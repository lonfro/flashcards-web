'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart3,
  Calendar,
  Flame,
  CheckCircle2,
  TrendingUp,
  RotateCcw,
  Clock,
  BookOpen,
  Award,
  Layers,
  Sparkles,
} from 'lucide-react';
import { NodeData } from '../types/flashcard';
import { StudyLogEntry, DeckMasteryStat } from '../types/stats';
import { idbGetStudyLogs, idbClearStudyLogs } from '../utils/db';
import { syncStudyStats } from '../utils/googleDriveSync';
import { useSync } from '../context';

interface XamlStatsPageProps {
  nodes: NodeData[];
  onGoToRevision?: () => void;
}

export const XamlStatsPage: React.FC<XamlStatsPageProps> = ({ nodes, onGoToRevision }) => {
  const { accessToken } = useSync();
  const [logs, setLogs] = useState<StudyLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [timeRange, setTimeRange] = useState<'7d' | '14d' | '30d' | 'all'>('14d');

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      if (accessToken) {
        await syncStudyStats(accessToken);
      }
      const data = await idbGetStudyLogs(500);
      setLogs(data);
    } catch (e) {
      console.error('Failed to load study logs:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [accessToken]);

  const handleClearHistory = async () => {
    if (confirm('Are you sure you want to clear all revision and study history logs? (Card weights and decks will remain intact)')) {
      await idbClearStudyLogs();
      setLogs([]);
    }
  };

  // Card stats computation
  const cardNodes = useMemo(() => nodes.filter((n) => n.type === 'card' && n.card), [nodes]);

  // Deck Mastery Breakdown
  const deckMastery = useMemo<DeckMasteryStat[]>(() => {
    const dividers = nodes.filter((n) => n.type === 'divider');
    const stats: DeckMasteryStat[] = [];

    // Root / All cards summary
    let rootMastered = 0;
    let rootLearning = 0;
    let rootStruggling = 0;

    for (const c of cardNodes) {
      const w = c.card?.weight ?? 20;
      if (w <= 8) rootMastered++;
      else if (w <= 20) rootLearning++;
      else rootStruggling++;
    }

    stats.push({
      deckId: null,
      deckName: 'All Cards (Total Library)',
      totalCards: cardNodes.length,
      masteredCards: rootMastered,
      learningCards: rootLearning,
      newOrStruggling: rootStruggling,
      masteryPercentage: cardNodes.length > 0 ? Math.round((rootMastered / cardNodes.length) * 100) : 0,
    });

    for (const div of dividers) {
      // Find cards under this divider
      const deckCards = nodes.filter((n) => n.type === 'card' && n.parentId === div.id && n.card);
      let mastered = 0;
      let learning = 0;
      let struggling = 0;

      for (const c of deckCards) {
        const w = c.card?.weight ?? 20;
        if (w <= 8) mastered++;
        else if (w <= 20) learning++;
        else struggling++;
      }

      if (deckCards.length > 0) {
        stats.push({
          deckId: div.id,
          deckName: div.name,
          totalCards: deckCards.length,
          masteredCards: mastered,
          learningCards: learning,
          newOrStruggling: struggling,
          masteryPercentage: deckCards.length > 0 ? Math.round((mastered / deckCards.length) * 100) : 0,
        });
      }
    }

    return stats;
  }, [nodes, cardNodes]);

  // Overall KPIs
  const totalReviews = logs.length;
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayReviews = logs.filter((l) => l.date === todayStr).length;

  // Calculate study streak (consecutive days with at least 1 review)
  const streakDays = useMemo(() => {
    if (logs.length === 0) return 0;
    const distinctDates = Array.from(new Set(logs.map((l) => l.date))).sort().reverse();
    if (distinctDates.length === 0) return 0;

    let streak = 0;
    let checkDate = new Date();

    // If no reviews today yet, check if studied yesterday to keep streak alive
    const todayFormatted = checkDate.toISOString().slice(0, 10);
    if (!distinctDates.includes(todayFormatted)) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (true) {
      const dateStr = checkDate.toISOString().slice(0, 10);
      if (distinctDates.includes(dateStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }, [logs]);

  // Difficulty counts
  const difficultyCounts = useMemo(() => {
    const counts = { again: 0, hard: 0, good: 0, easy: 0 };
    for (const log of logs) {
      if (log.difficulty === 0 || log.difficultyName === 'Again') counts.again++;
      else if (log.difficulty === 1 || log.difficultyName === 'Hard') counts.hard++;
      else if (log.difficulty === 2 || log.difficultyName === 'Good') counts.good++;
      else if (log.difficulty === 3 || log.difficultyName === 'Easy') counts.easy++;
    }
    return counts;
  }, [logs]);

  // Activity Timeline
  const activityData = useMemo(() => {
    const daysToShow = timeRange === '7d' ? 7 : timeRange === '14d' ? 14 : timeRange === '30d' ? 30 : 30;
    const result: { date: string; label: string; count: number }[] = [];

    const dateMap: Record<string, number> = {};
    for (const l of logs) {
      dateMap[l.date] = (dateMap[l.date] || 0) + 1;
    }

    for (let i = daysToShow - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString(undefined, { weekday: 'short', month: 'numeric', day: 'numeric' });
      result.push({
        date: dStr,
        label,
        count: dateMap[dStr] || 0,
      });
    }

    return result;
  }, [logs, timeRange]);

  const maxActivityCount = Math.max(1, ...activityData.map((d) => d.count));

  // Overall library mastery percentage
  const totalMasteredCards = cardNodes.filter((c) => (c.card?.weight ?? 20) <= 8).length;
  const overallMastery = cardNodes.length > 0 ? Math.round((totalMasteredCards / cardNodes.length) * 100) : 0;

  return (
    <div className="flex-1 h-full p-4 sm:p-8 overflow-y-auto max-w-5xl mx-auto space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center space-x-2">
            <BarChart3 size={24} className="text-emerald-400" />
            <span>Study Statistics & Insights</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track daily revision volume, memory retention, difficulty distributions, and deck mastery
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={loadLogs}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg border border-slate-700 transition-colors flex items-center space-x-1.5"
            title="Refresh statistics"
          >
            <RotateCcw size={13} className={isLoading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>

          {logs.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 text-xs font-medium rounded-lg border border-rose-500/30 transition-colors"
            >
              Clear Logs
            </button>
          )}
        </div>
      </div>

      {/* Hero Metric KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Reviews */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Reviews</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-bold text-slate-100">{totalReviews}</span>
            <p className="text-[11px] text-slate-500 mt-0.5">Recorded card ratings</p>
          </div>
        </div>

        {/* Reviews Today */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Studied Today</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Calendar size={18} />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-bold text-slate-100">{todayReviews}</span>
            <p className="text-[11px] text-slate-500 mt-0.5">Cards revised today</p>
          </div>
        </div>

        {/* Current Daily Streak */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Daily Streak</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Flame size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-1.5">
            <span className="text-2xl sm:text-3xl font-bold text-amber-400">{streakDays}</span>
            <span className="text-xs font-semibold text-slate-400">{streakDays === 1 ? 'day' : 'days'}</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">{streakDays > 0 ? '🔥 Keep it going!' : 'Study today to start!'}</p>
        </div>

        {/* Overall Mastery Rate */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Mastery Rate</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Sparkles size={18} />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-bold text-purple-300">{overallMastery}%</span>
            <p className="text-[11px] text-slate-500 mt-0.5">{totalMasteredCards} of {cardNodes.length} cards mastered</p>
          </div>
        </div>
      </div>

      {/* Activity Bar Chart & Difficulty Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Activity Timeline */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center space-x-2">
              <TrendingUp size={18} className="text-indigo-400" />
              <h2 className="text-sm font-bold text-slate-200">Daily Review Activity</h2>
            </div>
            <div className="flex items-center space-x-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[11px]">
              {(['7d', '14d', '30d'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={`px-2 py-0.5 rounded font-medium transition-colors ${
                    timeRange === r ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Histogram Bar Chart */}
          <div className="h-44 sm:h-52 flex items-end justify-between gap-1 sm:gap-2 pt-6 pb-2 px-1">
            {activityData.map((day) => {
              const heightPercent = maxActivityCount > 0 ? Math.max(8, (day.count / maxActivityCount) * 100) : 8;
              const isToday = day.date === todayStr;

              return (
                <div key={day.date} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                  {/* Tooltip on hover */}
                  <div className="absolute -top-7 bg-slate-950 text-slate-200 border border-slate-800 px-2 py-0.5 rounded text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md z-20 font-mono">
                    {day.label}: {day.count} reviews
                  </div>

                  <div className="w-full max-w-[28px] bg-slate-800/60 rounded-t-md relative flex flex-col justify-end overflow-hidden h-full">
                    <div
                      style={{ height: `${day.count > 0 ? heightPercent : 0}%` }}
                      className={`w-full rounded-t-md transition-all duration-300 ${
                        isToday ? 'bg-gradient-to-t from-emerald-600 to-emerald-400' : 'bg-gradient-to-t from-indigo-700 to-indigo-500'
                      }`}
                    />
                  </div>
                  <span className="text-[9px] text-slate-500 mt-1 truncate w-full text-center font-mono">
                    {day.date.slice(8)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Difficulty Distribution */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4 shadow-lg flex flex-col justify-between">
          <div className="border-b border-slate-800/80 pb-3">
            <h2 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
              <Award size={18} className="text-amber-400" />
              <span>Response Accuracy</span>
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">Rating breakdown across all sessions</p>
          </div>

          <div className="space-y-3 flex-1 flex flex-col justify-center">
            {/* Easy */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-emerald-400 font-semibold">Easy (4)</span>
                <span className="text-slate-300 font-mono">
                  {difficultyCounts.easy} ({totalReviews > 0 ? Math.round((difficultyCounts.easy / totalReviews) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${totalReviews > 0 ? (difficultyCounts.easy / totalReviews) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Good */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-indigo-400 font-semibold">Good (3)</span>
                <span className="text-slate-300 font-mono">
                  {difficultyCounts.good} ({totalReviews > 0 ? Math.round((difficultyCounts.good / totalReviews) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${totalReviews > 0 ? (difficultyCounts.good / totalReviews) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Hard */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-amber-400 font-semibold">Hard (2)</span>
                <span className="text-slate-300 font-mono">
                  {difficultyCounts.hard} ({totalReviews > 0 ? Math.round((difficultyCounts.hard / totalReviews) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${totalReviews > 0 ? (difficultyCounts.hard / totalReviews) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Again */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-rose-400 font-semibold">Again (1)</span>
                <span className="text-slate-300 font-mono">
                  {difficultyCounts.again} ({totalReviews > 0 ? Math.round((difficultyCounts.again / totalReviews) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-rose-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${totalReviews > 0 ? (difficultyCounts.again / totalReviews) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deck Mastery Overview Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4 shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center space-x-2">
            <Layers size={18} className="text-purple-400" />
            <h2 className="text-sm font-bold text-slate-200">Deck Retention & Mastery Status</h2>
          </div>
          <span className="text-xs text-slate-400">{deckMastery.length} decks</span>
        </div>

        <div className="space-y-3">
          {deckMastery.map((deck) => (
            <div key={deck.deckId || 'root'} className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BookOpen size={15} className="text-indigo-400 shrink-0" />
                  <span className="text-xs font-semibold text-slate-200">{deck.deckName}</span>
                </div>
                <div className="flex items-center space-x-3 text-xs">
                  <span className="text-emerald-400 font-mono font-semibold">{deck.masteryPercentage}% Mastered</span>
                  <span className="text-slate-500 font-mono">({deck.totalCards} cards)</span>
                </div>
              </div>

              {/* Segmented Progress Bar */}
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden flex">
                <div
                  title={`Mastered: ${deck.masteredCards}`}
                  className="bg-emerald-500 h-2 transition-all duration-300"
                  style={{ width: `${deck.totalCards > 0 ? (deck.masteredCards / deck.totalCards) * 100 : 0}%` }}
                />
                <div
                  title={`Learning: ${deck.learningCards}`}
                  className="bg-indigo-500 h-2 transition-all duration-300"
                  style={{ width: `${deck.totalCards > 0 ? (deck.learningCards / deck.totalCards) * 100 : 0}%` }}
                />
                <div
                  title={`Needs Review: ${deck.newOrStruggling}`}
                  className="bg-amber-500 h-2 transition-all duration-300"
                  style={{ width: `${deck.totalCards > 0 ? (deck.newOrStruggling / deck.totalCards) * 100 : 0}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  <span>Mastered: {deck.masteredCards}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />
                  <span>Learning: {deck.learningCards}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                  <span>Needs Review: {deck.newOrStruggling}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Revision History Log */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4 shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center space-x-2">
            <Clock size={18} className="text-slate-400" />
            <h2 className="text-sm font-bold text-slate-200">Recent Review Activity Log</h2>
          </div>
          <span className="text-xs text-slate-400">{logs.length} entries</span>
        </div>

        {logs.length === 0 ? (
          <div className="p-8 text-center text-slate-500 space-y-2">
            <BookOpen size={28} className="mx-auto opacity-40" />
            <p className="text-xs">No reviews recorded yet. Start a revision session to track your learning progress!</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60 max-h-80 overflow-y-auto pr-1">
            {logs.slice(0, 50).map((log) => {
              const diffColors: Record<string, string> = {
                Again: 'bg-rose-950 text-rose-300 border-rose-500/40',
                Hard: 'bg-amber-950 text-amber-300 border-amber-500/40',
                Good: 'bg-indigo-950 text-indigo-300 border-indigo-500/40',
                Easy: 'bg-emerald-950 text-emerald-300 border-emerald-500/40',
              };

              const colorCls = diffColors[log.difficultyName] || 'bg-slate-800 text-slate-300 border-slate-700';

              return (
                <div key={log.id} className="py-2.5 flex items-center justify-between text-xs gap-3">
                  <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${colorCls} shrink-0`}
                    >
                      {log.difficultyName}
                    </span>
                    <span className="font-medium text-slate-200 truncate">{log.cardName}</span>
                    <span className="text-[11px] text-slate-500 truncate hidden sm:inline">({log.deckName})</span>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0 text-slate-400 font-mono text-[11px]">
                    <span className="hidden sm:inline">Weight: {log.weight.toFixed(1)}</span>
                    <span>{new Date(log.reviewedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
