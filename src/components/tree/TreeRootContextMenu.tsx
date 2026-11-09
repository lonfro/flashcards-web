'use client';

import React from 'react';
import {
  FilePlus,
  FolderPlus,
  RefreshCw,
  ArrowUpDown,
  Layers,
  Upload,
  Download,
  RotateCcw,
} from 'lucide-react';

interface TreeRootContextMenuProps {
  position: { x: number; y: number };
  onClose: () => void;
  onAddCard: (parentId: string | null) => void;
  onAddDivider: (parentId: string | null) => void;
  onReviseDivider: () => void;
  onSortNodes: (recursive: boolean) => void;
  onOpenImport: (nodeId: null, mode: 'divider' | 'contents') => void;
  onResetWeights: (nodeId: null, recursive: boolean) => void;
  onExportDivider: (dividerId: string) => void;
}

export const TreeRootContextMenu: React.FC<TreeRootContextMenuProps> = ({
  position,
  onClose,
  onAddCard,
  onAddDivider,
  onReviseDivider,
  onSortNodes,
  onOpenImport,
  onResetWeights,
  onExportDivider,
}) => {
  return (
    <div
      style={{
        position: 'fixed',
        left: `${Math.min(position.x, typeof window !== 'undefined' ? window.innerWidth - 250 : 300)}px`,
        top: `${Math.min(position.y, typeof window !== 'undefined' ? Math.max(8, window.innerHeight - Math.min(window.innerHeight * 0.7, 425)) : 300)}px`,
      }}
      className="z-50 w-56 max-h-[70dvh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1 text-xs text-slate-200 divide-y divide-slate-800/80 animate-fade-in"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="py-1">
        <button
          onClick={() => {
            onAddCard(null);
            onClose();
          }}
          className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center space-x-2"
        >
          <FilePlus size={14} style={{ color: 'var(--color-card-icon, #818cf8)' }} />
          <span>Add cards (Root)</span>
        </button>
        <button
          onClick={() => {
            onAddDivider(null);
            onClose();
          }}
          className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center space-x-2"
        >
          <FolderPlus size={14} style={{ color: 'var(--color-folder-icon, #f59e0b)' }} />
          <span>Add new deck</span>
        </button>
      </div>

      <div className="py-1">
        <button
          onClick={() => {
            onReviseDivider();
            onClose();
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
            onClose();
          }}
          className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center space-x-2"
        >
          <ArrowUpDown size={14} />
          <span>Sort alphabetically</span>
        </button>
        <button
          onClick={() => {
            onSortNodes(true);
            onClose();
          }}
          className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center space-x-2"
        >
          <Layers size={14} />
          <span>Sort alphabetically (recursive)</span>
        </button>
      </div>

      <div className="py-1">
        {[false, true].map((recursive) => (
          <button key={String(recursive)} onClick={() => {
            onResetWeights(null, recursive);
            onClose();
          }} className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center gap-2">
            <RotateCcw size={14} /> Reset weights{recursive ? ' (recursive)' : ''}
          </button>
        ))}
      </div>
      <div className="py-1">
        {(['divider', 'contents'] as const).map((mode) => (
          <button key={mode} onClick={() => {
            onOpenImport(null, mode);
            onClose();
          }} className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center gap-2">
            <Upload size={14} /> Import {mode === 'divider' ? 'divider' : 'divider contents'}
          </button>
        ))}
        <button
          onClick={() => {
            onExportDivider('');
            onClose();
          }}
          className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center space-x-2"
        >
          <Download size={14} />
          <span>Export JSON</span>
        </button>
      </div>
    </div>
  );
};
