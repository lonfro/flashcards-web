'use client';

import React, { createContext, useContext, useState } from 'react';
import { ActivePage } from '../components/WinUITitleBar';
import { NodeData } from '../types/flashcard';

export interface NavigationContextValue {
  activePage: ActivePage;
  historyStack: ActivePage[];
  canGoBack: boolean;
  mobileView: 'tree' | 'card';
  rightViewMode: 'CardView' | 'CardEditView' | 'CardAddView';
  editingCardNode: NodeData | null;
  isCardFlipped: boolean;
  setActivePage: (page: ActivePage) => void;
  setMobileView: (view: 'tree' | 'card') => void;
  toggleMobileView: () => void;
  setRightViewMode: (mode: 'CardView' | 'CardEditView' | 'CardAddView') => void;
  setEditingCardNode: (node: NodeData | null) => void;
  setIsCardFlipped: (flipped: boolean | ((prev: boolean) => boolean)) => void;
  handleNavigate: (page: ActivePage) => void;
  handleGoBack: () => void;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

export function useNavigation(): NavigationContextValue {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [activePage, setActivePage] = useState<ActivePage>('FlashcardsPage');
  const [historyStack, setHistoryStack] = useState<ActivePage[]>([]);
  const [mobileView, setMobileView] = useState<'tree' | 'card'>('tree');
  const [rightViewMode, setRightViewMode] = useState<'CardView' | 'CardEditView' | 'CardAddView'>('CardView');
  const [editingCardNode, setEditingCardNode] = useState<NodeData | null>(null);
  const [isCardFlipped, setIsCardFlipped] = useState<boolean>(false);

  const handleNavigate = (page: ActivePage) => {
    if (page === activePage) return;
    setHistoryStack((prev) => [...prev, activePage]);
    setActivePage(page);
    setIsCardFlipped(false);
  };

  const handleGoBack = () => {
    if (historyStack.length === 0) return;
    const prevPage = historyStack[historyStack.length - 1];
    setHistoryStack((prev) => prev.slice(0, prev.length - 1));
    setActivePage(prevPage);
    setIsCardFlipped(false);
  };

  const toggleMobileView = () => {
    setMobileView((prev) => (prev === 'tree' ? 'card' : 'tree'));
  };

  return (
    <NavigationContext.Provider
      value={{
        activePage,
        historyStack,
        canGoBack: historyStack.length > 0,
        mobileView,
        rightViewMode,
        editingCardNode,
        isCardFlipped,
        setActivePage,
        setMobileView,
        toggleMobileView,
        setRightViewMode,
        setEditingCardNode,
        setIsCardFlipped,
        handleNavigate,
        handleGoBack,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}
