'use client';

import React from 'react';
import { FluentProvider, webDarkTheme, type Theme } from '@fluentui/react-components';
import { SettingsProvider } from './SettingsContext';
import { NavigationProvider } from './NavigationContext';
import { LibraryProvider } from './LibraryContext';
import { SyncProvider } from './SyncContext';

const theme: Theme = {
  ...webDarkTheme,
  fontFamilyBase: 'var(--winui-font)',
  colorNeutralForeground1: 'var(--text-main)',
  colorNeutralForeground1Hover: 'var(--text-main)',
  colorNeutralForeground1Pressed: 'var(--text-main)',
  colorNeutralForeground2: 'var(--text-main)',
  colorNeutralForeground2Hover: 'var(--text-main)',
  colorNeutralForeground2Pressed: 'var(--text-muted)',
  colorNeutralForeground2BrandSelected: 'var(--text-main)',
  colorNeutralForegroundDisabled: 'var(--winui-disabled)',
  colorNeutralBackground1: 'var(--winui-control)',
  colorNeutralBackground1Hover: 'var(--winui-hover)',
  colorNeutralBackground1Pressed: 'var(--winui-pressed)',
  colorNeutralBackground2: 'var(--bg-card)',
  colorTransparentBackgroundHover: 'var(--winui-hover)',
  colorTransparentBackgroundPressed: 'var(--winui-pressed)',
  colorNeutralStroke1: 'var(--winui-stroke)',
  colorNeutralStroke2: 'var(--border-main)',
  colorNeutralStrokeAccessible: 'var(--winui-bottom-stroke)',
  colorCompoundBrandStroke: 'var(--accent-main)',
  colorStrokeFocus2: 'var(--accent-main)',
  colorBrandBackground: 'var(--accent-main)',
};

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <FluentProvider theme={theme} className="winui-provider">
      <SettingsProvider>
        <NavigationProvider>
          <LibraryProvider>
            <SyncProvider>{children}</SyncProvider>
          </LibraryProvider>
        </NavigationProvider>
      </SettingsProvider>
    </FluentProvider>
  );
}
