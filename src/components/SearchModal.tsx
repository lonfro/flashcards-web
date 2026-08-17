'use client';

import React, { useState, useEffect } from 'react';
import { Search, X, Layers, FileText, ArrowRight } from 'lucide-react';
import { NodeData } from '../types/flashcard';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: NodeData[];
  onSelectNode: (node: NodeData) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  nodes,
  onSelectNode,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results = query.trim()
    ? nodes.filter((n) => {
        const q = query.toLowerCase();
        if (n.name.toLowerCase().includes(q)) return true;
        if (n.type === 'card' && n.card) {
          return n.card.front.toLowerCase().includes(q) || n.card.back.toLowerCase().includes(q);
        }
        if (n.type === 'divider' && n.divider) {
          return n.divider.description?.toLowerCase().includes(q);
        }
        return false;
      })
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[70vh]">
        {/* Input Header */}
        <div className="flex items-center px-4 py-3 border-b border-slate-800 bg-slate-950">
          <Search size={20} className="text-indigo-400 mr-3 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search decks, cards, questions, answers... (Cmd+K)"
            className="w-full bg-transparent text-slate-100 text-base focus:outline-none placeholder-slate-500"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search Results List */}
        <div className="p-3 overflow-y-auto flex-1 divide-y divide-slate-800/60">
          {query.trim() === '' ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              Type keywords above to search all flashcards and decks...
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              No matching flashcards or decks found for &quot;<span className="text-slate-300">{query}</span>&quot;
            </div>
          ) : (
            results.map((node) => (
              <div
                key={node.id}
                onClick={() => {
                  onSelectNode(node);
                  onClose();
                }}
                className="py-3 px-4 rounded-xl hover:bg-indigo-950/40 cursor-pointer transition-colors flex items-center justify-between group"
              >
                <div className="flex items-start space-x-3 overflow-hidden">
                  <div className="mt-0.5 p-2 rounded-lg bg-slate-800/80 text-indigo-400 shrink-0">
                    {node.type === 'divider' ? <Layers size={18} /> : <FileText size={18} />}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-sm font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors truncate">
                      {node.name}
                    </h4>
                    {node.type === 'card' && node.card && (
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5 font-mono">
                        {node.card.front.replace(/[#*`]/g, '')}
                      </p>
                    )}
                    {node.type === 'divider' && node.divider?.description && (
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                        {node.divider.description}
                      </p>
                    )}
                  </div>
                </div>

                <ArrowRight
                  size={16}
                  className="text-slate-600 group-hover:text-indigo-400 transition-colors shrink-0 ml-3"
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
