'use client';

import React, { useState, useEffect } from 'react';
import { X, Bold, Italic, Code, Sigma, ListCheck, Heading, Save, Layers } from 'lucide-react';
import { NodeData } from '../types/flashcard';
import { MarkdownRenderer } from './MarkdownRenderer';

interface CardEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCard: (cardNode: Partial<NodeData>) => void;
  editingCardNode?: NodeData | null;
  availableDecks: NodeData[]; // Only divider nodes
  defaultParentId?: string | null;
}

export const CardEditorModal: React.FC<CardEditorModalProps> = ({
  isOpen,
  onClose,
  onSaveCard,
  editingCardNode,
  availableDecks,
  defaultParentId = null,
}) => {
  const [name, setName] = useState('');
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [parentId, setParentId] = useState<string | null>(defaultParentId);
  const [activeTab, setActiveTab] = useState<'front' | 'back'>('front');

  useEffect(() => {
    if (editingCardNode && editingCardNode.card) {
      setName(editingCardNode.name);
      setFront(editingCardNode.card.front);
      setBack(editingCardNode.card.back);
      setParentId(editingCardNode.parentId);
    } else {
      setName('');
      setFront('');
      setBack('');
      setParentId(defaultParentId);
    }
  }, [editingCardNode, defaultParentId, isOpen]);

  if (!isOpen) return null;

  const insertSnippet = (snippet: string) => {
    if (activeTab === 'front') {
      setFront((prev) => prev + snippet);
    } else {
      setBack((prev) => prev + snippet);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!front.trim() || !back.trim()) return;

    onSaveCard({
      id: editingCardNode?.id,
      name: name.trim() || (front.slice(0, 35).replace(/[#*`]/g, '') + '...'),
      parentId,
      type: 'card',
      card: {
        id: editingCardNode?.card?.id || `card-${Date.now()}`,
        nodeId: editingCardNode?.id || `node-card-${Date.now()}`,
        front,
        back,
        weight: editingCardNode?.card?.weight ?? 1.0,
        easeFactor: editingCardNode?.card?.easeFactor ?? 2.5,
        interval: editingCardNode?.card?.interval ?? 1,
        reviewCount: editingCardNode?.card?.reviewCount ?? 0,
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Layers className="text-indigo-400" size={20} />
            <h3 className="text-lg font-bold text-slate-100">
              {editingCardNode ? 'Edit Flashcard' : 'Create New Flashcard'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSave} className="flex-1 flex flex-col overflow-hidden">
          <div className="p-6 space-y-4 overflow-y-auto flex-1">
            {/* Title & Deck Selector */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Card Name / Short Title
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Binary Search Complexity"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Target Deck / Folder
                </label>
                <select
                  value={parentId || ''}
                  onChange={(e) => setParentId(e.target.value || null)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="">Top-Level (No Deck)</option>
                  {availableDecks.map((deck) => (
                    <option key={deck.id} value={deck.id}>
                      📁 {deck.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Markdown Toolbar */}
            <div className="flex items-center justify-between bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => insertSnippet(' **bold**')}
                  className="p-1.5 rounded text-slate-400 hover:text-indigo-300 hover:bg-slate-800 text-xs font-semibold"
                  title="Bold"
                >
                  <Bold size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => insertSnippet(' *italic*')}
                  className="p-1.5 rounded text-slate-400 hover:text-indigo-300 hover:bg-slate-800 text-xs font-semibold"
                  title="Italic"
                >
                  <Italic size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => insertSnippet('\n### Heading')}
                  className="p-1.5 rounded text-slate-400 hover:text-indigo-300 hover:bg-slate-800 text-xs font-semibold"
                  title="Heading"
                >
                  <Heading size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => insertSnippet('\n```typescript\n// code here\n```\n')}
                  className="p-1.5 rounded text-slate-400 hover:text-indigo-300 hover:bg-slate-800 text-xs font-semibold"
                  title="Code Block"
                >
                  <Code size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => insertSnippet(' $\\sum_{i=1}^n x_i$ ')}
                  className="p-1.5 rounded text-slate-400 hover:text-indigo-300 hover:bg-slate-800 text-xs font-semibold"
                  title="LaTeX Math"
                >
                  <Sigma size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => insertSnippet('\n- [ ] Task item')}
                  className="p-1.5 rounded text-slate-400 hover:text-indigo-300 hover:bg-slate-800 text-xs font-semibold"
                  title="Checklist"
                >
                  <ListCheck size={16} />
                </button>
              </div>

              {/* Side Tab Switcher */}
              <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setActiveTab('front')}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    activeTab === 'front'
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Front Side
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('back')}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    activeTab === 'back'
                      ? 'bg-purple-600 text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Back Side
                </button>
              </div>
            </div>

            {/* Split Editor & Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[340px]">
              {/* Left Code/Text Area */}
              <div className="flex flex-col h-full">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Markdown Editor ({activeTab === 'front' ? 'Question Front' : 'Answer Back'})
                </label>
                <textarea
                  value={activeTab === 'front' ? front : back}
                  onChange={(e) => (activeTab === 'front' ? setFront(e.target.value) : setBack(e.target.value))}
                  className="flex-1 w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-100 font-mono text-sm resize-none focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="Write Markdown here..."
                />
              </div>

              {/* Right Live Preview */}
              <div className="flex flex-col h-full">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Live Preview
                </label>
                <div className="flex-1 w-full bg-slate-950/60 border border-slate-800 rounded-xl p-4 overflow-y-auto">
                  <MarkdownRenderer content={activeTab === 'front' ? front : back} />
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end space-x-3 px-6 py-4 bg-slate-950 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center space-x-2"
            >
              <Save size={16} />
              <span>Save Card</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
