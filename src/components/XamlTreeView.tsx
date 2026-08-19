'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Folder,
  FolderOpen,
  FileText,
  ChevronRight,
  ChevronDown,
  Search,
  MoreVertical,
  FilePlus,
  FolderPlus,
  Edit,
  Trash,
  RotateCcw,
  RefreshCw,
  Download,
  Upload,
  ArrowUpDown,
  Layers,
} from 'lucide-react';
import { NodeData } from '../types/flashcard';

interface XamlTreeViewProps {
  nodes: NodeData[];
  selectedNodeId: string | null;
  width: number;
  onSelectNode: (node: NodeData) => void;
  onAddCard: (parentId: string | null) => void;
  onAddDivider: (parentId: string | null) => void;
  onReviseDivider: (node: NodeData | null) => void;
  onEditCard: (node: NodeData) => void;
  onRenameNode: (node: NodeData, newName: string) => void;
  onDeleteNode: (nodeId: string) => void;
  onResetWeights: (nodeId: string, recursive?: boolean) => void;
  onExportDivider: (dividerId: string) => void;
  onImportDivider: (e: React.ChangeEvent<HTMLInputElement>, targetParentId: string | null) => void;
  onMoveNode: (draggedNodeId: string, targetParentId: string | null) => void;
  onSortNodes: (recursive: boolean) => void;
}

