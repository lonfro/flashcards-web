'use client';

import { NodeData } from '../types/flashcard';
import { exportToWinUIJson, importFromWinUIJson, calculateJsonHash } from './winuiJsonConverter';

// Exact File Names matching WinUI 3 appsettings.json SyncOptions
export const LIBRARY_FILE_NAME = 'library.json';
export const METADATA_FILE_NAME = 'sync.json';
export const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.appdata';

export const STORAGE_CLIENT_ID_KEY = 'flashcards_web_gdrive_client_id_v1';
export const STORAGE_TOKEN_KEY = 'flashcards_web_gdrive_access_token_v1';
export const STORAGE_TOKEN_EXP_KEY = 'flashcards_web_gdrive_token_exp_v1';
export const STORAGE_LAST_SYNC_KEY = 'flashcards_web_gdrive_last_sync_v1';
export const STORAGE_LOCAL_METADATA_KEY = 'flashcards_web_local_metadata_v1';

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
 * Request OAuth 2.0 Access Token from Google Identity Services
 */
export function requestGoogleDriveToken(
  clientId: string,
  onSuccess: (accessToken: string) => void,
  onError: (err: string) => void,
  prompt: string = 'select_account'
): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_CLIENT_ID_KEY, clientId);
  } catch (e) {}

  const handleInit = () => {
    try {
      const client = (window as any).google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: DRIVE_SCOPE,
        prompt: prompt,
        callback: (response: any) => {
          if (response.error) {
            onError(response.error_description || response.error);
          } else if (response.access_token) {
            const expiresIn = response.expires_in ? parseInt(response.expires_in, 10) : 3600;
            saveStoredToken(response.access_token, expiresIn);
            onSuccess(response.access_token);
          }
        },
      });
      client.requestAccessToken({ prompt: prompt });
    } catch (err: any) {
      onError(err.message || 'OAuth Client Initialization failed');
    }
  };

  if (!(window as any).google?.accounts?.oauth2) {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = handleInit;
    script.onerror = () => {
      onError('Failed to load Google Identity Services SDK.');
    };
    document.body.appendChild(script);
  } else {
    handleInit();
  }
}

/**
 * Silently refresh OAuth 2.0 Access Token without popups
 */
export function requestSilentGoogleDriveToken(
  clientId: string,
  onSuccess: (accessToken: string) => void,
  onError: (err: string) => void
): void {
  requestGoogleDriveToken(clientId, onSuccess, onError, '');
}

/**
 * Upload single file content to Google Drive appDataFolder (create or patch update)
 */
async function uploadSingleFileToDrive(
  accessToken: string,
  fileName: string,
  content: string
): Promise<{ success: boolean; isAuthError?: boolean; error?: string }> {
  try {
    const searchRes = await fetch(
      `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=name='${fileName}'%20and%20trashed=false`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (searchRes.status === 401) {
      clearStoredToken();
      return { success: false, isAuthError: true, error: 'Google Drive auth expired.' };
    }

    if (!searchRes.ok) {
      throw new Error(`Search failed for ${fileName}: ${searchRes.statusText}`);
    }

    const searchData = await searchRes.json();
    const existingFile = searchData.files && searchData.files[0];

    let uploadRes;
    if (existingFile) {
      uploadRes = await fetch(
        `https://www.googleapis.com/upload/drive/v3/files/${existingFile.id}?uploadType=media`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: content,
        }
      );
    } else {
      const metadata = {
        name: fileName,
        parents: ['appDataFolder'],
      };
      const formData = new FormData();
      formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      formData.append('file', new Blob([content], { type: 'application/json' }));

      uploadRes = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}` },
          body: formData,
        }
      );
    }

    if (uploadRes.status === 401) {
      clearStoredToken();
      return { success: false, isAuthError: true, error: 'Google Drive auth expired.' };
    }

    if (!uploadRes.ok) {
      throw new Error(`Upload failed for ${fileName}: ${uploadRes.statusText}`);
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || `Failed to upload ${fileName}` };
  }
}

/**
 * Fetch remote sync.json metadata from Google Drive appDataFolder
 */
export async function getRemoteMetadataFromDrive(
  accessToken: string
): Promise<{ success: boolean; metadata?: WinUISyncMetadata; isAuthError?: boolean; error?: string }> {
  try {
    const searchRes = await fetch(
      `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=name='${METADATA_FILE_NAME}'%20and%20trashed=false`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (searchRes.status === 401) {
      clearStoredToken();
      return { success: false, isAuthError: true, error: 'Google Drive auth expired.' };
    }

    if (!searchRes.ok) {
      throw new Error(`Search failed for ${METADATA_FILE_NAME}: ${searchRes.statusText}`);
    }

    const searchData = await searchRes.json();
    const file = searchData.files && searchData.files[0];

    if (!file) {
      return { success: true, metadata: undefined };
    }

    const downloadRes = await fetch(
      `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (downloadRes.status === 401) {
      clearStoredToken();
      return { success: false, isAuthError: true, error: 'Google Drive auth expired.' };
    }

    if (!downloadRes.ok) {
      throw new Error(`Download failed for ${METADATA_FILE_NAME}: ${downloadRes.statusText}`);
    }

    const metadata = await downloadRes.json();
    return { success: true, metadata };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to fetch remote metadata' };
  }
}

