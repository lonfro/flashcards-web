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
 * Request OAuth 2.0 Access Token via Google Identity Services
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
    } catch (initErr: any) {
      onError(initErr.message || 'OAuth Client Initialization failed');
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
export async function requestSilentGoogleDriveToken(
  clientId: string,
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

  // Fallback to GIS silent prompt
  requestGoogleDriveToken(clientId, onSuccess, onError, 'none');
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
      return { success: false, isAuthError: true, error: 'Authentication token expired' };
    }

    if (!searchRes.ok) {
      return { success: false, error: `Search file failed: ${searchRes.statusText}` };
    }

    const searchData = await searchRes.json();
    const existingFile = searchData.files && searchData.files.length > 0 ? searchData.files[0] : null;

    if (existingFile) {
      const updateRes = await fetch(
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

      if (updateRes.status === 401) {
        return { success: false, isAuthError: true, error: 'Authentication token expired' };
      }

      if (!updateRes.ok) {
        return { success: false, error: `Update file failed: ${updateRes.statusText}` };
      }

      return { success: true };
    } else {
      const metadata = {
        name: fileName,
        parents: ['appDataFolder'],
      };

      const form = new FormData();
      form.append(
        'metadata',
        new Blob([JSON.stringify(metadata)], { type: 'application/json' })
      );
      form.append(
        'file',
        new Blob([content], { type: 'application/json' })
      );

      const createRes = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: form,
        }
      );

      if (createRes.status === 401) {
        return { success: false, isAuthError: true, error: 'Authentication token expired' };
      }

      if (!createRes.ok) {
        return { success: false, error: `Create file failed: ${createRes.statusText}` };
      }

      return { success: true };
    }
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error during upload' };
  }
}

/**
 * 1:1 Push to Google Drive (Atomic upload of library.json + sync.json metadata)
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
      return { success: false, isAuthError: true, error: 'Authentication token expired' };
    }

    if (!searchRes.ok) {
      return { success: false, error: `Search metadata failed: ${searchRes.statusText}` };
    }

    const searchData = await searchRes.json();
    if (!searchData.files || searchData.files.length === 0) {
      return { success: true, metadata: undefined };
    }

    const fileId = searchData.files[0].id;
    const downloadRes = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
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
 * Download and parse library.json from Google Drive
 */
export async function downloadFromGoogleDrive(
  accessToken: string,
  currentNodes: NodeData[],
  overwriteLocal: boolean = true
): Promise<{ success: boolean; nodes?: NodeData[]; isAuthError?: boolean; error?: string }> {
  try {
    const searchRes = await fetch(
      `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=name='${LIBRARY_FILE_NAME}'%20and%20trashed=false`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (searchRes.status === 401) {
      return { success: false, isAuthError: true, error: 'Authentication token expired' };
    }

    if (!searchRes.ok) {
      return { success: false, error: `Search library failed: ${searchRes.statusText}` };
    }

    const searchData = await searchRes.json();
    if (!searchData.files || searchData.files.length === 0) {
      return { success: false, error: 'No existing library.json found in Google Drive appDataFolder' };
    }

    const fileId = searchData.files[0].id;
    const downloadRes = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
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
      return { success: false, error: 'Downloaded library.json is corrupted or not valid JSON' };
    }

    const parsedNodes = importFromWinUIJson(parsedJson, currentNodes, null, overwriteLocal);

    if (parsedNodes.length === 0 && jsonText.length > 50) {
      return { success: false, error: 'Parsed 0 items from downloaded library.json' };
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
