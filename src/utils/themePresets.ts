import { AppTheme } from '../types/theme';

export const PRESET_THEMES: AppTheme[] = [
  {
    id: 'winui-dark',
    name: 'WinUI 3 Dark (Default)',
    background: '#202020',
    surface: '#272727',
    cardBg: '#2c2c2c',
    border: '#3d3d3d',
    foreground: '#ffffff',
    foregroundMuted: '#c5c5c5',
    accent: '#60cdff',
    accentHover: '#78d5ff',
    accentText: '#00334d',
    folderIconColor: '#e4e4e4',
    cardIconColor: '#e4e4e4',
    scrollbarThumb: '#686868',
    scrollbarTrack: '#202020',
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
    background: '#f3f3f3',
    surface: '#f9f9f9',
    cardBg: '#fbfbfb',
    border: '#dedede',
    foreground: '#1a1a1a',
    foregroundMuted: '#595959',
    accent: '#005fb8',
    accentHover: '#196ebc',
    accentText: '#ffffff',
    folderIconColor: '#292929',
    cardIconColor: '#292929',
    scrollbarThumb: '#909090',
    scrollbarTrack: '#f3f3f3',
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
  const color = theme.background.slice(1);
  const red = Number.parseInt(color.slice(0, 2), 16);
  const green = Number.parseInt(color.slice(2, 4), 16);
  const blue = Number.parseInt(color.slice(4, 6), 16);
  root.dataset.winuiLight = String(red * 0.299 + green * 0.587 + blue * 0.114 > 155);
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
      const stored: AppTheme = JSON.parse(raw);
      return stored.isCustom ? stored : (PRESET_THEMES.find((preset) => preset.id === stored.id) ?? stored);
    }
  } catch (e) {
    console.error('Failed to load theme:', e);
  }
  return PRESET_THEMES[0];
}
