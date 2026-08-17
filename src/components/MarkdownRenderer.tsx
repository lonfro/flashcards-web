'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  return (
    <div className={`prose prose-invert max-w-none text-slate-100 ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          code({ className, children, ...props }) {
            const isInline = !className;
            return isInline ? (
              <code
                className="bg-indigo-950/70 text-indigo-300 px-1.5 py-0.5 rounded text-sm font-mono border border-indigo-800/40"
                {...props}
              >
                {children}
              </code>
            ) : (
              <pre className="bg-slate-950/90 text-slate-200 p-4 rounded-xl text-sm font-mono border border-slate-800 overflow-x-auto my-3 shadow-inner">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            );
          },
          h1: ({ children }) => <h1 className="text-2xl font-bold text-indigo-200 mb-3 border-b border-indigo-900/40 pb-1">{children}</h1>,
          h2: ({ children }) => <h2 className="text-xl font-semibold text-purple-200 mb-2 mt-4">{children}</h2>,
          h3: ({ children }) => <h3 className="text-lg font-medium text-slate-200 mb-2 mt-3">{children}</h3>,
          p: ({ children }) => <p className="mb-3 leading-relaxed text-slate-300">{children}</p>,
          ul: ({ children }) => <ul className="list-disc list-inside space-y-1.5 mb-3 text-slate-300">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside space-y-1.5 mb-3 text-slate-300">{children}</ol>,
          li: ({ children }) => <li className="text-slate-300">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-indigo-500 pl-4 italic text-slate-400 my-3 bg-indigo-950/20 py-2 rounded-r-lg">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-4 rounded-lg border border-slate-800">
              <table className="min-w-full divide-y divide-slate-800 text-sm text-left">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-slate-900/80 text-slate-300 uppercase font-semibold text-xs">{children}</thead>,
          tbody: ({ children }) => <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">{children}</tbody>,
          tr: ({ children }) => <tr className="hover:bg-slate-900/40 transition-colors">{children}</tr>,
          th: ({ children }) => <th className="px-4 py-2.5">{children}</th>,
          td: ({ children }) => <td className="px-4 py-2.5 text-slate-300">{children}</td>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
