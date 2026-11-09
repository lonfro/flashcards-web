'use client';

import React, { createContext, useContext, useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { NodeData } from '../types/flashcard';
import { useSettings } from './SettingsContext';
import { useNavigation } from './NavigationContext';
import { useNodes } from '../hooks/useNodes';
import { useLibraryBackups } from '../hooks/useLibraryBackups';
import { getAllCardsInDeck, resetToSampleNodes } from '../utils/storage';
import { applyWeightDecay } from '../utils/spacedRepetition';
import { exportToWinUIJson, importFromWinUIJson, calculateJsonHash, downloadLibraryJson } from '../utils/winuiJsonConverter';
import { saveStoredLocalMetadata, type WinUISyncMetadata } from '../utils/googleDriveSync';

type ImportMode = 'auto' | 'divider' | 'contents';

export interface LibraryContextValue {
  nodes: NodeData[];
  backups: ReturnType<typeof useLibraryBackups>;
  isLoading: boolean;
  selectedNodeId: string | null;
  selectedNode: NodeData | null;
  selectedCardNode: NodeData | null;
  addCardParentId: string | null;
  revisionDividerId: string | null | undefined;
  revisionDividerNode: NodeData | null;
  cardsToRevise: NodeData[];
  setNodes: React.Dispatch<React.SetStateAction<NodeData[]>>;
  setSelectedNodeId: (id: string | null) => void;
  setAddCardParentId: (id: string | null) => void;
  setRevisionDividerId: (id: string | null) => void;
  restoreSyncedNodes: (newNodes: NodeData[], metadata: WinUISyncMetadata, expectedNodes: NodeData[]) => Promise<boolean>;
  handleUpdateNodes: (newNodes: NodeData[]) => Promise<void>;
  handleSelectNode: (node: NodeData) => void;
  handleTriggerAddCard: (parentId: string | null) => void;
  handleSaveNewCard: (front: string, back: string) => void;
  handleAddDivider: (parentId: string | null) => NodeData;
  handleStartEditCard: (cardNode: NodeData) => void;
  handleSaveCardEdit: (front: string, back: string) => void;
  handleRenameNode: (node: NodeData, newName: string) => void;
  handleDeleteNode: (nodeId: string) => void;
  handleResetWeights: (nodeId: string | null, recursive?: boolean) => void;
  handleToggleProgress: (nodeId: string) => void;
  handleExportAll: (dividerId?: string) => void;
  handleImportAll: (e: React.ChangeEvent<HTMLInputElement>, targetParentId?: string | null, mode?: ImportMode) => void;
  handleResetAll: () => Promise<void>;
  handleMoveNode: (draggedNodeId: string, targetNodeId: string | null, dropPosition?: 'before' | 'after' | 'into') => void;
  handleSortNodes: (recursive: boolean, parentId?: string | null) => void;
  registerSyncListener: (listener: (nodes: NodeData[]) => void) => () => void;
}

const LibraryContext = createContext<LibraryContextValue | null>(null);

export function useLibrary(): LibraryContextValue {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
}

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const { cardSettings, handleUpdateCardSettings } = useSettings();
  const {
    setMobileView,
    setRightViewMode,
    setEditingCardNode,
    setIsCardFlipped,
    editingCardNode,
    rightViewMode,
  } = useNavigation();

  const { nodes, isLoading, saveNodes, setNodes } = useNodes();
  const backups = useLibraryBackups(nodes, isLoading);
  const latestNodes = useRef(nodes);
  useEffect(() => { latestNodes.current = nodes; }, [nodes]);
  const [selectedNodeId, setTreeSelection] = useState<string | null>(null);
  const [viewedCardId, setViewedCardId] = useState<string | null>(null);
  const setSelectedNodeId = useCallback((id: string | null) => {
    setTreeSelection(id);
    if (!id || latestNodes.current.some((node) => node.id === id && node.card)) {
      setViewedCardId(id);
    }
  }, []);
  const [addCardParentId, setAddCardParentId] = useState<string | null>(null);
  const [revisionDividerId, setRevisionDividerId] = useState<string | null | undefined>(undefined);

  const syncListenersRef = useRef<Set<(nodes: NodeData[]) => void>>(new Set());

  const registerSyncListener = useCallback((listener: (nodes: NodeData[]) => void) => {
    syncListenersRef.current.add(listener);
    return () => {
      syncListenersRef.current.delete(listener);
    };
  }, []);

  // Central Node Mutation Handler
  const handleUpdateNodes = useCallback(
    async (newNodes: NodeData[]) => {
      latestNodes.current = newNodes;
      await saveNodes(newNodes);
      if (latestNodes.current !== newNodes) return;

      // Save updated local SyncMetadata with current timestamp for smart sync comparison
      try {
        const jsonStr = exportToWinUIJson(newNodes, null, true);
        const hash = await calculateJsonHash(jsonStr);
        if (latestNodes.current !== newNodes) return;
        saveStoredLocalMetadata({ Hash: hash, ModifiedAt: new Date().toISOString() });
      } catch (e) {
        console.error('Failed to compute JSON hash:', e);
      }

      // Notify sync listeners (e.g. SyncContext for debounced cloud sync)
      syncListenersRef.current.forEach((listener) => {
        try {
          listener(newNodes);
        } catch (e) {
          console.error('Sync listener error:', e);
        }
      });
    },
    [saveNodes]
  );

  const restoreSyncedNodes = useCallback(async (
    newNodes: NodeData[],
    metadata: WinUISyncMetadata,
    expectedNodes: NodeData[]
  ) => {
    if (latestNodes.current !== expectedNodes) return false;
    latestNodes.current = newNodes;
    await saveNodes(newNodes);
    if (latestNodes.current !== newNodes) return false;
    saveStoredLocalMetadata(metadata);
    return true;
  }, [saveNodes]);

  useEffect(() => {
    const { decayDurationHours, decayWeight, lastDecayTime } = cardSettings;
    if (!decayDurationHours || decayWeight <= 0 || isLoading) return;
    if (!lastDecayTime || !Number.isFinite(Date.parse(lastDecayTime))) {
      handleUpdateCardSettings({ ...cardSettings, lastDecayTime: new Date().toISOString() });
      return;
    }

    const applyDecay = () => {
      const result = applyWeightDecay(latestNodes.current, cardSettings);
      if (!result) return;
      void handleUpdateNodes(result.updatedNodes);
      handleUpdateCardSettings({ ...cardSettings, lastDecayTime: result.newLastDecayTime });
    };
    const due = Date.parse(lastDecayTime) + decayDurationHours * 3_600_000;
    let timer: number;
    const schedule = () => {
      const remaining = due - Date.now();
      if (remaining <= 0) applyDecay();
      else timer = window.setTimeout(schedule, Math.min(remaining, 2_147_483_647));
    };
    schedule();
    return () => window.clearTimeout(timer);
  }, [isLoading, cardSettings, handleUpdateNodes, handleUpdateCardSettings]);

  // Derived state
  const selectedNode = useMemo(() => {
    if (!selectedNodeId) return null;
    return nodes.find((n) => n.id === selectedNodeId) || null;
  }, [nodes, selectedNodeId]);

  const selectedCardNode = useMemo(
    () => nodes.find((node) => node.id === viewedCardId && node.card) ?? null,
    [nodes, viewedCardId]
  );

  const revisionDividerNode = useMemo(() => {
    if (!revisionDividerId) return null;
    return nodes.find((n) => n.id === revisionDividerId) || null;
  }, [nodes, revisionDividerId]);

  const cardsToRevise = useMemo(() => {
    return revisionDividerId === undefined ? [] : getAllCardsInDeck(nodes, revisionDividerId);
  }, [nodes, revisionDividerId]);

  // TreeView Item Selection
  const handleSelectNode = useCallback(
    (node: NodeData) => {
      setSelectedNodeId(node.id);
      if (node.type === 'divider') {
        if (rightViewMode === 'CardAddView') setAddCardParentId(node.id);
        return;
      }
      setIsCardFlipped(false);
      setRightViewMode('CardView');
      setMobileView('card');
    },
    [rightViewMode, setSelectedNodeId, setIsCardFlipped, setRightViewMode, setMobileView]
  );

  // Trigger Add Card mode
  const handleTriggerAddCard = useCallback(
    (parentId: string | null) => {
      setAddCardParentId(parentId);
      if (parentId) setSelectedNodeId(parentId);
      setRightViewMode('CardAddView');
      setIsCardFlipped(false);
      setMobileView('card');
    },
    [setSelectedNodeId, setIsCardFlipped, setRightViewMode, setMobileView]
  );

  // Save new card
  const handleSaveNewCard = useCallback(
    (front: string, back: string) => {
      const newId = crypto.randomUUID();
      const targetParent =
        addCardParentId !== undefined
          ? addCardParentId
          : selectedNode?.type === 'divider'
          ? selectedNode.id
          : null;

      const newCardNode: NodeData = {
        id: newId,
        name: front.slice(0, 35).replace(/[#*`]/g, '') || 'New Flashcard',
        type: 'card',
        parentId: targetParent,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        card: {
          id: crypto.randomUUID(),
          nodeId: newId,
          front,
          back,
          weight: cardSettings.defaultWeight,
          easeFactor: 2.5,
          interval: 1,
          reviewCount: 0,
        },
      };

      handleUpdateNodes([...latestNodes.current, newCardNode]);
      setSelectedNodeId(newId);
      setMobileView('card');
    },
    [addCardParentId, selectedNode, cardSettings.defaultWeight, handleUpdateNodes, setSelectedNodeId, setMobileView]
  );

  const handleAddDivider = useCallback(
    (parentId: string | null) => {
      const newId = `node-deck-${Date.now()}`;
      const targetParent =
        parentId !== undefined
          ? parentId
          : selectedNode?.type === 'divider'
          ? selectedNode.id
          : null;

      const newDividerNode: NodeData = {
        id: newId,
        name: 'New divider',
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
      return newDividerNode;
    },
    [selectedNode, handleUpdateNodes, nodes, setSelectedNodeId]
  );

  const handleStartEditCard = useCallback(
    (cardNode: NodeData) => {
      setEditingCardNode(cardNode);
      setRightViewMode('CardEditView');
      setMobileView('card');
    },
    [setEditingCardNode, setRightViewMode, setMobileView]
  );

  const handleSaveCardEdit = useCallback(
    (front: string, back: string) => {
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
    },
    [editingCardNode, nodes, handleUpdateNodes, setRightViewMode, setIsCardFlipped]
  );

  const handleRenameNode = useCallback(
    (node: NodeData, newName: string) => {
      const updated = nodes.map((n) => {
        if (n.id !== node.id) return n;
        return n.card
          ? { ...n, name: newName.slice(0, 35).replace(/[#*`]/g, '') || n.name, card: { ...n.card, front: newName } }
          : { ...n, name: newName };
      });
      handleUpdateNodes(updated);
    },
    [nodes, handleUpdateNodes]
  );

  const handleDeleteNode = useCallback(
    (nodeId: string) => {
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
    },
    [nodes, handleUpdateNodes, selectedNodeId, setSelectedNodeId, setMobileView]
  );

  const handleResetWeights = useCallback((nodeId: string | null, recursive = true) => {
    const idsToReset = new Set<string>();
    const collect = (parentId: string | null) => {
      for (const child of nodes.filter((node) => node.parentId === parentId)) {
        if (child.card) idsToReset.add(child.id);
        else if (recursive) collect(child.id);
      }
    };

    if (nodeId && nodes.find((node) => node.id === nodeId)?.card) idsToReset.add(nodeId);
    else collect(nodeId);

    const hideUntil = new Date().toISOString();
    void handleUpdateNodes(nodes.map((node) =>
      idsToReset.has(node.id) && node.card
        ? { ...node, card: { ...node.card, weight: cardSettings.defaultWeight, hideUntil } }
        : node
    ));
  }, [nodes, cardSettings.defaultWeight, handleUpdateNodes]);

  const handleToggleProgress = useCallback((nodeId: string) => {
    void handleUpdateNodes(nodes.map((node) => node.id === nodeId && node.divider
      ? { ...node, divider: { ...node.divider, isProgressShown: !node.divider.isProgressShown } }
      : node
    ));
  }, [nodes, handleUpdateNodes]);

  const handleExportAll = useCallback(
    (dividerId?: string) => {
      const json = exportToWinUIJson(nodes, typeof dividerId === 'string' ? dividerId : null);
      const name = nodes.find((node) => node.id === dividerId)?.name;
      const filename = name
        ? name.replace(/[<>:"/\\|?*]/g, '_') + '.json'
        : `flashcards_backup-${new Date().toISOString().slice(0, 10)}.json`;
      downloadLibraryJson(json, filename);
    },
    [nodes]
  );

  const handleImportAll = useCallback(async (
    event: React.ChangeEvent<HTMLInputElement>,
    targetParentId: string | null = null,
    mode: ImportMode = 'auto'
  ) => {
    const file = event.currentTarget.files?.[0];
    if (!file) return;
    event.currentTarget.value = '';
    try {
      const imported: unknown = JSON.parse(await file.text());
      const current = latestNodes.current;
      if (targetParentId && !current.some((node) => node.id === targetParentId && node.type === 'divider')) {
        throw new Error('Target divider no longer exists');
      }
      const updated = importFromWinUIJson(imported, current, targetParentId, false, mode);
      await handleUpdateNodes(updated);
      alert('WinUI flashcards imported successfully!');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to import WinUI JSON.');
    }
  }, [handleUpdateNodes]);

  const handleResetAll = useCallback(async () => {
    if (confirm('Reset to factory sample flashcards?')) {
      const sample = await resetToSampleNodes();
      await handleUpdateNodes(sample);
      setSelectedNodeId(null);
      setMobileView('tree');
    }
  }, [handleUpdateNodes, setSelectedNodeId, setMobileView]);

  const handleMoveNode = useCallback(
    (draggedNodeId: string, targetNodeId: string | null, dropPosition?: 'before' | 'after' | 'into') => {
      if (draggedNodeId === targetNodeId) return;

      const isDescendant = (id: string, ancestorId: string): boolean => {
        const current = nodes.find((n) => n.id === id);
        if (!current || !current.parentId) return false;
        if (current.parentId === ancestorId) return true;
        return isDescendant(current.parentId, ancestorId);
      };

      // 'into' = drop onto a folder → change parentId only (old behaviour)
      if (dropPosition === 'into' || !dropPosition) {
        if (targetNodeId && isDescendant(targetNodeId, draggedNodeId)) return;
        const updated = nodes.map((n) =>
          n.id === draggedNodeId ? { ...n, parentId: targetNodeId, updatedAt: new Date().toISOString() } : n
        );
        handleUpdateNodes(updated);
        return;
      }

      // 'before' / 'after' = reorder within the same sibling group
      const draggedNode = nodes.find((n) => n.id === draggedNodeId);
      const targetNode = targetNodeId ? nodes.find((n) => n.id === targetNodeId) : null;
      if (!draggedNode) return;

      const targetParentId = targetNode ? targetNode.parentId : null;

      // Prevent dropping into own descendant
      if (targetParentId && (targetParentId === draggedNodeId || isDescendant(targetParentId, draggedNodeId))) return;

      // Build the new flat node list:
      // 1. Remove dragged node from its current position
      const withoutDragged = nodes.filter((n) => n.id !== draggedNodeId);
      const updatedDragged = { ...draggedNode, parentId: targetParentId, updatedAt: new Date().toISOString() };

      if (!targetNodeId) {
        // Drop on root with no specific target → append to end of root
        handleUpdateNodes([...withoutDragged, updatedDragged]);
        return;
      }

      const targetIdx = withoutDragged.findIndex((n) => n.id === targetNodeId);
      if (targetIdx === -1) {
        handleUpdateNodes([...withoutDragged, updatedDragged]);
        return;
      }

      // Insert before or after target
      const insertAt = dropPosition === 'before' ? targetIdx : targetIdx + 1;
      const reordered = [
        ...withoutDragged.slice(0, insertAt),
        updatedDragged,
        ...withoutDragged.slice(insertAt),
      ];
      handleUpdateNodes(reordered);
    },
    [nodes, handleUpdateNodes]
  );

  const handleSortNodes = useCallback(
    (recursive: boolean, parentId: string | null = null) => {
      const sortLevel = (list: NodeData[], parentId: string | null): NodeData[] => {
        const children = list.filter((n) => n.parentId === parentId);
        const others = list.filter((n) => n.parentId !== parentId);

        children.sort((a, b) => {
          if (a.type !== b.type) {
            return a.type === 'divider' ? -1 : 1;
          }
          return (a.card?.front ?? a.name).localeCompare(b.card?.front ?? b.name, undefined, { sensitivity: 'base', numeric: true });
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

      const sorted = sortLevel(nodes, parentId);
      handleUpdateNodes(sorted);
    },
    [nodes, handleUpdateNodes]
  );

  return (
    <LibraryContext.Provider
      value={{
        nodes,
        backups,
        isLoading,
        selectedNodeId,
        selectedNode,
        selectedCardNode,
        addCardParentId,
        revisionDividerId,
        revisionDividerNode,
        cardsToRevise,
        setNodes,
        setSelectedNodeId,
        setAddCardParentId,
        setRevisionDividerId,
        handleUpdateNodes,
        restoreSyncedNodes,
        handleSelectNode,
        handleTriggerAddCard,
        handleSaveNewCard,
        handleAddDivider,
        handleStartEditCard,
        handleSaveCardEdit,
        handleRenameNode,
        handleDeleteNode,
        handleResetWeights,
        handleToggleProgress,
        handleExportAll,
        handleImportAll,
        handleResetAll,
        handleMoveNode,
        handleSortNodes,
        registerSyncListener,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}
