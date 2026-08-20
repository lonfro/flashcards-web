'use client';

import { useState, useEffect, useCallback } from 'react';
import { NodeData } from '../types/flashcard';
import { idbGetNodes, idbSaveNodes } from '../utils/db';
import { migrateLocalStorageToIDB } from '../utils/dbMigration';

export interface UseNodesResult {
  nodes: NodeData[];
  isLoading: boolean;
  saveNodes: (nodes: NodeData[]) => Promise<void>;
  setNodes: React.Dispatch<React.SetStateAction<NodeData[]>>;
}

export function useNodes(): UseNodesResult {
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        await migrateLocalStorageToIDB();
        const loaded = await idbGetNodes();
        if (isMounted) {
          setNodes(loaded);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Failed to load nodes in useNodes hook:', err);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const saveNodes = useCallback(async (newNodes: NodeData[]) => {
    setNodes(newNodes);
    try {
      await idbSaveNodes(newNodes);
    } catch (err) {
      console.error('Failed to persist nodes:', err);
    }
  }, []);

  return { nodes, isLoading, saveNodes, setNodes };
}
