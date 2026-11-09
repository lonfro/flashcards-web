import { useEffect, useState } from 'react';
import { NodeData } from '../types/flashcard';
import { getDB, idbSaveLibraryBackup } from '../utils/db';
import { downloadLibraryJson, exportToWinUIJson } from '../utils/winuiJsonConverter';

const settingsKey = 'flashcards_web_backup_settings_v1';
const defaults = { intervalMinutes: 0, maxBackups: 10, enabledAt: 0 };

export function useLibraryBackups(nodes: NodeData[], isLoading: boolean) {
  const [settings, setSettings] = useState(defaults);
  const [times, setTimes] = useState<number[] | null>(null);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const saved = localStorage.getItem(settingsKey);
        const db = await getDB();
        const keys = await db.getAllKeys('library_backups');
        if (!active) return;
        if (saved) setSettings({ ...defaults, ...JSON.parse(saved) });
        setTimes(keys.filter((key): key is number => typeof key === 'number'));
      } catch {
        if (active) setError('Could not load saved backups.');
      }
    })();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (isLoading || !times || !settings.intervalMinutes) return;
    const intervalMs = settings.intervalMinutes * 60_000;
    const due = Math.max(times.at(-1) ?? 0, settings.enabledAt) + intervalMs;
    let timer: number;
    let active = true;

    const schedule = () => {
      const remaining = due - Date.now();
      if (remaining > 0) {
        timer = window.setTimeout(schedule, Math.min(remaining, 2_147_483_647));
        return;
      }
      void idbSaveLibraryBackup(exportToWinUIJson(nodes), settings.maxBackups, {
        intervalMs,
        enabledAt: settings.enabledAt,
      }).then((backups) => {
        if (active) setTimes(backups);
      }).catch(() => {
        if (active) setError('Could not save the scheduled backup.');
      });
    };
    timer = window.setTimeout(schedule, 0);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [nodes, isLoading, settings, times]);

  function updateSettings(intervalMinutes: number, maxBackups: number) {
    const next = {
      intervalMinutes,
      maxBackups,
      enabledAt: intervalMinutes === settings.intervalMinutes ? settings.enabledAt : Date.now(),
    };
    try {
      localStorage.setItem(settingsKey, JSON.stringify(next));
      setSettings(next);
      setError('');
    } catch {
      setError('Could not save backup settings.');
    }
  }

  async function saveBackup() {
    setIsSaving(true);
    setError('');
    try {
      setTimes(await idbSaveLibraryBackup(exportToWinUIJson(nodes), settings.maxBackups));
    } catch {
      setError('Could not save the backup.');
    } finally {
      setIsSaving(false);
    }
  }

  async function downloadBackup(time: number) {
    try {
      const json = await (await getDB()).get('library_backups', time);
      if (!json) throw new Error('Backup missing');
      const timestamp = new Date(time).toISOString().replace(/[:.]/g, '-');
      downloadLibraryJson(json, `flashcards_backup-${timestamp}.json`);
    } catch {
      setError('Could not download the backup.');
    }
  }

  return { settings, times, error, isSaving, updateSettings, saveBackup, downloadBackup };
}
