import { idbSaveNodes, idbGetNodes } from './db';
import { INITIAL_SAMPLE_NODES } from './storage';

const LEGACY_LS_KEY = 'flashcards_web_nodes_v1';
const MIGRATION_DONE_KEY = 'flashcards_web_idb_migrated_v1';

export async function migrateLocalStorageToIDB(): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    // Check if migration has already been executed
    if (localStorage.getItem(MIGRATION_DONE_KEY) === 'true') {
      return;
    }

    // Check if IDB already has existing data
    const existingIDB = await idbGetNodes();
    if (existingIDB && existingIDB.length > 0) {
      localStorage.setItem(MIGRATION_DONE_KEY, 'true');
      return;
    }

    // Try reading legacy data from localStorage
    const raw = localStorage.getItem(LEGACY_LS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        await idbSaveNodes(parsed);
        localStorage.setItem(MIGRATION_DONE_KEY, 'true');
        console.log(`[IDB Migration] Successfully migrated ${parsed.length} nodes from localStorage to IndexedDB.`);
        return;
      }
    }

    // Default to sample nodes if neither IDB nor localStorage had nodes
    await idbSaveNodes(INITIAL_SAMPLE_NODES);
    localStorage.setItem(MIGRATION_DONE_KEY, 'true');
    console.log('[IDB Migration] Initialized IndexedDB with sample nodes.');
  } catch (err) {
    console.error('[IDB Migration] Error during migration:', err);
  }
}
