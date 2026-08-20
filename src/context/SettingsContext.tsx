'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CardSettingsData,
  DifficultySettingsData,
  DEFAULT_CARD_SETTINGS,
  DEFAULT_DIFFICULTY_SETTINGS,
} from '../types/cardSettings';
import { getStoredTheme, applyTheme } from '../utils/themePresets';

const SIDEBAR_WIDTH_KEY = 'flashcards_web_sidebar_width_v1';
const AUTO_REFRESH_ENABLED_KEY = 'flashcards_web_auto_refresh_enabled_v1';
const AUTO_REFRESH_INTERVAL_KEY = 'flashcards_web_auto_refresh_interval_v1';
const CARD_SETTINGS_KEY = 'flashcards_web_card_settings_v1';
const DIFFICULTY_SETTINGS_KEY = 'flashcards_web_difficulty_settings_v1';

export interface SettingsContextValue {
  sidebarWidth: number;
  autoRefreshEnabled: boolean;
  autoRefreshInterval: number;
  cardSettings: CardSettingsData;
  difficultySettings: DifficultySettingsData;
  setSidebarWidth: (w: number) => void;
  setAutoRefreshEnabled: (enabled: boolean) => void;
  setAutoRefreshInterval: (seconds: number) => void;
  setCardSettings: (settings: CardSettingsData) => void;
  setDifficultySettings: (settings: DifficultySettingsData) => void;
  handleSidebarWidthChange: (newWidth: number) => void;
  handleToggleAutoRefresh: (enabled: boolean) => void;
  handleChangeRefreshInterval: (seconds: number) => void;
  handleUpdateCardSettings: (newSettings: CardSettingsData) => void;
  handleUpdateDifficultySettings: (newSettings: DifficultySettingsData) => void;
  handleResetCardSettings: () => void;
  handleResetDifficultySettings: () => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function useSettings(): SettingsContextValue {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [sidebarWidth, setSidebarWidth] = useState<number>(250);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState<boolean>(true);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState<number>(30);
  const [cardSettings, setCardSettings] = useState<CardSettingsData>(DEFAULT_CARD_SETTINGS);
  const [difficultySettings, setDifficultySettings] = useState<DifficultySettingsData>(DEFAULT_DIFFICULTY_SETTINGS);

  useEffect(() => {
    // Apply theme
    try {
      const theme = getStoredTheme();
      applyTheme(theme);
    } catch (e) {
      console.error('Failed to load theme:', e);
    }

    // Load persisted settings
    try {
      const savedWidth = localStorage.getItem(SIDEBAR_WIDTH_KEY);
      if (savedWidth) {
        setSidebarWidth(parseInt(savedWidth, 10));
      }

      const savedRefreshEnabled = localStorage.getItem(AUTO_REFRESH_ENABLED_KEY);
      if (savedRefreshEnabled !== null) {
        setAutoRefreshEnabled(savedRefreshEnabled === 'true');
      }

      const savedRefreshInterval = localStorage.getItem(AUTO_REFRESH_INTERVAL_KEY);
      if (savedRefreshInterval) {
        setAutoRefreshInterval(parseInt(savedRefreshInterval, 10));
      }

      const savedCardSettings = localStorage.getItem(CARD_SETTINGS_KEY);
      if (savedCardSettings) {
        setCardSettings(JSON.parse(savedCardSettings));
      }

      const savedDiffSettings = localStorage.getItem(DIFFICULTY_SETTINGS_KEY);
      if (savedDiffSettings) {
        setDifficultySettings(JSON.parse(savedDiffSettings));
      }
    } catch (e) {
      console.error('Failed to load persisted settings:', e);
    }
  }, []);

  const handleSidebarWidthChange = (newWidth: number) => {
    setSidebarWidth(newWidth);
    try {
      localStorage.setItem(SIDEBAR_WIDTH_KEY, newWidth.toString());
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleAutoRefresh = (enabled: boolean) => {
    setAutoRefreshEnabled(enabled);
    try {
      localStorage.setItem(AUTO_REFRESH_ENABLED_KEY, enabled.toString());
    } catch (e) {
      console.error(e);
    }
  };

  const handleChangeRefreshInterval = (seconds: number) => {
    setAutoRefreshInterval(seconds);
    try {
      localStorage.setItem(AUTO_REFRESH_INTERVAL_KEY, seconds.toString());
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateCardSettings = (newSettings: CardSettingsData) => {
    setCardSettings(newSettings);
    try {
      localStorage.setItem(CARD_SETTINGS_KEY, JSON.stringify(newSettings));
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateDifficultySettings = (newSettings: DifficultySettingsData) => {
    setDifficultySettings(newSettings);
    try {
      localStorage.setItem(DIFFICULTY_SETTINGS_KEY, JSON.stringify(newSettings));
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetCardSettings = () => {
    setCardSettings(DEFAULT_CARD_SETTINGS);
    try {
      localStorage.setItem(CARD_SETTINGS_KEY, JSON.stringify(DEFAULT_CARD_SETTINGS));
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetDifficultySettings = () => {
    setDifficultySettings(DEFAULT_DIFFICULTY_SETTINGS);
    try {
      localStorage.setItem(DIFFICULTY_SETTINGS_KEY, JSON.stringify(DEFAULT_DIFFICULTY_SETTINGS));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        sidebarWidth,
        autoRefreshEnabled,
        autoRefreshInterval,
        cardSettings,
        difficultySettings,
        setSidebarWidth,
        setAutoRefreshEnabled,
        setAutoRefreshInterval,
        setCardSettings,
        setDifficultySettings,
        handleSidebarWidthChange,
        handleToggleAutoRefresh,
        handleChangeRefreshInterval,
        handleUpdateCardSettings,
        handleUpdateDifficultySettings,
        handleResetCardSettings,
        handleResetDifficultySettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
