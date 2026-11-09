'use client';

import React from 'react';
import { Button } from '@fluentui/react-components';
import {
  Folder,
  FolderOpen,
  FileText,
  ChevronRight,
  ChevronDown,
  MoreVertical,
} from 'lucide-react';
import { CardSettingsData } from '../../types/cardSettings';
import { TreeNode } from './types';
import { NodeData } from '../../types/flashcard';
import type { FlyoutAnchor } from '../WinUIFlyout';

interface TreeNodeItemProps {
  node: TreeNode;
  cardSettings: CardSettingsData;
  depth?: number;
  selectedNodeId: string | null;
  expandedFolderIds: Record<string, boolean>;
  editingNodeId: string | null;
  editingName: string;
  activeMenuNodeId: string | null;
  dropTarget: { nodeId: string; position: 'before' | 'after' | 'into' } | null;
  onSelectNode: (node: NodeData) => void;
  onToggleFolder: (folderId: string) => void;
  onStartRename: (node: NodeData) => void;
  onSaveRename: (node: NodeData) => void;
  onCancelRename: () => void;
  onEditingNameChange: (val: string) => void;
  onOpenMenu: (node: TreeNode, anchor: FlyoutAnchor) => void;
  onCloseMenu: () => void;
  onDragStart: (e: React.DragEvent, node: NodeData) => void;
  onDragOver: (e: React.DragEvent, nodeId: string, isFolder: boolean) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, nodeId: string, isFolder: boolean) => void;
}

