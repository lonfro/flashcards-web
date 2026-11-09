'use client';

import { useEffect, useRef, useState } from 'react';
import { FolderOpen } from 'lucide-react';
import { Button, Textarea } from '@fluentui/react-components';
import { MarkdownAnswerEditor } from './MarkdownAnswerEditor';

interface CardEditorProps {
  dividerPath: string;
  initialFront?: string;
  initialBack?: string;
  onSave: (front: string, back: string) => void;
  onDone?: () => void;
}

export function XamlCardEditor({
  dividerPath,
  initialFront = '',
  initialBack = '',
  onSave,
  onDone,
}: CardEditorProps) {
  const [front, setFront] = useState(initialFront);
  const [back, setBack] = useState(initialBack);
  const frontRef = useRef<HTMLTextAreaElement>(null);
  const backRef = useRef<HTMLTextAreaElement>(null);
  const adding = !!onDone;

  useEffect(() => {
    const input = frontRef.current;
    if (!input) return;
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  }, []);

  function add() {
    if (front.trim() || back.trim()) {
      onSave(front, back);
      setFront('');
      setBack('');
    }
    frontRef.current?.focus();
  }

  function done() {
    if (onDone) {
      add();
      onDone();
    } else {
      onSave(front, back);
    }
  }

  return (
    <section
      aria-label={adding ? 'Add cards' : 'Edit card'}
      className="winui-editor-pane"
      onKeyDown={(event) => {
        if (event.key === 'Escape' && !event.defaultPrevented && !event.nativeEvent.isComposing) {
          event.preventDefault();
          done();
        }
      }}
    >
      <div className="winui-editor">
        <Textarea
          ref={frontRef}
          aria-label="Front (Question / Prompt)"
          className="winui-editor-front"
          rows={1}
          value={front}
          onChange={(_, data) => setFront(data.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.nativeEvent.isComposing) {
              event.preventDefault();
              backRef.current?.focus();
            }
          }}
        />
        <MarkdownAnswerEditor
          textareaRef={backRef}
          value={back}
          onChange={setBack}
          onKeyDown={(event) => {
            if (adding && event.key === 'Tab' && !event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey) {
              event.preventDefault();
              add();
            }
          }}
        />
        <div className="winui-editor-footer">
          <div className="winui-editor-path" title={dividerPath}>
            <FolderOpen size={18} strokeWidth={1.5} aria-hidden="true" />
            {dividerPath && <span>{dividerPath}</span>}
          </div>
          <div className="winui-editor-actions">
            {adding && (
              <Button type="button" className="winui-button" onClick={add}>
                Add <span>(Tab)</span>
              </Button>
            )}
            <Button type="button" className="winui-button" onClick={done}>
              Done <span>(Esc)</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
