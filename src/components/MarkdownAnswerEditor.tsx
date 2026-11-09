import { useRef } from 'react';

interface MarkdownAnswerEditorProps {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLTextAreaElement>;
}

export function MarkdownAnswerEditor({ textareaRef, value, onChange, onKeyDown }: MarkdownAnswerEditorProps) {
  const selection = useRef<[number, number]>([0, 0]);

  function toggle(marker: '*' | '**') {
    const editor = textareaRef.current;
    if (!editor) return;

    let [start, end] = selection.current;
    while (start < end && /[\s*]/.test(value[end - 1])) end--;
    while (start < end && /[\s*]/.test(value[start])) start++;

    const before = value.slice(0, start);
    const after = value.slice(end);
    const selected = value.slice(start, end);
    const wrapped = before.endsWith(marker) && after.startsWith(marker);
    const left = wrapped ? before.slice(0, -marker.length) : before + marker;
    const right = wrapped ? after.slice(marker.length) : marker + after;
    onChange(left + selected + right);
    requestAnimationFrame(() => {
      editor.focus();
      editor.setSelectionRange(left.length, left.length + selected.length);
      selection.current = [left.length, left.length + selected.length];
    });
  }

  return (
    <div className="space-y-1 flex-1 min-h-0 flex flex-col">
      <div className="flex items-center justify-between gap-2 shrink-0">
        <label htmlFor="card-answer" className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Back (Answer / Markdown / LaTeX)
        </label>
        <div className="flex gap-1" aria-label="Markdown formatting">
          <button type="button" title="Bold (Ctrl+B)" aria-label="Bold" onClick={() => toggle('**')}
            className="px-2 py-1 rounded bg-slate-800 text-xs font-bold text-slate-200">B</button>
          <button type="button" title="Italic (Ctrl+I)" aria-label="Italic" onClick={() => toggle('*')}
            className="px-2 py-1 rounded bg-slate-800 text-xs italic text-slate-200">I</button>
        </div>
      </div>
      <textarea
        id="card-answer"
        ref={textareaRef}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onSelect={(event) => {
          selection.current = [event.currentTarget.selectionStart, event.currentTarget.selectionEnd];
        }}
        onKeyDown={(event) => {
          const key = event.key.toLowerCase();
          if ((event.ctrlKey || event.metaKey) && !event.altKey && (key === 'b' || key === 'i')) {
            event.preventDefault();
            if (!event.repeat) {
              selection.current = [event.currentTarget.selectionStart, event.currentTarget.selectionEnd];
              toggle(key === 'b' ? '**' : '*');
            }
            return;
          }
          onKeyDown?.(event);
        }}
        placeholder="Back answer in Markdown / LaTeX..."
        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 sm:p-4 text-sm sm:text-lg font-mono text-slate-100 focus:outline-none focus:border-indigo-500 resize-none flex-1 min-h-0 overflow-y-auto leading-relaxed"
      />
    </div>
  );
}
