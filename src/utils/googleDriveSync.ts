import { NodeData } from '../types/flashcard';
import { StudyLogEntry } from '../types/stats';
import { exportToWinUIJson, importFromWinUIJson, calculateJsonHash } from './winuiJsonConverter';
import { idbGetStudyLogs, idbSaveStudyLogs } from './db';

// Exact File Names matching WinUI 3 appsettings.json SyncOptions + stats sync
export const LIBRARY_FILE_NAME = 'library.json';
export const METADATA_FILE_NAME = 'sync.json';
export const STATS_FILE_NAME = 'stats.json';
export const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.appdata';

export const STORAGE_CLIENT_ID_KEY = 'flashcards_web_gdrive_client_id_v1';
export const STORAGE_TOKEN_KEY = 'flashcards_web_gdrive_access_token_v1';
export const STORAGE_TOKEN_EXP_KEY = 'flashcards_web_gdrive_token_exp_v1';
export const STORAGE_LAST_SYNC_KEY = 'flashcards_web_gdrive_last_sync_v1';
export const STORAGE_LOCAL_METADATA_KEY = 'flashcards_web_local_metadata_v1';
export const STORAGE_USER_EMAIL_KEY = 'flashcards_web_gdrive_user_email_v1';

export type SyncState = 'idle' | 'syncing' | 'synced' | 'error' | 'unauthenticated';

export interface WinUISyncMetadata {
  Hash: string;
  ModifiedAt: string;
}

export interface GoogleDriveStatus {
  isConnected: boolean;
  syncState: SyncState;
  lastSyncTime?: string;
  error?: string;
}

/**
 * Get stored valid access token from localStorage (if not expired)
 */
export function getStoredAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const token = localStorage.getItem(STORAGE_TOKEN_KEY);
    const expStr = localStorage.getItem(STORAGE_TOKEN_EXP_KEY);
    if (!token || !expStr) return null;

    const exp = parseInt(expStr, 10);
    if (Date.now() >= exp) {
      clearStoredToken();
      return null;
    }
    return token;
  } catch (e) {
    return null;
  }
}

/**
 * Save access token to localStorage with expiration timestamp
 */
export function saveStoredToken(token: string, expiresInSeconds: number = 3600): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_TOKEN_KEY, token);
    const expTime = Date.now() + (expiresInSeconds - 60) * 1000;
    localStorage.setItem(STORAGE_TOKEN_EXP_KEY, expTime.toString());
  } catch (e) {
    console.error(e);
  }
}

/**
 * Clear stored token from localStorage
 */
export function clearStoredToken(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    localStorage.removeItem(STORAGE_TOKEN_EXP_KEY);
  } catch (e) {
    console.error(e);
  }
}

/**
 * Get stored local SyncMetadata from localStorage
 */
export function getStoredLocalMetadata(): WinUISyncMetadata | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_LOCAL_METADATA_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

/**
 * Save local SyncMetadata to localStorage
 */
export function saveStoredLocalMetadata(meta: WinUISyncMetadata): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_LOCAL_METADATA_KEY, JSON.stringify(meta));
  } catch (e) {
    console.error(e);
  }
}

/**
 * Silently refreshes the Google Access Token using the Vercel / Next.js serverless route
 * if permanent HttpOnly refresh_token cookie exists
 */
export async function refreshAccessTokenViaServer(): Promise<{
  success: boolean;
  accessToken?: string;
  expiresIn?: number;
  error?: string;
}> {
  try {
    const res = await fetch('/api/auth/google/refresh', {
      method: 'POST',
      credentials: 'include',
    });

    if (!res.ok) {
      return { success: false, error: 'refresh_rejected' };
    }

    const data = await res.json();
    if (data.success && data.accessToken) {
      const expiresIn = data.expiresIn || 3600;
      saveStoredToken(data.accessToken, expiresIn);
      return { success: true, accessToken: data.accessToken, expiresIn };
    }
    return { success: false, error: data.error || 'no_access_token' };
  } catch (err: any) {
    return { success: false, error: err.message || 'server_refresh_failed' };
  }
}

