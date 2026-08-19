import { AppTheme } from '../types/theme';

export const PRESET_THEMES: AppTheme[] = [
  {
    id: 'winui-dark',
    name: 'WinUI 3 Dark (Default)',
    background: '#020617',
    surface: '#0f172a',
    cardBg: '#0f172a',
    border: '#1e293b',
    foreground: '#f8fafc',
    foregroundMuted: '#94a3b8',
    accent: '#6366f1',
    accentHover: '#4f46e5',
    accentText: '#ffffff',
    folderIconColor: '#f59e0b',
    cardIconColor: '#818cf8',
    scrollbarThumb: '#334155',
    scrollbarTrack: '#090d16',
  },
  {
    id: 'amoled-black',
    name: 'AMOLED True Black',
    background: '#000000',
    surface: '#0a0a0a',
    cardBg: '#121212',
    border: '#262626',
    foreground: '#ffffff',
    foregroundMuted: '#a3a3a3',
    accent: '#3b82f6',
    accentHover: '#2563eb',
    accentText: '#ffffff',
    folderIconColor: '#fbbf24',
    cardIconColor: '#60a5fa',
    scrollbarThumb: '#404040',
    scrollbarTrack: '#000000',
  },
  {
    id: 'catppuccin-mocha',
    name: 'Catppuccin Mocha',
    background: '#1e1e2e',
    surface: '#181825',
    cardBg: '#313244',
    border: '#45475a',
    foreground: '#cdd6f4',
    foregroundMuted: '#a6adc8',
    accent: '#cba6f7',
    accentHover: '#b4befe',
    accentText: '#11111b',
    folderIconColor: '#fab387',
    cardIconColor: '#cba6f7',
    scrollbarThumb: '#585b70',
    scrollbarTrack: '#11111b',
  },
  {
    id: 'catppuccin-macchiato',
    name: 'Catppuccin Macchiato',
    background: '#24273a',
    surface: '#1e2030',
    cardBg: '#363a4f',
    border: '#494d64',
    foreground: '#cad3f5',
    foregroundMuted: '#a5adce',
    accent: '#8aadf4',
    accentHover: '#7dc4e4',
    accentText: '#181926',
    folderIconColor: '#f5a97f',
    cardIconColor: '#8aadf4',
    scrollbarThumb: '#5b6078',
    scrollbarTrack: '#181926',
  },
  {
    id: 'mica-light',
    name: 'Mica Light',
    background: '#f8fafc',
    surface: '#ffffff',
    cardBg: '#ffffff',
    border: '#e2e8f0',
    foreground: '#0f172a',
    foregroundMuted: '#64748b',
    accent: '#2563eb',
    accentHover: '#1d4ed8',
    accentText: '#ffffff',
    folderIconColor: '#d97706',
    cardIconColor: '#2563eb',
    scrollbarThumb: '#cbd5e1',
    scrollbarTrack: '#f1f5f9',
  },
  {
    id: 'dracula-purple',
    name: 'Cyberpunk Neon',
    background: '#0d0714',
    surface: '#170b28',
    cardBg: '#1a0c30',
    border: '#2e1052',
    foreground: '#f5f3ff',
    foregroundMuted: '#a78bfa',
    accent: '#a855f7',
    accentHover: '#9333ea',
    accentText: '#ffffff',
    folderIconColor: '#f43f5e',
    cardIconColor: '#c084fc',
    scrollbarThumb: '#581c87',
    scrollbarTrack: '#0d0714',
  },
  {
    id: 'emerald-cyber',
    name: 'Emerald Matrix',
    background: '#02120a',
    surface: '#062415',
    cardBg: '#092e1b',
    border: '#114a2c',
    foreground: '#ecfdf5',
    foregroundMuted: '#6ee7b7',
    accent: '#10b981',
    accentHover: '#059669',
    accentText: '#ffffff',
    folderIconColor: '#34d399',
    cardIconColor: '#10b981',
    scrollbarThumb: '#047857',
    scrollbarTrack: '#02120a',
  },
  {
    id: 'sunset-amber',
    name: 'Sunset Amber',
    background: '#180c04',
    surface: '#2b1608',
    cardBg: '#341a0a',
    border: '#54290e',
    foreground: '#fffbeb',
    foregroundMuted: '#fcd34d',
    accent: '#f59e0b',
    accentHover: '#d97706',
    accentText: '#ffffff',
    folderIconColor: '#fb923c',
    cardIconColor: '#f59e0b',
    scrollbarThumb: '#b45309',
    scrollbarTrack: '#180c04',
  },
  {
    id: 'nordic-frost',
    name: 'Nordic Frost',
    background: '#08131e',
    surface: '#0f2438',
    cardBg: '#132d46',
    border: '#1b4368',
    foreground: '#ecfeff',
    foregroundMuted: '#67e8f9',
    accent: '#06b6d4',
    accentHover: '#0891b2',
    accentText: '#ffffff',
    folderIconColor: '#38bdf8',
    cardIconColor: '#22d3ee',
    scrollbarThumb: '#0e7490',
    scrollbarTrack: '#08131e',
  },
];

const THEME_STORAGE_KEY = 'flashcards_web_theme_v1';

export function applyTheme(theme: AppTheme): void {
  if (typeof window === 'undefined') return;

  const root = document.documentElement;
  root.style.setProperty('--bg-main', theme.background);
  root.style.setProperty('--bg-surface', theme.surface);
  root.style.setProperty('--bg-card', theme.cardBg);
  root.style.setProperty('--border-main', theme.border);
  root.style.setProperty('--text-main', theme.foreground);
  root.style.setProperty('--text-muted', theme.foregroundMuted);
  root.style.setProperty('--accent-main', theme.accent);
  root.style.setProperty('--accent-hover', theme.accentHover);
  root.style.setProperty('--accent-text', theme.accentText);
  root.style.setProperty('--color-folder-icon', theme.folderIconColor || '#f59e0b');
  root.style.setProperty('--color-card-icon', theme.cardIconColor || theme.accent || '#818cf8');
  root.style.setProperty('--scrollbar-thumb', theme.scrollbarThumb);
  root.style.setProperty('--scrollbar-track', theme.scrollbarTrack);

  try {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme));
  } catch (e) {
    console.error('Failed to save theme:', e);
  }
}

export function getStoredTheme(): AppTheme {
  if (typeof window === 'undefined') return PRESET_THEMES[0];
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load theme:', e);
  }
  return PRESET_THEMES[0];
}
