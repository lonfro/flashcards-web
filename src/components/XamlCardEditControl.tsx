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
    <div className="flex-1 h-full p-8 flex items-center justify-center select-none">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl flex flex-col space-y-6">
        {/* Row 0: Front TextBox */}
        <input
          ref={frontInputRef}
          type="text"
          value={front}
          onChange={(e) => setFront(e.target.value)}
          onKeyDown={handleFrontKeyDown}
          placeholder="Front question..."
          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-2xl font-medium text-slate-100 focus:outline-none focus:border-indigo-500"
        />

        {/* Row 1: Back TextBox */}
        <textarea
          ref={backTextAreaRef}
          rows={8}
          value={back}
          onChange={(e) => setBack(e.target.value)}
          placeholder="Back answer in Markdown..."
          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-4 text-xl font-mono text-slate-100 focus:outline-none focus:border-indigo-500 resize-none flex-1"
        />

        {/* Row 2: Bottom Button Row (Matching CardEditControl.xaml) */}
        <div className="flex items-center justify-end space-x-4 pt-2">
          <button
            onClick={handleDone}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-lg rounded-lg transition-all shadow-lg shadow-indigo-600/30 flex items-center space-x-2"
          >
            <span>Done</span>
            <span className="text-xs text-indigo-200 font-mono font-normal">(Esc)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
