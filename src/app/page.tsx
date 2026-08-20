'use client';

import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useLibrary, useSync, useNavigation, useSettings } from '../context';
import { WinUITitleBar } from '../components/WinUITitleBar';
import { XamlTreeView } from '../components/XamlTreeView';
import { XamlCardControl } from '../components/XamlCardControl';
import { XamlCardEditControl } from '../components/XamlCardEditControl';
import { XamlCardAddControl } from '../components/XamlCardAddControl';
import { XamlRevisionPage } from '../components/XamlRevisionPage';
import { XamlSettingsPage } from '../components/XamlSettingsPage';
import { XamlGridSplitter } from '../components/XamlGridSplitter';

export default function HomePage() {
  const {
    nodes,
    isLoading,
    selectedNodeId,
    selectedNode,
    selectedCardNode,
    revisionDividerNode,
    cardsToRevise,
    setSelectedNodeId,
    setRevisionDividerId,
    handleSelectNode,
    handleTriggerAddCard,
    handleSaveNewCard,
    handleAddDivider,
    handleStartEditCard,
    handleSaveCardEdit,
    handleRenameNode,
    handleDeleteNode,
    handleResetWeights,
    handleExportAll,
    handleImportAll,
    handleResetAll,
    handleMoveNode,
    handleSortNodes,
    handleUpdateNodes,
  } = useLibrary();

  const {
    accessToken,
    syncState,
    lastSyncTime,
    handleConnectDrive,
    handleDisconnectDrive,
    handleManualUpload,
    handleManualDownload,
    handleFullManualSync,
  } = useSync();

  const {
    activePage,
    canGoBack,
    mobileView,
    rightViewMode,
    editingCardNode,
    isCardFlipped,
    setMobileView,
    toggleMobileView,
    setRightViewMode,
    setIsCardFlipped,
    handleNavigate,
    handleGoBack,
  } = useNavigation();

  const {
    sidebarWidth,
    autoRefreshEnabled,
    autoRefreshInterval,
    cardSettings,
    difficultySettings,
    handleSidebarWidthChange,
    handleToggleAutoRefresh,
    handleChangeRefreshInterval,
    handleUpdateCardSettings,
    handleUpdateDifficultySettings,
    handleResetCardSettings,
    handleResetDifficultySettings,
  } = useSettings();

  if (isLoading) {
    return (
      <div className="flex flex-col h-dvh w-screen max-w-full bg-slate-950 text-slate-100 items-center justify-center select-none fixed inset-0">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400 font-medium">Loading library from IndexedDB...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-dvh w-screen max-w-full bg-slate-950 text-slate-100 overflow-hidden font-sans select-none fixed inset-0">
      {/* WinUI 3 TitleBar & Navigation with Auto-Sync Status Badge & Mobile View Switcher */}
      <WinUITitleBar
        activePage={activePage}
        onNavigate={handleNavigate}
        canGoBack={canGoBack}
        onGoBack={handleGoBack}
        syncState={syncState}
        lastSyncTime={lastSyncTime}
        onManualSync={handleFullManualSync}
        mobileView={mobileView}
        onToggleMobileView={toggleMobileView}
      />

      {/* Main Content Pages */}
      <div className="flex-1 flex overflow-hidden relative">
        {activePage === 'FlashcardsPage' && (
          <div className="flex-1 flex h-full overflow-hidden relative">
            {/* Left TreeView Pane (Full screen on mobile when mobileView === 'tree', sidebar on desktop) */}
            <div
              className={`h-full ${
                mobileView === 'tree' ? 'flex w-full' : 'hidden'
              } md:flex md:w-auto shrink-0 z-10`}
            >
              <XamlTreeView
                nodes={nodes}
                selectedNodeId={selectedNodeId}
                width={sidebarWidth}
                onSelectNode={handleSelectNode}
                onAddCard={handleTriggerAddCard}
                onAddDivider={handleAddDivider}
                onReviseDivider={(node) => {
                  setRevisionDividerId(node ? node.id : null);
                  handleNavigate('RevisionPage');
                }}
                onEditCard={(node) => {
                  setSelectedNodeId(node.id);
                  handleStartEditCard(node);
                }}
                onRenameNode={handleRenameNode}
                onDeleteNode={handleDeleteNode}
                onResetWeights={handleResetWeights}
                onExportDivider={handleExportAll}
                onImportDivider={handleImportAll}
                onMoveNode={handleMoveNode}
                onSortNodes={handleSortNodes}
              />
            </div>

            {/* WinUI 3 GridSplitter Column (Hidden on mobile) */}
            <div className="hidden md:block">
              <XamlGridSplitter
                width={sidebarWidth}
                onWidthChange={handleSidebarWidthChange}
                minWidth={180}
                maxWidth={500}
              />
            </div>

            {/* Right Pane: CardControl, CardEditControl, or CardAddControl */}
            <div
              className={`flex-1 h-full bg-slate-950 flex flex-col overflow-hidden relative ${
                mobileView === 'card' ? 'flex w-full' : 'hidden md:flex'
              }`}
            >
              {/* Mobile Top Header Banner when viewing a card */}
              <div className="md:hidden flex items-center justify-between px-3 py-2 bg-slate-900/90 border-b border-slate-800 shrink-0">
                <button
                  onClick={() => setMobileView('tree')}
                  className="flex items-center space-x-1 text-xs text-indigo-300 font-medium py-1 px-2.5 bg-indigo-950/80 border border-indigo-500/40 rounded-lg touch-manipulation"
                >
                  <ChevronLeft size={14} />
                  <span>Decks List</span>
                </button>
                <span className="text-xs font-semibold text-slate-300 truncate max-w-[180px]">
                  {selectedNode ? selectedNode.name : 'Card View'}
                </span>
              </div>

              {rightViewMode === 'CardAddView' ? (
                <XamlCardAddControl
                  onAddCard={handleSaveNewCard}
                  onDone={() => setRightViewMode('CardView')}
                />
              ) : rightViewMode === 'CardEditView' ? (
                <XamlCardEditControl
                  cardNode={editingCardNode || selectedCardNode}
                  onSave={handleSaveCardEdit}
                  onCancel={() => setRightViewMode('CardView')}
                />
              ) : (
                <XamlCardControl
                  cardNode={selectedCardNode}
                  isFlipped={isCardFlipped}
                  onFlip={() => setIsCardFlipped((prev) => !prev)}
                  onStartEditing={() => {
                    if (selectedCardNode) handleStartEditCard(selectedCardNode);
                  }}
                  isEditButtonVisible={!!selectedCardNode}
                  cardSettings={cardSettings}
                />
              )}
            </div>
          </div>
        )}

        {activePage === 'RevisionPage' && (
          <XamlRevisionPage
            selectedDividerNode={revisionDividerNode}
            cardsToRevise={cardsToRevise}
            cardSettings={cardSettings}
            difficultySettings={difficultySettings}
            onUpdateCard={(updatedNode) => {
              const updated = nodes.map((n) => (n.id === updatedNode.id ? updatedNode : n));
              handleUpdateNodes(updated);
            }}
            onGoToFlashcardsPage={() => handleNavigate('FlashcardsPage')}
          />
        )}

        {activePage === 'SettingsPage' && (
          <XamlSettingsPage
            nodes={nodes}
            accessToken={accessToken}
            syncState={syncState}
            lastSyncTime={lastSyncTime}
            autoRefreshEnabled={autoRefreshEnabled}
            autoRefreshInterval={autoRefreshInterval}
            cardSettings={cardSettings}
            difficultySettings={difficultySettings}
            onConnectDrive={handleConnectDrive}
            onDisconnectDrive={handleDisconnectDrive}
            onUploadManual={handleManualUpload}
            onDownloadManual={handleManualDownload}
            onToggleAutoRefresh={handleToggleAutoRefresh}
            onChangeRefreshInterval={handleChangeRefreshInterval}
            onUpdateCardSettings={handleUpdateCardSettings}
            onUpdateDifficultySettings={handleUpdateDifficultySettings}
            onResetCardSettings={handleResetCardSettings}
            onResetDifficultySettings={handleResetDifficultySettings}
            onExportAll={handleExportAll}
            onImportAll={handleImportAll}
            onResetAll={handleResetAll}
          />
        )}
      </div>
    </div>
  );
}
