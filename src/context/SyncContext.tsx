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
  saveStoredLocalMetadata,
} from '../utils/googleDriveSync';
import { exportToWinUIJson, calculateJsonHash } from '../utils/winuiJsonConverter';

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
  const { nodes, isLoading, setNodes, setSelectedNodeId, selectedNodeId, registerSyncListener, handleUpdateNodes } = useLibrary();
  const { autoRefreshEnabled, autoRefreshInterval } = useSettings();

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [syncState, setSyncState] = useState<SyncState>('unauthenticated');
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasInitializedRef = useRef<boolean>(false);

  // Load last sync time on mount
  useEffect(() => {
    try {
      const savedSync = localStorage.getItem(STORAGE_LAST_SYNC_KEY);
      if (savedSync) setLastSyncTime(savedSync);
    } catch (e) {
      console.error('Failed to load last sync time:', e);
    }
  }, []);

  // Startup: restore persistent Google Drive session once library has loaded
  useEffect(() => {
    if (isLoading || hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    const token = getStoredAccessToken();

    if (token) {
      setAccessToken(token);
      setSyncState('syncing');

      performSmartSync(token, nodes).then((res) => {
        if (res.success) {
          if (res.nodes) {
            handleUpdateNodes(res.nodes);
            const firstCard = res.nodes.find((n) => n.type === 'card');
            setSelectedNodeId(firstCard ? firstCard.id : (res.nodes[0]?.id || null));
          }
          const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          setLastSyncTime(timeStr);
          try {
            localStorage.setItem(STORAGE_LAST_SYNC_KEY, timeStr);
          } catch (e) {}
          setSyncState('synced');
        } else if (res.isAuthError) {
          // Token expired mid-session — try silent server refresh cookie
          refreshAccessTokenViaServer().then((refreshRes) => {
            if (refreshRes.success && refreshRes.accessToken) {
              setAccessToken(refreshRes.accessToken);
              performSmartSync(refreshRes.accessToken, nodes).then((sRes) => {
                if (sRes.success && sRes.nodes) {
                  handleUpdateNodes(sRes.nodes);
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
          performSmartSync(refreshRes.accessToken, nodes).then((res) => {
            if (res.success) {
              if (res.nodes) {
                handleUpdateNodes(res.nodes);
                const firstCard = res.nodes.find((n) => n.type === 'card');
                setSelectedNodeId(firstCard ? firstCard.id : (res.nodes[0]?.id || null));
              }
              const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              setLastSyncTime(timeStr);
              try {
                localStorage.setItem(STORAGE_LAST_SYNC_KEY, timeStr);
              } catch (e) {}
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
  }, [isLoading, nodes, handleUpdateNodes, setSelectedNodeId]);

  // Debounced auto-sync when nodes change
  useEffect(() => {
    const unregister = registerSyncListener((updatedNodes: NodeData[]) => {
      if (!accessToken) return;

      setSyncState('syncing');
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }

      syncTimeoutRef.current = setTimeout(() => {
        performSmartSync(accessToken, updatedNodes).then((res) => {
          if (res.success) {
            if (res.nodes) {
              setNodes(res.nodes);
            }
            const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            setLastSyncTime(timeStr);
            try {
              localStorage.setItem(STORAGE_LAST_SYNC_KEY, timeStr);
            } catch (e) {}
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
    };
  }, [accessToken, registerSyncListener, setNodes]);

  // Background Auto-Refresh Polling
  useEffect(() => {
    if (!autoRefreshEnabled || !accessToken) return;

    const intervalMs = autoRefreshInterval * 1000;
    const intervalId = setInterval(() => {
      performSmartSync(accessToken, nodes).then((res) => {
        if (res.success) {
          if (res.nodes) {
            handleUpdateNodes(res.nodes);
          }
          const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          setLastSyncTime(timeStr);
          try {
            localStorage.setItem(STORAGE_LAST_SYNC_KEY, timeStr);
          } catch (e) {}
          setSyncState('synced');
        } else if (res.isAuthError) {
          setAccessToken(null);
          setSyncState('unauthenticated');
        }
      });
    }, intervalMs);

    return () => clearInterval(intervalId);
  }, [autoRefreshEnabled, autoRefreshInterval, accessToken, nodes, handleUpdateNodes]);

  // Connect to Google Drive (OAuth)
  const handleConnectDrive = useCallback(
    (clientId: string) => {
      setSyncState('syncing');
      requestGoogleDriveToken(
        clientId,
        (token) => {
          setAccessToken(token);
          setSyncState('syncing');

          // On first sign-in: auto-restore from Google Drive
          downloadFromGoogleDrive(token, nodes, true).then((dlRes) => {
            if (dlRes.success && dlRes.nodes && dlRes.nodes.length > 0) {
              handleUpdateNodes(dlRes.nodes);
              const firstCard = dlRes.nodes.find((n) => n.type === 'card');
              setSelectedNodeId(firstCard ? firstCard.id : (dlRes.nodes[0]?.id || null));

              getRemoteMetadataFromDrive(token).then((metaRes) => {
                if (metaRes.metadata) {
                  saveStoredLocalMetadata(metaRes.metadata);
                }
              });

              const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              setLastSyncTime(timeStr);
              try {
                localStorage.setItem(STORAGE_LAST_SYNC_KEY, timeStr);
              } catch (e) {}
              setSyncState('synced');
            } else {
              // Upload current library if no library on Drive yet
              uploadToGoogleDrive(token, nodes).then((upRes) => {
                if (upRes.success) {
                  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  setLastSyncTime(timeStr);
                  try {
                    localStorage.setItem(STORAGE_LAST_SYNC_KEY, timeStr);
                  } catch (e) {}
                  setSyncState('synced');
                } else if (upRes.isAuthError) {
                  setAccessToken(null);
                  setSyncState('unauthenticated');
                } else {
                  setSyncState('error');
                }
              });
            }
          });
        },
        () => {
          setSyncState('error');
        }
      );
    },
    [nodes, handleUpdateNodes, setSelectedNodeId]
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
        } catch (e) {}
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
    downloadFromGoogleDrive(accessToken, nodes, true).then((res) => {
      if (res.success && res.nodes) {
        handleUpdateNodes(res.nodes);
        if (!selectedNodeId || !res.nodes.some((n) => n.id === selectedNodeId)) {
          const firstCard = res.nodes.find((n) => n.type === 'card');
          setSelectedNodeId(firstCard ? firstCard.id : (res.nodes[0]?.id || null));
        }
        const jsonStr = exportToWinUIJson(res.nodes, null, true);
        calculateJsonHash(jsonStr).then((hash) => {
          saveStoredLocalMetadata({ Hash: hash, ModifiedAt: new Date().toISOString() });
        });
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setLastSyncTime(timeStr);
        try {
          localStorage.setItem(STORAGE_LAST_SYNC_KEY, timeStr);
        } catch (e) {}
        setSyncState('synced');
      } else if (res.isAuthError) {
        setAccessToken(null);
        setSyncState('unauthenticated');
      } else {
        setSyncState('error');
      }
    });
  }, [accessToken, nodes, handleUpdateNodes, selectedNodeId, setSelectedNodeId]);

  const handleFullManualSync = useCallback(() => {
    if (!accessToken) return;
    setSyncState('syncing');

    performSmartSync(accessToken, nodes).then((res) => {
      if (res.success) {
        if (res.nodes) {
          handleUpdateNodes(res.nodes);
          if (!selectedNodeId || !res.nodes.some((n) => n.id === selectedNodeId)) {
            const firstCard = res.nodes.find((n) => n.type === 'card');
            setSelectedNodeId(firstCard ? firstCard.id : (res.nodes[0]?.id || null));
          }
        }
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setLastSyncTime(timeStr);
        try {
          localStorage.setItem(STORAGE_LAST_SYNC_KEY, timeStr);
        } catch (e) {}
        setSyncState('synced');
      } else if (res.isAuthError) {
        setAccessToken(null);
        setSyncState('unauthenticated');
      } else {
        setSyncState('error');
      }
    });
  }, [accessToken, nodes, handleUpdateNodes, selectedNodeId, setSelectedNodeId]);

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
