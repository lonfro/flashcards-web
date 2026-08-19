'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ChevronLeft } from 'lucide-react';
import { NodeData } from '../types/flashcard';
import {
  getStoredNodes,
  saveStoredNodes,
  resetToSampleNodes,
  getAllCardsInDeck,
} from '../utils/storage';
import { WinUITitleBar, ActivePage } from '../components/WinUITitleBar';
import { XamlTreeView } from '../components/XamlTreeView';
import { XamlCardControl } from '../components/XamlCardControl';
import { XamlCardEditControl } from '../components/XamlCardEditControl';
import { XamlCardAddControl } from '../components/XamlCardAddControl';
import { XamlRevisionPage } from '../components/XamlRevisionPage';
import { XamlSettingsPage } from '../components/XamlSettingsPage';
import { XamlGridSplitter } from '../components/XamlGridSplitter';

import { getStoredTheme, applyTheme } from '../utils/themePresets';
import { exportToWinUIJson, importFromWinUIJson, calculateJsonHash } from '../utils/winuiJsonConverter';
import {
  SyncState,
  STORAGE_LAST_SYNC_KEY,
  STORAGE_CLIENT_ID_KEY,
  getStoredAccessToken,
  clearStoredToken,
  requestGoogleDriveToken,
  requestSilentGoogleDriveToken,
  uploadToGoogleDrive,
  downloadFromGoogleDrive,
  performSmartSync,
  saveStoredLocalMetadata,
} from '../utils/googleDriveSync';

import {
  CardSettingsData,
  DifficultySettingsData,
  DEFAULT_CARD_SETTINGS,
  DEFAULT_DIFFICULTY_SETTINGS,
} from '../types/cardSettings';
import { applyWeightDecay } from '../utils/spacedRepetition';

const SIDEBAR_WIDTH_KEY = 'flashcards_web_sidebar_width_v1';
const AUTO_REFRESH_ENABLED_KEY = 'flashcards_web_auto_refresh_enabled_v1';
const AUTO_REFRESH_INTERVAL_KEY = 'flashcards_web_auto_refresh_interval_v1';
const CARD_SETTINGS_KEY = 'flashcards_web_card_settings_v1';
const DIFFICULTY_SETTINGS_KEY = 'flashcards_web_difficulty_settings_v1';

