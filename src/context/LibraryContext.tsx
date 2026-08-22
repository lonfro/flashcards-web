'use client';

import React, { createContext, useContext, useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { NodeData } from '../types/flashcard';
import { useSettings } from './SettingsContext';
import { useNavigation } from './NavigationContext';
import { useNodes } from '../hooks/useNodes';
import { getAllCardsInDeck, resetToSampleNodes } from '../utils/storage';
import { applyWeightDecay } from '../utils/spacedRepetition';
import { exportToWinUIJson, importFromWinUIJson, calculateJsonHash } from '../utils/winuiJsonConverter';
import { saveStoredLocalMetadata } from '../utils/googleDriveSync';

export interface LibraryContextValue {
  nodes: NodeData[];
  isLoading: boolean;
  selectedNodeId: string | null;
  selectedNode: NodeData | null;
  selectedCardNode: NodeData | null;
  addCardParentId: string | null;
  revisionDividerId: string | null;
  revisionDividerNode: NodeData | null;
  cardsToRevise: NodeData[];
  setNodes: React.Dispatch<React.SetStateAction<NodeData[]>>;
  setSelectedNodeId: (id: string | null) => void;
  setAddCardParentId: (id: string | null) => void;
  setRevisionDividerId: (id: string | null) => void;
  handleUpdateNodes: (newNodes: NodeData[]) => Promise<void>;
  handleSelectNode: (node: NodeData) => void;
  handleTriggerAddCard: (parentId: string | null) => void;
  handleSaveNewCard: (front: string, back: string) => void;
  handleAddDivider: (parentId: string | null) => void;
  handleStartEditCard: (cardNode: NodeData) => void;
  handleSaveCardEdit: (front: string, back: string) => void;
  handleRenameNode: (node: NodeData, newName: string) => void;
  handleDeleteNode: (nodeId: string) => void;
  handleResetWeights: (nodeId: string, recursive?: boolean) => void;
  handleExportAll: (dividerId?: string) => void;
  handleImportAll: (e: React.ChangeEvent<HTMLInputElement>, targetParentId?: string | null) => void;
  handleResetAll: () => Promise<void>;
  handleMoveNode: (draggedNodeId: string, targetNodeId: string | null, dropPosition?: 'before' | 'after' | 'into') => void;
  handleSortNodes: (recursive: boolean) => void;
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
  } = useNavigation();

  const { nodes, isLoading, saveNodes, setNodes } = useNodes();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [addCardParentId, setAddCardParentId] = useState<string | null>(null);
  const [revisionDividerId, setRevisionDividerId] = useState<string | null>(null);

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
      await saveNodes(newNodes);

      // Save updated local SyncMetadata with current timestamp for smart sync comparison
      try {
        const jsonStr = exportToWinUIJson(newNodes, null, true);
        const hash = await calculateJsonHash(jsonStr);
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

  // Card Weight Decay Background Engine
  useEffect(() => {
    if (!cardSettings.decayDurationHours || cardSettings.decayWeight <= 0 || nodes.length === 0) return;

    const decayResult = applyWeightDecay(nodes, cardSettings);
    if (decayResult) {
      handleUpdateNodes(decayResult.updatedNodes);
      const updatedSettings = { ...cardSettings, lastDecayTime: decayResult.newLastDecayTime };
      handleUpdateCardSettings(updatedSettings);
    }
  }, [nodes, cardSettings, handleUpdateNodes, handleUpdateCardSettings]);

  // Derived state
  const selectedNode = useMemo(() => {
    if (!selectedNodeId) return null;
    return nodes.find((n) => n.id === selectedNodeId) || null;
  }, [nodes, selectedNodeId]);

  const selectedCardNode = useMemo(() => {
    if (!selectedNode) return null;
    if (selectedNode.type === 'card' && selectedNode.card) return selectedNode;
    return null;
  }, [selectedNode]);

  const revisionDividerNode = useMemo(() => {
    if (!revisionDividerId) return null;
    return nodes.find((n) => n.id === revisionDividerId) || null;
  }, [nodes, revisionDividerId]);

  const cardsToRevise = useMemo(() => {
    return getAllCardsInDeck(nodes, revisionDividerId);
  }, [nodes, revisionDividerId]);

  // TreeView Item Selection
  const handleSelectNode = useCallback(
    (node: NodeData) => {
      setSelectedNodeId(node.id);
      setIsCardFlipped(false);
      setRightViewMode('CardView');
      if (node.type === 'card') {
        setMobileView('card');
      }
    },
    [setIsCardFlipped, setRightViewMode, setMobileView]
  );

  // Trigger Add Card mode
  const handleTriggerAddCard = useCallback(
    (parentId: string | null) => {
      setAddCardParentId(parentId);
      if (parentId) setSelectedNodeId(parentId);
      setRightViewMode('CardAddView');
      setMobileView('card');
    },
    [setRightViewMode, setMobileView]
  );

  // Save new card
  const handleSaveNewCard = useCallback(
    (front: string, back: string) => {
      const newId = `node-card-${Date.now()}`;
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
    },
    [addCardParentId, selectedNode, cardSettings.defaultWeight, handleUpdateNodes, nodes, setRightViewMode, setMobileView]
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
    },
    [selectedNode, handleUpdateNodes, nodes]
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
      const updated = nodes.map((n) => (n.id === node.id ? { ...n, name: newName } : n));
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
    [nodes, handleUpdateNodes, selectedNodeId, setMobileView]
  );

  const handleResetWeights = useCallback(
    (nodeId: string, recursive: boolean = true) => {
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
    },
    [nodes, cardSettings.defaultWeight, handleUpdateNodes]
  );

  const handleExportAll = useCallback(
    (dividerId?: string) => {
      const jsonStr = exportToWinUIJson(nodes, typeof dividerId === 'string' ? dividerId : null);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `flashcards_export_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    },
    [nodes]
  );

  const handleImportAll = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, targetParentId: string | null = null) => {
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
    },
    [nodes, handleUpdateNodes]
  );

  const handleResetAll = useCallback(async () => {
    if (confirm('Reset to factory sample flashcards?')) {
      const sample = await resetToSampleNodes();
      await handleUpdateNodes(sample);
      setSelectedNodeId(null);
      setMobileView('tree');
    }
  }, [handleUpdateNodes, setMobileView]);

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
      if (targetParentId && isDescendant(targetParentId, draggedNodeId)) return;

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
    (recursive: boolean) => {
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
    },
    [nodes, handleUpdateNodes]
  );

  return (
    <LibraryContext.Provider
      value={{
        nodes,
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
        handleSelectNode,
        handleTriggerAddCard,
        handleSaveNewCard,
        handleAddDivider,
        handleStartEditCard,
        handleSaveCardEdit,
        handleRenameNode,
        handleDeleteNode,
        handleResetWeights,
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
