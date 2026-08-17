'use client';

import React, { useState, useEffect } from 'react';
import { X, FolderPlus, Palette } from 'lucide-react';
import { NodeData } from '../types/flashcard';

interface DeckEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveDeck: (deckNode: Partial<NodeData>) => void;
  editingDeckNode?: NodeData | null;
  availableDecks: NodeData[];
  defaultParentId?: string | null;
}

const COLOR_OPTIONS = [
  { name: 'Purple', value: 'purple', bg: 'bg-purple-600' },
  { name: 'Indigo', value: 'indigo', bg: 'bg-indigo-600' },
  { name: 'Blue', value: 'blue', bg: 'bg-blue-600' },
  { name: 'Emerald', value: 'emerald', bg: 'bg-emerald-600' },
  { name: 'Amber', value: 'amber', bg: 'bg-amber-600' },
  { name: 'Rose', value: 'rose', bg: 'bg-rose-600' },
];

export const DeckEditorModal: React.FC<DeckEditorModalProps> = ({
  isOpen,
  onClose,
  onSaveDeck,
  editingDeckNode,
  availableDecks,
  defaultParentId = null,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('indigo');
  const [parentId, setParentId] = useState<string | null>(defaultParentId);

  useEffect(() => {
    if (editingDeckNode) {
      setName(editingDeckNode.name);
      setDescription(editingDeckNode.divider?.description || '');
      setColor(editingDeckNode.divider?.color || 'indigo');
      setParentId(editingDeckNode.parentId);
    } else {
      setName('');
      setDescription('');
      setColor('indigo');
      setParentId(defaultParentId);
    }
  }, [editingDeckNode, defaultParentId, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSaveDeck({
      id: editingDeckNode?.id,
      name: name.trim(),
      parentId,
      type: 'divider',
      divider: {
        id: editingDeckNode?.divider?.id || `div-${Date.now()}`,
        nodeId: editingDeckNode?.id || `node-deck-${Date.now()}`,
        description: description.trim(),
        color,
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <FolderPlus className="text-indigo-400" size={20} />
            <h3 className="text-lg font-bold text-slate-100">
              {editingDeckNode ? 'Edit Deck / Folder' : 'Create New Deck / Folder'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Deck Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. System Design Concepts"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of what this deck covers..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Parent Folder
            </label>
            <select
              value={parentId || ''}
              onChange={(e) => setParentId(e.target.value || null)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="">Top-Level (Root Deck)</option>
              {availableDecks
                .filter((d) => d.id !== editingDeckNode?.id)
                .map((deck) => (
                  <option key={deck.id} value={deck.id}>
                    📁 {deck.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <Palette size={14} className="text-indigo-400" />
              <span>Accent Color</span>
            </label>
            <div className="flex items-center space-x-3">
              {COLOR_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setColor(opt.value)}
                  className={`w-8 h-8 rounded-full ${opt.bg} transition-all transform flex items-center justify-center ${
                    color === opt.value
                      ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110'
                      : 'hover:scale-105 opacity-80 hover:opacity-100'
                  }`}
                  title={opt.name}
                />
              ))}
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/30"
            >
              Save Deck
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
