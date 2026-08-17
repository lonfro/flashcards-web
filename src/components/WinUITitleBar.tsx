'use client';

import React from 'react';
import { Library, RefreshCw, Settings, ChevronLeft, Cloud, CloudOff, RefreshCw as SpinIcon, CheckCircle2, AlertCircle } from 'lucide-react';

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
}

export const WinUITitleBar: React.FC<WinUITitleBarProps> = ({
  activePage,
  onNavigate,
  canGoBack,
  onGoBack,
  syncState = 'idle',
  lastSyncTime,
  onManualSync,
}) => {
  return (
    <header className="w-full bg-slate-900/90 border-b border-slate-800 text-slate-100 flex flex-col backdrop-blur-md select-none shrink-0 z-30">
      {/* Top Window TitleBar */}
      <div className="h-9 px-3 flex items-center justify-between border-b border-slate-800/60 bg-slate-950/80 text-xs">
        <div className="flex items-center space-x-2">
          <button
            onClick={onGoBack}
            disabled={!canGoBack}
            className={`p-1 rounded transition-colors ${
              canGoBack
                ? 'text-slate-200 hover:bg-slate-800 hover:text-white'
                : 'text-slate-600 cursor-not-allowed'
            }`}
            title="Back"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="font-semibold text-slate-200 tracking-wide">Flashcards</span>
        </div>

        {/* Clickable Google Drive Cloud Sync Status Badge */}
        <div className="flex items-center space-x-3">
          {syncState === 'syncing' && (
            <button
              onClick={onManualSync}
              className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 text-[11px] font-medium hover:bg-indigo-900 transition-colors"
              title="Syncing... Click to re-trigger manual sync"
            >
              <SpinIcon size={12} className="animate-spin text-indigo-400" />
              <span>Syncing with Drive...</span>
            </button>
          )}

          {syncState === 'synced' && (
            <button
              onClick={onManualSync}
              className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-[11px] font-medium hover:bg-emerald-900/80 transition-colors cursor-pointer"
              title={`Click to trigger manual Google Drive sync (Last synced: ${lastSyncTime || 'just now'})`}
            >
              <CheckCircle2 size={12} className="text-emerald-400" />
              <span>Google Drive Synced</span>
            </button>
          )}

          {syncState === 'error' && (
            <button
              onClick={onManualSync || (() => onNavigate('SettingsPage'))}
              className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-rose-950/60 border border-rose-500/40 text-rose-300 text-[11px] font-medium hover:bg-rose-900/80 transition-colors cursor-pointer"
              title="Click to retry Google Drive sync"
            >
              <AlertCircle size={12} className="text-rose-400" />
              <span>Sync Error (Click to Retry)</span>
            </button>
          )}

          {syncState === 'unauthenticated' && (
            <button
              onClick={() => onNavigate('SettingsPage')}
              className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 text-[11px] hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Click to connect Google Drive in Settings"
            >
              <CloudOff size={12} className="text-slate-500" />
              <span>Drive Offline</span>
            </button>
          )}

          <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">WinUI 3 .NET 10 Web Edition</span>
        </div>
      </div>

      {/* WinUI NavigationView Header Bar */}
      <div className="px-3 py-1.5 flex items-center justify-between bg-slate-900/60">
        <nav className="flex items-center space-x-1">
          <button
            onClick={() => onNavigate('FlashcardsPage')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center space-x-2 transition-all ${
              activePage === 'FlashcardsPage'
                ? 'bg-slate-800 text-indigo-300 font-semibold border-b-2 border-indigo-500 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Library size={15} />
            <span>Flashcards</span>
          </button>

          <button
            onClick={() => onNavigate('RevisionPage')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center space-x-2 transition-all ${
              activePage === 'RevisionPage'
                ? 'bg-slate-800 text-purple-300 font-semibold border-b-2 border-purple-500 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <RefreshCw size={15} />
            <span>Revision</span>
          </button>
        </nav>

        <button
          onClick={() => onNavigate('SettingsPage')}
          className={`p-2 rounded-md transition-all ${
            activePage === 'SettingsPage'
              ? 'bg-slate-800 text-indigo-300'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
          title="Settings"
        >
          <Settings size={16} />
        </button>
      </div>
    </header>
  );
};