/**
 * Opens a popup for Serverless Google OAuth 2.0 (Offline flow with permanent refresh_token)
 */
export function loginViaServerlessPopup(
  clientId?: string,
  onSuccess?: (token: string) => void,
  onError?: (err: string) => void
): void {
  if (typeof window === 'undefined') return;

  const width = 500;
  const height = 650;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;

  const loginUrl = `/api/auth/google/login${clientId ? `?client_id=${encodeURIComponent(clientId)}` : ''}`;
  const popup = window.open(
    loginUrl,
    'google_oauth_serverless_popup',
    `width=${width},height=${height},left=${left},top=${top},status=no,menubar=no,toolbar=no`
  );

  const handleMessage = (event: MessageEvent) => {
    if (event.data?.type === 'GOOGLE_AUTH_SUCCESS' && event.data.accessToken) {
      window.removeEventListener('message', handleMessage);
      const expiresIn = event.data.expiresIn || 3600;
      saveStoredToken(event.data.accessToken, expiresIn);
      if (event.data.email) {
        try {
          localStorage.setItem(STORAGE_USER_EMAIL_KEY, event.data.email);
        } catch (e) {}
      }
      onSuccess?.(event.data.accessToken);
    } else if (event.data?.type === 'GOOGLE_AUTH_ERROR') {
      window.removeEventListener('message', handleMessage);
      onError?.(event.data.error || 'Authentication error');
    }
  };

  window.addEventListener('message', handleMessage);
}

/**
 * Request OAuth 2.0 Access Token via Serverless Popup
 */
export function requestGoogleDriveToken(
  clientId?: string,
  onSuccess?: (accessToken: string) => void,
  onError?: (err: string) => void,
  _prompt?: string
): void {
  if (typeof window === 'undefined') return;

  if (clientId) {
    try {
      localStorage.setItem(STORAGE_CLIENT_ID_KEY, clientId);
    } catch (e) {}
  }

  loginViaServerlessPopup(clientId, onSuccess, onError);
}

/**
 * Silently refresh OAuth 2.0 Access Token via serverless cookie without popups
 */
export async function requestSilentGoogleDriveToken(
  _clientId: string,
  onSuccess: (accessToken: string) => void,
  onError: (err: string) => void
): Promise<void> {
  try {
    const serverRefresh = await refreshAccessTokenViaServer();
    if (serverRefresh.success && serverRefresh.accessToken) {
      onSuccess(serverRefresh.accessToken);
      return;
    }
  } catch (e) {}

  onError('Silent refresh unavailable');
}

/**
 * 1:1 Find file in appDataFolder matching WinUI 3 FindFileAsync
 */
async function findFileInAppDataFolder(
  accessToken: string,
  fileName: string
): Promise<{ success: boolean; file?: { id: string; name: string }; isAuthError?: boolean; error?: string }> {
  try {
    const query = encodeURIComponent(`name = '${fileName}' and trashed = false`);
    const url = `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=${query}&fields=files(id,name,modifiedTime)&orderBy=modifiedTime%20desc&pageSize=1`;

    const searchRes = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (searchRes.status === 401) {
      return { success: false, isAuthError: true, error: 'Authentication token expired' };
    }

    if (!searchRes.ok) {
      return { success: false, error: `Search failed for ${fileName}: ${searchRes.statusText}` };
    }

    const searchData = await searchRes.json();
    const file = searchData.files && searchData.files.length > 0 ? searchData.files[0] : undefined;
    return { success: true, file };
  } catch (err: any) {
    return { success: false, error: err.message || 'Search network error' };
  }
}

/**
 * Upload single file content to Google Drive appDataFolder 1:1 matching WinUI 3 UploadOrUpdateAsync
 */
