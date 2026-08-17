'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, RotateCcw, Eye, Edit3, Trash2 } from 'lucide-react';
import { NodeData } from '../types/flashcard';
import { MarkdownRenderer } from './MarkdownRenderer';
import { AutoFitViewbox } from './AutoFitViewbox';

interface CardFlipperProps {
  cardNode: NodeData;
  isFlipped: boolean;
  onFlip: () => void;
  onEdit?: (cardNode: NodeData) => void;
  onDelete?: (nodeId: string) => void;
}

export const CardFlipper: React.FC<CardFlipperProps> = ({
  cardNode,
  isFlipped,
  onFlip,
  onEdit,
  onDelete,
}) => {
  const card = cardNode.card;
  const [speaking, setSpeaking] = useState(false);

  if (!card) return null;

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const textToSpeak = isFlipped ? card.back : card.front;
    const cleanText = textToSpeak.replace(/[#*`$_~]/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="w-full max-w-2xl mx-auto perspective-1000 my-4 select-none">
      <motion.div
        className="w-full min-h-[380px] cursor-pointer relative rounded-2xl transition-all duration-500 shadow-2xl overflow-hidden"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateX: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        onClick={onFlip}
      >
        {!isFlipped ? (
          /* FRONT SIDE */
          <div className="absolute inset-0 w-full h-full rounded-2xl p-8 bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-950 border border-indigo-500/20 backdrop-blur-xl flex flex-col justify-between shadow-indigo-950/50 shadow-xl">
            {/* Header Metadata */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  QUESTION
                </span>
                <span className="text-xs text-slate-400">Card #{card.id.slice(-4)}</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleSpeak}
                  title="Read Front Aloud"
                  className={`p-2 rounded-lg hover:bg-slate-800/60 transition-colors ${
                    speaking ? 'text-indigo-400 animate-pulse' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Volume2 size={18} />
                </button>
                {onEdit && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(cardNode);
                    }}
                    title="Edit Card"
                    className="p-2 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800/60 transition-colors"
                  >
                    <Edit3 size={18} />
                  </button>
                )}
                {onDelete && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(cardNode.id);
                    }}
                    title="Delete Card"
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>

            {/* Front Content */}
            <div className="flex-1 flex items-center justify-center py-4">
              <AutoFitViewbox maxHeight={260} maxWidth={450}>
                <MarkdownRenderer content={card.front} className="text-center" />
              </AutoFitViewbox>
            </div>

            {/* Footer Hint */}
            <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-800/60 pt-3 mt-4">
              <span className="flex items-center space-x-1.5">
                <RotateCcw size={14} className="text-indigo-400" />
                <span>Click or Press <kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded font-mono">Space</kbd> to flip</span>
              </span>
              <span className="bg-slate-800/60 px-2 py-0.5 rounded text-slate-400 font-mono">
                Weight: {card.weight.toFixed(1)}
              </span>
            </div>
          </div>
        ) : (
          /* BACK SIDE */
          <div
            style={{ transform: 'rotateX(180deg)' }}
            className="absolute inset-0 w-full h-full rounded-2xl p-8 bg-gradient-to-br from-slate-950 via-purple-950/40 to-slate-900 border border-purple-500/30 backdrop-blur-xl flex flex-col justify-between shadow-purple-950/50 shadow-xl"
          >
            {/* Header Metadata */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  ANSWER
                </span>
                <span className="text-xs text-slate-400">Card #{card.id.slice(-4)}</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleSpeak}
                  title="Read Answer Aloud"
                  className={`p-2 rounded-lg hover:bg-slate-800/60 transition-colors ${
                    speaking ? 'text-purple-400 animate-pulse' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Volume2 size={18} />
                </button>
                {onEdit && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(cardNode);
                    }}
                    title="Edit Card"
                    className="p-2 rounded-lg text-slate-400 hover:text-purple-400 hover:bg-slate-800/60 transition-colors"
                  >
                    <Edit3 size={18} />
                  </button>
                )}
              </div>
            </div>

            {/* Back Content */}
            <div className="flex-1 flex items-center justify-center py-4">
              <AutoFitViewbox maxHeight={260} maxWidth={450}>
                <MarkdownRenderer content={card.back} />
              </AutoFitViewbox>
            </div>

            {/* Footer Stats */}
            <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-800/60 pt-3 mt-4">
              <span className="flex items-center space-x-1.5 text-purple-400">
                <Eye size={14} />
                <span>Answer Revealed</span>
              </span>
              <span className="bg-purple-950/50 px-2 py-0.5 rounded text-purple-300 font-mono">
                Ease: {card.easeFactor ? card.easeFactor.toFixed(2) : '2.50'}
              </span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
