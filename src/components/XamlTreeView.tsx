'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Input } from '@fluentui/react-components';
import {
  MoreVertical,
  FilePlus,
  FolderPlus,
  RefreshCw,
} from 'lucide-react';
import { NodeData } from '../types/flashcard';
import { TreeNode, XamlTreeViewProps } from './tree/types';
import { TreeNodeItem } from './tree/TreeNodeItem';
import { TreeSearchResults } from './tree/TreeSearchResults';
import { TreeNodeContextMenu } from './tree/TreeNodeContextMenu';
import type { FlyoutAnchor } from './WinUIFlyout';

export const XamlTreeView: React.FC<XamlTreeViewProps> = ({
  nodes,
  selectedNodeId,
  width,
  cardSettings,
  onSelectNode,
  onAddCard,
  onAddDivider,
  onReviseDivider,
  onEditCard,
  onRenameNode,
  onDeleteNode,
  onResetWeights,
  onToggleProgress,
  onExportDivider,
  onImportDivider,
  onMoveNode,
  onSortNodes,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expansionOverrides, setExpandedFolderIds] = useState<Record<string, boolean>>({});
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');
  const [menu, setMenu] = useState<{ node: TreeNode | null; anchor: FlyoutAnchor } | null>(null);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<{ nodeId: string; position: 'before' | 'after' | 'into' } | null>(null);

  const fileInput = useRef<HTMLInputElement>(null);
  const importTarget = useRef<{ id: string | null; mode: 'divider' | 'contents' }>({ id: null, mode: 'contents' });
  const openImport = (id: string | null, mode: 'divider' | 'contents') => {
    importTarget.current = { id, mode };
    fileInput.current?.click();
  };

  // Build hierarchical tree with recursive card counts
  const treeData = useMemo(() => {
    const byParent = new Map<string | null, NodeData[]>();
    for (const node of nodes) {
      const siblings = byParent.get(node.parentId) ?? [];
      siblings.push(node);
      byParent.set(node.parentId, siblings);
    }
    const buildTree = (parentId: string | null): TreeNode[] => {
      return (byParent.get(parentId) ?? []).map((node) => {
        const childrenNodes = buildTree(node.id);
        return {
          ...node,
          childrenNodes,
          cardCount: node.card ? 1 : childrenNodes.reduce((sum, child) => sum + child.cardCount, 0),
          totalWeight: node.card?.weight ?? childrenNodes.reduce((sum, child) => sum + child.totalWeight, 0),
        };
      });
    };

    return buildTree(null);
  }, [nodes]);

  const expandedFolderIds = useMemo(() => ({
    ...Object.fromEntries(nodes.filter(({ divider }) => divider?.isExpanded).map(({ id }) => [id, true])),
    ...expansionOverrides,
  }), [nodes, expansionOverrides]);

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];

    const frontMatches: NodeData[] = [];
    const otherMatches: NodeData[] = [];
    for (const node of nodes) {
      if (!node.card) continue;
      if (node.card.front.toLowerCase().includes(query)) frontMatches.push(node);
      else if (node.card.back.toLowerCase().includes(query) || node.name.toLowerCase().includes(query)) {
        otherMatches.push(node);
      }
    }
    return [...frontMatches, ...otherMatches];
  }, [nodes, searchQuery]);

  const toggleFolder = (folderId: string) => {
    setExpandedFolderIds((prev) => ({
      ...prev,
      [folderId]: !expandedFolderIds[folderId],
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
      if (e.defaultPrevented || menu || target?.closest('[role="menu"]') || targetTag === 'input' || targetTag === 'textarea' || editingNodeId) {
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
  }, [visibleNodes, selectedNodeId, expandedFolderIds, editingNodeId, onSelectNode, nodes, menu]);

  const handleStartRename = (node: NodeData) => {
    setEditingNodeId(node.id);
    setEditingName(node.card?.front ?? node.name);
    setMenu(null);
  };

  const addDivider = (parentId: string | null) => {
    if (parentId) setExpandedFolderIds((previous) => ({ ...previous, [parentId]: true }));
    handleStartRename(onAddDivider(parentId));
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

  const handleDragOver = (e: React.DragEvent, targetNodeId: string, isFolder: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedNodeId || draggedNodeId === targetNodeId) return;
    e.dataTransfer.dropEffect = 'move';

    // Determine drop zone: top 25% = before, bottom 25% = after, middle 50% = into (folders only)
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const offsetY = e.clientY - rect.top;
    const relY = offsetY / rect.height;

    let position: 'before' | 'after' | 'into';
    if (isFolder && relY > 0.25 && relY < 0.75) {
      position = 'into';
    } else if (relY <= 0.5) {
      position = 'before';
    } else {
      position = 'after';
    }

    setDropTarget({ nodeId: targetNodeId, position });
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDropTarget(null);
  };

  const handleDrop = (e: React.DragEvent, targetNodeId: string, isFolder: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    const target = dropTarget;
    setDropTarget(null);
    setDraggedNodeId(null);

    if (!draggedNodeId || draggedNodeId === targetNodeId) return;

    if (target && target.nodeId === targetNodeId) {
      onMoveNode(draggedNodeId, targetNodeId, target.position);
    } else {
      // Fallback: folder drop without a tracked zone → 'into'
      if (isFolder) onMoveNode(draggedNodeId, targetNodeId, 'into');
    }
  };

  // Drop on the root container (between all root items) → append to root
  const handleRootDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedNodeId) return;
    setDropTarget(null);
    const id = draggedNodeId;
    setDraggedNodeId(null);
    onMoveNode(id, null, 'after');
  };

  return (
    <div
      className="winui-tree-pane"
      style={{ '--sidebar-width': `${width}px` } as React.CSSProperties}
    >
      <div className="winui-tree-search">
        <Input
          type="search"
          size="small"
          value={searchQuery}
          onChange={(_, data) => setSearchQuery(data.value)}
          placeholder="Search"
          aria-label="Search flashcards"
          className="winui-search-control"
        />
      </div>

      <div
        className="winui-tree-viewport"
        tabIndex={treeData.length ? -1 : 0}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          if (event.key === 'ContextMenu' || (event.key === 'F10' && event.shiftKey)) {
            event.preventDefault();
            const { left, top } = event.currentTarget.getBoundingClientRect();
            setMenu({ node: null, anchor: { x: left + 8, y: top + 8, source: event.currentTarget } });
          }
        }}
        onContextMenu={(event) => {
          if (event.target instanceof HTMLElement && event.target.closest('input')) return;
          event.preventDefault();
          setMenu({ node: null, anchor: { x: event.clientX, y: event.clientY, source: event.currentTarget } });
        }}
        onDragOver={(event) => { event.preventDefault(); event.dataTransfer.dropEffect = 'move'; }}
        onDrop={handleRootDrop}
      >
        {searchQuery.trim() ? (
          <TreeSearchResults
            searchResults={searchResults}
            query={searchQuery.trim()}
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
              cardSettings={cardSettings}
              depth={0}
              selectedNodeId={selectedNodeId}
              expandedFolderIds={expandedFolderIds}
              editingNodeId={editingNodeId}
              editingName={editingName}
              activeMenuNodeId={menu?.node?.id ?? null}
              dropTarget={dropTarget}
              onSelectNode={onSelectNode}
              onToggleFolder={toggleFolder}
              onStartRename={handleStartRename}
              onSaveRename={handleSaveRename}
              onCancelRename={() => setEditingNodeId(null)}
              onEditingNameChange={setEditingName}
              onOpenMenu={(node, anchor) => setMenu({ node, anchor })}
              onCloseMenu={() => setMenu(null)}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
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
          onClick={() => addDivider(null)}
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
            const { left, top } = e.currentTarget.getBoundingClientRect();
            setMenu(menu && !menu.node ? null : {
              node: null, anchor: { x: left, y: top, source: e.currentTarget },
            });
          }}
          className="py-2 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium flex items-center justify-center border border-slate-700 touch-manipulation"
          title="Decks & Library Actions"
        >
          <MoreVertical size={14} />
        </button>
      </div>

      <input
        type="file"
        ref={fileInput}
        accept=".json"
        hidden
        onChange={(event) => onImportDivider(event, importTarget.current.id, importTarget.current.mode)}
      />

      {menu && (
        <TreeNodeContextMenu
          key={menu.node?.id ?? 'root'}
          node={menu.node}
          anchor={menu.anchor}
          onClose={() => setMenu(null)}
          onAddCard={(id) => {
            if (id) setExpandedFolderIds((previous) => ({ ...previous, [id]: true }));
            onAddCard(id);
          }}
          onAddDivider={addDivider}
          onReviseDivider={onReviseDivider}
          onEditCard={onEditCard}
          onStartRename={handleStartRename}
          onDeleteNode={onDeleteNode}
          onSortNodes={onSortNodes}
          onOpenImport={openImport}
          onToggleProgress={onToggleProgress}
          onResetWeights={onResetWeights}
          onExportDivider={onExportDivider}
        />
      )}
    </div>
  );
};
