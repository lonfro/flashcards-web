'use client';

import { MarkdownAnswerEditor } from './MarkdownAnswerEditor';
import React, { useState, useRef, useEffect } from 'react';

interface XamlCardAddControlProps {
  dividerPath: string;
  onAddCard: (front: string, back: string) => void;
  onDone: () => void;
}

export const XamlCardAddControl: React.FC<XamlCardAddControlProps> = ({ dividerPath, onAddCard, onDone }) => {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');

  const frontInputRef = useRef<HTMLInputElement>(null);
  const backTextAreaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus frontTextBox on mount
  useEffect(() => {
    frontInputRef.current?.focus();
  }, []);

  const handleFrontKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      backTextAreaRef.current?.focus();
    }
  };

  const handleBackKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab' && !e.shiftKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
      handleAddCurrent();
    }
  };

  const handleAddCurrent = () => {
    if (front.trim() || back.trim()) {
      onAddCard(front, back);
      setFront('');
      setBack('');
      frontInputRef.current?.focus();
    }
  };

  const handleDone = () => {
    handleAddCurrent();
    onDone();
  };

  return (
    <div className="flex-1 h-full p-3 sm:p-9 flex items-center justify-center select-none overflow-hidden" onKeyDown={(event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleDone();
      }
    }}>
      <div className="w-full max-w-3xl h-full max-h-[580px] bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-8 shadow-2xl flex flex-col space-y-3 sm:space-y-4 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 shrink-0">
          <h3 className="text-sm sm:text-base font-semibold text-slate-100">Add New Flashcard</h3>
          <button
            onClick={handleDone}
            className="text-xs text-slate-400 hover:text-slate-200 px-2.5 py-1 rounded bg-slate-800/60 transition-colors"
          >
            Done
          </button>
        </div>

        {/* Row 0: frontTextBox */}
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

        <MarkdownAnswerEditor
          textareaRef={backTextAreaRef}
          value={back}
          onChange={setBack}
          onKeyDown={handleBackKeyDown}
        />

        {/* Row 2: Bottom Button Row: Add & Done */}
        <div className="flex items-center justify-end gap-3 pt-1 shrink-0 flex-wrap">
          {dividerPath && (
            <span className="text-xs text-slate-400 flex-1 min-w-0 truncate" title={dividerPath}>
              {dividerPath}
            </span>
          )}
          <button
            onClick={handleAddCurrent}
            className="flex-1 sm:flex-initial px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm sm:text-base rounded-lg transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 touch-manipulation"
          >
            <span>Add Card</span>
            <span className="text-xs text-indigo-200 font-mono font-normal hidden sm:inline">(Tab)</span>
          </button>

          <button
            onClick={handleDone}
            className="flex-1 sm:flex-initial px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm sm:text-base rounded-lg transition-colors border border-slate-700 flex items-center justify-center space-x-2 touch-manipulation"
          >
            <span>Done</span>
            <span className="text-xs text-slate-400 font-mono font-normal hidden sm:inline">(Esc)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
