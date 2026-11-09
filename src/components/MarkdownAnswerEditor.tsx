import { useRef, useState } from 'react';
import { MenuItem, Textarea } from '@fluentui/react-components';
import { Bold, Italic } from 'lucide-react';
import { WinUIFlyout, type FlyoutAnchor } from './WinUIFlyout';

interface MarkdownAnswerEditorProps {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLTextAreaElement>;
}

export function MarkdownAnswerEditor({ textareaRef, value, onChange, onKeyDown }: MarkdownAnswerEditorProps) {
  const selection = useRef<[number, number]>([0, 0]);
  const [anchor, setAnchor] = useState<FlyoutAnchor | null>(null);

  function openMenu(editor: HTMLTextAreaElement, x: number, y: number) {
    selection.current = [editor.selectionStart, editor.selectionEnd];
    setAnchor({ x, y, source: editor });
  }

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
    <>
      <Textarea
        ref={textareaRef}
        aria-label="Back (Answer / Markdown / LaTeX)"
        className="winui-editor-answer"
        value={value}
        onChange={(_, data) => onChange(data.value)}
        onContextMenu={(event) => {
          event.preventDefault();
          const editor = textareaRef.current;
          if (editor) openMenu(editor, event.clientX, event.clientY);
        }}
        onKeyDown={(event) => {
          if (event.nativeEvent.isComposing) return;
          const editor = textareaRef.current;
          const key = event.key.toLowerCase();
          if (editor && (key === 'contextmenu' || (key === 'f10' && event.shiftKey))) {
            event.preventDefault();
            const { left, top } = editor.getBoundingClientRect();
            openMenu(editor, left + 12, top + 24);
            return;
          }
          if (editor && (event.ctrlKey || event.metaKey) && !event.altKey && (key === 'b' || key === 'i')) {
            event.preventDefault();
            if (!event.repeat) {
              selection.current = [editor.selectionStart, editor.selectionEnd];
              toggle(key === 'b' ? '**' : '*');
            }
            return;
          }
          onKeyDown?.(event);
        }}
      />
      {anchor && (
        <WinUIFlyout anchor={anchor} label="Markdown formatting" onClose={() => setAnchor(null)}>
          <MenuItem icon={<Bold />} onClick={() => toggle('**')}>Bold</MenuItem>
          <MenuItem icon={<Italic />} onClick={() => toggle('*')}>Italic</MenuItem>
        </WinUIFlyout>
      )}
    </>
  );
}
