'use client';

import React from 'react';
import {
  Folder,
  FolderOpen,
  FileText,
  ChevronRight,
  ChevronDown,
  MoreVertical,
} from 'lucide-react';
import { TreeNode } from './types';
import { NodeData } from '../../types/flashcard';
import { TreeNodeContextMenu } from './TreeNodeContextMenu';

interface TreeNodeItemProps {
  node: TreeNode;
  depth?: number;
  selectedNodeId: string | null;
  expandedFolderIds: Record<string, boolean>;
  editingNodeId: string | null;
  editingName: string;
  activeMenuNodeId: string | null;
  dragOverFolderId: string | null;
  onSelectNode: (node: NodeData) => void;
  onToggleFolder: (folderId: string) => void;
  onStartRename: (node: NodeData) => void;
  onSaveRename: (node: NodeData) => void;
  onCancelRename: () => void;
  onEditingNameChange: (val: string) => void;
  onOpenMenu: (nodeId: string) => void;
  onCloseMenu: () => void;
  onDragStart: (e: React.DragEvent, node: NodeData) => void;
  onDragOver: (e: React.DragEvent, folderId: string) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, targetFolderId: string) => void;
  onAddCard: (parentId: string | null) => void;
  onAddDivider: (parentId: string | null) => void;
  onReviseDivider: (node: NodeData | null) => void;
  onEditCard: (node: NodeData) => void;
  onDeleteNode: (nodeId: string) => void;
  onResetWeights: (nodeId: string, recursive?: boolean) => void;
  onExportDivider: (dividerId: string) => void;
}

export const TreeNodeItem: React.FC<TreeNodeItemProps> = ({
  node,
  depth = 0,
  selectedNodeId,
  expandedFolderIds,
  editingNodeId,
  editingName,
  activeMenuNodeId,
  dragOverFolderId,
  onSelectNode,
  onToggleFolder,
  onStartRename,
  onSaveRename,
  onCancelRename,
  onEditingNameChange,
  onOpenMenu,
  onCloseMenu,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onAddCard,
  onAddDivider,
  onReviseDivider,
  onEditCard,
  onDeleteNode,
  onResetWeights,
  onExportDivider,
}) => {
  const isFolder = node.type === 'divider';
  const isExpanded = !!expandedFolderIds[node.id];
  const isSelected = selectedNodeId === node.id;
  const isEditing = editingNodeId === node.id;
  const isMenuOpen = activeMenuNodeId === node.id;
  const isDragOver = dragOverFolderId === node.id;

  return (
    <div className="relative group">
      <div
        draggable={!isEditing}
        onDragStart={(e) => onDragStart(e, node)}
        onDragOver={isFolder ? (e) => onDragOver(e, node.id) : undefined}
        onDragLeave={isFolder ? onDragLeave : undefined}
        onDrop={isFolder ? (e) => onDrop(e, node.id) : undefined}
        onClick={() => {
          onSelectNode(node);
          if (isFolder) onToggleFolder(node.id);
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onOpenMenu(node.id);
        }}
        style={{ paddingLeft: `${Math.max(8, depth * 14 + 6)}px` }}
        className={`flex items-center justify-between h-9 sm:h-8 pr-2 rounded-md text-xs cursor-pointer transition-colors select-none relative shrink-0 ${
          isSelected
            ? 'bg-slate-800 text-indigo-300 font-semibold border-l-2 border-indigo-500 shadow-sm'
            : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
        } ${isDragOver ? 'bg-indigo-950/80 border border-indigo-500' : ''}`}
      >
        {/* Left item details: Chevron + Icon + Title */}
        <div className="flex items-center space-x-1.5 flex-1 min-w-0 pr-1 h-full">
          {isFolder ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFolder(node.id);
              }}
              className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-slate-200 rounded shrink-0 touch-manipulation"
            >
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          ) : (
            <span className="w-5 h-5 shrink-0" />
          )}

          {isFolder ? (
            isExpanded ? (
              <FolderOpen size={15} style={{ color: 'var(--color-folder-icon, #f59e0b)' }} className="shrink-0" />
            ) : (
              <Folder size={15} style={{ color: 'var(--color-folder-icon, #f59e0b)' }} className="shrink-0" />
            )
          ) : (
            <FileText size={15} style={{ color: 'var(--color-card-icon, #818cf8)' }} className="shrink-0" />
          )}

          {isEditing ? (
            <input
              type="text"
              autoFocus
              value={editingName}
              onChange={(e) => onEditingNameChange(e.target.value)}
              onBlur={() => onSaveRename(node)}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSaveRename(node);
                if (e.key === 'Escape') onCancelRename();
              }}
              className="bg-slate-950 border border-indigo-500 px-1.5 py-0.5 rounded text-xs text-slate-100 w-full focus:outline-none"
            />
          ) : (
            <span className="truncate text-xs sm:text-[13px] leading-normal py-0.5">{node.name}</span>
          )}
        </div>

        {/* Right badge & context menu toggle button */}
        <div className="flex items-center space-x-1 shrink-0 ml-1">
          {isFolder && node.cardCount > 0 && (
            <span className="text-[10px] font-mono text-slate-400 bg-slate-950/80 px-1.5 py-0.5 rounded border border-slate-800">
              {node.cardCount}
            </span>
          )}

          {/* Context Flyout trigger (mobile) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (isMenuOpen) {
                onCloseMenu();
              } else {
                onOpenMenu(node.id);
              }
            }}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 opacity-80 md:hidden transition-opacity touch-manipulation"
            title="Item menu"
          >
            <MoreVertical size={14} />
          </button>
        </div>
      </div>

      {/* Context Menu Flyout */}
      {isMenuOpen && (
        <TreeNodeContextMenu
          node={node}
          onClose={onCloseMenu}
          onAddCard={onAddCard}
          onAddDivider={onAddDivider}
          onReviseDivider={onReviseDivider}
          onEditCard={onEditCard}
          onStartRename={onStartRename}
          onDeleteNode={onDeleteNode}
          onResetWeights={onResetWeights}
          onExportDivider={onExportDivider}
        />
      )}

      {/* Render Folder Children */}
      {isFolder && isExpanded && node.childrenNodes.length > 0 && (
        <div className="border-l border-slate-800 ml-3.5 my-0.5">
          {node.childrenNodes.map((child) => (
            <TreeNodeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedNodeId={selectedNodeId}
              expandedFolderIds={expandedFolderIds}
              editingNodeId={editingNodeId}
              editingName={editingName}
              activeMenuNodeId={activeMenuNodeId}
              dragOverFolderId={dragOverFolderId}
              onSelectNode={onSelectNode}
              onToggleFolder={onToggleFolder}
              onStartRename={onStartRename}
              onSaveRename={onSaveRename}
              onCancelRename={onCancelRename}
              onEditingNameChange={onEditingNameChange}
              onOpenMenu={onOpenMenu}
              onCloseMenu={onCloseMenu}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onAddCard={onAddCard}
              onAddDivider={onAddDivider}
              onReviseDivider={onReviseDivider}
              onEditCard={onEditCard}
              onDeleteNode={onDeleteNode}
              onResetWeights={onResetWeights}
              onExportDivider={onExportDivider}
            />
          ))}
        </div>
      )}
    </div>
  );
};
