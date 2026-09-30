import React from 'react';
import { PlayerStats, QuestTask, QuillNote } from '../types';
import { PixelHeart, PixelHunger, PixelXpOrb } from './PixelIcons';
import { sound } from '../utils/audio';

interface StatsViewProps {
  stats: PlayerStats;
  tasks: QuestTask[];
  notes: QuillNote[];
}

export const StatsView: React.FC<StatsViewProps> = ({
  stats,
  tasks,
  notes,
}) => {
  const completedCount = tasks.filter((t) => t.completed).length;

  const achievements = [
    {
      id: 'ach-1',
      title: 'Taking Inventory',
      desc: 'Open your notebook and record your initial quest.',
      unlocked: true,
      icon: '📦',
      xp: 20,
    },
    {
      id: 'ach-2',
      title: 'Botanist Bloom',
      desc: 'Complete a quest in the Cherry Grove biome.',
      unlocked: tasks.some((t) => t.category === 'cherry_grove' && t.completed),
      icon: '🌸',
      xp: 35,
    },
    {
      id: 'ach-3',
      title: 'Lush Cave Wanderer',
      desc: 'Plant glowberries or cultivate your cozy study space.',
      unlocked: tasks.some((t) => t.category === 'lush_cave' && t.completed),
      icon: '🌿',
      xp: 35,
    },
    {
      id: 'ach-4',
      title: 'Defier of Gravity',
      desc: 'Launch a voxel block into zero-G orbit.',
      unlocked: true,
      icon: '🌌',
      xp: 50,
    },
    {
      id: 'ach-5',
      title: 'Parchment Scholar',
      desc: 'Inscribe at least 3 pages of research in your Book & Quill.',
      unlocked: notes.some((n) => n.pages.length >= 2),
      icon: '🪶',
      xp: 40,
    },
    {
      id: 'ach-6',
      title: 'Netherite Perseverance',
      desc: 'Conquer 5 high-priority challenge quests.',
      unlocked: completedCount >= 5,
      icon: '⛏️',
      xp: 100,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mc-container p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <PixelXpOrb size={26} />
            <h1 className="mc-font-hud text-3xl sm:text-4xl text-white">
              Explorer Stats & Advancements
            </h1>
          </div>
          {/* Zero-Pill metadata */}
          <div className="flex items-center gap-2 text-xs text-[#a59eb8] mt-1">
            <span>Level {stats.level} Explorer</span>
            <span aria-hidden="true">·</span>
            <span>{stats.xp} Total XP</span>
            <span aria-hidden="true">·</span>
            <span>{stats.currentStreakDays} Day Streak</span>
          </div>
        </div>
      </div>

      {/* Metrics Row (Constitution: Tabular numerals, unboxed clean layout) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="mc-container p-4">
          <div className="text-xs text-[#a59eb8]">Quests Cleared</div>
          <div className="mc-font-hud text-3xl sm:text-4xl text-white font-bold tabular-nums mt-1">
            {completedCount}
          </div>
          <div className="text-[11px] text-[#55ff55] mt-1">
            +{completedCount * 30} XP Earned
          </div>
        </div>

        <div className="mc-container p-4">
          <div className="text-xs text-[#a59eb8]">Active Quests</div>
          <div className="mc-font-hud text-3xl sm:text-4xl text-[#ffe08a] font-bold tabular-nums mt-1">
            {tasks.length - completedCount}
          </div>
          <div className="text-[11px] text-[#a59eb8] mt-1">
            Ready to tackle
          </div>
        </div>

        <div className="mc-container p-4">
          <div className="text-xs text-[#a59eb8]">Field Notes</div>
          <div className="mc-font-hud text-3xl sm:text-4xl text-[#f2a7be] font-bold tabular-nums mt-1">
            {notes.length}
          </div>
          <div className="text-[11px] text-[#a59eb8] mt-1">
            Parchment scrolls
          </div>
        </div>

        <div className="mc-container p-4">
          <div className="text-xs text-[#a59eb8]">Streak Discipline</div>
          <div className="mc-font-hud text-3xl sm:text-4xl text-[#55ffff] font-bold tabular-nums mt-1">
            {stats.currentStreakDays}d
          </div>
          <div className="text-[11px] text-[#a59eb8] mt-1">
            Daily adventure
          </div>
        </div>
      </div>

      {/* Advancements List */}
      <div className="mc-container p-5">
        <h3 className="mc-font-hud text-2xl text-white mb-4">
          Minecraft Advancements
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              onClick={() => {
                if (ach.unlocked) sound.playLevelUp();
                else sound.playClick();
              }}
              className={`p-3.5 border-2 transition-all cursor-pointer ${
                ach.unlocked
                  ? 'bg-[#211a30] border-[#55ff55] shadow-sm'
                  : 'bg-[#151220] border-[#251f33] opacity-60'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 mc-slot flex items-center justify-center text-xl shrink-0 ${
                    ach.unlocked ? 'border-[#55ff55]' : ''
                  }`}
                >
                  {ach.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-sm font-bold text-white truncate">
                      {ach.title}
                    </h4>
                    <span className="mc-font-hud text-xs text-[#ffe08a] shrink-0">
                      +{ach.xp} XP
                    </span>
                  </div>

                  <p className="text-xs text-[#b0a8c2] mt-1 leading-relaxed">
                    {ach.desc}
                  </p>

                  <div className="text-[11px] text-[#55ff55] mt-1.5 font-semibold">
                    {ach.unlocked ? '✓ ADVANCEMENT UNLOCKED' : '🔒 LOCKED'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
