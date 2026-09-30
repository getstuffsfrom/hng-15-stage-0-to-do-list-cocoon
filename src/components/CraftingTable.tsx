import React, { useState } from 'react';
import { QuestTask, QuillNote } from '../types';
import { PixelCraftingTable, PixelXpOrb } from './PixelIcons';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface CraftingTableProps {
  onAddTasks: (newTasks: QuestTask[]) => void;
  onAddNote: (newNote: QuillNote) => void;
  onAddXp: (amount: number) => void;
}

interface Recipe {
  id: string;
  name: string;
  description: string;
  category: 'cherry_grove' | 'lush_cave' | 'amethyst_geode' | 'deepslate' | 'sunflower';
  xpReward: number;
  ingredients: string[]; // 9 slots
  resultTasks: Partial<QuestTask>[];
  resultNote?: Partial<QuillNote>;
}

const RECIPES: Recipe[] = [
  {
    id: 'cherry_study',
    name: 'Cherry Blossom Study Expedition',
    description: 'Crafts a calm, deep-focus study package with review milestones and coordinate note.',
    category: 'cherry_grove',
    xpReward: 50,
    ingredients: ['🌸', '🪶', '🌸', '📜', '☕', '📜', '🪵', '🪵', '🪵'],
    resultTasks: [
      {
        title: 'Review 3 Key Concepts in Quiet Focus',
        description: 'Read the summary, solve practice problems, and mark questions for tomorrow.',
        category: 'cherry_grove',
        priority: 'emerald',
        xpReward: 30,
        subtasks: [
          { id: 'cs-1', title: 'Outline core equations & terms', completed: false },
          { id: 'cs-2', title: 'Complete first 5 practice questions', completed: false },
        ],
      },
      {
        title: 'Organize Study Desk & Restock Highlighters',
        description: 'Clear desk clutter, brew warm honey tea, set 25-minute timer.',
        category: 'cherry_grove',
        priority: 'amethyst',
        xpReward: 20,
        subtasks: [],
      },
    ],
    resultNote: {
      title: 'Botanical & Study Field Notes',
      pages: [
        'Study Log Entry:\n\n- Key realization today:\n- Questions to clarify:\n- Target for next session:',
      ],
      category: 'cherry_grove',
      tags: ['Study', 'Focus', 'Ritual'],
    },
  },
  {
    id: 'lush_sanctuary',
    name: 'Lush Cave Self-Care Sanctuary',
    description: 'Crafts an restorative routine with hydration, screen break, and cozy garden tasks.',
    category: 'lush_cave',
    xpReward: 45,
    ingredients: ['🌿', '💧', '🌿', '🫐', '🕯️', '🫐', '🪨', '🪨', '🪨'],
    resultTasks: [
      {
        title: 'Hydrate & 15-Minute Screen Free Recharge',
        description: 'Fill a 32oz water bottle, stretch shoulders, step outside into natural air.',
        category: 'lush_cave',
        priority: 'gold',
        xpReward: 25,
        subtasks: [
          { id: 'ls-1', title: 'Drink fresh glass of water', completed: false },
          { id: 'ls-2', title: 'Gentle neck & wrist stretch', completed: false },
        ],
      },
      {
        title: 'Evening Cozy Reading Under Lantern Light',
        description: 'Read 20 pages of a good book before sleeping without blue light.',
        category: 'lush_cave',
        priority: 'emerald',
        xpReward: 20,
        subtasks: [],
      },
    ],
  },
  {
    id: 'deepslate_sprint',
    name: 'Netherite Deep Work Sprint',
    description: 'Crafts an intensive high-yield productivity quest chain for heavy assignments.',
    category: 'deepslate',
    xpReward: 65,
    ingredients: ['⛏️', '⏱️', '⛏️', '🔥', '🛡️', '🔥', '🧱', '🧱', '🧱'],
    resultTasks: [
      {
        title: 'Tackle Hardest Priority Task First (Deep Sprint)',
        description: 'Turn off notifications, work for 45 minutes straight on the primary blocker.',
        category: 'deepslate',
        priority: 'netherite',
        xpReward: 45,
        subtasks: [
          { id: 'ds-1', title: 'Close distracting tabs', completed: false },
          { id: 'ds-2', title: 'Complete first substantial milestone', completed: false },
        ],
      },
      {
        title: 'Consolidate Notes & Clear Digital Inbox',
        description: 'Archive finished threads, file downloads, leave desk pristine.',
        category: 'deepslate',
        priority: 'diamond',
        xpReward: 20,
        subtasks: [],
      },
    ],
  },
];

