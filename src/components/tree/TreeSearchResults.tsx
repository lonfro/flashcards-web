'use client';

import React from 'react';
import { FileText } from 'lucide-react';
import { MarkdownRenderer } from '../MarkdownRenderer';
import { NodeData } from '../../types/flashcard';

interface TreeSearchResultsProps {
  searchResults: NodeData[];
  query: string;
  selectedNodeId: string | null;
  onSelectResult: (node: NodeData) => void;
  onClearSearch: () => void;
}

export const TreeSearchResults: React.FC<TreeSearchResultsProps> = ({
  searchResults,
  query,
  selectedNodeId,
  onSelectResult,
  onClearSearch,
}) => {
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = query ? new RegExp(escapedQuery, 'gi') : null;
  const highlight = (text: string) => pattern
    ? text.replace(pattern, (match) => `**${match}**`).replace(/\*{4}/g, '')
    : text;

  return (
    <div className="space-y-1">
      <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
        <span>Search Results ({searchResults.length})</span>
        <button
          onClick={onClearSearch}
          className="text-[10px] text-indigo-400 hover:underline cursor-pointer lowercase font-normal"
        >
          close
        </button>
      </div>
      {searchResults.length === 0 ? (
        <div className="px-2 py-6 text-xs text-slate-500 italic text-center">
          No matching cards found.
        </div>
      ) : (
        searchResults.map((cardNode) => (
          <div
            key={cardNode.id}
            role="button"
            aria-label={cardNode.name}
            tabIndex={0}
            onClick={() => onSelectResult(cardNode)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onSelectResult(cardNode);
              }
            }}
            className={`flex items-center space-x-2 py-2.5 sm:py-1.5 px-2.5 rounded text-xs cursor-pointer transition-colors ${
              selectedNodeId === cardNode.id
                ? 'bg-slate-800 text-indigo-300 font-semibold border-l-2 border-indigo-500'
                : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <FileText size={14} style={{ color: 'var(--color-card-icon, #818cf8)' }} className="shrink-0" />
            <div inert className="min-w-0 flex-1 break-words">
              <MarkdownRenderer content={highlight(cardNode.card?.front ?? cardNode.name)} className="max-h-16 overflow-hidden" />
              <MarkdownRenderer content={highlight(cardNode.card?.back ?? '')} className="border-t border-slate-700 pt-1 max-h-20 overflow-hidden" />
            </div>
          </div>
        ))
      )}
    </div>
  );
};
