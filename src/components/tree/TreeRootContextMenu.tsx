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
} from 'lucide-react';

interface TreeRootContextMenuProps {
  position: { x: number; y: number };
  onClose: () => void;
  onAddCard: (parentId: string | null) => void;
  onAddDivider: (parentId: string | null) => void;
  onReviseDivider: () => void;
  onSortNodes: (recursive: boolean) => void;
  onImportDivider: (e: React.ChangeEvent<HTMLInputElement>, targetParentId: string | null) => void;
  onExportDivider: (dividerId: string) => void;
}

export const TreeRootContextMenu: React.FC<TreeRootContextMenuProps> = ({
  position,
  onClose,
  onAddCard,
  onAddDivider,
  onReviseDivider,
  onSortNodes,
  onImportDivider,
  onExportDivider,
}) => {
  return (
    <div
      style={{
        position: 'fixed',
        left: `${Math.min(position.x, typeof window !== 'undefined' ? window.innerWidth - 250 : 300)}px`,
        top: `${Math.min(position.y, typeof window !== 'undefined' ? window.innerHeight - 280 : 300)}px`,
      }}
      className="z-50 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1 text-xs text-slate-200 divide-y divide-slate-800/80 animate-fade-in"
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
        <label className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center space-x-2 cursor-pointer">
          <Upload size={14} />
          <span>Import JSON</span>
          <input
            type="file"
            accept=".json"
            onChange={(e) => {
              onImportDivider(e, null);
              onClose();
            }}
            className="hidden"
          />
        </label>
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
