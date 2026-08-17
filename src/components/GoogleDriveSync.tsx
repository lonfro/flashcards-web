'use client';

import React, { useState, useEffect } from 'react';
import { Cloud, CloudUpload, CloudDownload, Key, Check, AlertCircle, RefreshCw, LogOut, Clock } from 'lucide-react';
import { NodeData } from '../types/flashcard';
import { SyncState, STORAGE_CLIENT_ID_KEY } from '../utils/googleDriveSync';

const DEFAULT_CLIENT_ID = '477566603394-gpj2v25u4pb39ci67j0bqt7d11vud4u4.apps.googleusercontent.com';

interface GoogleDriveSyncProps {
  nodes: NodeData[];
  accessToken: string | null;
  syncState: SyncState;
  lastSyncTime: string | null;
  autoRefreshEnabled: boolean;
  autoRefreshInterval: number;
  onConnectDrive: (clientId: string) => void;
  onDisconnectDrive: () => void;
  onUploadManual: () => void;
  onDownloadManual: () => void;
  onToggleAutoRefresh: (enabled: boolean) => void;
  onChangeRefreshInterval: (seconds: number) => void;
}

export const GoogleDriveSync: React.FC<GoogleDriveSyncProps> = ({
  nodes,
  accessToken,
  syncState,
  lastSyncTime,
  autoRefreshEnabled,
  autoRefreshInterval,
  onConnectDrive,
  onDisconnectDrive,
  onUploadManual,
  onDownloadManual,
  onToggleAutoRefresh,
  onChangeRefreshInterval,
}) => {
  const [clientId, setClientId] = useState<string>(DEFAULT_CLIENT_ID);

  useEffect(() => {
    try {
      const savedId = localStorage.getItem(STORAGE_CLIENT_ID_KEY);
      if (savedId) setClientId(savedId);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleSaveClientId = (newId: string) => {
    setClientId(newId);
    try {
      localStorage.setItem(STORAGE_CLIENT_ID_KEY, newId);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 select-none shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2">
          <Cloud className="text-indigo-400" size={20} />
          <div>
            <h3 className="text-sm font-bold text-slate-100">Google Drive Cloud Sync (WinUI 3 1:1)</h3>
            <p className="text-xs text-slate-400">Syncs library.json and sync.json in appDataFolder with C# WinUI desktop app</p>
          </div>
        </div>

        {accessToken ? (
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 px-2.5 py-1 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold rounded-lg">
              <Check size={14} />
              <span>Drive Connected</span>
            </div>
            <button
              onClick={onDisconnectDrive}
              className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
              title="Disconnect Google Drive"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <div className="px-2.5 py-1 bg-slate-950 border border-slate-800 text-slate-400 text-xs font-medium rounded-lg">
            Offline Mode
          </div>
        )}
      </div>

      {/* Client ID Configuration Input */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center space-x-1">
          <Key size={13} className="text-indigo-400" />
          <span>Google OAuth Client ID</span>
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={clientId}
            onChange={(e) => handleSaveClientId(e.target.value)}
            placeholder="e.g. 1234567890-xxx.apps.googleusercontent.com"
            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 font-mono text-xs focus:outline-none focus:border-indigo-500"
          />
          {!accessToken ? (
            <button
              onClick={() => onConnectDrive(clientId)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-all shadow-md shadow-indigo-600/30 shrink-0"
            >
              Connect Drive
            </button>
          ) : (
            <button
              onClick={() => onConnectDrive(clientId)}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 shrink-0"
            >
              Re-authenticate
            </button>
          )}
        </div>
      </div>

      {/* Configurable Background Auto-Refresh Settings */}
      {accessToken && (
        <div className="border-t border-b border-slate-800/80 py-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock size={16} className="text-indigo-400" />
              <div>
                <h4 className="text-xs font-semibold text-slate-200">Background Auto-Refresh (Polling)</h4>
                <p className="text-[11px] text-slate-400">Periodically checks for remote updates made in the WinUI 3 desktop app</p>
              </div>
            </div>

            <button
              onClick={() => onToggleAutoRefresh(!autoRefreshEnabled)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                autoRefreshEnabled ? 'bg-indigo-600' : 'bg-slate-800'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  autoRefreshEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {autoRefreshEnabled && (
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-300">Refresh Interval</span>
              <select
                value={autoRefreshInterval}
                onChange={(e) => onChangeRefreshInterval(parseInt(e.target.value, 10))}
                className="bg-slate-950 border border-slate-800 rounded-md px-3 py-1 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
              >
                <option value={15}>Every 15 seconds</option>
                <option value={30}>Every 30 seconds</option>
                <option value={60}>Every 1 minute</option>
                <option value={120}>Every 2 minutes</option>
                <option value={300}>Every 5 minutes</option>
              </select>
            </div>
          )}
        </div>
      )}

      {/* Status Messages */}
      {syncState === 'syncing' && (
        <div className="p-3 rounded-lg border border-indigo-500/40 bg-indigo-950/60 text-indigo-300 text-xs flex items-center space-x-2">
          <RefreshCw size={15} className="animate-spin shrink-0" />
          <span>Syncing with Google Drive...</span>
        </div>
      )}

      {syncState === 'synced' && (
        <div className="p-3 rounded-lg border border-emerald-500/40 bg-emerald-950/60 text-emerald-300 text-xs flex items-center space-x-2">
          <Check size={15} className="shrink-0" />
          <span>All decks synced (library.json & sync.json) with Google Drive! ({lastSyncTime || 'just now'})</span>
        </div>
      )}

      {syncState === 'error' && (
        <div className="p-3 rounded-lg border border-rose-500/40 bg-rose-950/60 text-rose-300 text-xs flex items-center space-x-2">
          <AlertCircle size={15} className="shrink-0" />
          <span>Auto-sync error. Check internet connection or re-authenticate Google Drive.</span>
        </div>
      )}

      {/* Backup & Restore Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
        <div className="flex items-center space-x-3">
          <button
            onClick={onUploadManual}
            disabled={syncState === 'syncing'}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-all shadow-lg shadow-indigo-600/30 flex items-center space-x-2 disabled:opacity-50"
          >
            <CloudUpload size={16} />
            <span>Sync Now (Upload)</span>
          </button>

          <button
            onClick={onDownloadManual}
            disabled={syncState === 'syncing'}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center space-x-2 transition-colors disabled:opacity-50"
          >
            <CloudDownload size={16} />
            <span>Restore from Cloud</span>
          </button>
        </div>

        {lastSyncTime && (
          <span className="text-[11px] text-slate-400 font-mono text-right">
            Last synced: {lastSyncTime}
          </span>
        )}
      </div>
    </div>
  );
};
