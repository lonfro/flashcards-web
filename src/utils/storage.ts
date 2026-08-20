import { NodeData, CardData, DividerData } from '../types/flashcard';

const STORAGE_KEY = 'flashcards_web_nodes_v1';

export const INITIAL_SAMPLE_NODES: NodeData[] = [
  // Folder: C# & .NET 10 Development
  {
    id: 'folder-csharp',
    name: 'C# & .NET 10 Fundamentals',
    type: 'divider',
    parentId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    divider: {
      id: 'div-csharp',
      nodeId: 'folder-csharp',
      description: 'Core concepts in modern C# 14, .NET 10, and WinUI / Blazor',
      color: 'purple',
      icon: 'code',
    },
  },
  {
    id: 'card-csharp-1',
    name: 'What is Native AOT in .NET 10?',
    type: 'card',
    parentId: 'folder-csharp',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    card: {
      id: 'c-1',
      nodeId: 'card-csharp-1',
      front: '### What is Native AOT in .NET 10?\nHow does it differ from traditional JIT compilation?',
      back: '### Native Ahead-Of-Time (AOT)\nNative AOT compiles C# code directly into self-contained machine code at build time, bypassing the JIT compiler.\n\n**Benefits:**\n- 🚀 **Instant Startup Time** (No JIT warm-up)\n- 📉 **Lower Memory Footprint**\n- 📦 **No .NET Runtime Dependency required** on target machine\n\n*Configured in `.csproj` via `<PublishAot>true</PublishAot>`.*',
      weight: 1.0,
      easeFactor: 2.5,
      interval: 1,
      reviewCount: 0,
    },
  },
  {
    id: 'card-csharp-2',
    name: 'MVVM Pattern in WinUI & WPF',
    type: 'card',
    parentId: 'folder-csharp',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    card: {
      id: 'c-2',
      nodeId: 'card-csharp-2',
      front: '### MVVM Pattern\nWhat are the 3 main layers of the **Model-View-ViewModel** architecture?',
      back: '### 1. Model\nRepresents domain data and business logic (e.g. `Card.cs`, `Divider.cs`).\n\n### 2. View\nRepresents the UI layer (XAML, HTML, React JSX).\n\n### 3. ViewModel\nActs as a binder between Model and View. Exposes data properties and `IRelayCommand` handlers.\n\n```csharp\n[ObservableProperty]\npublic partial string Title { get; set; }\n```',
      weight: 1.0,
      easeFactor: 2.5,
      interval: 1,
      reviewCount: 0,
    },
  },

  // Folder: Data Structures & Algorithms
  {
    id: 'folder-dsa',
    name: 'Data Structures & Algorithms',
    type: 'divider',
    parentId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    divider: {
      id: 'div-dsa',
      nodeId: 'folder-dsa',
      description: 'Essential computer science patterns and complexity bounds',
      color: 'blue',
      icon: 'layers',
    },
  },
  {
    id: 'card-dsa-1',
    name: 'Binary Search Time & Space Complexity',
    type: 'card',
    parentId: 'folder-dsa',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    card: {
      id: 'c-dsa-1',
      nodeId: 'card-dsa-1',
      front: '### Binary Search Complexity\nWhat is the Time and Space complexity of Binary Search on a sorted array of length $N$?',
      back: '### Complexity Analysis\n- **Time Complexity:** $\\mathcal{O}(\\log N)$\n- **Space Complexity:** $\\mathcal{O}(1)$ iterative or $\\mathcal{O}(\\log N)$ recursive stack\n\n```typescript\nfunction binarySearch(arr: number[], target: number): number {\n  let left = 0, right = arr.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}\n```',
      weight: 1.0,
      easeFactor: 2.5,
      interval: 1,
      reviewCount: 0,
    },
  },
  {
    id: 'card-dsa-2',
    name: 'SuperMemo SM-2 Algorithm',
    type: 'card',
    parentId: 'folder-dsa',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    card: {
      id: 'c-dsa-2',
      nodeId: 'card-dsa-2',
      front: '### Spaced Repetition (SM-2)\nWhat is the formula used to update the **Ease Factor ($EF$)** after a review?',
      back: '### SM-2 Ease Factor Formula\n$$EF\' = EF + (0.1 - (5 - q) \\times (0.08 + (5 - q) \\times 0.02))$$\n\nwhere:\n- $EF$ is the previous ease factor (default 2.5)\n- $q$ is the quality grade of response ($0$ to $5$)\n- Minimum $EF$ threshold is $1.3$',
      weight: 1.0,
      easeFactor: 2.5,
      interval: 1,
      reviewCount: 0,
    },
  },

  // Folder: Web Development & Next.js
  {
    id: 'folder-web',
    name: 'Next.js & Modern Web Architecture',
    type: 'divider',
    parentId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    divider: {
      id: 'div-web',
      nodeId: 'folder-web',
      description: 'React Server Components, Next.js App Router, and Bun',
      color: 'emerald',
      icon: 'globe',
    },
  },
  {
    id: 'card-web-1',
    name: 'React Server Components vs Client Components',
    type: 'card',
    parentId: 'folder-web',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    card: {
      id: 'c-web-1',
      nodeId: 'card-web-1',
      front: '### RSC vs Client Components\nWhen should you use `"use client"` in Next.js App Router?',
      back: '### Use `"use client"` when you need:\n- ⚡ **Event Listeners** (`onClick`, `onChange`, `onKeyDown`)\n- 🔄 **React Hooks** (`useState`, `useEffect`, `useRef`)\n- 🌐 **Browser APIs** (`localStorage`, `window`, `navigator`)\n\n*Server Components remain the default for zero-bundle-size rendering and data fetching.*',
      weight: 1.0,
      easeFactor: 2.5,
      interval: 1,
      reviewCount: 0,
    },
  },
];

export { idbGetNodes as getStoredNodes, idbSaveNodes as saveStoredNodes } from './db';

export async function resetToSampleNodes(): Promise<NodeData[]> {
  const { idbSaveNodes } = await import('./db');
  await idbSaveNodes(INITIAL_SAMPLE_NODES);
  return INITIAL_SAMPLE_NODES;
}

// Tree helpers
export interface TreeNode extends NodeData {
  childrenNodes: TreeNode[];
  cardCount: number;
}

export function buildTree(nodes: NodeData[], parentId: string | null = null): TreeNode[] {
  return nodes
    .filter((n) => n.parentId === parentId)
    .map((n) => {
      const childrenNodes = buildTree(nodes, n.id);
      const childCardCount = childrenNodes.reduce((sum, child) => sum + child.cardCount, 0);
      const cardCount = (n.type === 'card' ? 1 : 0) + childCardCount;
      return {
        ...n,
        childrenNodes,
        cardCount,
      };
    });
}

export function getAllCardsInDeck(nodes: NodeData[], deckNodeId: string | null): NodeData[] {
  if (!deckNodeId) {
    return nodes.filter((n) => n.type === 'card' && !!n.card);
  }

  const result: NodeData[] = [];

  function collect(currentId: string) {
    const current = nodes.find((n) => n.id === currentId);
    if (!current) return;

    if (current.type === 'card') {
      result.push(current);
    } else {
      const children = nodes.filter((n) => n.parentId === currentId);
      children.forEach((child) => collect(child.id));
    }
  }

  collect(deckNodeId);
  return result;
}
