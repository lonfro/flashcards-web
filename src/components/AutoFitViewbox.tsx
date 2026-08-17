'use client';

import React, { useRef, useLayoutEffect, useState } from 'react';

interface AutoFitViewboxProps {
  children: React.ReactNode;
  maxHeight?: number;
  maxWidth?: number;
  className?: string;
}

export const AutoFitViewbox: React.FC<AutoFitViewboxProps> = ({
  children,
  maxHeight = 260,
  maxWidth = 450,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const measure = () => {
      if (contentRef.current && containerRef.current) {
        const contentHeight = contentRef.current.scrollHeight;
        const targetHeight = maxHeight;

        if (contentHeight > targetHeight && targetHeight > 0) {
          const calculatedScale = targetHeight / contentHeight;
          setScale(Math.max(0.45, Math.min(1, calculatedScale)));
        } else {
          setScale(1);
        }
      }
    };

    measure();
    // Re-measure after small delay for web font/katex rendering
    const timer = setTimeout(measure, 40);
    return () => clearTimeout(timer);
  }, [children, maxHeight]);

  return (
    <div
      ref={containerRef}
      style={{ maxHeight: `${maxHeight}px`, maxWidth: `${maxWidth}px` }}
      className={`w-full h-full overflow-hidden flex items-center justify-center ${className}`}
    >
      <div
        ref={contentRef}
        style={{
          transform: scale < 1 ? `scale(${scale})` : 'none',
          transformOrigin: 'center center',
          width: '100%',
        }}
        className="w-full transition-transform duration-200"
      >
        {children}
      </div>
    </div>
  );
};