async function uploadSingleFileToDrive(
  accessToken: string,
  fileName: string,
  content: string
): Promise<{ success: boolean; isAuthError?: boolean; error?: string }> {
  try {
    const findRes = await findFileInAppDataFolder(accessToken, fileName);
    if (!findRes.success) return findRes;

    const existingFile = findRes.file;

    if (existingFile) {
      // 1:1 WinUI PATCH /upload/drive/v3/files/{id}?uploadType=media
      const updateRes = await fetch(
        `https://www.googleapis.com/upload/drive/v3/files/${existingFile.id}?uploadType=media`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json; charset=UTF-8',
          },
          body: content,
        }
      );

      if (updateRes.status === 401) {
        return { success: false, isAuthError: true, error: 'Authentication token expired' };
      }

      if (!updateRes.ok) {
        return { success: false, error: `Update failed for ${fileName}: ${updateRes.statusText}` };
      }

      return { success: true };
    } else {
      // 1:1 WinUI POST /upload/drive/v3/files?uploadType=multipart with multipart/related
      const metadata = {
        name: fileName,
        parents: ['appDataFolder'],
      };

      const boundary = '-------314159265358979323846';
      const delimiter = `\r\n--${boundary}\r\n`;
      const closeDelimiter = `\r\n--${boundary}--`;

      const multipartRequestBody =
        delimiter +
        'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
        content +
        closeDelimiter;

      const createRes = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': `multipart/related; boundary=${boundary}`,
          },
          body: multipartRequestBody,
        }
      );

      if (createRes.status === 401) {
        return { success: false, isAuthError: true, error: 'Authentication token expired' };
      }

      if (!createRes.ok) {
        return { success: false, error: `Create failed for ${fileName}: ${createRes.statusText}` };
      }

      return { success: true };
    }
  } catch (err: any) {
    return { success: false, error: err.message || 'Upload network error' };
  }
}

/**
 * Upload study logs to Google Drive appDataFolder (stats.json)
 */
export async function uploadStatsToDrive(
  accessToken: string,
  logs: StudyLogEntry[]
): Promise<{ success: boolean; isAuthError?: boolean; error?: string }> {
  try {
    const jsonStr = JSON.stringify(logs, null, 2);
    return await uploadSingleFileToDrive(accessToken, STATS_FILE_NAME, jsonStr);
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to upload stats' };
  }
}

/**
 * Download study logs from Google Drive appDataFolder (stats.json)
 */
