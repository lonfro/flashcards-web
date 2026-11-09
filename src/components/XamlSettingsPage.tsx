'use client';

import React from 'react';
import { RotateCcw, Download, Upload, Info, AppWindow } from 'lucide-react';
import { Button, SpinButton, Switch } from '@fluentui/react-components';
import { SyncState } from '../utils/googleDriveSync';
import { CardSettingsData, DifficultySettingsData } from '../types/cardSettings';
import { ThemeConfigurator } from './ThemeConfigurator';
import { GoogleDriveSync } from './GoogleDriveSync';
import { CardSettingsSection, DurationInput } from './CardSettingsSection';
import { useLibrary, useSettings } from '../context';

interface XamlSettingsPageProps {
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
  const { backups } = useLibrary();
  const { uiSettings, updateUISettings } = useSettings();
  const { intervalMinutes, maxBackups } = backups.settings;
  return (
    <div className="winui-settings">
      <header><h1>Settings</h1></header>
      <div className="winui-settings-scroll">
        <div className="winui-settings-sections">
          <h2>UI</h2>
          <div className="winui-setting-row">
            <AppWindow size={20} strokeWidth={1.5} aria-hidden="true" />
            <div>
              <h3>Maximum flashcard width</h3>
              <p>The maximum width of a flashcard, measured in pixels. Default is 550.</p>
            </div>
            <SpinButton
              aria-label="Maximum flashcard width"
              value={uiSettings.maxCardWidth}
              min={100}
              max={5000}
              step={10}
              onChange={(_, data) => {
                const value = data.value ?? Number(data.displayValue);
                if (Number.isFinite(value)) {
                  updateUISettings({ ...uiSettings, maxCardWidth: Math.min(5000, Math.max(100, Math.round(value))) });
                }
              }}
            />
          </div>
          <div className="winui-setting-row">
            <AppWindow size={20} strokeWidth={1.5} aria-hidden="true" />
            <div>
              <h3>Show tooltips</h3>
              <p>Show guiding text such as the learning progress label.</p>
            </div>
            <Switch
              aria-label="Show tooltips"
              checked={uiSettings.showTooltips}
              onChange={(_, data) => updateUISettings({ ...uiSettings, showTooltips: data.checked })}
            />
          </div>

          <h2>Revision</h2>
          <CardSettingsSection
            cardSettings={cardSettings}
            difficultySettings={difficultySettings}
            onUpdateCardSettings={onUpdateCardSettings}
            onUpdateDifficultySettings={onUpdateDifficultySettings}
            onResetCardSettings={onResetCardSettings}
            onResetDifficultySettings={onResetDifficultySettings}
          />

          <h2>Library</h2>
          <section className="winui-settings-panel space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-200">Library backups</h3>
                <p className="text-xs text-slate-400">Backups are kept in this browser and can be downloaded as Windows JSON.</p>
              </div>
              <Button onClick={() => void backups.saveBackup()} disabled={backups.isSaving}>
                Back up now
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs text-slate-300">Automatic backup interval</p>
                <DurationInput
                  label="Automatic backup interval"
                  minutes={intervalMinutes}
                  onChange={(minutes) => backups.updateSettings(minutes, maxBackups)}
                />
                <p className="text-xs text-slate-500">Set to zero to disable. Backups run while Flashcards is open.</p>
              </div>
              <label className="text-xs text-slate-300 flex items-center gap-2 self-start">
                Backups to keep
                <input
                  type="number"
                  min="1"
                  value={maxBackups}
                  onChange={(event) => backups.updateSettings(
                    intervalMinutes, Math.max(1, Math.round(event.target.valueAsNumber || 1))
                  )}
                  className="w-20 px-2 py-1 bg-slate-950 border border-slate-700 rounded"
                />
              </label>
            </div>
            {backups.error && <p role="alert" className="text-xs text-rose-400">{backups.error}</p>}
            {!!backups.times?.length && (
              <ul className="max-h-48 overflow-y-auto divide-y divide-slate-800">
                {[...backups.times].reverse().map((time) => (
                  <li key={time} className="flex items-center justify-between gap-3 py-2 text-xs">
                    <time dateTime={new Date(time).toISOString()} className="text-slate-300">{new Date(time).toLocaleString()}</time>
                    <button onClick={() => void backups.downloadBackup(time)} className="text-indigo-300 hover:text-indigo-200">
                      Download
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Google Drive Cloud Sync */}
          <GoogleDriveSync
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
          <div className="winui-settings-panel space-y-4">
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

          <h2>Web preferences</h2>
          <ThemeConfigurator />

          {/* About Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-2 shadow-xl">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
              <Info size={16} className="text-indigo-400" />
              <span>About Flashcards</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Flashcards for the web uses Fluent UI controls and shares the Windows library format for imports, backups, and Google Drive sync.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
