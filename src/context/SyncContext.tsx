'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useLibrary } from './LibraryContext';
import { useSettings } from './SettingsContext';
import { NodeData } from '../types/flashcard';
import {
  SyncState,
  STORAGE_LAST_SYNC_KEY,
  getStoredAccessToken,
  clearStoredToken,
  requestGoogleDriveToken,
  refreshAccessTokenViaServer,
  uploadToGoogleDrive,
  downloadFromGoogleDrive,
  getRemoteMetadataFromDrive,
  performSmartSync,
} from '../utils/googleDriveSync';

export interface SyncContextValue {
  accessToken: string | null;
  syncState: SyncState;
  lastSyncTime: string | null;
  setAccessToken: (token: string | null) => void;
  setSyncState: (state: SyncState) => void;
  setLastSyncTime: (time: string | null) => void;
  handleConnectDrive: (clientId: string) => void;
  handleDisconnectDrive: () => void;
  handleManualUpload: () => void;
  handleManualDownload: () => void;
  handleFullManualSync: () => void;
}

const SyncContext = createContext<SyncContextValue | null>(null);

export function useSync(): SyncContextValue {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSync must be used within a SyncProvider');
  }
  return context;
}

export function SyncProvider({ children }: { children: React.ReactNode }) {
  const { nodes, isLoading, setSelectedNodeId, selectedNodeId, registerSyncListener, restoreSyncedNodes } = useLibrary();
  const { autoRefreshEnabled, autoRefreshInterval } = useSettings();

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [syncState, setSyncState] = useState<SyncState>('unauthenticated');
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasInitializedRef = useRef<boolean>(false);

  // Restore the browser session after the library has loaded.
  useEffect(() => {
    if (isLoading || hasInitializedRef.current) return;

    const frame = window.requestAnimationFrame(() => {
      hasInitializedRef.current = true;
      try {
        const savedSync = localStorage.getItem(STORAGE_LAST_SYNC_KEY);
        if (savedSync) setLastSyncTime(savedSync);
      } catch (error) {
        console.error('Failed to load last sync time:', error);
      }

      const token = getStoredAccessToken();

      if (token) {
        setAccessToken(token);
        setSyncState('syncing');

        performSmartSync(token, nodes).then(async (res) => {
          if (res.success) {
            if (res.nodes && res.metadata && await restoreSyncedNodes(res.nodes, res.metadata, nodes)) {
              const firstCard = res.nodes.find((n) => n.type === 'card');
              setSelectedNodeId(firstCard ? firstCard.id : (res.nodes[0]?.id || null));
            }
            const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            setLastSyncTime(timeStr);
            try {
              localStorage.setItem(STORAGE_LAST_SYNC_KEY, timeStr);
            } catch {}
            setSyncState('synced');
          } else if (res.isAuthError) {
            // Token expired mid-session — try silent server refresh cookie
            refreshAccessTokenViaServer().then((refreshRes) => {
              if (refreshRes.success && refreshRes.accessToken) {
                setAccessToken(refreshRes.accessToken);
                performSmartSync(refreshRes.accessToken, nodes).then(async (sRes) => {
                  if (sRes.success && sRes.nodes && sRes.metadata) {
                    await restoreSyncedNodes(sRes.nodes, sRes.metadata, nodes);
                  }
                  setSyncState('synced');
                });
              } else {
                clearStoredToken();
                setAccessToken(null);
                setSyncState('unauthenticated');
              }
            });
          } else {
            setSyncState('unauthenticated');
          }
        });
      } else {
        // No localStorage token — try server HttpOnly refresh_token cookie for persistent session
        setSyncState('syncing');
        refreshAccessTokenViaServer().then((refreshRes) => {
          if (refreshRes.success && refreshRes.accessToken) {
            setAccessToken(refreshRes.accessToken);
            performSmartSync(refreshRes.accessToken, nodes).then(async (res) => {
              if (res.success) {
                if (res.nodes && res.metadata && await restoreSyncedNodes(res.nodes, res.metadata, nodes)) {
                  const firstCard = res.nodes.find((n) => n.type === 'card');
                  setSelectedNodeId(firstCard ? firstCard.id : (res.nodes[0]?.id || null));
                }
                const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                setLastSyncTime(timeStr);
                try {
                  localStorage.setItem(STORAGE_LAST_SYNC_KEY, timeStr);
                } catch {}
                setSyncState('synced');
              } else {
                setSyncState('synced');
              }
            });
          } else {
            setSyncState('unauthenticated');
          }
        });
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [isLoading, nodes, restoreSyncedNodes, setSelectedNodeId]);

  // Debounced auto-sync when nodes change
  useEffect(() => {
    const unregister = registerSyncListener((updatedNodes: NodeData[]) => {
      if (!accessToken) return;

      setSyncState('syncing');
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }

      syncTimeoutRef.current = setTimeout(() => {
        performSmartSync(accessToken, updatedNodes).then(async (res) => {
          if (res.success) {
            if (res.nodes && res.metadata) {
              await restoreSyncedNodes(res.nodes, res.metadata, updatedNodes);
            }
            const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            setLastSyncTime(timeStr);
            try {
              localStorage.setItem(STORAGE_LAST_SYNC_KEY, timeStr);
            } catch {}
            setSyncState('synced');
          } else if (res.isAuthError) {
            setAccessToken(null);
            setSyncState('unauthenticated');
          } else {
            setSyncState('error');
          }
        });
      }, 1200);
    });

    return () => {
      unregister();
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    };
  }, [accessToken, registerSyncListener, restoreSyncedNodes]);

  // Background Auto-Refresh Polling
  useEffect(() => {
    if (!autoRefreshEnabled || !accessToken) return;

    const intervalMs = autoRefreshInterval * 1000;
    const intervalId = setInterval(() => {
      performSmartSync(accessToken, nodes).then(async (res) => {
        if (res.success) {
          if (res.nodes && res.metadata) {
            await restoreSyncedNodes(res.nodes, res.metadata, nodes);
          }
          const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          setLastSyncTime(timeStr);
          try {
            localStorage.setItem(STORAGE_LAST_SYNC_KEY, timeStr);
          } catch {}
          setSyncState('synced');
        } else if (res.isAuthError) {
          setAccessToken(null);
          setSyncState('unauthenticated');
        }
      });
    }, intervalMs);

    return () => clearInterval(intervalId);
  }, [autoRefreshEnabled, autoRefreshInterval, accessToken, nodes, restoreSyncedNodes]);

  // Connect to Google Drive (OAuth)
  const handleConnectDrive = useCallback(
    (clientId: string) => {
      setSyncState('syncing');
      requestGoogleDriveToken(
        clientId,
        (token) => {
          setAccessToken(token);
          setSyncState('syncing');

          downloadFromGoogleDrive(token, nodes).then(async (result) => {
            if (result.success && result.nodes && result.hash) {
              const remote = await getRemoteMetadataFromDrive(token);
              const metadata = remote.metadata ?? { Hash: result.hash, ModifiedAt: new Date(0).toISOString() };
              if (await restoreSyncedNodes(result.nodes, metadata, nodes)) {
                const firstCard = result.nodes.find((node) => node.type === 'card');
                setSelectedNodeId(firstCard?.id ?? result.nodes[0]?.id ?? null);
              }
            } else if (result.notFound) {
              const upload = await uploadToGoogleDrive(token, nodes);
              if (!upload.success) {
                setSyncState('error');
                return;
              }
            } else {
              setSyncState('error');
              return;
            }

            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            setLastSyncTime(time);
            localStorage.setItem(STORAGE_LAST_SYNC_KEY, time);
            setSyncState('synced');
          });
        },
        () => {
          setSyncState('error');
        }
      );
    },
    [nodes, restoreSyncedNodes, setSelectedNodeId]
  );

  const handleDisconnectDrive = useCallback(() => {
    clearStoredToken();
    setAccessToken(null);
    setSyncState('unauthenticated');
  }, []);

  const handleManualUpload = useCallback(() => {
    if (!accessToken) return;
    setSyncState('syncing');
    uploadToGoogleDrive(accessToken, nodes).then((res) => {
      if (res.success) {
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setLastSyncTime(timeStr);
        try {
          localStorage.setItem(STORAGE_LAST_SYNC_KEY, timeStr);
        } catch {}
        setSyncState('synced');
      } else if (res.isAuthError) {
        setAccessToken(null);
        setSyncState('unauthenticated');
      } else {
        setSyncState('error');
      }
    });
  }, [accessToken, nodes]);

  const handleManualDownload = useCallback(() => {
    if (!accessToken) return;
    setSyncState('syncing');
    downloadFromGoogleDrive(accessToken, nodes, true).then(async (res) => {
      if (res.success && res.nodes && res.hash) {
        const remote = await getRemoteMetadataFromDrive(accessToken);
        const metadata = remote.metadata ?? { Hash: res.hash, ModifiedAt: new Date(0).toISOString() };
        if (!await restoreSyncedNodes(res.nodes, metadata, nodes)) {
          setSyncState('idle');
          return;
        }
        if (!selectedNodeId || !res.nodes.some((n) => n.id === selectedNodeId)) {
          const firstCard = res.nodes.find((n) => n.type === 'card');
          setSelectedNodeId(firstCard ? firstCard.id : (res.nodes[0]?.id || null));
        }
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setLastSyncTime(timeStr);
        try {
          localStorage.setItem(STORAGE_LAST_SYNC_KEY, timeStr);
        } catch {}
        setSyncState('synced');
      } else if (res.isAuthError) {
        setAccessToken(null);
        setSyncState('unauthenticated');
      } else {
        setSyncState('error');
      }
    });
  }, [accessToken, nodes, restoreSyncedNodes, selectedNodeId, setSelectedNodeId]);

  const handleFullManualSync = useCallback(() => {
    if (!accessToken) return;
    setSyncState('syncing');

    performSmartSync(accessToken, nodes).then(async (res) => {
      if (res.success) {
        if (res.nodes && res.metadata && await restoreSyncedNodes(res.nodes, res.metadata, nodes)) {
          if (!selectedNodeId || !res.nodes.some((n) => n.id === selectedNodeId)) {
            const firstCard = res.nodes.find((n) => n.type === 'card');
            setSelectedNodeId(firstCard ? firstCard.id : (res.nodes[0]?.id || null));
          }
        }
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setLastSyncTime(timeStr);
        try {
          localStorage.setItem(STORAGE_LAST_SYNC_KEY, timeStr);
        } catch {}
        setSyncState('synced');
      } else if (res.isAuthError) {
        setAccessToken(null);
        setSyncState('unauthenticated');
      } else {
        setSyncState('error');
      }
    });
  }, [accessToken, nodes, restoreSyncedNodes, selectedNodeId, setSelectedNodeId]);

  return (
    <SyncContext.Provider
      value={{
        accessToken,
        syncState,
        lastSyncTime,
        setAccessToken,
        setSyncState,
        setLastSyncTime,
        handleConnectDrive,
        handleDisconnectDrive,
        handleManualUpload,
        handleManualDownload,
        handleFullManualSync,
      }}
    >
      {children}
    </SyncContext.Provider>
  );
}
