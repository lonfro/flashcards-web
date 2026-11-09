'use client';

import { useRef, useState } from 'react';

interface XamlGridSplitterProps {
  width: number;
  onWidthChange: (newWidth: number) => void;
  minWidth?: number;
  maxWidth?: number;
}

export function XamlGridSplitter({
  width, onWidthChange, minWidth = 180, maxWidth = 500,
}: XamlGridSplitterProps) {
  const [isResizing, setIsResizing] = useState(false);
  const start = useRef({ x: 0, width });

  return (
    <div
      className="winui-splitter"
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize deck pane"
      data-resizing={isResizing}
      onPointerDown={(event) => {
        if (event.button !== 0) return;
        event.preventDefault();
        start.current = { x: event.clientX, width };
        event.currentTarget.setPointerCapture(event.pointerId);
        setIsResizing(true);
      }}
      onPointerMove={(event) => {
        if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
        const next = start.current.width + event.clientX - start.current.x;
        onWidthChange(Math.min(maxWidth, Math.max(minWidth, next)));
      }}
      onLostPointerCapture={() => setIsResizing(false)}
    />
  );
}