interface TreeNode extends NodeData {
  childrenNodes: TreeNode[];
  cardCount: number;
}

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

  // Root TreeView Right-Click Context Menu State
  const [isRootMenuOpen, setIsRootMenuOpen] = useState<boolean>(false);
  const [rootMenuPos, setRootMenuPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Dismiss context flyouts on global click outside
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

  // Render individual tree item (Folder or Card)
  const renderTreeNode = (node: TreeNode, depth: number = 0) => {
    const isFolder = node.type === 'divider';
    const isExpanded = !!expandedFolderIds[node.id];
    const isSelected = selectedNodeId === node.id;
    const isEditing = editingNodeId === node.id;
    const isMenuOpen = activeMenuNodeId === node.id;
    const isDragOver = dragOverFolderId === node.id;

    return (
      <div key={node.id} className="relative group">
        <div
          draggable={!isEditing}
          onDragStart={(e) => handleDragStart(e, node)}
          onDragOver={isFolder ? (e) => handleDragOver(e, node.id) : undefined}
          onDragLeave={isFolder ? handleDragLeave : undefined}
          onDrop={isFolder ? (e) => handleDrop(e, node.id) : undefined}
          onClick={() => {
            onSelectNode(node);
            if (isFolder) toggleFolder(node.id);
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsRootMenuOpen(false);
            setActiveMenuNodeId(node.id);
          }}
          style={{ paddingLeft: `${Math.max(8, depth * 14 + 6)}px` }}
          className={`flex items-center justify-between py-2 sm:py-1.5 pr-2 rounded-md text-xs cursor-pointer transition-colors select-none relative min-h-[36px] sm:min-h-[28px] ${
            isSelected
              ? 'bg-slate-800 text-indigo-300 font-semibold border-l-2 border-indigo-500 shadow-sm'
              : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
          } ${isDragOver ? 'bg-indigo-950/80 border border-indigo-500' : ''}`}
        >
          {/* Left item details: Chevron + Icon + Title */}
          <div className="flex items-center space-x-1.5 flex-1 min-w-0 pr-1">
            {isFolder ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFolder(node.id);
                }}
                className="p-1 -ml-1 text-slate-400 hover:text-slate-200 rounded shrink-0 touch-manipulation"
              >
                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
            ) : (
              <span className="w-4 shrink-0" />
            )}

            {isFolder ? (
              isExpanded ? (
                <FolderOpen size={15} className="text-amber-400 shrink-0" />
              ) : (
                <Folder size={15} className="text-amber-400 shrink-0" />
              )
            ) : (
              <FileText size={15} className="text-indigo-400 shrink-0" />
            )}

            {isEditing ? (
              <input
                type="text"
                autoFocus
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onBlur={() => handleSaveRename(node)}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveRename(node);
                  if (e.key === 'Escape') setEditingNodeId(null);
                }}
                className="bg-slate-950 border border-indigo-500 px-1 py-0.5 rounded text-xs text-slate-100 w-full focus:outline-none"
              />
            ) : (
              <span className="truncate text-xs sm:text-[13px]">{node.name}</span>
            )}
          </div>

          {/* Right badge & context menu toggle button */}
          <div className="flex items-center space-x-1 shrink-0 ml-1">
            {isFolder && node.cardCount > 0 && (
              <span className="text-[10px] font-mono text-slate-400 bg-slate-950/80 px-1.5 py-0.5 rounded border border-slate-800">
                {node.cardCount}
              </span>
            )}

            {/* Context Flyout trigger (always visible on mobile, hover on desktop) */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsRootMenuOpen(false);
                setActiveMenuNodeId(isMenuOpen ? null : node.id);
              }}
              className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity touch-manipulation"
              title="Item menu"
            >
              <MoreVertical size={14} />
            </button>
          </div>
        </div>

        {/* Context Menu Flyout */}
        {isMenuOpen && (
          <div
            className="absolute left-6 sm:left-8 top-8 z-50 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1 text-xs text-slate-200 divide-y divide-slate-800/80 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {isFolder ? (
              <>
                <div className="py-1">
                  <button
                    onClick={() => {
                      onAddCard(node.id);
                      setActiveMenuNodeId(null);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center space-x-2"
                  >
                    <FilePlus size={14} className="text-indigo-400" />
                    <span>Add cards</span>
                  </button>
                  <button
                    onClick={() => {
                      onAddDivider(node.id);
                      setActiveMenuNodeId(null);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center space-x-2"
                  >
                    <FolderPlus size={14} className="text-amber-400" />
                    <span>Add new divider</span>
                  </button>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      onReviseDivider(node);
                      setActiveMenuNodeId(null);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center space-x-2 text-purple-300 font-semibold"
                  >
                    <RefreshCw size={14} />
                    <span>Revise deck</span>
                  </button>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      onResetWeights(node.id, false);
                      setActiveMenuNodeId(null);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center space-x-2"
                  >
                    <RotateCcw size={14} className="text-slate-400" />
                    <span>Reset card weights</span>
                  </button>
                  <button
                    onClick={() => {
                      onResetWeights(node.id, true);
                      setActiveMenuNodeId(null);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center space-x-2"
                  >
                    <RotateCcw size={14} className="text-slate-400" />
                    <span>Reset weights (recursive)</span>
                  </button>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => handleStartRename(node)}
                    className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center space-x-2"
                  >
                    <Edit size={14} />
                    <span>Rename divider</span>
                  </button>
                  <button
                    onClick={() => {
                      onDeleteNode(node.id);
                      setActiveMenuNodeId(null);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center space-x-2 text-rose-400"
                  >
                    <Trash size={14} />
                    <span>Delete divider</span>
                  </button>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      onExportDivider(node.id);
                      setActiveMenuNodeId(null);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center space-x-2"
                  >
                    <Download size={14} />
                    <span>Export divider</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="py-1">
                  <button
                    onClick={() => {
                      onEditCard(node);
                      setActiveMenuNodeId(null);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center space-x-2"
                  >
                    <Edit size={14} className="text-indigo-400" />
                    <span>Edit card</span>
                  </button>
                  <button
                    onClick={() => handleStartRename(node)}
                    className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center space-x-2"
                  >
                    <Edit size={14} />
                    <span>Rename card</span>
                  </button>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      onResetWeights(node.id, false);
                      setActiveMenuNodeId(null);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center space-x-2"
                  >
                    <RotateCcw size={14} className="text-indigo-400" />
                    <span>Reset card weight</span>
                  </button>
                  <button
                    onClick={() => {
                      onDeleteNode(node.id);
                      setActiveMenuNodeId(null);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center space-x-2 text-rose-400"
                  >
                    <Trash size={14} />
                    <span>Delete card</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Render Folder Children */}
        {isFolder && isExpanded && node.childrenNodes.length > 0 && (
          <div className="border-l border-slate-800 ml-3.5 my-0.5">
            {node.childrenNodes.map((child) => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
        setActiveMenuNodeId(null);
        setRootMenuPos({ x: Math.min(e.clientX, window.innerWidth - 240), y: Math.min(e.clientY, window.innerHeight - 300) });
        setIsRootMenuOpen(true);
      }}
      className="bg-slate-900/90 border-r border-slate-800 h-full flex flex-col shrink-0 select-none relative w-full md:w-[var(--sidebar-width)]"
      style={{ '--sidebar-width': `${width}px` } as React.CSSProperties}
    >
      {/* Top Search TextBox */}
      <div className="p-2 border-b border-slate-800/80" onClick={(e) => e.stopPropagation()}>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search flashcards..."
            className="w-full bg-slate-950 border border-slate-800 rounded-md pl-8 pr-3 py-2 sm:py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
        </div>
      </div>

      {/* Main Tree Scroll Container */}
      <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5 touch-pan-y">
        {searchQuery.trim() ? (
          <div className="space-y-1">
            <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Search Results ({searchResults.length})
            </div>
            {searchResults.length === 0 ? (
              <div className="px-2 py-6 text-xs text-slate-500 italic text-center">
                No matching cards found.
              </div>
            ) : (
              searchResults.map((cardNode) => (
                <div
                  key={cardNode.id}
                  onClick={() => onSelectNode(cardNode)}
                  className={`flex items-center space-x-2 py-2.5 sm:py-1.5 px-2.5 rounded text-xs cursor-pointer ${
                    selectedNodeId === cardNode.id
                      ? 'bg-slate-800 text-indigo-300 font-semibold border-l-2 border-indigo-500'
                      : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <FileText size={14} className="text-indigo-400 shrink-0" />
                  <span className="truncate">{cardNode.name}</span>
                </div>
              ))
            )}
          </div>
        ) : treeData.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 text-center text-slate-500 space-y-3">
            <FolderPlus size={32} className="opacity-40" />
            <p className="text-xs">No decks or cards yet.</p>
          </div>
        ) : (
          treeData.map((rootNode) => renderTreeNode(rootNode, 0))
        )}
      </div>

      {/* Mobile-Friendly Bottom Quick Actions Toolbar */}
      <div className="p-2 border-t border-slate-800/80 bg-slate-950/90 flex items-center justify-around gap-1 shrink-0">
        <button
          onClick={() => onAddCard(selectedNodeId && nodes.find((n) => n.id === selectedNodeId)?.type === 'divider' ? selectedNodeId : null)}
          className="flex-1 py-2 px-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-1 shadow-sm touch-manipulation"
        >
          <FilePlus size={14} />
          <span>+ Card</span>
        </button>
        <button
          onClick={() => onAddDivider(null)}
          className="flex-1 py-2 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center justify-center space-x-1 border border-slate-700 touch-manipulation"
        >
          <FolderPlus size={14} className="text-amber-400" />
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
          title="More options"
        >
          <MoreVertical size={14} />
        </button>
      </div>

      {/* Root Tree Context Menu Flyout */}
      {isRootMenuOpen && (
        <div
          style={{ top: `${rootMenuPos.y}px`, left: `${rootMenuPos.x}px` }}
          className="fixed z-50 w-60 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1 text-xs text-slate-200 divide-y divide-slate-800/80 animate-fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="py-1">
            <button
              onClick={() => {
                onAddCard(null);
                setIsRootMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center space-x-2"
            >
              <FilePlus size={14} className="text-indigo-400" />
              <span>Add cards (Root)</span>
            </button>
            <button
              onClick={() => {
                onAddDivider(null);
                setIsRootMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center space-x-2"
            >
              <FolderPlus size={14} className="text-amber-400" />
              <span>Add new deck</span>
            </button>
          </div>

          <div className="py-1">
            <button
              onClick={() => {
                onReviseDivider(null);
                setIsRootMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center space-x-2 text-purple-300 font-semibold"
            >
              <RefreshCw size={14} />
              <span>Revise all cards (Cram)</span>
            </button>
          </div>

          <div className="py-1">
            <button
              onClick={() => {
                onSortNodes(false);
                setIsRootMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center space-x-2"
            >
              <ArrowUpDown size={14} />
              <span>Sort alphabetically</span>
            </button>
            <button
              onClick={() => {
                onSortNodes(true);
                setIsRootMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center space-x-2"
            >
              <Layers size={14} />
              <span>Sort alphabetically (recursive)</span>
            </button>
          </div>

          <div className="py-1">
            <label className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center space-x-2 cursor-pointer">
              <Upload size={14} />
              <span>Import JSON</span>
              <input
                type="file"
                accept=".json"
                onChange={(e) => {
                  onImportDivider(e, null);
                  setIsRootMenuOpen(false);
                }}
                className="hidden"
              />
            </label>
            <button
              onClick={() => {
                onExportDivider('');
                setIsRootMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center space-x-2"
            >
              <Download size={14} />
              <span>Export JSON</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
