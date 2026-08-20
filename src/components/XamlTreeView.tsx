'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  MoreVertical,
  FilePlus,
  FolderPlus,
  RefreshCw,
  X,
} from 'lucide-react';
import { NodeData } from '../types/flashcard';
import { TreeNode, XamlTreeViewProps } from './tree/types';
import { TreeNodeItem } from './tree/TreeNodeItem';
import { TreeSearchResults } from './tree/TreeSearchResults';
import { TreeRootContextMenu } from './tree/TreeRootContextMenu';

export const XamlTreeView: React.FC<XamlTreeViewProps> = ({
  nodes,
  selectedNodeId,
  width,
  onSelectNode,
  onAddCard,
  onAddDivider,
  onReviseDivider,
  onEditCard,
  onRenameNode,
  onDeleteNode,
  onResetWeights,
  onExportDivider,
  onImportDivider,
  onMoveNode,
  onSortNodes,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedFolderIds, setExpandedFolderIds] = useState<Record<string, boolean>>({});
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');
  const [activeMenuNodeId, setActiveMenuNodeId] = useState<string | null>(null);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [dragOverFolderId, setDragOverFolderId] = useState<string | null>(null);

  // Root Context Menu Flyout State
  const [isRootMenuOpen, setIsRootMenuOpen] = useState<boolean>(false);
  const [rootMenuPos, setRootMenuPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Dismiss context flyouts on click outside
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveMenuNodeId(null);
      setIsRootMenuOpen(false);
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  // Build hierarchical tree with recursive card counts
  const treeData = useMemo(() => {
    const buildTree = (parentId: string | null): TreeNode[] => {
      return nodes
        .filter((n) => n.parentId === parentId)
        .map((node) => {
          const childrenNodes = buildTree(node.id);
          let cardCount = 0;
          if (node.type === 'card') {
            cardCount = 1;
          } else {
            const countCards = (items: NodeData[]): number => {
              let count = 0;
              for (const item of items) {
                if (item.type === 'card') count += 1;
                else if (item.type === 'divider') {
                  const children = nodes.filter((n) => n.parentId === item.id);
                  count += countCards(children);
                }
              }
              return count;
            };
            const directChildren = nodes.filter((n) => n.parentId === node.id);
            cardCount = countCards(directChildren);
          }

          return {
            ...node,
            childrenNodes,
            cardCount,
          };
        });
    };

    return buildTree(null);
  }, [nodes]);

  // Search Results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return nodes.filter(
      (n) =>
        n.type === 'card' &&
        n.card &&
        (n.name.toLowerCase().includes(q) ||
          n.card.front.toLowerCase().includes(q) ||
          n.card.back.toLowerCase().includes(q))
    );
  }, [nodes, searchQuery]);

  const toggleFolder = (folderId: string) => {
    setExpandedFolderIds((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  // Reveals the search result in the TreeView by expanding all ancestor folders and selecting it
  const expandAncestorsAndSelect = (node: NodeData) => {
    const folderIdsToExpand: Record<string, boolean> = {};
    let currentParentId = node.parentId;
    while (currentParentId) {
      folderIdsToExpand[currentParentId] = true;
      const parentNode = nodes.find((n) => n.id === currentParentId);
      currentParentId = parentNode ? parentNode.parentId : null;
    }

    setExpandedFolderIds((prev) => ({
      ...prev,
      ...folderIdsToExpand,
    }));

    setSearchQuery('');
    onSelectNode(node);
  };

  // Compute flat ordered list of currently visible nodes for keyboard navigation
  const visibleNodes = useMemo(() => {
    const list: TreeNode[] = [];
    const traverse = (nodeList: TreeNode[]) => {
      for (const node of nodeList) {
        list.push(node);
        if (node.type === 'divider' && expandedFolderIds[node.id]) {
          traverse(node.childrenNodes);
        }
      }
    };
    traverse(treeData);
    return list;
  }, [treeData, expandedFolderIds]);

  // Arrow Key Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const targetTag = target?.tagName?.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea' || editingNodeId) {
        return;
      }

      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        if (visibleNodes.length === 0) return;

        const currentIndex = visibleNodes.findIndex((n) => n.id === selectedNodeId);

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const nextIndex = currentIndex < 0 ? 0 : Math.min(visibleNodes.length - 1, currentIndex + 1);
          const targetNode = visibleNodes[nextIndex];
          if (targetNode) onSelectNode(targetNode);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prevIndex = currentIndex <= 0 ? 0 : currentIndex - 1;
          const targetNode = visibleNodes[prevIndex];
          if (targetNode) onSelectNode(targetNode);
        } else if (e.key === 'ArrowRight') {
          const currentNode = visibleNodes[currentIndex];
          if (currentNode && currentNode.type === 'divider') {
            e.preventDefault();
            if (!expandedFolderIds[currentNode.id]) {
              setExpandedFolderIds((prev) => ({ ...prev, [currentNode.id]: true }));
            } else if (currentNode.childrenNodes.length > 0) {
              onSelectNode(currentNode.childrenNodes[0]);
            }
          }
        } else if (e.key === 'ArrowLeft') {
          const currentNode = visibleNodes[currentIndex];
          if (currentNode) {
            e.preventDefault();
            if (currentNode.type === 'divider' && expandedFolderIds[currentNode.id]) {
              setExpandedFolderIds((prev) => ({ ...prev, [currentNode.id]: false }));
            } else if (currentNode.parentId) {
              const parentNode = nodes.find((n) => n.id === currentNode.parentId);
              if (parentNode) onSelectNode(parentNode);
            }
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visibleNodes, selectedNodeId, expandedFolderIds, editingNodeId, onSelectNode, nodes]);

  const handleStartRename = (node: NodeData) => {
    setEditingNodeId(node.id);
    setEditingName(node.name);
    setActiveMenuNodeId(null);
  };

  const handleSaveRename = (node: NodeData) => {
    if (editingName.trim()) {
      onRenameNode(node, editingName.trim());
    }
    setEditingNodeId(null);
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, node: NodeData) => {
    e.stopPropagation();
    setDraggedNodeId(node.id);
    e.dataTransfer.setData('text/plain', node.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, folderId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedNodeId && draggedNodeId !== folderId) {
      setDragOverFolderId(folderId);
      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverFolderId(null);
  };

  const handleDrop = (e: React.DragEvent, targetFolderId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverFolderId(null);
    if (draggedNodeId && draggedNodeId !== targetFolderId) {
      onMoveNode(draggedNodeId, targetFolderId);
    }
    setDraggedNodeId(null);
  };

  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
        setActiveMenuNodeId(null);
        setRootMenuPos({
          x: Math.min(e.clientX, window.innerWidth - 240),
          y: Math.min(e.clientY, window.innerHeight - 300),
        });
        setIsRootMenuOpen(true);
      }}
      className="bg-slate-900/90 border-r border-slate-800 h-full flex flex-col shrink-0 select-none relative w-full md:w-[var(--sidebar-width)]"
      style={{ '--sidebar-width': `${width}px` } as React.CSSProperties}
    >
      {/* Search Input Bar */}
      <div className="p-2 border-b border-slate-800/80" onClick={(e) => e.stopPropagation()}>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search flashcards..."
            className="w-full bg-slate-950 border border-slate-800 rounded-md pl-8 pr-7 py-2 sm:py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-0.5 rounded transition-colors"
              title="Clear search"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Main Tree Viewport */}
      <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5 touch-pan-y">
        {searchQuery.trim() ? (
          <TreeSearchResults
            searchResults={searchResults}
            selectedNodeId={selectedNodeId}
            onSelectResult={expandAncestorsAndSelect}
            onClearSearch={() => setSearchQuery('')}
          />
        ) : treeData.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 text-center text-slate-500 space-y-3">
            <FolderPlus size={32} className="opacity-40" />
            <p className="text-xs">No decks or cards yet.</p>
          </div>
        ) : (
          treeData.map((rootNode) => (
            <TreeNodeItem
              key={rootNode.id}
              node={rootNode}
              depth={0}
              selectedNodeId={selectedNodeId}
              expandedFolderIds={expandedFolderIds}
              editingNodeId={editingNodeId}
              editingName={editingName}
              activeMenuNodeId={activeMenuNodeId}
              dragOverFolderId={dragOverFolderId}
              onSelectNode={onSelectNode}
              onToggleFolder={toggleFolder}
              onStartRename={handleStartRename}
              onSaveRename={handleSaveRename}
              onCancelRename={() => setEditingNodeId(null)}
              onEditingNameChange={setEditingName}
              onOpenMenu={(id) => {
                setIsRootMenuOpen(false);
                setActiveMenuNodeId(id);
              }}
              onCloseMenu={() => setActiveMenuNodeId(null)}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onAddCard={onAddCard}
              onAddDivider={onAddDivider}
              onReviseDivider={onReviseDivider}
              onEditCard={onEditCard}
              onDeleteNode={onDeleteNode}
              onResetWeights={onResetWeights}
              onExportDivider={onExportDivider}
            />
          ))
        )}
      </div>

      {/* Mobile-Friendly Toolbar */}
      <div className="p-2 pb-safe border-t border-slate-800/80 bg-slate-950/90 flex md:hidden items-center justify-around gap-1 shrink-0">
        <button
          onClick={() =>
            onAddCard(
              selectedNodeId && nodes.find((n) => n.id === selectedNodeId)?.type === 'divider'
                ? selectedNodeId
                : null
            )
          }
          className="flex-1 py-2 px-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-1 shadow-sm touch-manipulation"
        >
          <FilePlus size={14} />
          <span>+ Card</span>
        </button>
        <button
          onClick={() => onAddDivider(null)}
          className="flex-1 py-2 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center justify-center space-x-1 border border-slate-700 touch-manipulation"
        >
          <FolderPlus size={14} style={{ color: 'var(--color-folder-icon, #f59e0b)' }} />
          <span>+ Deck</span>
        </button>
        <button
          onClick={() => onReviseDivider(null)}
          className="py-2 px-2.5 bg-slate-800 hover:bg-purple-950 text-purple-300 rounded-lg text-xs font-medium flex items-center justify-center border border-slate-700 touch-manipulation"
          title="Revise / Cram All"
        >
          <RefreshCw size={14} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setRootMenuPos({ x: 20, y: Math.max(80, window.innerHeight - 340) });
            setIsRootMenuOpen(!isRootMenuOpen);
          }}
          className="py-2 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium flex items-center justify-center border border-slate-700 touch-manipulation"
          title="Decks & Library Actions"
        >
          <MoreVertical size={14} />
        </button>
      </div>

      {/* Root Context Menu */}
      {isRootMenuOpen && (
        <TreeRootContextMenu
          position={rootMenuPos}
          onClose={() => setIsRootMenuOpen(false)}
          onAddCard={onAddCard}
          onAddDivider={onAddDivider}
          onReviseDivider={() => onReviseDivider(null)}
          onSortNodes={onSortNodes}
          onImportDivider={onImportDivider}
          onExportDivider={onExportDivider}
        />
      )}
    </div>
  );
};