export default function HomePage() {
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [sidebarWidth, setSidebarWidth] = useState<number>(250);
  const [activePage, setActivePage] = useState<ActivePage>('FlashcardsPage');
  const [historyStack, setHistoryStack] = useState<ActivePage[]>([]);

  // Mobile View Switcher: 'tree' (decks tree view) | 'card' (single card view)
  const [mobileView, setMobileView] = useState<'tree' | 'card'>('tree');

  // Selected Node (Divider or Card)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [addCardParentId, setAddCardParentId] = useState<string | null>(null);

  // Active Right View mode: 'CardView' | 'CardEditView' | 'CardAddView'
  const [rightViewMode, setRightViewMode] = useState<'CardView' | 'CardEditView' | 'CardAddView'>(
    'CardView'
  );
  const [editingCardNode, setEditingCardNode] = useState<NodeData | null>(null);
  const [isCardFlipped, setIsCardFlipped] = useState<boolean>(false);

  // Revision state
  const [revisionDividerId, setRevisionDividerId] = useState<string | null>(null);

  // Google Drive Cloud Auto-Sync & Polling State
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [syncState, setSyncState] = useState<SyncState>('unauthenticated');
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  // Auto-Refresh (Polling) Settings
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState<boolean>(true);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState<number>(30); // Default 30 seconds

  // Card Settings & Difficulty Settings (1:1 WinUI CardSettings.cs & DifficultySettings.cs)
  const [cardSettings, setCardSettings] = useState<CardSettingsData>(DEFAULT_CARD_SETTINGS);
  const [difficultySettings, setDifficultySettings] = useState<DifficultySettingsData>(DEFAULT_DIFFICULTY_SETTINGS);

  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load initial nodes, theme, sidebar width, settings, and auto-sync on startup
  useEffect(() => {
    const data = getStoredNodes();
    setNodes(data);
    const theme = getStoredTheme();
    applyTheme(theme);

    try {
      const savedWidth = localStorage.getItem(SIDEBAR_WIDTH_KEY);
      if (savedWidth) {
        setSidebarWidth(parseInt(savedWidth, 10));
      }
      const savedSync = localStorage.getItem(STORAGE_LAST_SYNC_KEY);
      if (savedSync) setLastSyncTime(savedSync);

      const savedRefreshEnabled = localStorage.getItem(AUTO_REFRESH_ENABLED_KEY);
      if (savedRefreshEnabled !== null) {
        setAutoRefreshEnabled(savedRefreshEnabled === 'true');
      }

      const savedRefreshInterval = localStorage.getItem(AUTO_REFRESH_INTERVAL_KEY);
      if (savedRefreshInterval) {
        setAutoRefreshInterval(parseInt(savedRefreshInterval, 10));
      }

      const savedCardSettings = localStorage.getItem(CARD_SETTINGS_KEY);
      if (savedCardSettings) {
        setCardSettings(JSON.parse(savedCardSettings));
      }

      const savedDiffSettings = localStorage.getItem(DIFFICULTY_SETTINGS_KEY);
      if (savedDiffSettings) {
        setDifficultySettings(JSON.parse(savedDiffSettings));
      }
    } catch (e) {
      console.error(e);
    }

    // Check Google Drive token for initial load smart sync (1:1 WinUI SyncService algorithm)
    const token = getStoredAccessToken();
    const savedClientId = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_CLIENT_ID_KEY) : null;

    if (token) {
      setAccessToken(token);
      setSyncState('syncing');

      performSmartSync(token, data).then((res) => {
        if (res.success) {
          if (res.nodes) {
            setNodes(res.nodes);
            saveStoredNodes(res.nodes);
          }
          const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          setLastSyncTime(timeStr);
          try {
            localStorage.setItem(STORAGE_LAST_SYNC_KEY, timeStr);
          } catch (e) {}
          setSyncState('synced');
        } else if (res.isAuthError && savedClientId) {
          setSyncState('syncing');
          requestSilentGoogleDriveToken(
            savedClientId,
            (newToken) => {
              setAccessToken(newToken);
              performSmartSync(newToken, data).then((sRes) => {
                if (sRes.success && sRes.nodes) {
                  setNodes(sRes.nodes);
                  saveStoredNodes(sRes.nodes);
                }
                const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                setLastSyncTime(timeStr);
                try {
                  localStorage.setItem(STORAGE_LAST_SYNC_KEY, timeStr);
                } catch (e) {}
                setSyncState('synced');
              });
            },
            () => {
              clearStoredToken();
              setAccessToken(null);
              setSyncState('unauthenticated');
            }
          );
        } else {
          setSyncState('unauthenticated');
        }
      });
    }
  }, []);

  // Card Weight Decay Background Engine
  useEffect(() => {
    if (!cardSettings.decayDurationHours || cardSettings.decayWeight <= 0) return;

    const decayResult = applyWeightDecay(nodes, cardSettings);
    if (decayResult) {
      setNodes(decayResult.updatedNodes);
      saveStoredNodes(decayResult.updatedNodes);
      const updatedSettings = { ...cardSettings, lastDecayTime: decayResult.newLastDecayTime };
      setCardSettings(updatedSettings);
      try {
        localStorage.setItem(CARD_SETTINGS_KEY, JSON.stringify(updatedSettings));
      } catch (e) {}
    }
  }, [nodes, cardSettings]);

  // Background Auto-Refresh
  useEffect(() => {
    if (!autoRefreshEnabled || !accessToken) return;

    const intervalMs = autoRefreshInterval * 1000;
    const intervalId = setInterval(() => {
      performSmartSync(accessToken, nodes).then((res) => {
        if (res.success) {
          if (res.nodes) {
            setNodes(res.nodes);
            saveStoredNodes(res.nodes);
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
  }, [autoRefreshEnabled, autoRefreshInterval, accessToken, nodes]);

  const handleSidebarWidthChange = (newWidth: number) => {
    setSidebarWidth(newWidth);
    try {
      localStorage.setItem(SIDEBAR_WIDTH_KEY, newWidth.toString());
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleAutoRefresh = (enabled: boolean) => {
    setAutoRefreshEnabled(enabled);
    try {
      localStorage.setItem(AUTO_REFRESH_ENABLED_KEY, enabled.toString());
    } catch (e) {
      console.error(e);
    }
  };

  const handleChangeRefreshInterval = (seconds: number) => {
    setAutoRefreshInterval(seconds);
    try {
      localStorage.setItem(AUTO_REFRESH_INTERVAL_KEY, seconds.toString());
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateCardSettings = (newSettings: CardSettingsData) => {
    setCardSettings(newSettings);
    try {
      localStorage.setItem(CARD_SETTINGS_KEY, JSON.stringify(newSettings));
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateDifficultySettings = (newSettings: DifficultySettingsData) => {
    setDifficultySettings(newSettings);
    try {
      localStorage.setItem(DIFFICULTY_SETTINGS_KEY, JSON.stringify(newSettings));
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetCardSettings = () => {
    setCardSettings(DEFAULT_CARD_SETTINGS);
    try {
      localStorage.setItem(CARD_SETTINGS_KEY, JSON.stringify(DEFAULT_CARD_SETTINGS));
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetDifficultySettings = () => {
    setDifficultySettings(DEFAULT_DIFFICULTY_SETTINGS);
    try {
      localStorage.setItem(DIFFICULTY_SETTINGS_KEY, JSON.stringify(DEFAULT_DIFFICULTY_SETTINGS));
    } catch (e) {
      console.error(e);
    }
  };

  // Central Node Mutation Handler with 1:1 WinUI performSmartSync
  const handleUpdateNodes = (newNodes: NodeData[]) => {
    setNodes(newNodes);
    saveStoredNodes(newNodes);

    // Save updated local SyncMetadata with current timestamp for smart sync comparison
    const jsonStr = exportToWinUIJson(newNodes, null, true);
    calculateJsonHash(jsonStr).then((hash) => {
      saveStoredLocalMetadata({ Hash: hash, ModifiedAt: new Date().toISOString() });
    });

    if (accessToken) {
      setSyncState('syncing');

      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }

      syncTimeoutRef.current = setTimeout(() => {
        performSmartSync(accessToken, newNodes).then((res) => {
          if (res.success) {
            if (res.nodes) {
              setNodes(res.nodes);
              saveStoredNodes(res.nodes);
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
    }
  };

  // Google Drive Authentication Handlers
  const handleConnectDrive = (clientId: string) => {
    setSyncState('syncing');
    requestGoogleDriveToken(
      clientId,
      (token) => {
        setAccessToken(token);
        setSyncState('syncing');

        performSmartSync(token, nodes).then((res) => {
          if (res.success) {
            if (res.nodes) {
              setNodes(res.nodes);
              saveStoredNodes(res.nodes);
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
      },
      () => {
        setSyncState('error');
      }
    );
  };

  const handleDisconnectDrive = () => {
    clearStoredToken();
    setAccessToken(null);
    setSyncState('unauthenticated');
  };

  const handleManualUpload = () => {
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
  };

  const handleManualDownload = () => {
    if (!accessToken) return;
    setSyncState('syncing');
    downloadFromGoogleDrive(accessToken, nodes, true).then((res) => {
      if (res.success && res.nodes) {
        handleUpdateNodes(res.nodes);
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
  };

  // Full Manual Sync Trigger on TitleBar Sync Badge Click
  const handleFullManualSync = () => {
    if (!accessToken) return;
    setSyncState('syncing');

    performSmartSync(accessToken, nodes).then((res) => {
      if (res.success) {
        if (res.nodes) {
          setNodes(res.nodes);
          saveStoredNodes(res.nodes);
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
  };

  // Selected node object
  const selectedNode = useMemo(() => {
    if (!selectedNodeId) return null;
    return nodes.find((n) => n.id === selectedNodeId) || null;
  }, [nodes, selectedNodeId]);

  // Selected card object
  const selectedCardNode = useMemo(() => {
    if (!selectedNode) return null;
    if (selectedNode.type === 'card' && selectedNode.card) return selectedNode;
    return null;
  }, [selectedNode]);

  // Revision Cards selection
  const revisionDividerNode = useMemo(() => {
    if (!revisionDividerId) return null;
    return nodes.find((n) => n.id === revisionDividerId) || null;
  }, [nodes, revisionDividerId]);

  const cardsToRevise = useMemo(() => {
    return getAllCardsInDeck(nodes, revisionDividerId);
  }, [nodes, revisionDividerId]);

  // Navigation handlers
  const handleNavigate = (page: ActivePage) => {
    if (page === activePage) return;
    setHistoryStack((prev) => [...prev, activePage]);
    setActivePage(page);
    setIsCardFlipped(false);
  };

  const handleGoBack = () => {
    if (historyStack.length === 0) return;
    const prevPage = historyStack[historyStack.length - 1];
    setHistoryStack((prev) => prev.slice(0, prev.length - 1));
    setActivePage(prevPage);
    setIsCardFlipped(false);
  };

  // TreeView Item Selection
  const handleSelectNode = (node: NodeData) => {
    setSelectedNodeId(node.id);
    setIsCardFlipped(false);
    setRightViewMode('CardView');
    if (node.type === 'card') {
      setMobileView('card');
    }
  };

  // Trigger Add Card mode
  const handleTriggerAddCard = (parentId: string | null) => {
    setAddCardParentId(parentId);
    if (parentId) setSelectedNodeId(parentId);
    setRightViewMode('CardAddView');
    setMobileView('card');
  };

  // Save new card
  const handleSaveNewCard = (front: string, back: string) => {
    const newId = `node-card-${Date.now()}`;
    const targetParent = addCardParentId !== undefined ? addCardParentId : (selectedNode?.type === 'divider' ? selectedNode.id : null);
    
    const newCardNode: NodeData = {
      id: newId,
      name: front.slice(0, 35).replace(/[#*`]/g, '') || 'New Flashcard',
      type: 'card',
      parentId: targetParent,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      card: {
        id: `card-${Date.now()}`,
        nodeId: newId,
        front,
        back,
        weight: cardSettings.defaultWeight,
        easeFactor: 2.5,
        interval: 1,
        reviewCount: 0,
      },
    };
    handleUpdateNodes([...nodes, newCardNode]);
    setSelectedNodeId(newId);
    setRightViewMode('CardView');
    setMobileView('card');
  };

  const handleAddDivider = (parentId: string | null) => {
    const newId = `node-deck-${Date.now()}`;
    const targetParent = parentId !== undefined ? parentId : (selectedNode?.type === 'divider' ? selectedNode.id : null);

    const newDividerNode: NodeData = {
      id: newId,
      name: 'New Divider',
      type: 'divider',
      parentId: targetParent,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      divider: {
        id: `div-${Date.now()}`,
        nodeId: newId,
        description: '',
      },
    };
    handleUpdateNodes([...nodes, newDividerNode]);
    setSelectedNodeId(newId);
  };

  const handleStartEditCard = (cardNode: NodeData) => {
    setEditingCardNode(cardNode);
    setRightViewMode('CardEditView');
    setMobileView('card');
  };

  const handleSaveCardEdit = (front: string, back: string) => {
    if (!editingCardNode) return;

    const updated = nodes.map((n) =>
      n.id === editingCardNode.id
        ? {
            ...n,
            name: front.slice(0, 35).replace(/[#*`]/g, '') || n.name,
            updatedAt: new Date().toISOString(),
            card: n.card ? { ...n.card, front, back } : undefined,
          }
        : n
    );

    handleUpdateNodes(updated);
    setRightViewMode('CardView');
    setIsCardFlipped(false);
  };

  const handleRenameNode = (node: NodeData, newName: string) => {
    const updated = nodes.map((n) => (n.id === node.id ? { ...n, name: newName } : n));
    handleUpdateNodes(updated);
  };

  const handleDeleteNode = (nodeId: string) => {
    if (!confirm('Delete this item?')) return;

    const idsToDelete = new Set<string>();
    const collectToDelete = (id: string) => {
      idsToDelete.add(id);
      nodes.filter((n) => n.parentId === id).forEach((child) => collectToDelete(child.id));
    };
    collectToDelete(nodeId);

    const filtered = nodes.filter((n) => !idsToDelete.has(n.id));
    handleUpdateNodes(filtered);
    if (selectedNodeId && idsToDelete.has(selectedNodeId)) {
      setSelectedNodeId(null);
      setMobileView('tree');
    }
  };

  const handleResetWeights = (nodeId: string, recursive: boolean = true) => {
    const idsToReset = new Set<string>();
    const targetNode = nodes.find((n) => n.id === nodeId);
    if (!targetNode) return;

    if (targetNode.type === 'card') {
      idsToReset.add(nodeId);
    } else if (targetNode.type === 'divider') {
      const collect = (id: string) => {
        nodes.filter((n) => n.parentId === id).forEach((c) => {
          if (c.type === 'card') idsToReset.add(c.id);
          else if (c.type === 'divider' && recursive) collect(c.id);
        });
      };
      collect(nodeId);
    }

    const updated = nodes.map((n) => {
      if (idsToReset.has(n.id) && n.card) {
        return {
          ...n,
          card: { ...n.card, weight: cardSettings.defaultWeight },
        };
      }
      return n;
    });
    handleUpdateNodes(updated);
  };

  // Export / Import
  const handleExportAll = (dividerId?: string) => {
    const jsonStr = exportToWinUIJson(nodes, typeof dividerId === 'string' ? dividerId : null);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flashcards_export_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportAll = (
    e: React.ChangeEvent<HTMLInputElement>,
    targetParentId: string | null = null
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const imported = JSON.parse(evt.target?.result as string);
        const updated = importFromWinUIJson(imported, nodes, targetParentId);
        handleUpdateNodes(updated);
        alert('WinUI flashcards imported successfully!');
      } catch (err) {
        alert('Failed to parse WinUI JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetAll = () => {
    if (confirm('Reset to factory sample flashcards?')) {
      const sample = resetToSampleNodes();
      handleUpdateNodes(sample);
      setSelectedNodeId(null);
      setMobileView('tree');
    }
  };

  const handleMoveNode = (draggedNodeId: string, targetParentId: string | null) => {
    if (draggedNodeId === targetParentId) return;

    const isDescendant = (id: string, ancestorId: string): boolean => {
      const current = nodes.find((n) => n.id === id);
      if (!current || !current.parentId) return false;
      if (current.parentId === ancestorId) return true;
      return isDescendant(current.parentId, ancestorId);
    };

    if (targetParentId && isDescendant(targetParentId, draggedNodeId)) return;

    const updated = nodes.map((n) =>
      n.id === draggedNodeId ? { ...n, parentId: targetParentId, updatedAt: new Date().toISOString() } : n
    );

    handleUpdateNodes(updated);
  };

  const handleSortNodes = (recursive: boolean) => {
    const sortLevel = (list: NodeData[], parentId: string | null): NodeData[] => {
      const children = list.filter((n) => n.parentId === parentId);
      const others = list.filter((n) => n.parentId !== parentId);

      children.sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === 'divider' ? -1 : 1;
        }
        return a.name.localeCompare(b.name, undefined, { sensitivity: 'base', numeric: true });
      });

      let nextList = [...others, ...children];

      if (recursive) {
        children.forEach((c) => {
          if (c.type === 'divider') {
            nextList = sortLevel(nextList, c.id);
          }
        });
      }

      return nextList;
    };

    const sorted = sortLevel(nodes, null);
    handleUpdateNodes(sorted);
  };

  return (
    <div className="flex flex-col h-dvh w-screen max-w-full bg-slate-950 text-slate-100 overflow-hidden font-sans select-none fixed inset-0">
      {/* WinUI 3 TitleBar & Navigation with Auto-Sync Status Badge & Mobile View Switcher */}
      <WinUITitleBar
        activePage={activePage}
        onNavigate={handleNavigate}
        canGoBack={historyStack.length > 0}
        onGoBack={handleGoBack}
        syncState={syncState}
        lastSyncTime={lastSyncTime}
        onManualSync={handleFullManualSync}
        mobileView={mobileView}
        onToggleMobileView={() => setMobileView((prev) => (prev === 'tree' ? 'card' : 'tree'))}
      />

      {/* Main Content Pages */}
      <div className="flex-1 flex overflow-hidden relative">
        {activePage === 'FlashcardsPage' && (
          <div className="flex-1 flex h-full overflow-hidden relative">
            {/* Left TreeView Pane (Full screen on mobile when mobileView === 'tree', sidebar on desktop) */}
            <div
              className={`h-full ${
                mobileView === 'tree' ? 'flex w-full' : 'hidden'
              } md:flex md:w-auto shrink-0 z-10`}
            >
              <XamlTreeView
                nodes={nodes}
                selectedNodeId={selectedNodeId}
                width={sidebarWidth}
                onSelectNode={handleSelectNode}
                onAddCard={handleTriggerAddCard}
                onAddDivider={handleAddDivider}
                onReviseDivider={(node) => {
                  setRevisionDividerId(node ? node.id : null);
                  handleNavigate('RevisionPage');
                }}
                onEditCard={(node) => {
                  setSelectedNodeId(node.id);
                  handleStartEditCard(node);
                }}
                onRenameNode={handleRenameNode}
                onDeleteNode={handleDeleteNode}
                onResetWeights={handleResetWeights}
                onExportDivider={handleExportAll}
                onImportDivider={handleImportAll}
                onMoveNode={handleMoveNode}
                onSortNodes={handleSortNodes}
              />
            </div>

            {/* WinUI 3 GridSplitter Column (Hidden on mobile) */}
            <div className="hidden md:block">
              <XamlGridSplitter
                width={sidebarWidth}
                onWidthChange={handleSidebarWidthChange}
                minWidth={180}
                maxWidth={500}
              />
            </div>

            {/* Right Pane: CardControl, CardEditControl, or CardAddControl */}
            <div
              className={`flex-1 h-full bg-slate-950 flex flex-col overflow-hidden relative ${
                mobileView === 'card' ? 'flex w-full' : 'hidden md:flex'
              }`}
            >
              {/* Mobile Top Header Banner when viewing a card */}
              <div className="md:hidden flex items-center justify-between px-3 py-2 bg-slate-900/90 border-b border-slate-800 shrink-0">
                <button
                  onClick={() => setMobileView('tree')}
                  className="flex items-center space-x-1 text-xs text-indigo-300 font-medium py-1 px-2.5 bg-indigo-950/80 border border-indigo-500/40 rounded-lg touch-manipulation"
                >
                  <ChevronLeft size={14} />
                  <span>Decks List</span>
                </button>
                <span className="text-xs font-semibold text-slate-300 truncate max-w-[180px]">
                  {selectedNode ? selectedNode.name : 'Card View'}
                </span>
              </div>

              {rightViewMode === 'CardAddView' ? (
                <XamlCardAddControl
                  onAddCard={handleSaveNewCard}
                  onDone={() => setRightViewMode('CardView')}
                />
              ) : rightViewMode === 'CardEditView' ? (
                <XamlCardEditControl
                  cardNode={editingCardNode || selectedCardNode}
                  onSave={handleSaveCardEdit}
                  onCancel={() => setRightViewMode('CardView')}
                />
              ) : (
                <XamlCardControl
                  cardNode={selectedCardNode}
                  isFlipped={isCardFlipped}
                  onFlip={() => setIsCardFlipped(!isCardFlipped)}
                  onStartEditing={() => {
                    if (selectedCardNode) handleStartEditCard(selectedCardNode);
                  }}
                  isEditButtonVisible={!!selectedCardNode}
                  cardSettings={cardSettings}
                />
              )}
            </div>
          </div>
        )}

        {activePage === 'RevisionPage' && (
          <XamlRevisionPage
            selectedDividerNode={revisionDividerNode}
            cardsToRevise={cardsToRevise}
            cardSettings={cardSettings}
            difficultySettings={difficultySettings}
            onUpdateCard={(updatedNode) => {
              const updated = nodes.map((n) => (n.id === updatedNode.id ? updatedNode : n));
              handleUpdateNodes(updated);
            }}
            onGoToFlashcardsPage={() => handleNavigate('FlashcardsPage')}
          />
        )}

        {activePage === 'SettingsPage' && (
          <XamlSettingsPage
            nodes={nodes}
            accessToken={accessToken}
            syncState={syncState}
            lastSyncTime={lastSyncTime}
            autoRefreshEnabled={autoRefreshEnabled}
            autoRefreshInterval={autoRefreshInterval}
            cardSettings={cardSettings}
            difficultySettings={difficultySettings}
            onConnectDrive={handleConnectDrive}
            onDisconnectDrive={handleDisconnectDrive}
            onUploadManual={handleManualUpload}
            onDownloadManual={handleManualDownload}
            onToggleAutoRefresh={handleToggleAutoRefresh}
            onChangeRefreshInterval={handleChangeRefreshInterval}
            onUpdateCardSettings={handleUpdateCardSettings}
            onUpdateDifficultySettings={handleUpdateDifficultySettings}
            onResetCardSettings={handleResetCardSettings}
            onResetDifficultySettings={handleResetDifficultySettings}
            onExportAll={handleExportAll}
            onImportAll={handleImportAll}
            onResetAll={handleResetAll}
          />
        )}
      </div>
    </div>
  );
}
