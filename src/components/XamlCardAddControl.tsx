'use client';

import React, { useState, useRef, useEffect } from 'react';

interface XamlCardAddControlProps {
  onAddCard: (front: string, back: string) => void;
  onDone: () => void;
}

export const XamlCardAddControl: React.FC<XamlCardAddControlProps> = ({ onAddCard, onDone }) => {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');

  const frontInputRef = useRef<HTMLInputElement>(null);
  const backTextAreaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus frontTextBox on mount matching WinUI CardAddControl
  useEffect(() => {
    frontInputRef.current?.focus();
  }, []);

  // Escape key to finish/done matching UserControl_PreviewKeyDown
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onDone();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onDone]);

  // Front_TextBox_KeyDown: Enter -> move focus to backTextBox
  const handleFrontKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      backTextAreaRef.current?.focus();
    }
  };

  // Back_TextBox_KeyDown: Tab -> add card, clear input fields, auto-focus frontTextBox
  const handleBackKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
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

  return (
    <div className="flex-1 h-full p-8 flex items-center justify-center select-none">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl flex flex-col space-y-6">
        {/* Row 0: frontTextBox (Matching CardAddControl.xaml line 30) */}
        <input
          ref={frontInputRef}
          type="text"
          value={front}
          onChange={(e) => setFront(e.target.value)}
          onKeyDown={handleFrontKeyDown}
          placeholder="Front question..."
          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-2xl font-medium text-slate-100 focus:outline-none focus:border-indigo-500"
        />

        {/* Row 1: backTextBox (Matching CardAddControl.xaml line 36) */}
        <textarea
          ref={backTextAreaRef}
          rows={8}
          value={back}
          onChange={(e) => setBack(e.target.value)}
          onKeyDown={handleBackKeyDown}
          placeholder="Back answer in Markdown..."
          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-4 text-xl font-mono text-slate-100 focus:outline-none focus:border-indigo-500 resize-none flex-1"
        />

        {/* Row 2: Bottom Button Row: Add (Tab) & Done (Esc) (Matching CardAddControl.xaml line 43) */}
        <div className="flex items-center justify-end space-x-4 pt-2">
          <button
            onClick={handleAddCurrent}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-lg rounded-lg transition-all shadow-lg shadow-indigo-600/30 flex items-center space-x-2"
          >
            <span>Add</span>
            <span className="text-xs text-indigo-200 font-mono font-normal">(Tab)</span>
          </button>

          <button
            onClick={onDone}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-lg rounded-lg transition-colors border border-slate-700 flex items-center space-x-2"
          >
            <span>Done</span>
            <span className="text-xs text-slate-400 font-mono font-normal">(Esc)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
