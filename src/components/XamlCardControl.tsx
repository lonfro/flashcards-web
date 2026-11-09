'use client';

import { useEffect, useRef, useState } from 'react';
import { Button, ProgressBar } from '@fluentui/react-components';
import { RotateCcw } from 'lucide-react';
import { NodeData } from '../types/flashcard';
import { CardSettingsData, DEFAULT_CARD_SETTINGS } from '../types/cardSettings';
import { MarkdownRenderer } from './MarkdownRenderer';
import { AutoFitViewbox } from './AutoFitViewbox';
import { useSettings } from '../context/SettingsContext';

interface XamlCardControlProps {
  cardNode: NodeData | null;
  isFlipped: boolean;
  onFlip: () => void;
  onStartEditing?: () => void;
  isEditButtonVisible?: boolean;
  focusOnMount?: boolean;
  cardSettings?: CardSettingsData;
}

export function XamlCardControl({
  cardNode,
  isFlipped,
  onFlip,
  onStartEditing,
  isEditButtonVisible = true,
  focusOnMount = false,
  cardSettings = DEFAULT_CARD_SETTINGS,
}: XamlCardControlProps) {
  const { uiSettings } = useSettings();
  const [scale, setScale] = useState(1);
  const viewportRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const card = cardNode?.card;

  useEffect(() => {
    if (focusOnMount) cardRef.current?.focus();
  }, [focusOnMount]);

  useEffect(() => {
    if (!card) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.repeat || event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.target instanceof HTMLElement &&
          event.target.closest('input, textarea, select, button, a, [contenteditable], [role="menu"]')) return;

      if (event.code === 'Space' || event.code === 'Enter') {
        event.preventDefault();
        onFlip();
      } else if (event.key.toLowerCase() === 'e' && isEditButtonVisible && onStartEditing) {
        event.preventDefault();
        onStartEditing();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [card, onFlip, onStartEditing, isEditButtonVisible]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || !card) return;

    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey) return;
      event.preventDefault();
      const delta = event.deltaY < 0 ? 0.08 : -0.08;
      setScale((previous) => Math.min(2.5, Math.max(0.4, Number((previous + delta).toFixed(2)))));
    };
    viewport.addEventListener('wheel', handleWheel, { passive: false });
    return () => viewport.removeEventListener('wheel', handleWheel);
  }, [card]);

  if (!card) return <div className="winui-empty-state">No card selected</div>;

  const { minimumWeight, maximumWeight } = cardSettings;
  const weightPercent = maximumWeight === minimumWeight ? 0 : Math.min(100, Math.max(
    0, (maximumWeight - card.weight) / (maximumWeight - minimumWeight) * 100,
  ));
  const answerSize = ([ [50, 32], [100, 28], [200, 24], [350, 20], [600, 18], [1000, 16], [1500, 14] ]
    .find(([length]) => card.back.length < length)?.[1]) ?? 12;

  return (
    <div className="winui-card-view">
      <div className="winui-card-header">
        <div className="winui-card-progress" title={uiSettings.showTooltips ? `Learning progress: ${Math.round(weightPercent)}%` : undefined}>
          {uiSettings.showTooltips && <span>Learning progress</span>}
          <ProgressBar value={weightPercent} max={100} aria-label="Learning progress" />
        </div>
        <div className="winui-card-actions">
          {scale !== 1 && (
            <Button size="small" onClick={() => setScale(1)} icon={<RotateCcw size={14} />} title="Reset zoom">
              {Math.round(scale * 100)}%
            </Button>
          )}
          {isEditButtonVisible && onStartEditing && (
            <Button size="small" onClick={onStartEditing}>Edit <span className="font-light">(e)</span></Button>
          )}
        </div>
      </div>
      <div className="winui-card-stage" ref={viewportRef}>
        <div
          ref={cardRef}
          role="button"
          tabIndex={0}
          aria-label={isFlipped ? 'Show question' : 'Reveal answer'}
          className="winui-flashcard"
          data-flipped={isFlipped}
          style={{ transform: `scale(${scale})`, maxWidth: uiSettings.maxCardWidth }}
          onClick={(event) => {
            if (event.target instanceof HTMLElement && event.target.closest('a')) return;
            cardRef.current?.focus();
            onFlip();
          }}
        >
          <AutoFitViewbox maxWidth={450} maxHeight={268} allowUpscale={false}>
            <div className="w-full break-words" style={{ fontSize: isFlipped ? answerSize : 30 }}>
              <MarkdownRenderer className="winui-card-markdown" content={(isFlipped ? card.back : card.front) || 'Null'} />
            </div>
          </AutoFitViewbox>
        </div>
      </div>
    </div>
  );
}
