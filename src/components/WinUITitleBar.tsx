'use client';

import { useState } from 'react';
import { Button, Tooltip } from '@fluentui/react-components';
import {
  ArrowLeft, BarChart3, BookOpen, CloudCheck, CloudOff, CircleAlert, Layers, Library, Menu, RefreshCw, Settings,
} from 'lucide-react';

export type ActivePage = 'FlashcardsPage' | 'RevisionPage' | 'StatsPage' | 'SettingsPage';
type SyncStatusState = 'idle' | 'syncing' | 'synced' | 'error' | 'unauthenticated';

interface WinUITitleBarProps {
  canGoBack: boolean;
  onGoBack: () => void;
  syncState: SyncStatusState;
  lastSyncTime: string | null;
  onManualSync: () => void;
  onOpenSettings: () => void;
}

export function WinUITitleBar({
  canGoBack, onGoBack, syncState, lastSyncTime, onManualSync, onOpenSettings,
}: WinUITitleBarProps) {
  const status = {
    idle: null,
    syncing: { label: 'Google Drive syncing', icon: RefreshCw },
    synced: { label: 'Google Drive synced', icon: CloudCheck },
    error: { label: 'Google Drive sync error', icon: CircleAlert },
    unauthenticated: { label: 'Google Drive offline', icon: CloudOff },
  }[syncState];
  const StatusIcon = status?.icon;

  return (
    <header className="winui-title-bar pt-safe pl-safe pr-safe">
      <Button
        appearance="subtle"
        className="winui-title-back"
        icon={<ArrowLeft size={16} strokeWidth={1.5} />}
        aria-label="Back"
        title="Back"
        disabled={!canGoBack}
        onClick={onGoBack}
      />
      <Layers size={16} strokeWidth={1.5} aria-hidden="true" />
      <span>Flashcards</span>
      {status && StatusIcon && (
        <Tooltip content={syncState === 'synced' && lastSyncTime ? `${status.label} at ${lastSyncTime}` : status.label}
          relationship="description">
          <Button
            appearance="subtle"
            size="small"
            className="winui-sync-status"
            aria-label={status.label}
            icon={<StatusIcon size={16} strokeWidth={1.5} className={syncState === 'syncing' ? 'animate-spin' : undefined} />}
            onClick={syncState === 'unauthenticated' ? onOpenSettings : onManualSync}
          />
        </Tooltip>
      )}
    </header>
  );
}

const pages = [
  { id: 'FlashcardsPage', label: 'Flashcards', icon: Library },
  { id: 'RevisionPage', label: 'Revision', icon: RefreshCw },
  { id: 'StatsPage', label: 'Stats', icon: BarChart3 },
  { id: 'SettingsPage', label: 'Settings', icon: Settings },
] as const;

interface NavigationProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  mobileView: 'tree' | 'card';
  onToggleMobileView: () => void;
}

export function WinUINavigation({ activePage, onNavigate, mobileView, onToggleMobileView }: NavigationProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <nav className="winui-navigation" aria-label="Main navigation" data-expanded={expanded}>
      <Button
        appearance="subtle"
        icon={<Menu size={18} strokeWidth={1.5} />}
        aria-label={expanded ? 'Collapse navigation' : 'Expand navigation'}
        aria-expanded={expanded}
        className="winui-navigation-toggle"
        onClick={() => setExpanded(!expanded)}
      />
      {pages.map(({ id, label, icon: Icon }) => (
        <Tooltip key={id} content={label} relationship="description">
          <Button
            appearance="subtle"
            icon={<Icon size={18} strokeWidth={1.5} />}
            aria-label={label}
            aria-current={activePage === id ? 'page' : undefined}
            className="winui-nav-item"
            onClick={() => onNavigate(id)}
          >
            <span>{label}</span>
          </Button>
        </Tooltip>
      ))}
      {activePage === 'FlashcardsPage' && (
        <Button
          appearance="subtle"
          size="small"
          icon={<BookOpen size={16} strokeWidth={1.5} />}
          className="winui-mobile-view-button"
          onClick={onToggleMobileView}
        >
          {mobileView === 'tree' ? 'Card' : 'Decks'}
        </Button>
      )}
    </nav>
  );
}
