import React from 'react';
import { ActiveTab, PlayerStats } from '../types';
import { PixelHeart, PixelHunger, PixelSpeaker } from './PixelIcons';
import { sound } from '../utils/audio';

interface PlayerHUDProps {
  stats: PlayerStats;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  antiGravityActive: boolean;
  onToggleAntiGravity: () => void;
  onOpenQuickAdd: () => void;
}

export const PlayerHUD: React.FC<PlayerHUDProps> = ({
  stats,
  activeTab,
  setActiveTab,
  soundEnabled,
  onToggleSound,
  antiGravityActive,
  onToggleAntiGravity,
  onOpenQuickAdd,
}) => {
  // Calculate XP fill percentage within current level (e.g. 0-100)
  const xpNeededForNextLevel = stats.level * 25 + 50;
  const currentLevelProgress = Math.min(100, Math.floor((stats.xp % xpNeededForNextLevel) / xpNeededForNextLevel * 100));

  return (
    <header className="border-b-2 border-[#191526] bg-[#1a1628]/95 sticky top-0 z-40 backdrop-blur-md">
      {/* 3-Zone Top Navigation Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('tasks');
            }}
            className="flex items-center gap-2 group text-left"
          >
            <span className="w-4 h-4 rounded-sm bg-[#c97d93] inline-block shadow-[1px_1px_0_#632b3c]" />
            <span className="mc-font-hud text-2xl tracking-wider text-[#ded8ea] group-hover:text-[#ffffff] transition-colors">
              VoxelQuill
            </span>
          </button>
        </div>

        {/* Zone 2: 4-6 Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#a59eb8]">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('tasks');
            }}
            className={`transition-colors hover:text-white ${
              activeTab === 'tasks' ? 'text-white border-b-2 border-[#e5a84b] pb-0.5 font-semibold' : ''
            }`}
          >
            Quest Log
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('notes');
            }}
            className={`transition-colors hover:text-white ${
              activeTab === 'notes' ? 'text-white border-b-2 border-[#c97d93] pb-0.5 font-semibold' : ''
            }`}
          >
            Book & Quill
          </button>
          <button
            onClick={() => {
              sound.playLevitation();
              setActiveTab('antigravity');
            }}
            className={`transition-colors hover:text-white flex items-center gap-1.5 ${
              activeTab === 'antigravity' ? 'text-[#e5c2ff] border-b-2 border-[#ab79d6] pb-0.5 font-semibold' : ''
            }`}
          >
            <span>Anti-Gravity</span>
            {antiGravityActive && (
              <span className="w-2 h-2 rounded-full bg-[#ab79d6] animate-ping" />
            )}
          </button>
          <button
            onClick={() => {
              sound.playChest(true);
              setActiveTab('categories');
            }}
            className={`transition-colors hover:text-white ${
              activeTab === 'categories' ? 'text-white border-b-2 border-[#7ba64c] pb-0.5 font-semibold' : ''
            }`}
          >
            Biome Chests
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('crafting');
            }}
            className={`transition-colors hover:text-white ${
              activeTab === 'crafting' ? 'text-white border-b-2 border-[#e5ad35] pb-0.5 font-semibold' : ''
            }`}
          >
            Crafting Bench
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5">
          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
            className="w-8 h-8 flex items-center justify-center mc-slot rounded-sm hover:scale-105 active:scale-95 transition-transform"
          >
            <PixelSpeaker on={soundEnabled} size={15} />
          </button>

          {/* Quick Anti-Gravity Toggle */}
          <button
            onClick={onToggleAntiGravity}
            title="Toggle Anti-Gravity Levitation"
            className={`px-2.5 py-1 text-xs mc-font-pixel rounded-sm border transition-all ${
              antiGravityActive
                ? 'bg-[#5e3b79] border-[#d8b4fe] text-[#fff] shadow-[0_0_8px_rgba(216,180,254,0.5)]'
                : 'mc-button'
            }`}
          >
            Zero-G {antiGravityActive ? 'ON' : 'OFF'}
          </button>

          {/* New Quest / Note Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenQuickAdd();
            }}
            className="mc-button mc-button-cherry px-3 py-1.5 text-xs font-semibold mc-font-pixel tracking-wide flex items-center gap-1.5"
          >
            <span>+ New Quest</span>
          </button>
        </div>
      </div>

      {/* Minecraft Status HUD: Hearts, Level XP, Hunger */}
      <div className="bg-[#120f1e] py-1.5 px-4 border-t border-[#231d33]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          {/* Hearts Health Bar (10 Hearts) */}
          <div className="flex items-center gap-1" title={`${stats.health}/20 Health`}>
            {Array.from({ length: 10 }).map((_, i) => {
              const heartValue = (i + 1) * 2;
              const filled = stats.health >= heartValue;
              const half = !filled && stats.health >= heartValue - 1;
              return <PixelHeart key={i} filled={filled} half={half} size={15} />;
            })}
          </div>

          {/* Center XP Bar with Level Number */}
          <div className="flex-1 max-w-xs mx-2 flex items-center gap-2">
            <div className="flex-1 h-2.5 mc-xp-bar rounded-none overflow-hidden relative">
              <div
                className="h-full mc-xp-fill transition-all duration-300"
                style={{ width: `${currentLevelProgress}%` }}
              />
            </div>
            <div
              className="mc-font-hud text-lg text-[#55ff55] font-bold px-1.5 leading-none bg-[#091509] border border-[#1b4d00]"
              title={`Level ${stats.level} (${stats.xp} Total XP)`}
            >
              {stats.level}
            </div>
          </div>

          {/* Hunger Bar (10 Drumsticks) */}
          <div className="flex items-center gap-1" title={`${stats.hunger}/20 Hunger`}>
            {Array.from({ length: 10 }).map((_, i) => {
              const drumstickValue = (i + 1) * 2;
              const filled = stats.hunger >= drumstickValue;
              return <PixelHunger key={i} filled={filled} size={15} />;
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