export async function downloadStatsFromDrive(
  accessToken: string
): Promise<{ success: boolean; logs?: StudyLogEntry[]; isAuthError?: boolean; error?: string }> {
  try {
    const findRes = await findFileInAppDataFolder(accessToken, STATS_FILE_NAME);
    if (!findRes.success) return findRes;
    if (!findRes.file) return { success: true, logs: [] };

    const downloadRes = await fetch(
      `https://www.googleapis.com/drive/v3/files/${findRes.file.id}?alt=media`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (downloadRes.status === 401) {
      return { success: false, isAuthError: true, error: 'Authentication token expired' };
    }

    if (!downloadRes.ok) {
      return { success: false, error: `Download stats failed: ${downloadRes.statusText}` };
    }

    const jsonText = await downloadRes.text();
    let parsed: StudyLogEntry[] = [];
    try {
      parsed = JSON.parse(jsonText);
    } catch (e) {
      parsed = [];
    }

    return { success: true, logs: Array.isArray(parsed) ? parsed : [] };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to download stats' };
  }
}

/**
 * Two-way merge & sync study logs between local IndexedDB and remote Google Drive stats.json
 */
export async function syncStudyStats(accessToken: string): Promise<void> {
  try {
    const localLogs = await idbGetStudyLogs(1000);
    const remoteRes = await downloadStatsFromDrive(accessToken);
    if (!remoteRes.success) return;

    const remoteLogs = remoteRes.logs || [];

    // Union merge by unique log ID
    const mergedMap = new Map<string, StudyLogEntry>();
    for (const log of localLogs) {
      if (log && log.id) mergedMap.set(log.id, log);
    }
    for (const log of remoteLogs) {
      if (log && log.id) mergedMap.set(log.id, log);
    }

    const mergedList = Array.from(mergedMap.values()).sort(
      (a, b) => new Date(b.reviewedAt).getTime() - new Date(a.reviewedAt).getTime()
    );

    // If new logs were found from remote, update local IndexedDB
    if (mergedList.length > localLogs.length) {
      await idbSaveStudyLogs(mergedList);
    }

    // If local had new logs that remote didn't have (or first upload), push to Google Drive
    if (mergedList.length > remoteLogs.length || (!remoteRes.logs && mergedList.length > 0)) {
      await uploadStatsToDrive(accessToken, mergedList);
    }
  } catch (err) {
    console.error('Failed to sync study stats:', err);
  }
}

let statsUploadTimeout: NodeJS.Timeout | null = null;

/**
 * Triggers a debounced (1.5s) upload/merge of stats.json to Google Drive.
 * Only called when study stats actually change (e.g. rating a card).
 */
export function triggerDebouncedStatsUpload(accessToken: string): void {
  if (!accessToken) return;
  if (statsUploadTimeout) {
    clearTimeout(statsUploadTimeout);
  }
  statsUploadTimeout = setTimeout(() => {
    syncStudyStats(accessToken);
  }, 1500);
}

/**
 * 1:1 Push to Google Drive (Atomic upload of library.json + sync.json metadata matching WinUI 3 PushInternalAsync)
 */
export async function uploadToGoogleDrive(
  accessToken: string,
  nodes: NodeData[]
): Promise<{ success: boolean; isAuthError?: boolean; error?: string }> {
  try {
    const jsonContent = exportToWinUIJson(nodes, null, true);
    const hash = await calculateJsonHash(jsonContent);
    const modifiedAt = new Date().toISOString();

    const libUpload = await uploadSingleFileToDrive(accessToken, LIBRARY_FILE_NAME, jsonContent);
    if (!libUpload.success) return libUpload;

    const metadata: WinUISyncMetadata = {
      Hash: hash,
      ModifiedAt: modifiedAt,
    };
    const metaUpload = await uploadSingleFileToDrive(accessToken, METADATA_FILE_NAME, JSON.stringify(metadata, null, 2));
    if (!metaUpload.success) return metaUpload;

    saveStoredLocalMetadata(metadata);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to upload to Google Drive' };
  }
}

/**
 * Fetch remote sync.json metadata from Google Drive appDataFolder matching WinUI 3 GetSyncMetadataAsync
 */
export async function getRemoteMetadataFromDrive(
  accessToken: string
): Promise<{ success: boolean; metadata?: WinUISyncMetadata; isAuthError?: boolean; error?: string }> {
  try {
    const findRes = await findFileInAppDataFolder(accessToken, METADATA_FILE_NAME);
    if (!findRes.success) return findRes;

    if (!findRes.file) {
      return { success: true, metadata: undefined };
    }

    const downloadRes = await fetch(
      `https://www.googleapis.com/drive/v3/files/${findRes.file.id}?alt=media`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (downloadRes.status === 401) {
      return { success: false, isAuthError: true, error: 'Authentication token expired' };
    }

    if (!downloadRes.ok) {
      return { success: false, error: `Download metadata failed: ${downloadRes.statusText}` };
    }

    const metaText = await downloadRes.text();
    const metadata: WinUISyncMetadata = JSON.parse(metaText);
    return { success: true, metadata };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to get remote metadata' };
  }
}

/**
 * Download and parse library.json from Google Drive matching WinUI 3 DownloadSyncFileAsync
 */
export async function downloadFromGoogleDrive(
  accessToken: string,
  currentNodes: NodeData[],
  overwriteLocal: boolean = true
): Promise<{ success: boolean; nodes?: NodeData[]; isAuthError?: boolean; error?: string }> {
  try {
    const findRes = await findFileInAppDataFolder(accessToken, LIBRARY_FILE_NAME);
    if (!findRes.success) return findRes;

    if (!findRes.file) {
      return { success: false, error: 'No library.json found in Google Drive appDataFolder' };
    }

    const downloadRes = await fetch(
      `https://www.googleapis.com/drive/v3/files/${findRes.file.id}?alt=media`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (downloadRes.status === 401) {
      return { success: false, isAuthError: true, error: 'Authentication token expired' };
    }

    if (!downloadRes.ok) {
      return { success: false, error: `Download library failed: ${downloadRes.statusText}` };
    }

    const jsonText = await downloadRes.text();
    let parsedJson: any = null;
    try {
      parsedJson = JSON.parse(jsonText);
    } catch (parseErr) {
      return { success: false, error: 'Downloaded library.json is not valid JSON' };
    }

    const parsedNodes = importFromWinUIJson(parsedJson, currentNodes, null, overwriteLocal);

    if (parsedNodes.length === 0 && jsonText.length > 50) {
      return { success: false, error: 'Failed to extract decks from downloaded library.json' };
    }

    return {
      success: true,
      nodes: parsedNodes,
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to download from Google Drive' };
  }
}

/**
 * 1:1 Port of WinUI 3 C# GoogleDriveSyncService.cs / LibraryCoordinator.cs SyncAsync algorithm:
 * Compares local vs remote sync.json metadata.
 * Only uploads when local is newer; downloads when remote is newer!
 */
export async function performSmartSync(
  accessToken: string,
  localNodes: NodeData[]
): Promise<{
  success: boolean;
  actionTaken: 'downloaded' | 'uploaded' | 'noop';
  nodes?: NodeData[];
  isAuthError?: boolean;
  error?: string;
}> {
  try {
    const remoteMetaRes = await getRemoteMetadataFromDrive(accessToken);
    if (!remoteMetaRes.success) {
      if (remoteMetaRes.isAuthError) {
        const refreshRes = await refreshAccessTokenViaServer();
        if (refreshRes.success && refreshRes.accessToken) {
          return performSmartSync(refreshRes.accessToken, localNodes);
        }
      }
      return { success: false, actionTaken: 'noop', isAuthError: remoteMetaRes.isAuthError, error: remoteMetaRes.error };
    }

    const remoteMetadata = remoteMetaRes.metadata;
    const localMetadata = getStoredLocalMetadata();

    // 1. Local metadata is null (not mutated yet / fresh session):
    if (!localMetadata) {
      if (remoteMetadata) {
        const downloadRes = await downloadFromGoogleDrive(accessToken, localNodes, true);
        if (downloadRes.success && downloadRes.nodes && downloadRes.nodes.length > 0) {
          saveStoredLocalMetadata(remoteMetadata);
          return { success: true, actionTaken: 'downloaded', nodes: downloadRes.nodes };
        }
      }
      return { success: true, actionTaken: 'noop', nodes: localNodes };
    }

    // 2. Remote metadata doesn't exist on Google Drive yet:
    if (!remoteMetadata) {
      const uploadRes = await uploadToGoogleDrive(accessToken, localNodes);
      if (uploadRes.success) {
        return { success: true, actionTaken: 'uploaded' };
      }
      return { success: false, actionTaken: 'noop', error: uploadRes.error, isAuthError: uploadRes.isAuthError };
    }

    // 3. Hashes match — NO-OP!
    if (remoteMetadata.Hash === localMetadata.Hash) {
      return { success: true, actionTaken: 'noop', nodes: localNodes };
    }

    // 4. Remote is newer than local (remoteMetadata.ModifiedAt > localMetadata.ModifiedAt):
    const remoteTime = new Date(remoteMetadata.ModifiedAt).getTime();
    const localTime = new Date(localMetadata.ModifiedAt).getTime();

    if (remoteTime > localTime) {
      const downloadRes = await downloadFromGoogleDrive(accessToken, localNodes, true);
      if (downloadRes.success && downloadRes.nodes) {
        saveStoredLocalMetadata(remoteMetadata);
        return { success: true, actionTaken: 'downloaded', nodes: downloadRes.nodes };
      }
      return { success: true, actionTaken: 'noop', nodes: localNodes };
    }

    // 5. Local is newer than remote (localTime >= remoteTime):
    const uploadRes = await uploadToGoogleDrive(accessToken, localNodes);
    if (uploadRes.success) {
      return { success: true, actionTaken: 'uploaded' };
    }
    return { success: false, actionTaken: 'noop', error: uploadRes.error, isAuthError: uploadRes.isAuthError };
  } catch (err: any) {
    return { success: false, actionTaken: 'noop', error: err.message || 'Smart sync failed' };
  }
}
