'use client';

import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  FileText,
  Plus,
  Edit3,
  Trash2,
  BookOpen,
  PlusCircle,
  Sparkles,
} from 'lucide-react';
import { NodeData } from '../types/flashcard';
import { TreeNode, buildTree } from '../utils/storage';

interface SidebarProps {
  nodes: NodeData[];
  selectedDeckId: string | null;
  selectedCardId?: string | null;
  onSelectDeck: (deckId: string | null) => void;
  onSelectCard: (cardNode: NodeData) => void;
  onCreateDeck: (parentId: string | null) => void;
  onCreateCard: (parentId: string | null) => void;
  onEditDeck: (deckNode: NodeData) => void;
  onEditCard: (cardNode: NodeData) => void;
  onDeleteNode: (nodeId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  nodes,
  selectedDeckId,
  selectedCardId,
  onSelectDeck,
  onSelectCard,
  onCreateDeck,
  onCreateCard,
  onEditDeck,
  onEditCard,
  onDeleteNode,
}) => {
  const [expandedFolderIds, setExpandedFolderIds] = useState<Record<string, boolean>>({
    'folder-csharp': true,
    'folder-dsa': true,
    'folder-web': true,
  });

  const tree = buildTree(nodes, null);

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedFolderIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderTreeNode = (node: TreeNode, depth: number = 0) => {
    const isExpanded = !!expandedFolderIds[node.id];
    const isFolder = node.type === 'divider';
    const isSelectedDeck = isFolder && selectedDeckId === node.id;
    const isSelectedCard = !isFolder && selectedCardId === node.id;

    return (
      <div key={node.id} className="select-none">
        <div
          onClick={() => {
            if (isFolder) {
              onSelectDeck(node.id);
            } else {
              onSelectCard(node);
            }
          }}
          style={{ paddingLeft: `${depth * 14 + 12}px` }}
          className={`flex items-center justify-between py-2 px-3 my-0.5 rounded-xl cursor-pointer transition-all group ${
            isSelectedDeck
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-md shadow-indigo-600/30'
              : isSelectedCard
              ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-500/40 font-medium'
              : 'text-slate-300 hover:bg-slate-800/60 hover:text-slate-100'
          }`}
        >
          <div className="flex items-center space-x-2 overflow-hidden">
            {isFolder ? (
              <button
                type="button"
                onClick={(e) => toggleExpand(node.id, e)}
                className="p-0.5 rounded hover:bg-slate-700/50 text-slate-400 shrink-0"
              >
                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
            ) : (
              <FileText size={15} className="text-indigo-400 shrink-0 ml-4" />
            )}

            {isFolder && (
              <div className="shrink-0">
                {isExpanded ? (
                  <FolderOpen size={18} className={isSelectedDeck ? 'text-white' : 'text-indigo-400'} />
                ) : (
                  <Folder size={18} className={isSelectedDeck ? 'text-white' : 'text-indigo-400'} />
                )}
              </div>
            )}

            <span className="text-xs truncate">{node.name}</span>
          </div>

          {/* Right Actions & Badge */}
          <div className="flex items-center space-x-1 shrink-0">
            {isFolder && node.cardCount > 0 && (
              <span
                className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${
                  isSelectedDeck
                    ? 'bg-white/20 text-white font-bold'
                    : 'bg-slate-800 text-indigo-300 border border-slate-700'
                }`}
              >
                {node.cardCount}
              </span>
            )}

            {/* Hover Actions */}
            <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1 transition-opacity">
              {isFolder ? (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCreateCard(node.id);
                    }}
                    title="Add Card to Deck"
                    className="p-1 rounded text-slate-300 hover:text-white hover:bg-slate-700/60"
                  >
                    <Plus size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditDeck(node);
                    }}
                    title="Edit Deck"
                    className="p-1 rounded text-slate-300 hover:text-white hover:bg-slate-700/60"
                  >
                    <Edit3 size={13} />
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditCard(node);
                  }}
                  title="Edit Card"
                  className="p-1 rounded text-slate-300 hover:text-indigo-300 hover:bg-slate-700/60"
                >
                  <Edit3 size={13} />
                </button>
              )}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteNode(node.id);
                }}
                title="Delete"
                className="p-1 rounded text-slate-300 hover:text-rose-400 hover:bg-slate-700/60"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* Children Render */}
        {isFolder && isExpanded && node.childrenNodes.length > 0 && (
          <div className="border-l border-slate-800/80 ml-5 my-0.5">
            {node.childrenNodes.map((child) => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="w-72 bg-slate-900/80 border-r border-slate-800/80 h-full flex flex-col justify-between backdrop-blur-xl shrink-0">
      {/* Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30">
            <BookOpen size={20} />
          </div>
          <div>
            <h1 className="font-bold text-slate-100 text-base leading-tight">Flashcards Web</h1>
            <p className="text-[11px] text-indigo-400 font-medium">Next.js + Bun Engine</p>
          </div>
        </div>
      </div>

      {/* Navigation Quick Actions */}
      <div className="p-3 border-b border-slate-800/60 space-y-2">
        <button
          onClick={() => onSelectDeck(null)}
          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
            selectedDeckId === null && !selectedCardId
              ? 'bg-slate-800 text-indigo-300 border border-indigo-500/30'
              : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
          }`}
        >
          <span className="flex items-center space-x-2">
            <Sparkles size={14} className="text-indigo-400" />
            <span>All Decks & Cards</span>
          </span>
          <span className="font-mono bg-slate-900 px-2 py-0.5 rounded text-slate-400">
            {nodes.filter((n) => n.type === 'card').length} cards
          </span>
        </button>

        <div className="flex items-center space-x-2 pt-1">
          <button
            onClick={() => onCreateDeck(selectedDeckId)}
            className="flex-1 py-2 px-2.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 text-xs font-semibold rounded-xl transition-all border border-slate-700/60 flex items-center justify-center space-x-1.5"
          >
            <PlusCircle size={14} className="text-indigo-400" />
            <span>New Deck</span>
          </button>
          <button
            onClick={() => onCreateCard(selectedDeckId)}
            className="flex-1 py-2 px-2.5 bg-indigo-600/90 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center space-x-1.5"
          >
            <Plus size={14} />
            <span>New Card</span>
          </button>
        </div>
      </div>

      {/* Tree View list */}
      <div className="p-2 overflow-y-auto flex-1 space-y-1">
        {tree.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500">
            No decks yet. Click &quot;New Deck&quot; to create your first deck!
          </div>
        ) : (
          tree.map((node) => renderTreeNode(node))
        )}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 text-center">
        <span className="text-[11px] text-slate-500 font-mono">
          Spaced Repetition Algorithm: SuperMemo SM-2
        </span>
      </div>
    </aside>
  );
};
