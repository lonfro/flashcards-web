import { XamlCardEditor } from './XamlCardEditor';

interface XamlCardAddControlProps {
  dividerPath: string;
  onAddCard: (front: string, back: string) => void;
  onDone: () => void;
}

export function XamlCardAddControl({ dividerPath, onAddCard, onDone }: XamlCardAddControlProps) {
  return <XamlCardEditor dividerPath={dividerPath} onSave={onAddCard} onDone={onDone} />;
}
