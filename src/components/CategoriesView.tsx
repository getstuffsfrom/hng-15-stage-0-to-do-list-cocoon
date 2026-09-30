import React from 'react';
import { BiomeCategory, QuestTask, QuillNote } from '../types';
import { BIOME_CONFIG } from '../utils/storage';
import { PixelChest } from './PixelIcons';
import { sound } from '../utils/audio';

interface CategoriesViewProps {
  tasks: QuestTask[];
  notes: QuillNote[];
  selectedBiome: BiomeCategory | 'all';
  onSelectBiome: (biome: BiomeCategory) => void;
  onNavigateToTasks: () => void;
  onNavigateToNotes: () => void;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  tasks,
  notes,
  selectedBiome,
  onSelectBiome,
  onNavigateToTasks,
  onNavigateToNotes,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mc-container p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <PixelChest size={26} />
            <h1 className="mc-font-hud text-3xl sm:text-4xl text-white">
              Biome Chests & Inventories
            </h1>
          </div>
          {/* Zero-Pill metadata */}
          <div className="flex items-center gap-2 text-xs text-[#a59eb8] mt-1">
            <span>5 Biome Vaults</span>
            <span aria-hidden="true">·</span>
            <span>Organize Quests & Parchment Journals</span>
            <span aria-hidden="true">·</span>
            <span>Chest Storage Grid</span>
          </div>
        </div>
      </div>

      {/* Grid of Biome Chests */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(BIOME_CONFIG).map(([key, config]) => {
          const biomeKey = key as BiomeCategory;
          const biomeTasks = tasks.filter((t) => t.category === biomeKey);
          const completedTasks = biomeTasks.filter((t) => t.completed).length;
          const biomeNotes = notes.filter((n) => n.category === biomeKey);
          const isSelected = selectedBiome === biomeKey;

          return (
            <div
              key={key}
              onClick={() => {
                sound.playChest(true);
                onSelectBiome(biomeKey);
              }}
              style={{
                borderColor: isSelected ? config.color : '#282138',
              }}
              className={`mc-container p-5 cursor-pointer transition-all hover:scale-101 ${
                isSelected ? 'bg-[#29203a] shadow-lg ring-1' : 'hover:bg-[#201a30]'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl">{config.icon}</span>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {config.name}
                    </h3>
                    <p className="text-xs text-[#b8b0c9] mt-0.5">
                      {config.subtitle}
                    </p>
                  </div>
                </div>

                <div className="p-1 mc-slot rounded-sm">
                  <PixelChest size={20} />
                </div>
              </div>

              {/* Zero-Pill Unboxed Metadata line */}
              <div className="flex items-center gap-2 text-xs text-[#a59eb8] mt-4 pt-3 border-t border-[#312845]">
                <span>{biomeTasks.length} Quests</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#55ff55]">{completedTasks} Done</span>
                <span aria-hidden="true">·</span>
                <span>{biomeNotes.length} Notes</span>
              </div>

              {/* Action buttons */}
              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.playClick();
                    onSelectBiome(biomeKey);
                    onNavigateToTasks();
                  }}
                  className="mc-button flex-1 py-1 text-xs mc-font-pixel"
                >
                  View Quests
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.playPageFlip();
                    onSelectBiome(biomeKey);
                    onNavigateToNotes();
                  }}
                  className="mc-button mc-button-cherry flex-1 py-1 text-xs mc-font-pixel"
                >
                  View Notes
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
