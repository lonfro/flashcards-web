import { NodeData } from '../types/flashcard';

export interface WinUICardJson {
  $type: 'Card';
  Front: string;
  Back: string;
  Weight: number;
}

export interface WinUIDividerJson {
  $type: 'Divider';
  Name: string;
  Children: (WinUIDividerJson | WinUICardJson)[];
  TotalChildren?: number;
  IsExpanded?: boolean;
}

export interface LibraryTreeJson {
  Contents: (WinUIDividerJson | WinUICardJson)[];
  contents?: (WinUIDividerJson | WinUICardJson)[];
  Library?: (WinUIDividerJson | WinUICardJson)[];
}

export interface WinUISyncMetadataJson {
  Hash: string;
  ModifiedAt: string;
}

/**
 * Converts internal NodeData[] structure into 1:1 WinUI C# LibraryTree JSON format ({ "Contents": [...] }).
 * Includes both PascalCase and camelCase properties for 100% C# System.Text.Json compatibility.
 */
export function exportToWinUIJson(nodes: NodeData[], targetDividerId?: string | null): string {
  const rootNodes = targetDividerId
    ? nodes.filter((n) => n.id === targetDividerId)
    : nodes.filter((n) => !n.parentId || n.parentId === 'root');

  const convertNode = (nodeId: string): WinUIDividerJson | WinUICardJson | null => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return null;

    if (node.type === 'card' && node.card) {
      return {
        $type: 'Card',
        Front: node.card.front || '',
        Back: node.card.back || '',
        Weight: typeof node.card.weight === 'number' ? node.card.weight : 20.0,
      };
    }

    if (node.type === 'divider') {
      const childrenNodes = nodes.filter((n) => n.parentId === nodeId);
      const mappedChildren = childrenNodes
        .map((child) => convertNode(child.id))
        .filter((child): child is WinUIDividerJson | WinUICardJson => child !== null);

      const countCards = (items: (WinUIDividerJson | WinUICardJson)[]): number => {
        let count = 0;
        for (const item of items) {
          if (item.$type === 'Card') count += 1;
          else if (item.$type === 'Divider' && item.Children) {
            count += countCards(item.Children);
          }
        }
        return count;
      };

      return {
        $type: 'Divider',
        Name: node.name || 'Divider',
        Children: mappedChildren,
        TotalChildren: countCards(mappedChildren),
        IsExpanded: false,
      };
    }

    return null;
  };

  const exportedTree = rootNodes
    .map((root) => convertNode(root.id))
    .filter((x): x is WinUIDividerJson | WinUICardJson => x !== null);

  // If exporting a single divider, export as raw array; if full library sync, wrap in LibraryTree schema
  if (targetDividerId) {
    return JSON.stringify(exportedTree, null, 2);
  }

  // Wrap in both "Contents", "contents", and "Library" for 100% C# System.Text.Json deserialization compatibility
  return JSON.stringify(
    {
      Contents: exportedTree,
      contents: exportedTree,
      Library: exportedTree,
    },
    null,
    2
  );
}

/**
 * Imports 1:1 WinUI C# JSON format into internal NodeData[] structure.
 * Supports LibraryTree ({ "Contents": [...] }), legacy SyncFile ({ "Library": [...] }), raw array [...], or single object.
 */
export function importFromWinUIJson(
  jsonData: any,
  existingNodes: NodeData[] = [],
  targetParentId: string | null = null,
  replaceMode: boolean = false
): NodeData[] {
  const newNodes: NodeData[] = replaceMode ? [] : [...existingNodes];

  const processItem = (item: any, parentId: string | null) => {
    if (!item) return;

    const isCard = item.$type === 'Card' || (item.Front !== undefined && item.Back !== undefined);
    const isDivider = item.$type === 'Divider' || Array.isArray(item.Children);

    if (isCard) {
      const nodeId = `node-card-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      newNodes.push({
        id: nodeId,
        name: item.Front ? item.Front.slice(0, 35).replace(/[#*`]/g, '') : 'Imported Card',
        type: 'card',
        parentId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        card: {
          id: `card-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          nodeId,
          front: item.Front || '',
          back: item.Back || '',
          weight: typeof item.Weight === 'number' ? item.Weight : 20.0,
          easeFactor: 2.5,
          interval: 1,
          reviewCount: 0,
        },
      });
    } else if (isDivider) {
      const nodeId = `node-deck-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      newNodes.push({
        id: nodeId,
        name: item.Name || 'Imported Divider',
        type: 'divider',
        parentId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        divider: {
          id: `div-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          nodeId,
          description: '',
        },
      });

      if (Array.isArray(item.Children)) {
        item.Children.forEach((child: any) => processItem(child, nodeId));
      }
    }
  };

  const payload =
    jsonData?.Contents ||
    jsonData?.contents ||
    jsonData?.Library ||
    jsonData?.library ||
    jsonData;

  if (Array.isArray(payload)) {
    payload.forEach((item) => processItem(item, targetParentId));
  } else if (typeof payload === 'object') {
    processItem(payload, targetParentId);
  }

  return newNodes;
}

/**
 * Calculates simple SHA-256 hash string for sync.json metadata matching WinUI C# SyncMetadataService
 */
export async function calculateJsonHash(jsonStr: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(jsonStr);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('').toUpperCase();
  }
  return Date.now().toString(16).toUpperCase();
}
