'use client';

import {
  Menu, MenuDivider, MenuItem, MenuItemCheckbox, MenuList, MenuPopover, MenuTrigger,
} from '@fluentui/react-components';
import { ArrowDownToLine, ArrowUpFromLine, ArrowDownAZ, ChartNoAxesCombined, Folder, Pencil, Plus, RefreshCw, Shuffle, Trash2, Undo2 } from 'lucide-react';
import type { ReactElement, ReactNode } from 'react';
import type { TreeNode, XamlTreeViewProps } from './types';
import { WinUIFlyout, type FlyoutAnchor } from '../WinUIFlyout';

interface TreeNodeContextMenuProps extends Pick<XamlTreeViewProps,
  'onAddCard' | 'onReviseDivider' | 'onEditCard' | 'onDeleteNode' |
  'onResetWeights' | 'onToggleProgress' | 'onSortNodes' | 'onExportDivider'
> {
  node: TreeNode | null;
  anchor: FlyoutAnchor;
  onClose: () => void;
  onAddDivider: (parentId: string | null) => void;
  onStartRename: (node: TreeNode) => void;
  onOpenImport: (nodeId: string | null, mode: 'divider' | 'contents') => void;
}

function Submenu({ label, icon, children }: { label: string; icon: ReactElement; children: ReactNode }) {
  return (
    <Menu hasIcons hoverDelay={200} positioning={{ overflowBoundaryPadding: 6 }}>
      <MenuTrigger disableButtonEnhancement>
        <MenuItem icon={icon}>{label}</MenuItem>
      </MenuTrigger>
      <MenuPopover className="winui-flyout">
        <MenuList aria-label={label}>{children}</MenuList>
      </MenuPopover>
    </Menu>
  );
}

export function TreeNodeContextMenu({
  node, anchor, onClose, onAddCard, onAddDivider, onReviseDivider, onEditCard, onStartRename,
  onDeleteNode, onResetWeights, onToggleProgress, onOpenImport, onSortNodes, onExportDivider,
}: TreeNodeContextMenuProps) {
  const id = node?.id ?? null;

  if (node?.type === 'card') {
    return (
      <WinUIFlyout anchor={anchor} label="Card actions" onClose={onClose}>
        <MenuItem icon={<Pencil />} onClick={() => onEditCard(node)}>Edit card</MenuItem>
        <MenuItem icon={<Pencil />} onClick={() => onStartRename(node)}>Rename card</MenuItem>
        <MenuItem icon={<Undo2 />} onClick={() => onResetWeights(node.id, false)}>Reset card weight</MenuItem>
        <MenuItem className="winui-danger" icon={<Trash2 />} onClick={() => onDeleteNode(node.id)}>Delete card</MenuItem>
      </WinUIFlyout>
    );
  }

  return (
    <WinUIFlyout anchor={anchor} label={node ? 'Divider actions' : 'Library actions'} onClose={onClose}>
      <MenuItem icon={<Plus />} onClick={() => onAddCard(id)}>Add cards</MenuItem>
      <MenuItem icon={<Plus />} onClick={() => onAddDivider(id)}>Add new divider</MenuItem>
      <MenuDivider />
      <MenuItem icon={<RefreshCw />} onClick={() => onReviseDivider(node)}>
        {node ? 'Revise cards' : 'Revise all cards (cram)'}
      </MenuItem>
      <MenuDivider />
      <Submenu label="File operations" icon={<Folder />}>
        <MenuItem icon={<ArrowDownToLine />} onClick={() => onOpenImport(id, 'divider')}>Import divider</MenuItem>
        <MenuItem icon={<ArrowDownToLine />} onClick={() => onOpenImport(id, 'contents')}>Import contents of divider</MenuItem>
        <MenuItem icon={<ArrowUpFromLine />} onClick={() => onExportDivider(id ?? '')}>
          {node ? 'Export divider' : 'Export all dividers'}
        </MenuItem>
      </Submenu>
      <Menu hasIcons hasCheckmarks={!!node} checkedValues={{ progress: node?.divider?.isProgressShown ? ['show'] : [] }}
        hoverDelay={200} positioning={{ overflowBoundaryPadding: 6 }}>
        <MenuTrigger disableButtonEnhancement>
          <MenuItem icon={<Shuffle />}>Manage contents</MenuItem>
        </MenuTrigger>
        <MenuPopover className="winui-flyout">
          <MenuList aria-label="Manage contents">
            {node && (
              <MenuItemCheckbox icon={<ChartNoAxesCombined />} name="progress" value="show" onClick={() => onToggleProgress(node.id)}>
                Show learning progress
              </MenuItemCheckbox>
            )}
            <MenuItem icon={<Undo2 />} onClick={() => onResetWeights(id, false)}>Reset card weights</MenuItem>
            <MenuItem icon={<Undo2 />} onClick={() => onResetWeights(id, true)}>Reset card weights (recursive)</MenuItem>
            <MenuItem icon={<ArrowDownAZ />} onClick={() => onSortNodes(false, id)}>Sort contents alphabetically</MenuItem>
            <MenuItem icon={<ArrowDownAZ />} onClick={() => onSortNodes(true, id)}>Sort contents alphabetically (recursive)</MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>
      {node && (
        <>
          <MenuDivider />
          <MenuItem icon={<Pencil />} onClick={() => onStartRename(node)}>Rename divider</MenuItem>
          <MenuItem className="winui-danger" icon={<Trash2 />} onClick={() => onDeleteNode(node.id)}>Delete divider</MenuItem>
        </>
      )}
    </WinUIFlyout>
  );
}
