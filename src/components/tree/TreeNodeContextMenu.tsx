'use client';

import React from 'react';
import {
  FilePlus,
  FolderPlus,
  RefreshCw,
  RotateCcw,
  Edit,
  Trash,
  Download,
} from 'lucide-react';
import { TreeNode } from './types';
import { NodeData } from '../../types/flashcard';

interface TreeNodeContextMenuProps {
  node: TreeNode;
  onClose: () => void;
  onAddCard: (parentId: string | null) => void;
  onAddDivider: (parentId: string | null) => void;
  onReviseDivider: (node: NodeData | null) => void;
  onEditCard: (node: NodeData) => void;
  onStartRename: (node: NodeData) => void;
  onDeleteNode: (nodeId: string) => void;
  onResetWeights: (nodeId: string, recursive?: boolean) => void;
  onExportDivider: (dividerId: string) => void;
}

export const TreeNodeContextMenu: React.FC<TreeNodeContextMenuProps> = ({
  node,
  onClose,
  onAddCard,
  onAddDivider,
  onReviseDivider,
  onEditCard,
  onStartRename,
  onDeleteNode,
  onResetWeights,
  onExportDivider,
}) => {
  const isFolder = node.type === 'divider';

  return (
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
                onClose();
              }}
              className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center space-x-2"
            >
              <FilePlus size={14} style={{ color: 'var(--color-card-icon, #818cf8)' }} />
              <span>Add cards</span>
            </button>
            <button
              onClick={() => {
                onAddDivider(node.id);
                onClose();
              }}
              className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center space-x-2"
            >
              <FolderPlus size={14} style={{ color: 'var(--color-folder-icon, #f59e0b)' }} />
              <span>Add new divider</span>
            </button>
          </div>

          <div className="py-1">
            <button
              onClick={() => {
                onReviseDivider(node);
                onClose();
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
                onClose();
              }}
              className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center space-x-2"
            >
              <RotateCcw size={14} className="text-slate-400" />
              <span>Reset card weights</span>
            </button>
            <button
              onClick={() => {
                onResetWeights(node.id, true);
                onClose();
              }}
              className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center space-x-2"
            >
              <RotateCcw size={14} className="text-slate-400" />
              <span>Reset weights (recursive)</span>
            </button>
          </div>

          <div className="py-1">
            <button
              onClick={() => {
                onStartRename(node);
                onClose();
              }}
              className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center space-x-2"
            >
              <Edit size={14} />
              <span>Rename divider</span>
            </button>
            <button
              onClick={() => {
                onDeleteNode(node.id);
                onClose();
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
                onClose();
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
                onClose();
              }}
              className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center space-x-2"
            >
              <Edit size={14} className="text-indigo-400" />
              <span>Edit card</span>
            </button>
            <button
              onClick={() => {
                onStartRename(node);
                onClose();
              }}
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
                onClose();
              }}
              className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center space-x-2"
            >
              <RotateCcw size={14} className="text-indigo-400" />
              <span>Reset card weight</span>
            </button>
            <button
              onClick={() => {
                onDeleteNode(node.id);
                onClose();
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
  );
};
