'use client';

import React, { useState, useEffect } from 'react';
import { Palette, Download, Upload, Copy, Check, Sparkles, Folder, FileText } from 'lucide-react';
import { AppTheme } from '../types/theme';
import { PRESET_THEMES, applyTheme, getStoredTheme } from '../utils/themePresets';

export const ThemeConfigurator: React.FC = () => {
  const [activeTheme, setActiveTheme] = useState<AppTheme>(PRESET_THEMES[0]);
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');
  const [copied, setCopied] = useState(false);

  // Custom theme editor state
  const [customTheme, setCustomTheme] = useState<AppTheme>({
    id: 'custom-user-theme',
    name: 'My Custom Theme',
    isCustom: true,
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
  });

  useEffect(() => {
    const current = getStoredTheme();
    setActiveTheme(current);
    applyTheme(current);
    if (current.isCustom) {
      setCustomTheme(current);
      setActiveTab('custom');
    }
  }, []);

  const handleSelectPreset = (theme: AppTheme) => {
    setActiveTheme(theme);
    applyTheme(theme);
  };

  const handleCustomColorChange = (key: keyof AppTheme, value: string) => {
    const updated: AppTheme = {
      ...customTheme,
      [key]: value,
      isCustom: true,
    };
    setCustomTheme(updated);
    setActiveTheme(updated);
    applyTheme(updated);
  };

  const handleExportTheme = () => {
    const themeToExport = activeTab === 'custom' ? customTheme : activeTheme;
    const jsonStr = JSON.stringify(themeToExport, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${themeToExport.name.toLowerCase().replace(/\s+/g, '_')}_theme.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportTheme = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const importedTheme = JSON.parse(evt.target?.result as string) as AppTheme;
        if (importedTheme.background && importedTheme.accent) {
          importedTheme.id = `imported-${Date.now()}`;
          importedTheme.isCustom = true;
          setCustomTheme(importedTheme);
          setActiveTheme(importedTheme);
          applyTheme(importedTheme);
          setActiveTab('custom');
          alert(`Theme "${importedTheme.name}" imported and applied successfully!`);
        } else {
          alert('Invalid theme file structure.');
        }
      } catch (err) {
        alert('Failed to parse theme JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleCopyThemeJson = () => {
    const themeToCopy = activeTab === 'custom' ? customTheme : activeTheme;
    navigator.clipboard.writeText(JSON.stringify(themeToCopy, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 select-none shadow-xl">
      {/* Header & Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2">
          <Palette className="text-indigo-400" size={20} />
          <div>
            <h3 className="text-sm font-bold text-slate-100">Theme Engine & Customizer</h3>
            <p className="text-xs text-slate-400">Choose from presets or design your own shareable theme</p>
          </div>
        </div>

        {/* Preset vs Custom tabs */}
        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('presets')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'presets'
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Presets
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center space-x-1 ${
              activeTab === 'custom'
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles size={13} />
            <span>Custom Builder</span>
          </button>
        </div>
      </div>

      {/* TAB 1: PRESETS GRID */}
      {activeTab === 'presets' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {PRESET_THEMES.map((theme) => {
            const isSelected = activeTheme.id === theme.id;
            const folderCol = theme.folderIconColor || '#f59e0b';
            const cardCol = theme.cardIconColor || theme.accent || '#818cf8';

            return (
              <button
                key={theme.id}
                onClick={() => handleSelectPreset(theme)}
                className={`p-4 rounded-xl text-left border transition-all relative overflow-hidden group flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'border-indigo-500 ring-2 ring-indigo-500/30 bg-slate-950/80 shadow-lg'
                    : 'border-slate-800 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-950/60'
                }`}
              >
                {/* Mini Preview Box */}
                <div
                  style={{ background: theme.background, borderColor: theme.border }}
                  className="w-full h-20 rounded-lg p-2 border flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <Folder size={12} style={{ color: folderCol }} />
                      <FileText size={12} style={{ color: cardCol }} />
                    </div>
                    <div
                      style={{ background: theme.accent }}
                      className="w-3 h-3 rounded-full shadow-sm"
                    />
                  </div>

                  <div
                    style={{ background: theme.cardBg, borderColor: theme.border, color: theme.foreground }}
                    className="text-[9px] px-2 py-1 rounded border font-semibold flex items-center justify-between"
                  >
                    <span className="truncate">Card Preview</span>
                    <span style={{ color: cardCol }} className="text-[10px] font-mono">✦</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200">{theme.name}</span>
                  {isSelected && <Check size={14} className="text-indigo-400" />}
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        /* TAB 2: CUSTOM THEME CONFIGURATOR */
        <div className="space-y-6">
          {/* Custom Colors Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Theme Name */}
            <div className="col-span-full">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Theme Name
              </label>
              <input
                type="text"
                value={customTheme.name}
                onChange={(e) => handleCustomColorChange('name', e.target.value)}
                placeholder="My Awesome Theme"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Folder Symbol Color */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Folder size={16} style={{ color: customTheme.folderIconColor || '#f59e0b' }} />
                <div>
                  <label className="text-xs font-medium text-slate-200 block">Folder Symbol Color</label>
                  <span className="text-[10px] font-mono text-slate-500">{customTheme.folderIconColor || '#f59e0b'}</span>
                </div>
              </div>
              <input
                type="color"
                value={customTheme.folderIconColor || '#f59e0b'}
                onChange={(e) => handleCustomColorChange('folderIconColor', e.target.value)}
                className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
              />
            </div>

            {/* Flashcard Symbol Color */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText size={16} style={{ color: customTheme.cardIconColor || '#818cf8' }} />
                <div>
                  <label className="text-xs font-medium text-slate-200 block">Flashcard Symbol Color</label>
                  <span className="text-[10px] font-mono text-slate-500">{customTheme.cardIconColor || '#818cf8'}</span>
                </div>
              </div>
              <input
                type="color"
                value={customTheme.cardIconColor || '#818cf8'}
                onChange={(e) => handleCustomColorChange('cardIconColor', e.target.value)}
                className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
              />
            </div>

            {/* Background Color */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <label className="text-xs font-medium text-slate-200 block">Background</label>
                <span className="text-[10px] font-mono text-slate-500">{customTheme.background}</span>
              </div>
              <input
                type="color"
                value={customTheme.background}
                onChange={(e) => handleCustomColorChange('background', e.target.value)}
                className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
              />
            </div>

            {/* Surface Color */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <label className="text-xs font-medium text-slate-200 block">Surface / Sidebar</label>
                <span className="text-[10px] font-mono text-slate-500">{customTheme.surface}</span>
              </div>
              <input
                type="color"
                value={customTheme.surface}
                onChange={(e) => handleCustomColorChange('surface', e.target.value)}
                className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
              />
            </div>

            {/* Card Background */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <label className="text-xs font-medium text-slate-200 block">Card Background</label>
                <span className="text-[10px] font-mono text-slate-500">{customTheme.cardBg}</span>
              </div>
              <input
                type="color"
                value={customTheme.cardBg}
                onChange={(e) => handleCustomColorChange('cardBg', e.target.value)}
                className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
              />
            </div>

            {/* Accent Color */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <label className="text-xs font-medium text-slate-200 block">Accent Color</label>
                <span className="text-[10px] font-mono text-slate-500">{customTheme.accent}</span>
              </div>
              <input
                type="color"
                value={customTheme.accent}
                onChange={(e) => {
                  handleCustomColorChange('accent', e.target.value);
                  handleCustomColorChange('accentHover', e.target.value);
                }}
                className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
              />
            </div>

            {/* Border Color */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <label className="text-xs font-medium text-slate-200 block">Border Stroke</label>
                <span className="text-[10px] font-mono text-slate-500">{customTheme.border}</span>
              </div>
              <input
                type="color"
                value={customTheme.border}
                onChange={(e) => handleCustomColorChange('border', e.target.value)}
                className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
              />
            </div>

            {/* Foreground Text */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <label className="text-xs font-medium text-slate-200 block">Text Color</label>
                <span className="text-[10px] font-mono text-slate-500">{customTheme.foreground}</span>
              </div>
              <input
                type="color"
                value={customTheme.foreground}
                onChange={(e) => handleCustomColorChange('foreground', e.target.value)}
                className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
              />
            </div>
          </div>
        </div>
      )}

      {/* Share & Import Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
        <div className="flex items-center space-x-2">
          {/* Export / Download JSON */}
          <button
            onClick={handleExportTheme}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center space-x-1.5 transition-colors"
          >
            <Download size={14} />
            <span>Download Theme JSON</span>
          </button>

          {/* Import JSON */}
          <label className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center space-x-1.5 cursor-pointer transition-colors">
            <Upload size={14} />
            <span>Import Theme</span>
            <input type="file" accept=".json" onChange={handleImportTheme} className="hidden" />
          </label>
        </div>

        {/* Copy Theme Snippet */}
        <button
          onClick={handleCopyThemeJson}
          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-all shadow-md shadow-indigo-600/30 flex items-center space-x-1.5"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          <span>{copied ? 'Theme JSON Copied!' : 'Share Theme (Copy JSON)'}</span>
        </button>
      </div>
    </div>
  );
};
