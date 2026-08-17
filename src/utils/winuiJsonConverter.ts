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
}

export interface LibraryTreeJson {
  Contents: (WinUIDividerJson | WinUICardJson)[];
}

export interface WinUISyncMetadataJson {
  Hash: string;
  ModifiedAt: string;
}

/**
 * Converts internal NodeData[] structure into 1:1 WinUI C# LibraryTree JSON format ({ "Contents": [...] }).
 * Matches C# JsonSerializer output 1:1 without extra properties so dirtyHash === localHash === remoteHash.
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
        Weight: typeof node.card.weight === 'number' ? Math.round(node.card.weight * 10) / 10 : 20.0,
      };
    }

    if (node.type === 'divider') {
      const childrenNodes = nodes.filter((n) => n.parentId === nodeId);
      const mappedChildren = childrenNodes
        .map((child) => convertNode(child.id))
        .filter((child): child is WinUIDividerJson | WinUICardJson => child !== null);

      return {
        $type: 'Divider',
        Name: node.name || 'Divider',
        Children: mappedChildren,
      };
    }

    return null;
  };

  const exportedTree = rootNodes
    .map((root) => convertNode(root.id))
    .filter((x): x is WinUIDividerJson | WinUICardJson => x !== null);

  // If exporting a single divider, export as raw array; if full library sync, wrap in 1:1 WinUI LibraryTree schema
  if (targetDividerId) {
    return JSON.stringify(exportedTree, null, 2);
  }

  // 1:1 exact WinUI LibraryTree JSON schema output matching C# JsonSerializer.Serialize
  return JSON.stringify({ Contents: exportedTree }, null, 2);
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
 * Calculates SHA-256 hash string for sync.json metadata 1:1 matching WinUI C# SyncMetadataService
 */
export async function calculateJsonHash(jsonStr: string): Promise<string> {
  // Normalize line endings (\r\n -> \n) for deterministic SHA-256 computation
  const normalizedStr = jsonStr.replace(/\r\n/g, '\n');
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(normalizedStr);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('').toUpperCase();
  }
  return Date.now().toString(16).toUpperCase();
}
