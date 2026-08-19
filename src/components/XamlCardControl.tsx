'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Edit, RotateCcw } from 'lucide-react';
import { NodeData } from '../types/flashcard';
import { CardSettingsData, DEFAULT_CARD_SETTINGS } from '../types/cardSettings';
import { MarkdownRenderer } from './MarkdownRenderer';
import { AutoFitViewbox } from './AutoFitViewbox';

interface XamlCardControlProps {
  cardNode: NodeData | null;
  isFlipped: boolean;
  onFlip: () => void;
  onStartEditing?: () => void;
  isEditButtonVisible?: boolean;
  showProgressBar?: boolean;
  showFooterHint?: boolean;
  cardSettings?: CardSettingsData;
}

export const XamlCardControl: React.FC<XamlCardControlProps> = ({
  cardNode,
  isFlipped,
  onFlip,
  onStartEditing,
  isEditButtonVisible = true,
  showProgressBar = true,
  showFooterHint = true,
  cardSettings = DEFAULT_CARD_SETTINGS,
}) => {
  const [scale, setScale] = useState<number>(1.0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Global Keyboard Accelerators matching WinUI CardControl.xaml
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') return;

      if (!cardNode || !cardNode.card) return;

      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        onFlip();
      } else if (e.key.toLowerCase() === 'e') {
        if (isEditButtonVisible && onStartEditing) {
          e.preventDefault();
          onStartEditing();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cardNode, onFlip, onStartEditing, isEditButtonVisible]);

  // Handle Non-Passive Native Mouse Wheel Zooming
  useEffect(() => {
    const containerEl = containerRef.current;
    if (!containerEl) return;

    const handleNativeWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const delta = e.deltaY < 0 ? 0.08 : -0.08;
      setScale((prev) => Math.min(2.5, Math.max(0.4, Number((prev + delta).toFixed(2)))));
    };

    containerEl.addEventListener('wheel', handleNativeWheel, { passive: false });
    return () => {
      containerEl.removeEventListener('wheel', handleNativeWheel);
    };
  }, [cardNode]);

  if (!cardNode || !cardNode.card) {
    return (
      <div className="flex-1 h-full flex flex-col items-center justify-center p-6 text-center text-slate-500 select-none">
        <h2 className="text-lg sm:text-xl font-light text-slate-400">No card selected</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-xs">Select a card from the deck list or tap + Card to create one.</p>
      </div>
    );
  }

  const card = cardNode.card;

  // 1:1 WinUI CardViewModel.cs WeightPercentage calculation formula:
  const maxW = cardSettings?.maximumWeight ?? 30.0;
  const minW = cardSettings?.minimumWeight ?? 1.0;
  const rawWeight = typeof card.weight === 'number' ? card.weight : (cardSettings?.defaultWeight ?? 20.0);

  const weightPercent = Math.min(
    100,
    Math.max(0, Math.round(((maxW - rawWeight) / (maxW - minW)) * 100))
  );

  return (
    <div
      ref={containerRef}
      className="flex-1 h-full p-3 sm:p-6 flex flex-col justify-between items-center relative select-none overflow-hidden"
    >
      {/* Top Header: Progress Bar & Edit (e) / Zoom Control Buttons */}
      <div className="w-full flex items-center justify-between z-10 min-h-[36px] sm:min-h-[40px]">
        {showProgressBar ? (
          <div className="flex flex-col items-start space-y-0.5 sm:space-y-1" title={`Learning progress: ${weightPercent}% (Weight: ${rawWeight})`}>
            <div className="flex items-center space-x-1.5">
              <span className="text-[11px] sm:text-xs text-slate-400 font-medium">Progress</span>
              <span className="text-[10px] font-mono text-slate-500">({weightPercent}%)</span>
            </div>
            <div className="w-24 sm:w-36 bg-slate-800 rounded-full h-1.5 overflow-hidden border border-slate-700">
              <div
                className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${weightPercent}%` }}
              />
            </div>
          </div>
        ) : (
          <div />
        )}

        {/* Right side controls: Zoom indicator & Edit button */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {scale !== 1.0 && (
            <button
              onClick={() => setScale(1.0)}
              className="px-2 py-1 bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 text-xs rounded-md border border-indigo-500/40 flex items-center space-x-1 transition-colors"
              title="Reset Zoom to 100%"
            >
              <RotateCcw size={12} />
              <span className="font-mono text-[10px] sm:text-[11px]">{Math.round(scale * 100)}%</span>
            </button>
          )}

          {isEditButtonVisible && onStartEditing && (
            <button
              onClick={onStartEditing}
              className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-md transition-colors border border-slate-700 flex items-center space-x-1.5 shadow-sm touch-manipulation"
            >
              <Edit size={13} className="text-indigo-400" />
              <span>Edit</span>
              <span className="text-slate-400 font-mono text-[10px] hidden sm:inline">(e)</span>
            </button>
          )}
        </div>
      </div>

      {/* Center Responsive Card (with Zoom Scale & Flip 3D) */}
      <div className="w-full my-auto perspective-1000 flex flex-col items-center justify-center px-1 sm:px-4 py-2">
        <motion.div
          onClick={onFlip}
          className="w-full max-w-[550px] min-h-[230px] sm:min-h-[325px] cursor-pointer rounded-xl bg-slate-900 border border-slate-800 shadow-2xl relative flex flex-col justify-center items-center p-4 sm:p-8 backdrop-blur-xl overflow-hidden origin-center"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{
            scale,
            rotateX: isFlipped ? 180 : 0,
          }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        >
          {!isFlipped ? (
            /* Front side with auto-fitting scale and large base font (matching WinUI FontSize="30") */
            <div className="w-full h-full flex items-center justify-center p-2">
              <AutoFitViewbox maxWidth={460} maxHeight={268}>
                <div className="text-slate-100 font-medium text-center select-text max-w-full sm:max-w-[460px] text-2xl sm:text-3xl leading-snug">
                  <MarkdownRenderer content={card.front || 'Null'} />
                </div>
              </AutoFitViewbox>
            </div>
          ) : (
            /* Back side rendered upside down so it flips right-side-up with auto-fitting scale */
            <div className="w-full h-full flex items-center justify-center [transform:rotateX(180deg)] p-2">
              <AutoFitViewbox maxWidth={460} maxHeight={268}>
                <div className="text-slate-100 font-normal text-center select-text max-w-full sm:max-w-[460px] text-lg sm:text-xl leading-relaxed">
                  <MarkdownRenderer content={card.back || 'Null'} />
                </div>
              </AutoFitViewbox>
            </div>
          )}
        </motion.div>
      </div>

      {/* Bottom Footer Hint */}
      {showFooterHint && (
        <div className="text-[10px] sm:text-[11px] text-slate-500 font-medium z-10 flex items-center space-x-1 shrink-0">
          <span>Tap card or press <kbd className="px-1 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-400 font-mono text-[9px] sm:text-[10px]">Space</kbd> to flip</span>
        </div>
      )}
    </div>
  );
};
