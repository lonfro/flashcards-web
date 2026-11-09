'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@fluentui/react-components';
import { NodeData } from '../types/flashcard';
import {
  CardSettingsData,
  DEFAULT_DIFFICULTY_SETTINGS,
  DifficultySettingsData,
  formatRevisionDelay,
  REVISION_RATINGS,
} from '../types/cardSettings';
import { calculateNextReview, dealRevisionCard } from '../utils/spacedRepetition';
import { idbLogReview } from '../utils/db';
import { triggerDebouncedStatsUpload } from '../utils/googleDriveSync';
import { useLibrary, useSync } from '../context';
import { getDividerPath } from '../utils/storage';
import { XamlCardControl } from './XamlCardControl';
import { XamlCardEditControl } from './XamlCardEditControl';

interface XamlRevisionPageProps {
  selectedDividerNode: NodeData | null;
  cardsToRevise: NodeData[];
  cardSettings: CardSettingsData;
  difficultySettings?: DifficultySettingsData;
  onUpdateCard: (updatedNode: NodeData) => void;
  hasSelection: boolean;
}

export function XamlRevisionPage({
  selectedDividerNode,
  cardsToRevise,
  cardSettings,
  difficultySettings = DEFAULT_DIFFICULTY_SETTINGS,
  onUpdateCard,
  hasSelection,
}: XamlRevisionPageProps) {
  const { accessToken } = useSync();
  const { nodes } = useLibrary();
  const [currentId, setCurrentId] = useState(() => dealRevisionCard(cardsToRevise, null)?.id);
  const [isFlipped, setIsFlipped] = useState(false);
  const [editing, setEditing] = useState(false);

  const current = cardsToRevise.find((node) => node.id === currentId);
  const deckName = selectedDividerNode?.name ?? 'All Decks';

  useEffect(() => {
    if (current || cardsToRevise.length === 0) return;
    const nextAvailability = cardsToRevise.reduce((earliest, { card }) =>
      card ? Math.min(earliest, Date.parse(card.hideUntil ?? '') || 0) : earliest, Infinity
    );
    if (!Number.isFinite(nextAvailability)) return;
    let timer: number;
    const dealWhenReady = () => {
      const wait = nextAvailability - Date.now() + 1;
      if (wait > 0) {
        timer = window.setTimeout(dealWhenReady, Math.min(wait, 2_147_483_647));
        return;
      }
      setCurrentId(dealRevisionCard(cardsToRevise, null)?.id);
      setIsFlipped(false);
      setEditing(false);
    };
    timer = window.setTimeout(dealWhenReady, 0);
    return () => window.clearTimeout(timer);
  }, [current, cardsToRevise]);

  function rate(difficulty: number) {
    if (!current?.card || !isFlipped || editing) return;

    const now = Date.now();
    const reviewedAt = new Date(now).toISOString();
    const updated = {
      ...current,
      updatedAt: reviewedAt,
      card: {
        ...current.card,
        ...calculateNextReview(current.card, difficulty, cardSettings, difficultySettings, now),
      },
    };
    onUpdateCard(updated);

    void idbLogReview({
      id: crypto.randomUUID(),
      cardId: current.id,
      cardName: current.name,
      deckId: selectedDividerNode?.id ?? current.parentId,
      deckName,
      difficulty,
      difficultyName: REVISION_RATINGS[difficulty].name,
      reviewedAt,
      date: reviewedAt.slice(0, 10),
      weight: updated.card.weight,
    }).then(() => {
      if (accessToken) triggerDebouncedStatsUpload(accessToken);
    }).catch((error) => console.error('Failed to log review:', error));

    const updatedCards = cardsToRevise.map((node) => node.id === current.id ? updated : node);
    setCurrentId(dealRevisionCard(updatedCards, current.id, now)?.id);
    setIsFlipped(false);
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || event.ctrlKey || event.metaKey || event.altKey ||
          (event.target instanceof HTMLElement && event.target.closest('input, textarea, select, [contenteditable]'))) return;
      const difficulty = REVISION_RATINGS.findIndex(({ key }) => key === event.key);
      if (current && isFlipped && !editing && difficulty >= 0) {
        event.preventDefault();
        rate(difficulty);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  if (!current?.card) {
    return (
      <div className="winui-empty-state winui-revision-message">
        <h2>{hasSelection ? 'All done!' : 'No divider selected'}</h2>
        <p>
          {hasSelection
            ? 'No more cards left to revise! Come again later.'
            : 'Go back to the Flashcards page (the bookshelf icon), right-click a divider (folder) and select “Revise cards”.'}
        </p>
      </div>
    );
  }

  if (editing) {
    const card = current.card;
    return (
      <XamlCardEditControl
        cardNode={current}
        dividerPath={getDividerPath(nodes, current.parentId)}
        onSave={(front, back) => {
          onUpdateCard({
            ...current,
            name: front.slice(0, 35).replace(/[#*`]/g, '') || current.name,
            updatedAt: new Date().toISOString(),
            card: { ...card, front, back },
          });
          setEditing(false);
        }}
      />
    );
  }

  return (
    <div className="winui-revision">
      <XamlCardControl
        key={current.id}
        cardNode={current}
        isFlipped={isFlipped}
        onFlip={() => setIsFlipped((previous) => !previous)}
        onStartEditing={() => setEditing(true)}
        isEditButtonVisible={isFlipped}
        focusOnMount
        cardSettings={cardSettings}
      />
      {isFlipped && (
        <div className="winui-revision-ratings pb-safe" aria-label="Rate this card">
          {REVISION_RATINGS.map(({ name, key, color, delay }, index) => {
            const delayText = formatRevisionDelay(difficultySettings[delay]);
            return (
              <Button key={key} onClick={() => rate(index)} title={`Press ${key}`} style={{ color }}>
                {name}
                {delayText && <span>{delayText}</span>}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}
