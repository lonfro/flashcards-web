'use client';

import React from 'react';
import {
  Library,
  RefreshCw,
  Settings,
  ChevronLeft,
  CloudOff,
  RefreshCw as SpinIcon,
  CheckCircle2,
  AlertCircle,
  Menu,
  BookOpen,
} from 'lucide-react';

export type ActivePage = 'FlashcardsPage' | 'RevisionPage' | 'SettingsPage';
export type SyncStatusState = 'idle' | 'syncing' | 'synced' | 'error' | 'unauthenticated';

interface WinUITitleBarProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  canGoBack: boolean;
  onGoBack: () => void;
  syncState?: SyncStatusState;
  lastSyncTime?: string | null;
  onManualSync?: () => void;
  mobileView?: 'tree' | 'card';
  onToggleMobileView?: () => void;
}

export const WinUITitleBar: React.FC<WinUITitleBarProps> = ({
  activePage,
  onNavigate,
  canGoBack,
  onGoBack,
  syncState = 'idle',
  lastSyncTime,
  onManualSync,
  mobileView = 'tree',
  onToggleMobileView,
}) => {
  return (
    <header className="w-full bg-slate-900/95 border-b border-slate-800 text-slate-100 flex flex-col backdrop-blur-md select-none shrink-0 z-30 pt-safe pl-safe pr-safe">
      {/* Top Window TitleBar (1:1 WinUI 3 Window TitleBar) */}
      <div className="h-9 px-2 sm:px-3 flex items-center justify-between border-b border-slate-800/60 bg-slate-950/80 text-xs">
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {/* WinUI 3 TitleBar Back Button */}
          <button
            onClick={() => {
              if (activePage === 'FlashcardsPage' && mobileView === 'card' && onToggleMobileView) {
                onToggleMobileView();
              } else if (canGoBack) {
                onGoBack();
              }
            }}
            disabled={!canGoBack && !(activePage === 'FlashcardsPage' && mobileView === 'card')}
            className={`p-1 rounded transition-colors flex items-center justify-center ${
              canGoBack || (activePage === 'FlashcardsPage' && mobileView === 'card')
                ? 'text-slate-200 hover:bg-slate-800 hover:text-white cursor-pointer active:scale-95'
                : 'text-slate-600 cursor-not-allowed opacity-40'
            }`}
            title="Back"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Mobile Decks toggle pill if in card view on mobile */}
          {activePage === 'FlashcardsPage' && mobileView === 'card' && onToggleMobileView && (
            <button
              onClick={onToggleMobileView}
              className="md:hidden flex items-center space-x-1 px-2 py-0.5 rounded bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-900 transition-colors text-[11px] font-medium"
              title="Back to Decks Tree"
            >
              <Menu size={12} />
              <span>Decks</span>
            </button>
          )}

          <span className="font-semibold text-slate-200 tracking-wide text-xs sm:text-sm">Flashcards</span>
        </div>

        {/* Clickable Google Drive Cloud Sync Status Badge */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {syncState === 'syncing' && (
            <button
              onClick={onManualSync}
              className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 text-[11px] font-medium hover:bg-indigo-900 transition-colors"
              title="Syncing... Click to re-trigger manual sync"
            >
              <SpinIcon size={12} className="animate-spin text-indigo-400 shrink-0" />
              <span className="truncate">Google Drive syncing...</span>
            </button>
          )}

          {syncState === 'synced' && (
            <button
              onClick={onManualSync}
              className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-[11px] font-medium hover:bg-emerald-900/80 transition-colors cursor-pointer"
              title={`Click to trigger manual Google Drive sync (Last synced: ${lastSyncTime || 'just now'})`}
            >
              <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
              <span className="truncate">Google Drive synced</span>
            </button>
          )}

          {syncState === 'error' && (
            <button
              onClick={onManualSync || (() => onNavigate('SettingsPage'))}
              className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-rose-950/60 border border-rose-500/40 text-rose-300 text-[11px] font-medium hover:bg-rose-900/80 transition-colors cursor-pointer"
              title="Click to retry Google Drive sync"
            >
              <AlertCircle size={12} className="text-rose-400 shrink-0" />
              <span className="truncate">Google Drive sync error</span>
            </button>
          )}

          {syncState === 'unauthenticated' && (
            <button
              onClick={() => onNavigate('SettingsPage')}
              className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 text-[11px] hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Click to connect Google Drive in Settings"
            >
              <CloudOff size={12} className="text-slate-500 shrink-0" />
              <span className="truncate">Google Drive offline</span>
            </button>
          )}

          <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">WinUI 3 Web</span>
        </div>
      </div>

      {/* WinUI NavigationView Header Bar */}
      <div className="px-2 sm:px-3 py-1 flex items-center justify-between bg-slate-900/60">
        <nav className="flex items-center space-x-1">
          <button
            onClick={() => onNavigate('FlashcardsPage')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-medium flex items-center space-x-1.5 sm:space-x-2 transition-all ${
              activePage === 'FlashcardsPage'
                ? 'bg-slate-800 text-indigo-300 font-semibold border-b-2 border-indigo-500 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Library size={14} className="shrink-0" />
            <span>Cards</span>
          </button>

          <button
            onClick={() => onNavigate('RevisionPage')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-medium flex items-center space-x-1.5 sm:space-x-2 transition-all ${
              activePage === 'RevisionPage'
                ? 'bg-slate-800 text-purple-300 font-semibold border-b-2 border-purple-500 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <RefreshCw size={14} className="shrink-0" />
            <span>Revision</span>
          </button>
        </nav>

        <div className="flex items-center space-x-1">
          {/* Mobile view toggle between tree and active card */}
          {activePage === 'FlashcardsPage' && onToggleMobileView && (
            <button
              onClick={onToggleMobileView}
              className={`md:hidden px-2 py-1.5 rounded-md text-xs flex items-center space-x-1 transition-colors ${
                mobileView === 'card'
                  ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
              title={mobileView === 'tree' ? 'View Selected Card' : 'View Decks Tree'}
            >
              {mobileView === 'tree' ? <BookOpen size={14} /> : <Menu size={14} />}
              <span className="text-[11px] font-medium">{mobileView === 'tree' ? 'Card' : 'Decks'}</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('SettingsPage')}
            className={`p-1.5 sm:p-2 rounded-md transition-all ${
              activePage === 'SettingsPage'
                ? 'bg-slate-800 text-indigo-300'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
            title="Settings"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};
