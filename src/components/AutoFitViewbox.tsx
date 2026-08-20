'use client';

import React, { useRef, useLayoutEffect, useState } from 'react';

interface AutoFitViewboxProps {
  children: React.ReactNode;
  maxHeight?: number;
  maxWidth?: number;
  className?: string;
  allowUpscale?: boolean;
  minScale?: number;
  maxScale?: number;
}

export const AutoFitViewbox: React.FC<AutoFitViewboxProps> = ({
  children,
  maxHeight = 270,
  maxWidth = 480,
  className = '',
  allowUpscale = true,
  minScale = 0.35,
  maxScale = 2.2,
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
      const containerW = container.clientWidth || maxWidth;
      const containerH = container.clientHeight || maxHeight;

      // Reset transform temporarily for true unscaled measurement
      content.style.transform = 'none';
      const contentW = content.scrollWidth || content.offsetWidth;
      const contentH = content.scrollHeight || content.offsetHeight;

      if (contentW > 0 && contentH > 0 && containerW > 0 && containerH > 0) {
        const scaleX = (containerW * 0.94) / contentW;
        const scaleY = (containerH * 0.94) / contentH;
        let targetScale = Math.min(scaleX, scaleY);

        if (!allowUpscale) {
          targetScale = Math.min(1.0, targetScale);
        }

        // Clamp scale to readable limits
        const finalScale = Math.max(minScale, Math.min(maxScale, targetScale));
        setScale(Number(finalScale.toFixed(3)));
        content.style.transform = finalScale !== 1 ? `scale(${finalScale})` : 'none';
      } else {
        setScale(1);
        content.style.transform = 'none';
      }
    };

    measure();

    // Re-measure on resize and content changes (e.g. KaTeX math render, markdown tables, etc.)
    const resizeObserver = new ResizeObserver(() => measure());
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    if (contentRef.current) resizeObserver.observe(contentRef.current);

    const t1 = setTimeout(measure, 40);
    const t2 = setTimeout(measure, 180);

    return () => {
      resizeObserver.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [children, maxHeight, maxWidth, allowUpscale, minScale, maxScale]);

  return (
    <div
      ref={containerRef}
      style={{
        maxHeight: `${maxHeight}px`,
        maxWidth: `${maxWidth}px`,
        width: '100%',
        height: '100%',
      }}
      className={`overflow-hidden flex items-center justify-center relative ${className}`}
    >
      <div
        ref={contentRef}
        style={{
          transform: scale !== 1 ? `scale(${scale})` : 'none',
          transformOrigin: 'center center',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        className="transition-transform duration-100 ease-out select-text"
      >
        {children}
      </div>
    </div>
  );
};
