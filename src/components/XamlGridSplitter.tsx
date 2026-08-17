'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface XamlGridSplitterProps {
  width: number;
  onWidthChange: (newWidth: number) => void;
  minWidth?: number;
  maxWidth?: number;
}

export const XamlGridSplitter: React.FC<XamlGridSplitterProps> = ({
  width,
  onWidthChange,
  minWidth = 180,
  maxWidth = 500,
}) => {
  const [isResizing, setIsResizing] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = Math.min(Math.max(e.clientX, minWidth), maxWidth);
      onWidthChange(newWidth);
    },
    [isResizing, minWidth, maxWidth, onWidthChange]
  );

  const handleMouseUp = useCallback(() => {
    if (isResizing) {
      setIsResizing(false);
    }
  }, [isResizing]);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return (
    <div
      onMouseDown={handleMouseDown}
      className={`w-1.5 h-full cursor-col-resize select-none shrink-0 transition-colors z-30 group relative flex items-center justify-center ${
        isResizing ? 'bg-indigo-500' : 'bg-slate-800/80 hover:bg-indigo-500/70'
      }`}
      title="Drag to resize sidebar"
    >
      {/* Visual grip indicator line matching WinUI GridSplitter */}
      <div className="w-0.5 h-8 rounded-full bg-slate-600 group-hover:bg-indigo-200 transition-colors" />
    </div>
  );
};
