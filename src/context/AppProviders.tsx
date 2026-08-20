'use client';

import React from 'react';
import { SettingsProvider } from './SettingsContext';
import { NavigationProvider } from './NavigationContext';
import { LibraryProvider } from './LibraryContext';
import { SyncProvider } from './SyncContext';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SettingsProvider>
      <NavigationProvider>
        <LibraryProvider>
          <SyncProvider>{children}</SyncProvider>
        </LibraryProvider>
      </NavigationProvider>
    </SettingsProvider>
  );
}
