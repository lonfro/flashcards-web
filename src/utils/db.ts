import { openDB, IDBPDatabase } from 'idb';
import { NodeData } from '../types/flashcard';
import { StudyLogEntry } from '../types/stats';

const DB_NAME = 'flashcards_web';
const DB_VERSION = 2;

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
  study_logs: {
    key: string; // StudyLogEntry.id
    value: StudyLogEntry;
    indexes: { 'by-date': string; 'by-cardId': string; 'by-deckId': string | null };
  };
}

let dbPromise: Promise<IDBPDatabase<FlashcardsDB>> | null = null;

export function getDB(): Promise<IDBPDatabase<FlashcardsDB>> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('IndexedDB is only available in browser environments'));
  }

  if (!dbPromise) {
    dbPromise = openDB<FlashcardsDB>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        if (!db.objectStoreNames.contains('nodes')) {
          const store = db.createObjectStore('nodes', { keyPath: 'id' });
          store.createIndex('by-parent', 'parentId');
          store.createIndex('by-type', 'type');
        }
        if (!db.objectStoreNames.contains('meta')) {
          db.createObjectStore('meta');
        }
        if (!db.objectStoreNames.contains('study_logs')) {
          const logStore = db.createObjectStore('study_logs', { keyPath: 'id' });
          logStore.createIndex('by-date', 'date');
          logStore.createIndex('by-cardId', 'cardId');
          logStore.createIndex('by-deckId', 'deckId');
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

/**
 * Log a study session / card review entry
 */
export async function idbLogReview(entry: StudyLogEntry): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    const db = await getDB();
    await db.put('study_logs', entry);
  } catch (error) {
    console.error('Failed to log review to IndexedDB:', error);
  }
}

/**
 * Retrieve all study logs ordered chronologically (newest first)
 */
export async function idbGetStudyLogs(limit: number = 200): Promise<StudyLogEntry[]> {
  if (typeof window === 'undefined') return [];
  try {
    const db = await getDB();
    const all = await db.getAll('study_logs');
    return all.sort((a, b) => new Date(b.reviewedAt).getTime() - new Date(a.reviewedAt).getTime()).slice(0, limit);
  } catch (error) {
    console.error('Failed to get study logs from IndexedDB:', error);
    return [];
  }
}

/**
 * Put multiple study log entries (batch upsert)
 */
export async function idbSaveStudyLogs(entries: StudyLogEntry[]): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    const db = await getDB();
    const tx = db.transaction('study_logs', 'readwrite');
    for (const entry of entries) {
      await tx.store.put(entry);
    }
    await tx.done;
  } catch (error) {
    console.error('Failed to save study logs to IndexedDB:', error);
  }
}

/**
 * Clear all study log history
 */
export async function idbClearStudyLogs(): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    const db = await getDB();
    await db.clear('study_logs');
  } catch (error) {
    console.error('Failed to clear study logs from IndexedDB:', error);
  }
}
