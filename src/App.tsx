/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { ActiveTab, BiomeCategory, PlayerStats, QuestTask, QuillNote } from './types';
import { Storage } from './utils/storage';
import { sound } from './utils/audio';
import { PlayerHUD } from './components/PlayerHUD';
import { Hotbar } from './components/Hotbar';
import { TaskBoard } from './components/TaskBoard';
import { BookAndQuill } from './components/BookAndQuill';
import { AntiGravitySandbox } from './components/AntiGravitySandbox';
import { CategoriesView } from './components/CategoriesView';
import { CraftingTable } from './components/CraftingTable';
import { StatsView } from './components/StatsView';
import { DeployModal } from './components/DeployModal';
import { NewQuestModal } from './components/NewQuestModal';

export default function App() {
  const [tasks, setTasks] = useState<QuestTask[]>(() => Storage.getTasks());
  const [notes, setNotes] = useState<QuillNote[]>(() => Storage.getNotes());
  const [stats, setStats] = useState<PlayerStats>(() => Storage.getStats());

  const [activeTab, setActiveTab] = useState<ActiveTab>('tasks');
  const [selectedBiome, setSelectedBiome] = useState<BiomeCategory | 'all'>('all');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => sound.isEnabled());
  const [antiGravityActive, setAntiGravityActive] = useState<boolean>(false);

  const [isNewQuestModalOpen, setIsNewQuestModalOpen] = useState<boolean>(false);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState<boolean>(false);

  // Sync state to local storage
  useEffect(() => {
    Storage.saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    Storage.saveNotes(notes);
  }, [notes]);

  useEffect(() => {
    Storage.saveStats(stats);
  }, [stats]);

  // XP addition with level up threshold calculation
  const handleAddXp = useCallback((amount: number) => {
    setStats((prev) => {
      const nextXp = prev.xp + amount;
      const xpNeeded = prev.level * 25 + 50;
      let nextLevel = prev.level;
      if (nextXp >= nextLevel * (nextLevel * 25 + 50)) {
        nextLevel += 1;
      }
      return {
        ...prev,
        xp: nextXp,
        level: nextLevel,
        tasksCompleted: prev.tasksCompleted + 1,
      };
    });
  }, []);

  const handleToggleSound = () => {
    const nextState = sound.toggle();
    setSoundEnabled(nextState);
  };

  const handleToggleAntiGravity = () => {
    sound.playLevitation();
    setAntiGravityActive((prev) => !prev);
  };

  const handleCompleteTask = (task: QuestTask) => {
    sound.playPop();
    const updated = tasks.map((t) =>
      t.id === task.id ? { ...t, completed: !t.completed } : t
    );
    setTasks(updated);
    if (!task.completed) {
      sound.playLevelUp();
      handleAddXp(task.xpReward);
    }
  };

  const handleAddTasks = (newTasks: QuestTask[]) => {
    setTasks((prev) => [...newTasks, ...prev]);
  };

  const handleAddNote = (newNote: QuillNote) => {
    setNotes((prev) => [newNote, ...prev]);
  };

  // Determine shared link for submission
  const sharedUrl = typeof window !== 'undefined' 
    ? (window.location.origin.includes('dev') 
        ? window.location.origin.replace('-dev-', '-pre-') 
        : window.location.href)
    : 'https://ais-pre-yv5mgestnt6amjkvt6c3yp-556179056829.europe-west2.run.app';

  return (
    <div
      className={`min-h-screen pb-24 relative selection:bg-[#c97d93] selection:text-white transition-all duration-700 ${
        antiGravityActive ? 'bg-[#150f24]' : 'bg-[#120f1e]'
      }`}
    >
      {/* Background Pixel Grid Texture */}
      <div
        className="fixed inset-0 pointer-events-none opacity-40 z-0"
        style={{
          backgroundImage: `
            radial-gradient(#302647 1px, transparent 1px),
            linear-gradient(to right, rgba(255,255,255,0.015) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px, 48px 48px',
        }}
      />

      {/* Floating Anti-Gravity ambient drift particles when Zero-G is active */}
      {antiGravityActive && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2.5 h-2.5 rounded-none bg-[#f2a7be]/25 petal-drift pointer-events-none"
              style={{
                left: `${8 + i * 8}%`,
                animationDelay: `${i * 1.1}s`,
                animationDuration: `${12 + i * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Top Navigation Bar & Status HUD */}
      <PlayerHUD
        stats={stats}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        antiGravityActive={antiGravityActive}
        onToggleAntiGravity={handleToggleAntiGravity}
        onOpenQuickAdd={() => setIsNewQuestModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 relative z-20">
        {activeTab === 'tasks' && (
          <TaskBoard
            tasks={tasks}
            onUpdateTasks={setTasks}
            onAddXp={handleAddXp}
            selectedCategory={selectedBiome}
            onSelectCategory={setSelectedBiome}
            onOpenNewTaskModal={() => setIsNewQuestModalOpen(true)}
          />
        )}

        {activeTab === 'notes' && (
          <BookAndQuill
            notes={notes}
            onUpdateNotes={setNotes}
            onAddXp={handleAddXp}
          />
        )}

        {activeTab === 'antigravity' && (
          <AntiGravitySandbox
            tasks={tasks}
            notes={notes}
            onCompleteTask={handleCompleteTask}
            onOpenTaskModal={() => setIsNewQuestModalOpen(true)}
          />
        )}

        {activeTab === 'categories' && (
          <CategoriesView
            tasks={tasks}
            notes={notes}
            selectedBiome={selectedBiome}
            onSelectBiome={setSelectedBiome}
            onNavigateToTasks={() => setActiveTab('tasks')}
            onNavigateToNotes={() => setActiveTab('notes')}
          />
        )}

        {activeTab === 'crafting' && (
          <CraftingTable
            onAddTasks={handleAddTasks}
            onAddNote={handleAddNote}
            onAddXp={handleAddXp}
          />
        )}

        {activeTab === 'stats' && (
          <StatsView
            stats={stats}
            tasks={tasks}
            notes={notes}
          />
        )}

        {activeTab === 'deploy' && (
          <div className="mc-container p-8 text-center space-y-4">
            <h2 className="mc-font-hud text-3xl text-white">
              Ready to Host on Vercel or Netlify?
            </h2>
            <p className="text-xs text-[#b8b0ca] max-w-md mx-auto">
              You can submit your existing live link or push this codebase to GitHub and link to Vercel/Netlify in under 2 minutes.
            </p>
            <button
              onClick={() => setIsDeployModalOpen(true)}
              className="mc-button mc-button-primary px-6 py-2.5 text-xs mc-font-pixel font-bold"
            >
              Open Deployment & GitHub Hub
            </button>
          </div>
        )}
      </main>

      {/* Iconic Minecraft 9-Slot Hotbar (Fixed at bottom) */}
      <Hotbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenQuickAdd={() => setIsNewQuestModalOpen(true)}
        onOpenDeploy={() => setIsDeployModalOpen(true)}
      />

      {/* New Quest Modal */}
      <NewQuestModal
        isOpen={isNewQuestModalOpen}
        onClose={() => setIsNewQuestModalOpen(false)}
        onAddTask={(task) => {
          setTasks((prev) => [task, ...prev]);
        }}
        defaultBiome={selectedBiome !== 'all' ? selectedBiome : 'cherry_grove'}
      />

      {/* Deploy & GitHub Export Modal */}
      <DeployModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
        sharedUrl={sharedUrl}
      />
    </div>
  );
}
