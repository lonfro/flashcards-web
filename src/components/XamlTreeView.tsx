'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Folder,
  FolderOpen,
  FileText,
  ChevronRight,
  ChevronDown,
  Plus,
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
                  count += countCards(nodes.filter((n) => n.parentId === item.id));
                }
              }
              return count;
            };
            cardCount = countCards(nodes.filter((n) => n.parentId === node.id));
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

  // Flattened visible tree order for Up/Down arrow keyboard navigation
  const visibleFlatNodes = useMemo(() => {
    const flatList: TreeNode[] = [];
    const traverse = (nodeList: TreeNode[]) => {
      for (const node of nodeList) {
        flatList.push(node);
        if (node.type === 'divider' && expandedFolderIds[node.id]) {
          traverse(node.childrenNodes);
        }
      }
    };
    traverse(treeData);
    return flatList;
  }, [treeData, expandedFolderIds]);

  // Arrow Key (Up / Down) Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        editingNodeId !== null ||
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (visibleFlatNodes.length === 0) return;

        const currentIndex = visibleFlatNodes.findIndex((n) => n.id === selectedNodeId);
        let nextIndex = 0;

        if (currentIndex !== -1) {
          if (e.key === 'ArrowDown') {
            nextIndex = Math.min(currentIndex + 1, visibleFlatNodes.length - 1);
          } else {
            nextIndex = Math.max(currentIndex - 1, 0);
          }
        } else {
          nextIndex = 0;
        }

        const targetNode = visibleFlatNodes[nextIndex];
        if (targetNode) {
          onSelectNode(targetNode);
          if (targetNode.type === 'divider' && !expandedFolderIds[targetNode.id]) {
            setExpandedFolderIds((prev) => ({ ...prev, [targetNode.id]: true }));
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visibleFlatNodes, selectedNodeId, editingNodeId, expandedFolderIds, onSelectNode]);

  // Auto-expand parent dividers of currently selected item
  useEffect(() => {
    if (selectedNodeId) {
      const expandParents = (id: string) => {
        const targetNode = nodes.find((n) => n.id === id);
        if (targetNode && targetNode.parentId) {
          setExpandedFolderIds((prev) => ({ ...prev, [targetNode.parentId!]: true }));
          expandParents(targetNode.parentId);
        }
      };
      expandParents(selectedNodeId);

      // Auto-trigger rename on freshly created "New Divider"
      const currentSelected = nodes.find((n) => n.id === selectedNodeId);
      if (currentSelected && currentSelected.name === 'New Divider') {
        setEditingNodeId(currentSelected.id);
        setEditingName(currentSelected.name);
      }
    }
  }, [selectedNodeId, nodes]);

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedFolderIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleStartRename = (node: NodeData, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingNodeId(node.id);
    setEditingName(node.name);
    setActiveMenuNodeId(null);
  };

  const handleCommitRename = (node: NodeData) => {
    if (editingName.trim()) {
      onRenameNode(node, editingName.trim());
    }
    setEditingNodeId(null);
  };

  // Filter search results matching XAML ItemsRepeater format
  const searchResults = searchQuery.trim()
    ? nodes.filter((n) => {
        if (n.type !== 'card' || !n.card) return false;
        const q = searchQuery.toLowerCase();
        return (
          n.name.toLowerCase().includes(q) ||
          n.card.front.toLowerCase().includes(q) ||
          n.card.back.toLowerCase().includes(q)
        );
      })
    : [];

  const renderTreeNode = (node: TreeNode, depth: number = 0) => {
    const isExpanded = !!expandedFolderIds[node.id];
    const isFolder = node.type === 'divider';
    const isSelected = selectedNodeId === node.id;
    const isEditing = editingNodeId === node.id;
    const isMenuOpen = activeMenuNodeId === node.id;
    const isDragOver = dragOverFolderId === node.id;
    const isDragging = draggedNodeId === node.id;

    return (
      <div
        key={node.id}
        draggable={true}
        onDragStart={(e) => {
          e.stopPropagation();
          e.dataTransfer.setData('text/plain', node.id);
          setDraggedNodeId(node.id);
        }}
        onDragEnd={() => {
          setDraggedNodeId(null);
          setDragOverFolderId(null);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (draggedNodeId && draggedNodeId !== node.id) {
            setDragOverFolderId(isFolder ? node.id : node.parentId);
          }
        }}
        onDragLeave={(e) => {
          e.stopPropagation();
          setDragOverFolderId(null);
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const draggedId = e.dataTransfer.getData('text/plain');
          setDragOverFolderId(null);
          setDraggedNodeId(null);
          if (draggedId && draggedId !== node.id) {
            const targetParent = isFolder ? node.id : node.parentId;
            onMoveNode(draggedId, targetParent);
            if (targetParent) {
              setExpandedFolderIds((prev) => ({ ...prev, [targetParent]: true }));
            }
          }
        }}
        className="select-none relative"
      >
        <div
          onClick={(e) => {
            if (isFolder) {
              toggleExpand(node.id, e);
            }
            onSelectNode(node);
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsRootMenuOpen(false);
            setActiveMenuNodeId(isMenuOpen ? null : node.id);
          }}
          style={{ paddingLeft: `${depth * 14 + 8}px` }}
          className={`flex items-center justify-between py-1.5 px-2 my-0.5 rounded text-xs cursor-pointer transition-colors group ${
            isDragging ? 'opacity-50 ring-1 ring-indigo-400' : 'opacity-100'
          } ${
            isDragOver
              ? 'bg-indigo-950/90 border-2 border-dashed border-indigo-400 font-bold'
              : isSelected
              ? 'bg-slate-800 text-indigo-300 font-semibold border-l-2 border-indigo-500 shadow-sm'
              : 'text-slate-300 hover:bg-slate-800/60 hover:text-slate-100'
          }`}
        >
          <div className="flex items-center space-x-1.5 overflow-hidden flex-1">
            {isFolder ? (
              <button
                type="button"
                onClick={(e) => toggleExpand(node.id, e)}
                className="p-0.5 text-slate-400 hover:text-slate-200 shrink-0"
              >
                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
            ) : (
              <FileText size={14} className="text-indigo-400 shrink-0 ml-3.5" />
            )}

            {isFolder && (
              <div className="shrink-0">
                {isExpanded ? (
                  <FolderOpen size={16} className="text-amber-400" />
                ) : (
                  <Folder size={16} className="text-amber-400" />
                )}
              </div>
            )}

            {isEditing ? (
              <input
                type="text"
                autoFocus
                onFocus={(e) => e.target.select()}
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onBlur={() => handleCommitRename(node)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCommitRename(node);
                  if (e.key === 'Escape') setEditingNodeId(null);
                }}
                className="bg-slate-950 border border-indigo-500 px-1 py-0.5 rounded text-xs text-slate-100 w-full focus:outline-none"
              />
            ) : (
              <span className="truncate">{node.name}</span>
            )}
          </div>

          {/* Right badge & context menu toggle button */}
          <div className="flex items-center space-x-1 shrink-0 ml-2">
            {isFolder && node.cardCount > 0 && (
              <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-1.5 py-0.2 rounded border border-slate-800">
                {node.cardCount}
              </span>
            )}

            {/* Context Flyout trigger */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsRootMenuOpen(false);
                setActiveMenuNodeId(isMenuOpen ? null : node.id);
              }}
              className="p-0.5 rounded text-slate-500 hover:text-slate-200 hover:bg-slate-800 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical size={14} />
            </button>
          </div>
        </div>

        {/* Context Menu Flyout (matching XAML Item MenuFlyout) */}
        {isMenuOpen && (
          <div
            className="absolute left-8 top-6 z-50 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1 text-xs text-slate-200 divide-y divide-slate-800/80 animate-fade-in"
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
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center space-x-2"
                  >
                    <FilePlus size={14} className="text-indigo-400" />
                    <span>Add cards</span>
                  </button>
                  <button
                    onClick={() => {
                      onAddDivider(node.id);
                      setActiveMenuNodeId(null);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center space-x-2"
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
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center space-x-2 text-purple-300 font-semibold"
                  >
                    <RefreshCw size={14} />
                    <span>Revise cards</span>
                  </button>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      onResetWeights(node.id, false);
                      setActiveMenuNodeId(null);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center space-x-2"
                  >
                    <RotateCcw size={14} className="text-slate-400" />
                    <span>Reset card weights</span>
                  </button>
                  <button
                    onClick={() => {
                      onResetWeights(node.id, true);
                      setActiveMenuNodeId(null);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center space-x-2"
                  >
                    <RotateCcw size={14} className="text-slate-400" />
                    <span>Reset card weights (recursive)</span>
                  </button>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => handleStartRename(node)}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center space-x-2"
                  >
                    <Edit size={14} />
                    <span>Rename divider</span>
                  </button>
                  <button
                    onClick={() => {
                      onDeleteNode(node.id);
                      setActiveMenuNodeId(null);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center space-x-2 text-rose-400"
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
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center space-x-2"
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
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center space-x-2"
                  >
                    <Edit size={14} className="text-indigo-400" />
                    <span>Edit card</span>
                  </button>
                  <button
                    onClick={() => handleStartRename(node)}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center space-x-2"
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
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center space-x-2"
                  >
                    <RotateCcw size={14} className="text-indigo-400" />
                    <span>Reset card weight</span>
                  </button>
                  <button
                    onClick={() => {
                      onDeleteNode(node.id);
                      setActiveMenuNodeId(null);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center space-x-2 text-rose-400"
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
      style={{ width: `${width}px` }}
      onContextMenu={(e) => {
        e.preventDefault();
        setActiveMenuNodeId(null);
        setRootMenuPos({ x: e.clientX, y: e.clientY });
        setIsRootMenuOpen(true);
      }}
      className="bg-slate-900/90 border-r border-slate-800 h-full flex flex-col shrink-0 select-none relative"
    >
      {/* Top Search TextBox (Matching XAML Line 250) */}
      <div className="p-2 border-b border-slate-800/80" onClick={(e) => e.stopPropagation()}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search flashcards..."
          className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Main Tree Scroll Container */}
      <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5">
        {searchQuery.trim() ? (
          <div className="space-y-1">
            <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Search Results ({searchResults.length})
            </div>
            {searchResults.length === 0 ? (
              <div className="px-2 py-4 text-xs text-slate-500 italic text-center">
                No matching cards found.
              </div>
            ) : (
              searchResults.map((cardNode) => (
                <div
                  key={cardNode.id}
                  onClick={() => onSelectNode(cardNode)}
                  className={`flex items-center space-x-2 py-1.5 px-2 rounded text-xs cursor-pointer ${
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
        ) : (
          treeData.map((rootNode) => renderTreeNode(rootNode, 0))
        )}
      </div>

      {/* Root Tree Context Menu Flyout (matching FlashcardsPage.xaml line 325) */}
      {isRootMenuOpen && (
        <div
          style={{ top: `${rootMenuPos.y}px`, left: `${rootMenuPos.x}px` }}
          className="fixed z-50 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1 text-xs text-slate-200 divide-y divide-slate-800/80 animate-fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="py-1">
            <button
              onClick={() => {
                onAddCard(null);
                setIsRootMenuOpen(false);
              }}
              className="w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center space-x-2"
            >
              <FilePlus size={14} className="text-indigo-400" />
              <span>Add cards</span>
            </button>
            <button
              onClick={() => {
                onAddDivider(null);
                setIsRootMenuOpen(false);
              }}
              className="w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center space-x-2"
            >
              <FolderPlus size={14} className="text-amber-400" />
              <span>Add new divider</span>
            </button>
          </div>

          <div className="py-1">
            <button
              onClick={() => {
                onReviseDivider(null);
                setIsRootMenuOpen(false);
              }}
              className="w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center space-x-2 text-purple-300 font-semibold"
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
              className="w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center space-x-2"
            >
              <ArrowUpDown size={14} />
              <span>Sort alphabetically</span>
            </button>
            <button
              onClick={() => {
                onSortNodes(true);
                setIsRootMenuOpen(false);
              }}
              className="w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center space-x-2"
            >
              <Layers size={14} />
              <span>Sort alphabetically (recursive)</span>
            </button>
          </div>

          <div className="py-1">
            <label className="w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center space-x-2 cursor-pointer">
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
              className="w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center space-x-2"
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
