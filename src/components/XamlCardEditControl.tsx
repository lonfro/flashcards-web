'use client';

import React, { useState, useEffect, useRef } from 'react';
import { NodeData } from '../types/flashcard';

interface XamlCardEditControlProps {
  cardNode: NodeData | null;
  onSave: (front: string, back: string) => void;
  onCancel: () => void;
}

export const XamlCardEditControl: React.FC<XamlCardEditControlProps> = ({
  cardNode,
  onSave,
  onCancel,
}) => {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');

  const frontInputRef = useRef<HTMLInputElement>(null);
  const backTextAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (cardNode && cardNode.card) {
      setFront(cardNode.card.front);
      setBack(cardNode.card.back);
    } else {
      setFront('');
      setBack('');
    }
    frontInputRef.current?.focus();
  }, [cardNode]);

  // Handle ESC key to cancel/done matching XAML KeyboardAccelerator
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (front.trim() || back.trim()) {
          onSave(front, back);
        } else {
          onCancel();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [front, back, onSave, onCancel]);

  const handleFrontKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      backTextAreaRef.current?.focus();
    }
  };

  const handleDone = () => {
    onSave(front, back);
  };

  return (
    <div className="flex-1 h-full p-3 sm:p-9 flex items-center justify-center select-none overflow-hidden">
      <div className="w-full max-w-3xl h-full max-h-[580px] bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-8 shadow-2xl flex flex-col space-y-3 sm:space-y-4 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 shrink-0">
          <h3 className="text-sm sm:text-base font-semibold text-slate-100">Edit Flashcard</h3>
          <button
            onClick={onCancel}
            className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1 rounded bg-slate-800/60 transition-colors"
          >
            Cancel
          </button>
        </div>

        {/* Row 0: Front TextBox */}
        <div className="space-y-1 shrink-0">
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Front (Question / Prompt)
          </label>
          <input
            ref={frontInputRef}
            type="text"
            value={front}
            onChange={(e) => setFront(e.target.value)}
            onKeyDown={handleFrontKeyDown}
            placeholder="Front question..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 text-base sm:text-2xl font-medium text-slate-100 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Row 1: Back TextBox (fills remaining height and scrolls internally) */}
        <div className="space-y-1 flex-1 min-h-0 flex flex-col">
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0">
            Back (Answer / Markdown / LaTeX)
          </label>
          <textarea
            ref={backTextAreaRef}
            value={back}
            onChange={(e) => setBack(e.target.value)}
            placeholder="Back answer in Markdown / LaTeX..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 sm:p-4 text-sm sm:text-lg font-mono text-slate-100 focus:outline-none focus:border-indigo-500 resize-none flex-1 min-h-0 overflow-y-auto leading-relaxed"
          />
        </div>

        {/* Row 2: Bottom Button Row */}
        <div className="flex items-center justify-end space-x-3 pt-1 shrink-0">
          <button
            onClick={handleDone}
            className="w-full sm:w-auto px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm sm:text-base rounded-lg transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 touch-manipulation"
          >
            <span>Save & Done</span>
            <span className="text-xs text-indigo-200 font-mono font-normal hidden sm:inline">(Esc)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
