'use client';

import { Menu, MenuList, MenuPopover } from '@fluentui/react-components';
import type { ReactNode } from 'react';

export interface FlyoutAnchor {
  x: number;
  y: number;
  source: HTMLElement;
}

interface WinUIFlyoutProps {
  anchor: FlyoutAnchor;
  label: string;
  onClose: () => void;
  children: ReactNode;
}

export function WinUIFlyout({ anchor, label, onClose, children }: WinUIFlyoutProps) {
  return (
    <Menu
      open
      hasIcons
      closeOnScroll
      positioning={{
        target: { getBoundingClientRect: () => new DOMRect(anchor.x, anchor.y, 0, 0) },
        strategy: 'fixed',
        overflowBoundaryPadding: 6,
      }}
      onOpenChange={(_, data) => {
        if (data.open) return;
        onClose();
        if (data.keyboard) anchor.source.focus();
      }}
    >
      <MenuPopover
        className="winui-flyout"
        onClick={(event) => event.stopPropagation()}
        onContextMenu={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
      >
        <MenuList aria-label={label}>{children}</MenuList>
      </MenuPopover>
    </Menu>
  );
}
