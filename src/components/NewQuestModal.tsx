import React, { useState } from 'react';
import { BiomeCategory, PriorityTier, QuestTask } from '../types';
import { BIOME_CONFIG } from '../utils/storage';
import { sound } from '../utils/audio';

interface NewQuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: QuestTask) => void;
  defaultBiome?: BiomeCategory;
}

export const NewQuestModal: React.FC<NewQuestModalProps> = ({
  isOpen,
  onClose,
  onAddTask,
  defaultBiome = 'cherry_grove',
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<BiomeCategory>(defaultBiome);
  const [priority, setPriority] = useState<PriorityTier>('emerald');
  const [dueDate, setDueDate] = useState('');
  const [xpReward, setXpReward] = useState<number>(30);
  const [subtasksText, setSubtasksText] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    sound.playAnvil();

    // Parse subtasks line by line
    const subtasks = subtasksText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((text, idx) => ({
        id: `sub-${Date.now()}-${idx}`,
        title: text,
        completed: false,
      }));

    const newTask: QuestTask = {
      id: `task-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      completed: false,
      category,
      priority,
      xpReward,
      dueDate: dueDate.trim() || undefined,
      subtasks,
      pinned: false,
      createdAt: Date.now(),
    };

    onAddTask(newTask);
    onClose();

    // Reset form
    setTitle('');
    setDescription('');
    setDueDate('');
    setSubtasksText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="mc-container max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-[#c97d93]">
        <div className="flex items-center justify-between pb-3 border-b border-[#352c48]">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚔️</span>
            <h2 className="mc-font-hud text-2xl sm:text-3xl text-white">
              Inscribe New Quest
            </h2>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="text-base text-[#a59eb8] hover:text-white px-2 py-0.5 mc-button"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          {/* Quest Title */}
          <div>
            <label className="block text-[#a59eb8] mb-1 font-semibold">
              Quest Objective / Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Gather 32 obsidian & build nether portal"
              className="w-full bg-[#13101e] border-2 border-[#2c243d] text-white px-3 py-2 text-xs focus:border-[#c97d93] outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[#a59eb8] mb-1 font-semibold">
              Expedition Details / Notes
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Location coordinates, tips, required materials..."
              className="w-full bg-[#13101e] border-2 border-[#2c243d] text-white px-3 py-2 text-xs focus:border-[#c97d93] outline-none resize-none"
            />
          </div>

          {/* Biome Category & Priority Tier */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[#a59eb8] mb-1 font-semibold">
                Biome Sanctuary
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as BiomeCategory)}
                className="w-full bg-[#13101e] border-2 border-[#2c243d] text-white px-2.5 py-2 text-xs outline-none"
              >
                {Object.entries(BIOME_CONFIG).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.icon} {config.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#a59eb8] mb-1 font-semibold">
                Priority Tier
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityTier)}
                className="w-full bg-[#13101e] border-2 border-[#2c243d] text-white px-2.5 py-2 text-xs outline-none"
              >
                <option value="emerald">Emerald Tier (Standard)</option>
                <option value="diamond">Diamond Tier (Important)</option>
                <option value="amethyst">Amethyst Tier (Creative)</option>
                <option value="netherite">Netherite Tier (Critical)</option>
                <option value="gold">Gold Tier (Daily Habit)</option>
              </select>
            </div>
          </div>

          {/* Due Date & XP Reward */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[#a59eb8] mb-1 font-semibold">
                Target Deadline
              </label>
              <input
                type="text"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                placeholder="e.g. Today · Before Sunset"
                className="w-full bg-[#13101e] border-2 border-[#2c243d] text-white px-3 py-2 text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-[#a59eb8] mb-1 font-semibold">
                XP Reward: +{xpReward} XP
              </label>
              <input
                type="range"
                min={10}
                max={100}
                step={5}
                value={xpReward}
                onChange={(e) => setXpReward(Number(e.target.value))}
                className="w-full accent-[#55ff55] mt-2 cursor-pointer"
              />
            </div>
          </div>

          {/* Subtasks */}
          <div>
            <label className="block text-[#a59eb8] mb-1 font-semibold">
              Subtasks / Steps (One per line)
            </label>
            <textarea
              rows={2}
              value={subtasksText}
              onChange={(e) => setSubtasksText(e.target.value)}
              placeholder="Step 1: Forge diamond pickaxe&#10;Step 2: Collect 14 obsidian blocks"
              className="w-full bg-[#13101e] border-2 border-[#2c243d] text-white px-3 py-2 text-xs focus:border-[#c97d93] outline-none resize-none font-mono"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-[#352c48] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="mc-button px-4 py-2 text-xs mc-font-pixel"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="mc-button mc-button-cherry px-5 py-2 text-xs mc-font-pixel font-bold"
            >
              + Inscribe Quest
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
