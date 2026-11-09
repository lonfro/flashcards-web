import { NodeData } from '../types/flashcard';

interface WinUICardJson {
  $type: 'Card';
  Front: string;
  HideUntil: string;
  Back: string;
  Weight: number;
}

interface WinUIDividerJson {
  $type?: 'Divider';
  Name: string;
  Children: WinUINodeJson[];
  IsProgressShown: boolean;
  IsExpanded: boolean;
}

type WinUINodeJson = WinUICardJson | WinUIDividerJson;
type ImportMode = 'auto' | 'divider' | 'contents';

function escapeCSharpJson(json: string): string {
  return json.replace(/("HideUntil":\s*)?("(?:[^"\\]|\\.)*")/g, (token, datePrefix, stringToken) => {
    if (datePrefix) return token; // DateTimeOffset is written directly by System.Text.Json.
    return stringToken.replace(/\\["\\]|[\u007f-\uffff'<>&+`]/g, (character: string) => {
      if (character === '\\\\') return character;
      const code = character === '\\"' ? 34 : character.charCodeAt(0);
      return '\\u' + code.toString(16).padStart(4, '0').toUpperCase();
    });
  });
}

function formatHideUntil(value?: string): string {
  return (value ?? '1970-01-01T00:00:00Z')
    .replace(/(\.\d*?[1-9])0+(?=Z|[+-]\d\d:\d\d$)|\.0+(?=Z|[+-]\d\d:\d\d$)/, '$1')
    .replace(/Z$/, '+00:00');
}

/** A library and an exported deck are both serialized as a concrete Divider. */
export function exportToWinUIJson(
  nodes: NodeData[],
  targetDividerId: string | null = null,
  pretty = true
): string {
  const childrenByParent = new Map<string | null, NodeData[]>();
  for (const node of nodes) {
    const parent = node.parentId === 'root' ? null : node.parentId;
    const siblings = childrenByParent.get(parent) ?? [];
    siblings.push(node);
    childrenByParent.set(parent, siblings);
  }

  function children(parent: string | null): WinUINodeJson[] {
    return (childrenByParent.get(parent) ?? []).flatMap<WinUINodeJson>((node) => {
      if (node.type === 'divider') return [{ $type: 'Divider', ...divider(node) }];
      if (!node.card) return [];
      return [{
        $type: 'Card',
        Front: node.card.front,
        HideUntil: formatHideUntil(node.card.hideUntil),
        Back: node.card.back,
        Weight: node.card.weight,
      }];
    });
  }

  function divider(node?: NodeData): WinUIDividerJson {
    return {
      Name: node?.name ?? 'Root',
      Children: children(node?.id ?? null),
      IsProgressShown: node?.divider?.isProgressShown ?? false,
      IsExpanded: node?.divider?.isExpanded ?? false,
    };
  }

  const target = targetDividerId ? nodes.find((node) => node.id === targetDividerId && node.type === 'divider') : undefined;
  return escapeCSharpJson(JSON.stringify(divider(target), null, pretty ? 2 : undefined));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Reads current Windows dividers, legacy library wrappers and array exports. */
export function importFromWinUIJson(
  jsonData: unknown,
  existingNodes: NodeData[] = [],
  targetParentId: string | null = null,
  replaceMode = false,
  mode: ImportMode = 'auto'
): NodeData[] {
  const parsed: unknown = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
  const newNodes = replaceMode ? [] : [...existingNodes];
  const timestamp = new Date().toISOString();

  function processItem(item: unknown, parentId: string | null) {
    if (!isRecord(item)) throw new Error('Invalid library item');
    const { Front, Back, Weight, HideUntil, Name, Children, IsProgressShown, IsExpanded } = item;
    const isCard = item.$type === 'Card' || (typeof Front === 'string' && typeof Back === 'string');
    const id = crypto.randomUUID();

    if (isCard && typeof Front === 'string' && typeof Back === 'string') {
      if (HideUntil != null && (typeof HideUntil !== 'string' || !Number.isFinite(Date.parse(HideUntil)))) {
        throw new Error('Invalid card review date');
      }
      newNodes.push({
        id,
        name: Front.slice(0, 35).replace(/[#*`]/g, '') || 'Imported Card',
        type: 'card',
        parentId,
        createdAt: timestamp,
        updatedAt: timestamp,
        card: {
          id: crypto.randomUUID(),
          nodeId: id,
          front: Front,
          back: Back,
          weight: typeof Weight === 'number' && Number.isFinite(Weight) ? Weight : 20,
          hideUntil: typeof HideUntil === 'string' ? HideUntil : undefined,
          easeFactor: 2.5,
          interval: 1,
          reviewCount: 0,
        },
      });
    } else if (Array.isArray(Children) && typeof Name === 'string') {
      newNodes.push({
        id,
        name: Name,
        type: 'divider',
        parentId,
        createdAt: timestamp,
        updatedAt: timestamp,
        divider: {
          id: crypto.randomUUID(),
          nodeId: id,
          description: '',
          isProgressShown: IsProgressShown === true,
          isExpanded: IsExpanded === true,
        },
      });
      Children.forEach((child) => processItem(child, id));
    } else {
      throw new Error('Invalid library item');
    }
  }

  const wrapper = isRecord(parsed) ? parsed.Contents ?? parsed.contents ?? parsed.Library ?? parsed.library : undefined;
  const unwrapDivider = isRecord(parsed) && (replaceMode || mode === 'contents' ||
    (mode === 'auto' && parsed.Name === 'Root'));
  const payload = wrapper ?? (unwrapDivider ? parsed.Children : parsed);

  if (Array.isArray(payload)) {
    payload.forEach((item) => processItem(item, targetParentId));
  } else if (!unwrapDivider && wrapper === undefined) {
    processItem(payload, targetParentId);
  } else {
    throw new Error('Invalid library contents');
  }
  return newNodes;
}

export async function calculateJsonHash(json: string): Promise<string> {
  const bytes = new TextEncoder().encode(json.replace(/\r\n?/g, '\n'));
  const hash = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, '0')).join('').toUpperCase();
}


export function downloadLibraryJson(json: string, filename: string) {
  const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