export const TreeNodeItem: React.FC<TreeNodeItemProps> = ({
  node,
  cardSettings,
  depth = 0,
  selectedNodeId,
  expandedFolderIds,
  editingNodeId,
  editingName,
  activeMenuNodeId,
  dropTarget,
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
}) => {
  const isFolder = node.type === 'divider';
  const isExpanded = !!expandedFolderIds[node.id];
  const isSelected = selectedNodeId === node.id;
  const isEditing = editingNodeId === node.id;
  const isMenuOpen = activeMenuNodeId === node.id;

  const difference = cardSettings.maximumWeight - cardSettings.minimumWeight;
  const buffer = difference / 10;
  const progress = node.cardCount && difference > 0
    ? Math.min(1, Math.max(0, (cardSettings.maximumWeight - node.totalWeight / node.cardCount + buffer) / (difference + buffer)))
    : 0;
  const fill = `rgb(${Math.min(1, 2 - progress * 2) * 217} ${Math.min(1, progress * 2) * 217} 0 / 20%)`;
  const showProgress = isFolder && node.divider?.isProgressShown;

  const isDropBefore = dropTarget?.nodeId === node.id && dropTarget.position === 'before';
  const isDropAfter = dropTarget?.nodeId === node.id && dropTarget.position === 'after';
  const isDropInto = dropTarget?.nodeId === node.id && dropTarget.position === 'into';

  return (
    <div className="relative group">
      {/* Drop indicator: before */}
      {isDropBefore && (
        <div className="absolute top-0 left-2 right-2 h-0.5 bg-indigo-400 rounded-full z-10 pointer-events-none" />
      )}

      <div
        tabIndex={isSelected || depth === 0 ? 0 : -1}
        draggable={!isEditing}
        onDragStart={(e) => onDragStart(e, node)}
        onDragOver={(e) => onDragOver(e, node.id, isFolder)}
        onDragLeave={onDragLeave}
        onDrop={(e) => onDrop(e, node.id, isFolder)}
        onClick={() => {
          onSelectNode(node);
          if (isFolder) onToggleFolder(node.id);
        }}
        onContextMenu={(e) => {
          if (isEditing && e.target instanceof HTMLInputElement) return;
          e.preventDefault();
          e.stopPropagation();
          onOpenMenu(node, { x: e.clientX, y: e.clientY, source: e.currentTarget });
        }}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          if (event.key === 'ContextMenu' || (event.key === 'F10' && event.shiftKey)) {
            event.preventDefault();
            const { left, bottom } = event.currentTarget.getBoundingClientRect();
            onOpenMenu(node, { x: left + 24, y: bottom, source: event.currentTarget });
          } else if (event.key === 'Enter') {
            event.preventDefault();
            onSelectNode(node);
            if (isFolder) onToggleFolder(node.id);
          }
        }}
        style={{
          paddingLeft: `${depth * 16 + 4}px`,
          backgroundImage: showProgress ? `linear-gradient(to right, ${fill} ${progress * 100}%, transparent ${progress * 100}%)` : undefined,
        }}
        title={showProgress ? `Deck progress: ${Math.round(progress * 100)}%` : undefined}
        className="winui-tree-row"
        data-selected={isSelected}
        data-drop-into={isDropInto}
      >
        {/* Left item details: Chevron + Icon + Title */}
        <div className="flex items-center gap-2 flex-1 min-w-0 pr-1 h-full">
          {isFolder ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFolder(node.id);
              }}
              className="winui-tree-chevron"
              aria-label={isExpanded ? 'Collapse divider' : 'Expand divider'}
              aria-expanded={isExpanded}
            >
              {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            </button>
          ) : (
            <span className="w-4 h-5 shrink-0" />
          )}

          {isFolder ? (
            isExpanded ? (
              <FolderOpen size={18} strokeWidth={1.5} style={{ color: 'var(--color-folder-icon, currentColor)' }} className="shrink-0" />
            ) : (
              <Folder size={18} strokeWidth={1.5} style={{ color: 'var(--color-folder-icon, currentColor)' }} className="shrink-0" />
            )
          ) : (
            <FileText size={18} strokeWidth={1.5} style={{ color: 'var(--color-card-icon, currentColor)' }} className="shrink-0" />
          )}

          {isEditing ? (
            <input
              type="text"
              autoFocus
              onFocus={(event) => event.currentTarget.select()}
              value={editingName}
              onChange={(e) => onEditingNameChange(e.target.value)}
              onBlur={() => onSaveRename(node)}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSaveRename(node);
                if (e.key === 'Escape') onCancelRename();
              }}
              className="winui-textbox w-full px-1.5"
            />
          ) : (
            <span className="truncate leading-normal">{node.card?.front || node.name}</span>
          )}
        </div>

        {/* Right badge & context menu toggle button */}
        <div className="flex items-center space-x-1 shrink-0 ml-1">
          {isFolder && (
            <span className="winui-tree-count">
              {node.cardCount}
            </span>
          )}

          {/* Context Flyout trigger (mobile) */}
          <Button
            appearance="subtle"
            size="small"
            icon={<MoreVertical size={16} />}
            onClick={(e) => {
              e.stopPropagation();
              if (isMenuOpen) {
                onCloseMenu();
              } else {
                const { left, bottom } = e.currentTarget.getBoundingClientRect();
                onOpenMenu(node, { x: left, y: bottom, source: e.currentTarget });
              }
            }}
            className="winui-tree-menu-button"
            aria-label="Item menu"
            aria-haspopup="menu"
            aria-expanded={isMenuOpen}
          />
        </div>
      </div>

      {/* Drop indicator: after */}
      {isDropAfter && (
        <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-indigo-400 rounded-full z-10 pointer-events-none" />
      )}

      {/* Render Folder Children */}
      {isFolder && isExpanded && node.childrenNodes.length > 0 && (
        <div>
          {node.childrenNodes.map((child) => (
            <TreeNodeItem
              key={child.id}
              node={child}
              cardSettings={cardSettings}
              depth={depth + 1}
              selectedNodeId={selectedNodeId}
              expandedFolderIds={expandedFolderIds}
              editingNodeId={editingNodeId}
              editingName={editingName}
              activeMenuNodeId={activeMenuNodeId}
              dropTarget={dropTarget}
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
            />
          ))}
        </div>
      )}
    </div>
  );
};
