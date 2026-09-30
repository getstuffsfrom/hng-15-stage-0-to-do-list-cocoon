import React, { useState } from 'react';
import { BiomeCategory, PriorityTier, QuestTask } from '../types';
import { BIOME_CONFIG } from '../utils/storage';
import { PixelCheck, PixelXpOrb } from './PixelIcons';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface TaskBoardProps {
  tasks: QuestTask[];
  onUpdateTasks: (tasks: QuestTask[]) => void;
  onAddXp: (amount: number) => void;
  selectedCategory: BiomeCategory | 'all';
  onSelectCategory: (cat: BiomeCategory | 'all') => void;
  onOpenNewTaskModal: () => void;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({
  tasks,
  onUpdateTasks,
  onAddXp,
  selectedCategory,
  onSelectCategory,
  onOpenNewTaskModal,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed' | 'pinned'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  // Toggle task completion
  const handleToggleTask = (task: QuestTask) => {
    const nextCompleted = !task.completed;
    sound.playPop();

    if (nextCompleted) {
      sound.playLevelUp();
      onAddXp(task.xpReward);
      // Small sparkle confetti burst
      try {
        confetti({
          particleCount: 28,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#55ff55', '#d6859e', '#ab79d6', '#ffe08a'],
          disableForReducedMotion: true,
        });
      } catch {
        // Confetti fallback
      }
    }

    const updated = tasks.map((t) =>
      t.id === task.id ? { ...t, completed: nextCompleted } : t
    );
    onUpdateTasks(updated);
  };

  // Toggle subtask
  const handleToggleSubtask = (taskId: string, subId: string) => {
    sound.playPop();
    const updated = tasks.map((t) => {
      if (t.id !== taskId) return t;
      const nextSubs = t.subtasks.map((s) =>
        s.id === subId ? { ...s, completed: !s.completed } : s
      );
      // If all subtasks are done, mark main task as completed too
      const allDone = nextSubs.length > 0 && nextSubs.every((s) => s.completed);
      return {
        ...t,
        subtasks: nextSubs,
        completed: allDone ? true : t.completed,
      };
    });
    onUpdateTasks(updated);
  };

  // Toggle pin
  const handleTogglePin = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    const updated = tasks.map((t) =>
      t.id === taskId ? { ...t, pinned: !t.pinned } : t
    );
    onUpdateTasks(updated);
  };

  // Delete task
  const handleDeleteTask = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    const updated = tasks.filter((t) => t.id !== taskId);
    onUpdateTasks(updated);
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    // Biome category
    if (selectedCategory !== 'all' && task.category !== selectedCategory) {
      return false;
    }
    // Status
    if (filterStatus === 'active' && task.completed) return false;
    if (filterStatus === 'completed' && !task.completed) return false;
    if (filterStatus === 'pinned' && !task.pinned) return false;
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchDesc = task.description.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc) return false;
    }
    return true;
  });

  // Sort pinned first, then uncompleted, then newest
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return b.createdAt - a.createdAt;
  });

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const getPriorityLabel = (priority: PriorityTier) => {
    switch (priority) {
      case 'emerald':
        return { name: 'Emerald Tier', color: '#55ff55' };
      case 'diamond':
        return { name: 'Diamond Tier', color: '#55ffff' };
      case 'amethyst':
        return { name: 'Amethyst Tier', color: '#d8b4fe' };
      case 'netherite':
        return { name: 'Netherite Tier', color: '#908d96' };
      case 'gold':
        return { name: 'Gold Tier', color: '#ffe08a' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview & Progress Header */}
      <div className="mc-container p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="mc-font-hud text-3xl sm:text-4xl text-[#fff] tracking-wide">
            Adventure Quest Board
          </h1>
          {/* Zero-Pill metadata with separators */}
          <div className="flex items-center gap-2 text-xs text-[#a59eb8] mt-1">
            <span>{tasks.length} Total Quests</span>
            <span aria-hidden="true">·</span>
            <span>{completedCount} Cleared</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#55ff55] font-medium">{progressPct}% Log Completion</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Search bar */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search quests..."
              className="bg-[#151220] border-2 border-[#2b253c] text-xs text-white px-3 py-1.5 focus:border-[#ab79d6] outline-none w-44 sm:w-56"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[#8c82a2] hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* New Quest Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenNewTaskModal();
            }}
            className="mc-button mc-button-primary px-4 py-1.5 text-xs mc-font-pixel font-semibold whitespace-nowrap"
          >
            + Add Quest
          </button>
        </div>
      </div>

      {/* Filter Segmented Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#191526] p-2.5 border border-[#2b253c]">
        {/* Status tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'active', 'completed', 'pinned'] as const).map((status) => (
            <button
              key={status}
              onClick={() => {
                sound.playClick();
                setFilterStatus(status);
              }}
              className={`px-3 py-1 text-xs mc-font-pixel font-medium capitalize whitespace-nowrap transition-colors ${
                filterStatus === status
                  ? 'bg-[#372f4e] text-white border-b-2 border-[#e5a84b]'
                  : 'text-[#9f96b5] hover:text-white'
              }`}
            >
              {status === 'all' ? 'All Quests' : status}
            </button>
          ))}
        </div>

        {/* Biome quick filter dropdown/tabs */}
        <div className="flex items-center gap-1.5 text-xs text-[#a59eb8]">
          <span className="mc-font-hud text-sm">Biome:</span>
          <select
            value={selectedCategory}
            onChange={(e) => {
              sound.playClick();
              onSelectCategory(e.target.value as BiomeCategory | 'all');
            }}
            aria-label="Filter quests by biome category"
            className="bg-[#13101c] border border-[#2b253c] text-white text-xs px-2 py-1 outline-none"
          >
            <option value="all">All Biomes</option>
            {Object.entries(BIOME_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>
                {config.icon} {config.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {sortedTasks.length === 0 ? (
          <div className="mc-container p-10 text-center space-y-3">
            <div className="text-3xl">📜</div>
            <h3 className="mc-font-hud text-2xl text-white">No quests found</h3>
            <p className="text-xs text-[#9d93b3] max-w-sm mx-auto">
              Your journal is clean in this biome. Create a new quest to begin your expedition!
            </p>
            <button
              onClick={() => {
                sound.playClick();
                onOpenNewTaskModal();
              }}
              className="mc-button mc-button-cherry px-4 py-1.5 text-xs mc-font-pixel font-semibold inline-block"
            >
              + Create First Quest
            </button>
          </div>
        ) : (
          sortedTasks.map((task) => {
            const biome = BIOME_CONFIG[task.category];
            const isExpanded = expandedTaskId === task.id;
            const priorityInfo = getPriorityLabel(task.priority);

            return (
              <div
                key={task.id}
                className={`mc-panel-dark p-3.5 sm:p-4 transition-all border-l-4 ${
                  task.completed ? 'opacity-65' : ''
                }`}
                style={{ borderLeftColor: biome.color }}
              >
                <div className="flex items-start gap-3">
                  {/* Minecraft Checkbox Button */}
                  <button
                    onClick={() => handleToggleTask(task)}
                    title={task.completed ? 'Mark uncompleted' : 'Mark completed'}
                    className={`w-6 h-6 shrink-0 mt-0.5 mc-slot flex items-center justify-center cursor-pointer transition-transform hover:scale-110 active:scale-95 ${
                      task.completed ? 'bg-[#293a1c] border-[#55ff55]' : ''
                    }`}
                  >
                    <PixelCheck checked={task.completed} size={15} />
                  </button>

                  {/* Task Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3
                          onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                          className={`text-base font-semibold cursor-pointer transition-colors text-white hover:text-[#d8b4fe] ${
                            task.completed ? 'line-through text-[#827a94]' : ''
                          }`}
                        >
                          {task.title}
                        </h3>

                        {/* Unboxed Metadata Line per Anti-Pill Discipline */}
                        <div className="flex items-center gap-2 text-xs text-[#a59eb8] mt-1 flex-wrap">
                          <span style={{ color: biome.color }}>
                            {biome.icon} {biome.name}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span style={{ color: priorityInfo.color }}>
                            {priorityInfo.name}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="flex items-center gap-1 text-[#55ff55]">
                            <PixelXpOrb size={12} /> +{task.xpReward} XP
                          </span>
                          {task.dueDate && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="text-[#e5ad35]">{task.dueDate}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Right Pin & Delete controls */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={(e) => handleTogglePin(task.id, e)}
                          title={task.pinned ? 'Unpin Quest' : 'Pin to Top'}
                          className={`p-1 text-xs hover:text-white transition-colors ${
                            task.pinned ? 'text-[#ffe08a]' : 'text-[#6c6482]'
                          }`}
                        >
                          {task.pinned ? '★' : '☆'}
                        </button>
                        <button
                          onClick={(e) => handleDeleteTask(task.id, e)}
                          title="Delete Quest"
                          className="p-1 text-xs text-[#7d7593] hover:text-[#ff6b6b] transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    {/* Task Description */}
                    {task.description && (
                      <p className="text-xs text-[#c3bdd3] mt-2 leading-relaxed">
                        {task.description}
                      </p>
                    )}

                    {/* Subtasks Section */}
                    {task.subtasks && task.subtasks.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-[#2a243a]">
                        <div className="text-xs text-[#9d93b3] mb-1.5 flex items-center justify-between">
                          <span>
                            Subtasks ({task.subtasks.filter((s) => s.completed).length}/
                            {task.subtasks.length})
                          </span>
                        </div>
                        <div className="space-y-1.5">
                          {task.subtasks.map((sub) => (
                            <div
                              key={sub.id}
                              onClick={() => handleToggleSubtask(task.id, sub.id)}
                              className="flex items-center gap-2 cursor-pointer group text-xs text-[#ded8ea] hover:text-white"
                            >
                              <span
                                className={`w-3.5 h-3.5 mc-slot flex items-center justify-center shrink-0 ${
                                  sub.completed ? 'bg-[#293a1c] border-[#55ff55]' : ''
                                }`}
                              >
                                {sub.completed && <PixelCheck size={10} />}
                              </span>
                              <span className={sub.completed ? 'line-through text-[#79728d]' : ''}>
                                {sub.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
