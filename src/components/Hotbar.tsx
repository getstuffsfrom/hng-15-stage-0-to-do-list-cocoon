import React, { useEffect } from 'react';
import { ActiveTab } from '../types';
import {
  PixelBookQuill,
  PixelSword,
  PixelPotion,
  PixelChest,
  PixelCraftingTable,
  PixelXpOrb,
  PixelSpeaker,
} from './PixelIcons';
import { sound } from '../utils/audio';

interface HotbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenQuickAdd: () => void;
  onOpenDeploy: () => void;
}

export const Hotbar: React.FC<HotbarProps> = ({
  activeTab,
  setActiveTab,
  soundEnabled,
  onToggleSound,
  onOpenQuickAdd,
  onOpenDeploy,
}) => {
  // Listen for keyboard number shortcuts 1-9
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      switch (e.key) {
        case '1':
          sound.playClick();
          setActiveTab('tasks');
          break;
        case '2':
          sound.playPageFlip();
          setActiveTab('notes');
          break;
        case '3':
          sound.playLevitation();
          setActiveTab('antigravity');
          break;
        case '4':
          sound.playChest(true);
          setActiveTab('categories');
          break;
        case '5':
          sound.playClick();
          setActiveTab('crafting');
          break;
        case '6':
          sound.playLevelUp();
          setActiveTab('stats');
          break;
        case '7':
          onToggleSound();
          break;
        case '8':
          sound.playClick();
          onOpenDeploy();
          break;
        case '9':
          sound.playClick();
          onOpenQuickAdd();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveTab, onToggleSound, onOpenQuickAdd, onOpenDeploy]);

  const slots = [
    {
      num: 1,
      name: 'Quests',
      icon: <PixelSword size={22} />,
      active: activeTab === 'tasks',
      onClick: () => {
        sound.playClick();
        setActiveTab('tasks');
      },
    },
    {
      num: 2,
      name: 'Notes',
      icon: <PixelBookQuill size={22} />,
      active: activeTab === 'notes',
      onClick: () => {
        sound.playPageFlip();
        setActiveTab('notes');
      },
    },
    {
      num: 3,
      name: 'Anti-Gravity',
      icon: <PixelPotion size={22} />,
      active: activeTab === 'antigravity',
      onClick: () => {
        sound.playLevitation();
        setActiveTab('antigravity');
      },
    },
    {
      num: 4,
      name: 'Chests',
      icon: <PixelChest size={22} />,
      active: activeTab === 'categories',
      onClick: () => {
        sound.playChest(true);
        setActiveTab('categories');
      },
    },
    {
      num: 5,
      name: 'Crafting',
      icon: <PixelCraftingTable size={22} />,
      active: activeTab === 'crafting',
      onClick: () => {
        sound.playClick();
        setActiveTab('crafting');
      },
    },
    {
      num: 6,
      name: 'Stats',
      icon: <PixelXpOrb size={22} />,
      active: activeTab === 'stats',
      onClick: () => {
        sound.playLevelUp();
        setActiveTab('stats');
      },
    },
    {
      num: 7,
      name: 'SFX Audio',
      icon: <PixelSpeaker on={soundEnabled} size={20} />,
      active: false,
      onClick: () => {
        onToggleSound();
      },
    },
    {
      num: 8,
      name: 'Deploy & Git',
      icon: (
        <span className="mc-font-hud text-lg font-bold text-[#55ffff] leading-none">
          GIT
        </span>
      ),
      active: activeTab === 'deploy',
      onClick: () => {
        sound.playClick();
        onOpenDeploy();
      },
    },
    {
      num: 9,
      name: '+ New Quest',
      icon: (
        <span className="mc-font-hud text-2xl font-bold text-[#f2a7be] leading-none">
          +
        </span>
      ),
      active: false,
      onClick: () => {
        sound.playClick();
        onOpenQuickAdd();
      },
    },
  ];

  return (
    <aside aria-label="Inventory Hotbar" className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
      <div className="bg-[#1c182a]/95 border-2 border-[#0f0c18] p-1 shadow-2xl flex items-center gap-1 sm:gap-1.5 backdrop-blur-md">
        {slots.map((s) => (
          <button
            key={s.num}
            onClick={s.onClick}
            title={`${s.name} (Key ${s.num})`}
            className={`w-11 h-11 sm:w-12 sm:h-12 relative flex items-center justify-center mc-slot group cursor-pointer transition-all ${
              s.active ? 'active scale-105' : 'hover:scale-102'
            }`}
          >
            {/* Slot Number in top-left */}
            <span className="absolute top-0.5 left-1 mc-font-hud text-xs text-[#9d93b3] group-hover:text-white pointer-events-none">
              {s.num}
            </span>

            {/* Icon */}
            <div className="flex items-center justify-center pointer-events-none transform group-hover:scale-110 transition-transform">
              {s.icon}
            </div>

            {/* Hover Tooltip in Minecraft Style */}
            <div className="absolute -top-9 left-1/2 -translate-x-1/2 hidden group-hover:block pointer-events-none z-50 whitespace-nowrap">
              <div className="mc-tooltip px-2 py-0.5 text-xs mc-font-hud tracking-wide shadow-md">
                {s.name} <span className="text-[#a59eb8]">[{s.num}]</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
};
