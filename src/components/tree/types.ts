import { CardSettingsData } from '../../types/cardSettings';
import { NodeData } from '../../types/flashcard';

export interface TreeNode extends NodeData {
  childrenNodes: TreeNode[];
  cardCount: number;
  totalWeight: number;
}

export interface XamlTreeViewProps {
  nodes: NodeData[];
  selectedNodeId: string | null;
  width: number;
  cardSettings: CardSettingsData;
  onSelectNode: (node: NodeData) => void;
  onAddCard: (parentId: string | null) => void;
  onAddDivider: (parentId: string | null) => void;
  onReviseDivider: (node: NodeData | null) => void;
  onEditCard: (node: NodeData) => void;
  onRenameNode: (node: NodeData, newName: string) => void;
  onDeleteNode: (nodeId: string) => void;
  onResetWeights: (nodeId: string | null, recursive?: boolean) => void;
  onToggleProgress: (nodeId: string) => void;
  onExportDivider: (dividerId: string) => void;
  onImportDivider: (e: React.ChangeEvent<HTMLInputElement>, targetParentId: string | null, mode: 'divider' | 'contents') => void;
  onMoveNode: (draggedNodeId: string, targetNodeId: string | null, dropPosition?: 'before' | 'after' | 'into') => void;
  onSortNodes: (recursive: boolean, parentId?: string | null) => void;
}
