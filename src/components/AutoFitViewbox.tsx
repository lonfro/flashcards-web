'use client';

import React, { useRef, useLayoutEffect, useState } from 'react';

interface AutoFitViewboxProps {
  children: React.ReactNode;
  maxHeight?: number;
  maxWidth?: number;
  className?: string;
  allowUpscale?: boolean;
}

export const AutoFitViewbox: React.FC<AutoFitViewboxProps> = ({
  children,
  maxHeight = 268,
  maxWidth = 460,
  className = '',
  allowUpscale = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const measure = () => {
      const container = containerRef.current;
      const content = contentRef.current;
      if (!container || !content) return;

      // Available container bounds
      const containerW = Math.min(maxWidth, container.clientWidth || maxWidth);
      const containerH = Math.min(maxHeight, container.clientHeight || maxHeight);

      // Natural unscaled content bounds
      const contentW = content.scrollWidth;
      const contentH = content.scrollHeight;

      if (contentW > 0 && contentH > 0 && containerW > 0 && containerH > 0) {
        const scaleX = containerW / contentW;
        const scaleY = containerH / contentH;
        let targetScale = Math.min(scaleX, scaleY);

        if (!allowUpscale) {
          targetScale = Math.min(1.0, targetScale);
        }

        // Clamp scale to a readable minimum (0.35) and maximum
        const finalScale = Math.max(0.35, Math.min(allowUpscale ? 1.5 : 1.0, targetScale));
        setScale(Number(finalScale.toFixed(3)));
      } else {
        setScale(1);
      }
    };

    measure();

    // Re-measure on resize or after web fonts/KaTeX math render
    const resizeObserver = new ResizeObserver(() => measure());
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    if (contentRef.current) resizeObserver.observe(contentRef.current);

    const t1 = setTimeout(measure, 30);
    const t2 = setTimeout(measure, 150);

    return () => {
      resizeObserver.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [children, maxHeight, maxWidth, allowUpscale]);

  return (
    <div
      ref={containerRef}
      style={{ maxHeight: `${maxHeight}px`, maxWidth: `${maxWidth}px` }}
      className={`w-full h-full overflow-hidden flex items-center justify-center relative ${className}`}
    >
      <div
        ref={contentRef}
        style={{
          transform: scale !== 1 ? `scale(${scale})` : 'none',
          transformOrigin: 'center center',
          width: '100%',
        }}
        className="w-full flex flex-col items-center justify-center transition-transform duration-150"
      >
        {children}
      </div>
    </div>
  );
};
