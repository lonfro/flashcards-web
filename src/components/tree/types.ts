import { NodeData } from '../../types/flashcard';

export interface TreeNode extends NodeData {
  childrenNodes: TreeNode[];
  cardCount: number;
}

export interface XamlTreeViewProps {
  nodes: NodeData[];
  selectedNodeId: string | null;
  width: number;
  onSelectNode: (node: NodeData) => void;
  onAddCard: (parentId: string | null) => void;
  onAddDivider: (parentId: string | null) => void;
  onReviseDivider: (node: NodeData | null) => void;
  onEditCard: (node: NodeData) => void;
  onRenameNode: (node: NodeData, newName: string) => void;
  onDeleteNode: (nodeId: string) => void;
  onResetWeights: (nodeId: string, recursive?: boolean) => void;
  onExportDivider: (dividerId: string) => void;
  onImportDivider: (e: React.ChangeEvent<HTMLInputElement>, targetParentId: string | null) => void;
  onMoveNode: (draggedNodeId: string, targetNodeId: string | null, dropPosition?: 'before' | 'after' | 'into') => void;
  onSortNodes: (recursive: boolean) => void;
}