export const CraftingTable: React.FC<CraftingTableProps> = ({
  onAddTasks,
  onAddNote,
  onAddXp,
}) => {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe>(RECIPES[0]);

  const handleCraft = () => {
    sound.playAnvil();
    onAddXp(selectedRecipe.xpReward);

    // Create Tasks
    const timestamp = Date.now();
    const createdTasks: QuestTask[] = selectedRecipe.resultTasks.map((t, idx) => ({
      id: `task-craft-${timestamp}-${idx}`,
      title: t.title || 'Crafted Quest',
      description: t.description || '',
      completed: false,
      category: selectedRecipe.category,
      priority: t.priority || 'emerald',
      xpReward: t.xpReward || 25,
      subtasks: t.subtasks || [],
      pinned: false,
      createdAt: timestamp + idx,
    }));
    onAddTasks(createdTasks);

    // Create Note if included
    if (selectedRecipe.resultNote) {
      const createdNote: QuillNote = {
        id: `note-craft-${timestamp}`,
        title: selectedRecipe.resultNote.title || 'Crafted Field Guide',
        pages: selectedRecipe.resultNote.pages || [''],
        category: selectedRecipe.category,
        tags: selectedRecipe.resultNote.tags || ['Crafted'],
        bookmarked: true,
        inkColor: '#2b231d',
        fontStyle: 'parchment',
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      onAddNote(createdNote);
    }

    // Victory confetti
    try {
      confetti({
        particleCount: 35,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#ffe08a', '#d6859e', '#55ff55'],
        disableForReducedMotion: true,
      });
    } catch {
      // Ignored
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mc-container p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <PixelCraftingTable size={26} />
            <h1 className="mc-font-hud text-3xl sm:text-4xl text-white">
              Crafting Bench & Quest Forge
            </h1>
          </div>
          {/* Zero-Pill metadata */}
          <div className="flex items-center gap-2 text-xs text-[#a59eb8] mt-1">
            <span>Recipe Forge</span>
            <span aria-hidden="true">·</span>
            <span>Craft Prepared Quest Bundles & Journals</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#55ff55]">Instant XP Yield</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 3x3 Crafting Grid UI */}
        <div className="lg:col-span-6 space-y-4">
          <div className="mc-container p-6">
            <h3 className="mc-font-hud text-xl text-white mb-4 flex items-center justify-between">
              <span>3×3 Crafting Grid</span>
              <span className="text-xs text-[#55ff55] flex items-center gap-1 font-mono">
                <PixelXpOrb size={14} /> +{selectedRecipe.xpReward} XP
              </span>
            </h3>

            {/* 3x3 Grid + Arrow + Output Slot */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-4">
              {/* 3x3 Grid */}
              <div className="grid grid-cols-3 gap-2 bg-[#120f1e] p-3 border-2 border-[#090710] shadow-inner">
                {selectedRecipe.ingredients.map((item, idx) => (
                  <div
                    key={idx}
                    className="w-12 h-12 mc-slot flex items-center justify-center text-xl select-none"
                  >
                    {item}
                  </div>
                ))}
              </div>

              {/* Arrow */}
              <div className="mc-font-hud text-3xl text-[#ffe08a] transform rotate-90 sm:rotate-0">
                ➔
              </div>

              {/* Output Result Slot */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 mc-slot active flex items-center justify-center text-3xl border-2 border-[#ffe08a]">
                  📦
                </div>
                <span className="mc-font-pixel text-[11px] text-[#ffe08a] text-center max-w-[100px] leading-tight">
                  {selectedRecipe.name.split(' ')[0]} Pack
                </span>
              </div>
            </div>

            {/* Craft Action Button */}
            <div className="mt-6 text-center">
              <button
                onClick={handleCraft}
                className="mc-button mc-button-primary px-8 py-2.5 text-sm mc-font-pixel font-bold tracking-wider inline-flex items-center gap-2 hover:scale-102 active:scale-98 transition-all"
              >
                <span>CRAFT QUEST BUNDLE</span>
                <span className="text-lg">🔨</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Recipe Book Catalog */}
        <div className="lg:col-span-6 space-y-3">
          <div className="mc-container p-4">
            <h3 className="mc-font-hud text-xl text-white mb-3">
              Recipe Catalog (Click to select)
            </h3>

            <div className="space-y-3">
              {RECIPES.map((rec) => {
                const isSelected = selectedRecipe.id === rec.id;
                return (
                  <div
                    key={rec.id}
                    onClick={() => {
                      sound.playClick();
                      setSelectedRecipe(rec);
                    }}
                    className={`p-3.5 border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#29223a] border-[#ffe08a] shadow-md'
                        : 'bg-[#181426] border-[#251f34] hover:bg-[#201a30]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-bold text-white">
                        {rec.name}
                      </h4>
                      <span className="text-xs text-[#55ff55] font-mono shrink-0">
                        +{rec.xpReward} XP
                      </span>
                    </div>

                    <p className="text-xs text-[#b8b1ca] mt-1.5 leading-relaxed">
                      {rec.description}
                    </p>

                    <div className="flex items-center gap-2 text-[11px] text-[#a59eb8] mt-2">
                      <span>Creates {rec.resultTasks.length} Quests</span>
                      {rec.resultNote && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>Includes 1 Field Journal</span>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
