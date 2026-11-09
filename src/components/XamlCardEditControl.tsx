import { NodeData } from '../types/flashcard';
import { XamlCardEditor } from './XamlCardEditor';

interface XamlCardEditControlProps {
  dividerPath: string;
  cardNode: NodeData | null;
  onSave: (front: string, back: string) => void;
}

export function XamlCardEditControl({ cardNode, dividerPath, onSave }: XamlCardEditControlProps) {
  if (!cardNode?.card) return <div className="winui-empty-state">No card selected</div>;

  return (
    <XamlCardEditor
      key={cardNode.id}
      dividerPath={dividerPath}
      initialFront={cardNode.card.front}
      initialBack={cardNode.card.back}
      onSave={onSave}
    />
  );
}
