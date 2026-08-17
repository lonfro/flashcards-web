'use client';

import React from 'react';
import { Settings, RotateCcw, Download, Upload, Info } from 'lucide-react';
import { NodeData } from '../types/flashcard';
import { SyncState } from '../utils/googleDriveSync';
import { CardSettingsData, DifficultySettingsData } from '../types/cardSettings';
import { ThemeConfigurator } from './ThemeConfigurator';
import { GoogleDriveSync } from './GoogleDriveSync';
import { CardSettingsSection } from './CardSettingsSection';

interface XamlSettingsPageProps {
  nodes: NodeData[];
  accessToken: string | null;
  syncState: SyncState;
  lastSyncTime: string | null;
  autoRefreshEnabled: boolean;
  autoRefreshInterval: number;
  cardSettings: CardSettingsData;
  difficultySettings: DifficultySettingsData;
  onConnectDrive: (clientId: string) => void;
  onDisconnectDrive: () => void;
  onUploadManual: () => void;
  onDownloadManual: () => void;
  onToggleAutoRefresh: (enabled: boolean) => void;
  onChangeRefreshInterval: (seconds: number) => void;
  onUpdateCardSettings: (newSettings: CardSettingsData) => void;
  onUpdateDifficultySettings: (newSettings: DifficultySettingsData) => void;
  onResetCardSettings: () => void;
  onResetDifficultySettings: () => void;
  onExportAll: () => void;
  onImportAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetAll: () => void;
}

export const XamlSettingsPage: React.FC<XamlSettingsPageProps> = ({
  nodes,
  accessToken,
  syncState,
  lastSyncTime,
  autoRefreshEnabled,
  autoRefreshInterval,
  cardSettings,
  difficultySettings,
  onConnectDrive,
  onDisconnectDrive,
  onUploadManual,
  onDownloadManual,
  onToggleAutoRefresh,
  onChangeRefreshInterval,
  onUpdateCardSettings,
  onUpdateDifficultySettings,
  onResetCardSettings,
  onResetDifficultySettings,
  onExportAll,
  onImportAll,
  onResetAll,
}) => {
  return (
    <div className="flex-1 h-full p-8 overflow-y-auto max-w-4xl mx-auto space-y-6 select-none">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-slate-100 flex items-center space-x-2">
          <Settings size={24} className="text-indigo-400" />
          <span>Settings</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Application preferences, themes, card weight & decay rules, Google Drive cloud sync, and data management
        </p>
      </div>

      {/* Theme Engine & Customizer */}
      <ThemeConfigurator />

      {/* Card Weight, Boundaries, Decay, & Difficulty Delta Settings 1:1 WinUI */}
      <CardSettingsSection
        cardSettings={cardSettings}
        difficultySettings={difficultySettings}
        onUpdateCardSettings={onUpdateCardSettings}
        onUpdateDifficultySettings={onUpdateDifficultySettings}
        onResetCardSettings={onResetCardSettings}
        onResetDifficultySettings={onResetDifficultySettings}
      />

      {/* Google Drive Cloud Sync */}
      <GoogleDriveSync
        nodes={nodes}
        accessToken={accessToken}
        syncState={syncState}
        lastSyncTime={lastSyncTime}
        autoRefreshEnabled={autoRefreshEnabled}
        autoRefreshInterval={autoRefreshInterval}
        onConnectDrive={onConnectDrive}
        onDisconnectDrive={onDisconnectDrive}
        onUploadManual={onUploadManual}
        onDownloadManual={onDownloadManual}
        onToggleAutoRefresh={onToggleAutoRefresh}
        onChangeRefreshInterval={onChangeRefreshInterval}
      />

      {/* Data Options */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow-xl">
        <h3 className="text-sm font-semibold text-slate-200">Data Management</h3>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
          <div>
            <h4 className="text-xs font-medium text-slate-300">Export All Dividers & Flashcards</h4>
            <p className="text-[11px] text-slate-500">Download a full JSON backup of your decks</p>
          </div>
          <button
            onClick={onExportAll}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 flex items-center space-x-2 shrink-0"
          >
            <Download size={14} />
            <span>Export JSON</span>
          </button>
        </div>

        <div className="border-t border-slate-800/80 pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-xs font-medium text-slate-300">Import Dividers & Flashcards</h4>
            <p className="text-[11px] text-slate-500">Load decks from a JSON backup file</p>
          </div>
          <label className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 flex items-center space-x-2 cursor-pointer shrink-0">
            <Upload size={14} />
            <span>Import JSON</span>
            <input type="file" accept=".json" onChange={onImportAll} className="hidden" />
          </label>
        </div>

        <div className="border-t border-slate-800/80 pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-xs font-medium text-rose-300">Reset All Decks</h4>
            <p className="text-[11px] text-slate-500">Restore factory sample decks and reset all card weights</p>
          </div>
          <button
            onClick={onResetAll}
            className="px-4 py-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-medium rounded-lg border border-rose-500/40 flex items-center space-x-2 shrink-0"
          >
            <RotateCcw size={14} />
            <span>Reset Data</span>
          </button>
        </div>
      </div>

      {/* About Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-2 shadow-xl">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
          <Info size={16} className="text-indigo-400" />
          <span>About Flashcards</span>
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          WinUI 3 .NET 10 Web Edition — built with Next.js, TypeScript, and Bun. Features 1:1 XAML layout, 1:1 Google Drive cloud sync with C# desktop app, card weight decay background engine, custom theme builder, instant JSON theme sharing, and SuperMemo SM-2 spaced repetition.
        </p>
      </div>
    </div>
  );
};
