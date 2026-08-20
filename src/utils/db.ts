import { openDB, IDBPDatabase } from 'idb';
import { NodeData } from '../types/flashcard';

const DB_NAME = 'flashcards_web';
const DB_VERSION = 1;

export interface FlashcardsDB {
  nodes: {
    key: string; // NodeData.id
    value: NodeData;
    indexes: { 'by-parent': string | null; 'by-type': string };
  };
  meta: {
    key: string; // e.g. 'localHash', 'localModifiedAt'
    value: string;
  };
}

let dbPromise: Promise<IDBPDatabase<FlashcardsDB>> | null = null;

export function getDB(): Promise<IDBPDatabase<FlashcardsDB>> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('IndexedDB is only available in browser environments'));
  }

  if (!dbPromise) {
    dbPromise = openDB<FlashcardsDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('nodes')) {
          const store = db.createObjectStore('nodes', { keyPath: 'id' });
          store.createIndex('by-parent', 'parentId');
          store.createIndex('by-type', 'type');
        }
        if (!db.objectStoreNames.contains('meta')) {
          db.createObjectStore('meta');
        }
      },
    });
  }
  return dbPromise;
}

/**
 * Read all nodes as a flat array
 */
export async function idbGetNodes(): Promise<NodeData[]> {
  if (typeof window === 'undefined') return [];
  try {
    const db = await getDB();
    return await db.getAll('nodes');
  } catch (error) {
    console.error('Failed to get nodes from IndexedDB:', error);
    return [];
  }
}

/**
 * Write the full node array atomically in one transaction
 */
export async function idbSaveNodes(nodes: NodeData[]): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    const db = await getDB();
    const tx = db.transaction('nodes', 'readwrite');
    await tx.store.clear();
    for (const node of nodes) {
      await tx.store.put(node);
    }
    await tx.done;
  } catch (error) {
    console.error('Failed to save nodes to IndexedDB:', error);
    throw error;
  }
}

/**
 * Upsert a single node
 */
export async function idbPutNode(node: NodeData): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    const db = await getDB();
    await db.put('nodes', node);
  } catch (error) {
    console.error('Failed to put node to IndexedDB:', error);
    throw error;
  }
}

/**
 * Delete a node and all its descendants in a single transaction
 */
export async function idbDeleteNode(id: string): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    const db = await getDB();
    const all = await db.getAll('nodes');
    const toDelete = new Set<string>();

    const collect = (nodeId: string) => {
      toDelete.add(nodeId);
      all.filter((n) => n.parentId === nodeId).forEach((c) => collect(c.id));
    };
    collect(id);

    const tx = db.transaction('nodes', 'readwrite');
    for (const nodeId of toDelete) {
      await tx.store.delete(nodeId);
    }
    await tx.done;
  } catch (error) {
    console.error('Failed to delete node from IndexedDB:', error);
    throw error;
  }
}

/**
 * Read metadata value by key
 */
export async function idbGetMeta(key: string): Promise<string | undefined> {
  if (typeof window === 'undefined') return undefined;
  try {
    const db = await getDB();
    return await db.get('meta', key);
  } catch (error) {
    console.error(`Failed to get metadata [${key}] from IndexedDB:`, error);
    return undefined;
  }
}

/**
 * Set metadata key/value
 */
export async function idbSetMeta(key: string, value: string): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    const db = await getDB();
    await db.put('meta', value, key);
  } catch (error) {
    console.error(`Failed to set metadata [${key}] in IndexedDB:`, error);
  }
}