/**
 * Upload Flashcards library.json & sync.json to Google Drive appDataFolder 1:1 with WinUI SyncService
 */
export async function uploadToGoogleDrive(
  accessToken: string,
  nodes: NodeData[]
): Promise<{ success: boolean; fileId?: string; error?: string; isAuthError?: boolean }> {
  try {
    const libraryJson = exportToWinUIJson(nodes);
    const hash = await calculateJsonHash(libraryJson);
    const meta: WinUISyncMetadata = {
      Hash: hash,
      ModifiedAt: new Date().toISOString(),
    };
    const metadataJson = JSON.stringify(meta, null, 2);

    // 1. Upload library.json
    const libraryRes = await uploadSingleFileToDrive(accessToken, LIBRARY_FILE_NAME, libraryJson);
    if (!libraryRes.success) return libraryRes;

    // 2. Upload sync.json metadata file
    const metadataRes = await uploadSingleFileToDrive(accessToken, METADATA_FILE_NAME, metadataJson);
    if (!metadataRes.success) return metadataRes;

    saveStoredLocalMetadata(meta);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to sync to Google Drive' };
  }
}

/**
 * Download Flashcards library.json from Google Drive AppData folder 1:1 with WinUI SyncService
 */
export async function downloadFromGoogleDrive(
  accessToken: string,
  existingNodes: NodeData[],
  replaceMode: boolean = false
): Promise<{ success: boolean; nodes?: NodeData[]; error?: string; isAuthError?: boolean }> {
  try {
    const searchRes = await fetch(
      `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=name='${LIBRARY_FILE_NAME}'%20and%20trashed=false`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (searchRes.status === 401) {
      clearStoredToken();
      return { success: false, error: 'Google Drive authentication expired.', isAuthError: true };
    }

    if (!searchRes.ok) {
      throw new Error(`Search failed: ${searchRes.statusText}`);
    }

    const searchData = await searchRes.json();
    const file = searchData.files && searchData.files[0];

    if (!file) {
      return { success: false, error: 'No Google Drive sync file (library.json) found.' };
    }

    const downloadRes = await fetch(
      `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (downloadRes.status === 401) {
      clearStoredToken();
      return { success: false, error: 'Google Drive authentication expired.', isAuthError: true };
    }

    if (!downloadRes.ok) {
      throw new Error(`Download failed: ${downloadRes.statusText}`);
    }

    const importedJson = await downloadRes.json();
    const mergedNodes = importFromWinUIJson(importedJson, existingNodes, null, replaceMode);
    return { success: true, nodes: mergedNodes };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to download from Google Drive' };
  }
}

/**
 * 1:1 Port of WinUI 3 C# GoogleDriveSyncService.cs SyncAsync algorithm:
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
      return { success: false, actionTaken: 'noop', isAuthError: remoteMetaRes.isAuthError, error: remoteMetaRes.error };
    }

    const remoteMetadata = remoteMetaRes.metadata;
    const localMetadata = getStoredLocalMetadata();

    // 1. Local metadata is null (not mutated yet / fresh session):
    if (!localMetadata) {
      if (remoteMetadata) {
        const downloadRes = await downloadFromGoogleDrive(accessToken, localNodes, true);
        if (downloadRes.success && downloadRes.nodes) {
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
