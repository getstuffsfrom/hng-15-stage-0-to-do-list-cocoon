import { BiomeCategory, PlayerStats, QuestTask, QuillNote } from '../types';

export const BIOME_CONFIG: Record<BiomeCategory, {
  name: string;
  subtitle: string;
  color: string;
  darkColor: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
  icon: string;
}> = {
  cherry_grove: {
    name: 'Cherry Grove',
    subtitle: 'Gentle builds & blossoming plans',
    color: '#d6859e',
    darkColor: '#532938',
    borderColor: '#7a3e51',
    badgeBg: 'rgba(214, 133, 158, 0.15)',
    badgeText: '#f6b8c9',
    icon: '🌸',
  },
  lush_cave: {
    name: 'Lush Cave',
    subtitle: 'Moss sanctuaries & cozy refuges',
    color: '#7ba64c',
    darkColor: '#283818',
    borderColor: '#4d692e',
    badgeBg: 'rgba(123, 166, 76, 0.15)',
    badgeText: '#b2e281',
    icon: '🌿',
  },
  amethyst_geode: {
    name: 'Amethyst Geode',
    subtitle: 'Deep focus & crystalline ideas',
    color: '#ab79d6',
    darkColor: '#3d2552',
    borderColor: '#6a4387',
    badgeBg: 'rgba(171, 121, 214, 0.15)',
    badgeText: '#dfbdfc',
    icon: '🔮',
  },
  deepslate: {
    name: 'Deepslate Core',
    subtitle: 'Heavy grinds & resolute survival',
    color: '#656a7e',
    darkColor: '#1d1f26',
    borderColor: '#3c3f4e',
    badgeBg: 'rgba(101, 106, 126, 0.15)',
    badgeText: '#bdc2d8',
    icon: '⛏️',
  },
  sunflower: {
    name: 'Sunflower Plains',
    subtitle: 'Radiant morning habits & exploration',
    color: '#e5ad35',
    darkColor: '#45310b',
    borderColor: '#7f5f19',
    badgeBg: 'rgba(229, 173, 53, 0.15)',
    badgeText: '#ffe08a',
    icon: '🌻',
  },
};

const INITIAL_TASKS: QuestTask[] = [
  {
    id: 'task-1',
    title: 'Gather 64 Stripped Cherry Logs for Cottage Frame',
    description: 'Travel to the high mountain valley, harvest logs without breaking the bee nests, and strip the bark for the main arches.',
    completed: false,
    category: 'cherry_grove',
    priority: 'emerald',
    xpReward: 35,
    dueDate: 'Today · Before Sunset',
    subtasks: [
      { id: 'sub-1', title: 'Craft silk touch axe or shears for blossoms', completed: true },
      { id: 'sub-2', title: 'Collect 64 cherry logs from hilltop grove', completed: false },
      { id: 'sub-3', title: 'Strip bark using stone cutting bench', completed: false },
    ],
    pinned: true,
    createdAt: Date.now() - 3600000 * 4,
  },
  {
    id: 'task-2',
    title: 'Cultivate Glowberry & Azalea Terrace Garden',
    description: 'Set up an automatic dripleaf waterfall in the underground reading nook with lanterns hanging from moss ceilings.',
    completed: false,
    category: 'lush_cave',
    priority: 'amethyst',
    xpReward: 25,
    dueDate: 'Tomorrow',
    subtasks: [
      { id: 'sub-4', title: 'Plant 8 flowering azalea saplings', completed: false },
      { id: 'sub-5', title: 'String glowberry vines along warm spruce rafters', completed: false },
    ],
    pinned: false,
    createdAt: Date.now() - 3600000 * 12,
  },
  {
    id: 'task-3',
    title: 'Brew 3 Potions of Swiftness & Feather Falling',
    description: 'Prepare for exploring the jagged peaks with high mobility and soft landings.',
    completed: true,
    category: 'amethyst_geode',
    priority: 'diamond',
    xpReward: 40,
    dueDate: 'Completed',
    subtasks: [
      { id: 'sub-6', title: 'Harvest nether wart from fortress outpost', completed: true },
      { id: 'sub-7', title: 'Brew sugar into awkward potion', completed: true },
    ],
    pinned: false,
    createdAt: Date.now() - 3600000 * 24,
  },
  {
    id: 'task-4',
    title: 'Finish Physics & Math Equations Assignment',
    description: 'Solve the angular momentum and parabolic motion problems before guild study session.',
    completed: false,
    category: 'deepslate',
    priority: 'netherite',
    xpReward: 50,
    dueDate: 'Friday · 6:00 PM',
    subtasks: [
      { id: 'sub-8', title: 'Review gravitational constant formulas', completed: true },
      { id: 'sub-9', title: 'Solve problems 14 through 28', completed: false },
      { id: 'sub-10', title: 'Check answers with study notebook', completed: false },
    ],
    pinned: true,
    createdAt: Date.now() - 3600000 * 48,
  },
  {
    id: 'task-5',
    title: 'Morning Sunlit Walk & Herbal Tea Ritual',
    description: 'Step outside for 20 minutes of morning sunlight, water the window orchids, brew mint & ginger infusion.',
    completed: true,
    category: 'sunflower',
    priority: 'gold',
    xpReward: 20,
    dueDate: 'Daily Habit',
    subtasks: [
      { id: 'sub-11', title: 'Drink tall glass of fresh water', completed: true },
      { id: 'sub-12', title: '20 min quiet stroll without screen', completed: true },
    ],
    pinned: false,
    createdAt: Date.now() - 3600000 * 18,
  },
];

const INITIAL_NOTES: QuillNote[] = [
  {
    id: 'note-1',
    title: 'The Hidden Mountain Observatory Blueprint',
    pages: [
      `I stumbled across the most breathtaking mountain shelf this afternoon. High above the cloud line, where the cherry petals drift into the cold air.\n\nMaterial Palette:\n- Stripped Dark Oak (structural posts & window frames)\n- Cherry Planks (warm interior herringbone floor)\n- Tinted Glass (skylights facing the constellation)\n- Amethyst Cluster chandeliers with copper lightning rods.\n\nThe trick will be cantilevering the library over the waterfall so reading by the hearth feels like floating.`,
      `Observatory Equipment Checklist:\n\n1. Spyglass mounted on polished calcite pedestal\n2. 2x Double Chests organized by mineral hardness\n3. Enchanting table surrounded by 15 birch bookshelves\n4. Brewing stand with fresh water cauldron\n\nRemember to plant a ring of flowering azaleas around the perimeter to keep creepers from spawning quietly in the fog.`
    ],
    category: 'cherry_grove',
    tags: ['Architecture', 'Cozy Build', 'Coordinates'],
    bookmarked: true,
    inkColor: '#361d28',
    fontStyle: 'parchment',
    createdAt: Date.now() - 3600000 * 30,
    updatedAt: Date.now() - 3600000 * 2,
  },
  {
    id: 'note-2',
    title: 'Botanist Journal: Spore Blossoms & Glowing Moss',
    pages: [
      `Notes on Lush Cave flora behavior:\n\nSpore blossoms only release their soft greenish luminescence when hanging downwards from ceiling tiles. When placed over water sources, the ambient particles drift slightly further, like tiny fireflies.\n\nBrewing experiment:\nDried azalea petals combined with sweet honeycomb produce a natural soothing salve. Perfect for long mining expeditions deep in the caves.`
    ],
    category: 'lush_cave',
    tags: ['Flora', 'Brewing', 'Field Guide'],
    bookmarked: true,
    inkColor: '#203318',
    fontStyle: 'parchment',
    createdAt: Date.now() - 3600000 * 50,
    updatedAt: Date.now() - 3600000 * 14,
  },
  {
    id: 'note-3',
    title: 'Zero-Gravity Field Theory & Shulker Levitation',
    pages: [
      `When hit with shulker bullets or testing levitation brews, gravity decreases in discrete tick steps. If you counteract the upward momentum with feather falling boots, you achieve near-perfect neutral buoyancy.\n\nIn our Anti-Gravity chamber, we can freely toss blocks and notes into orbit. No drag, purely conservation of momentum!`
    ],
    category: 'amethyst_geode',
    tags: ['Physics', 'Anti-Gravity', 'Arcane'],
    bookmarked: false,
    inkColor: '#2f1a3f',
    fontStyle: 'pixel',
    createdAt: Date.now() - 3600000 * 70,
    updatedAt: Date.now() - 3600000 * 20,
  },
];

const INITIAL_STATS: PlayerStats = {
  xp: 135,
  level: 7,
  tasksCompleted: 8,
  notesWritten: 3,
  currentStreakDays: 5,
  health: 20, // 10 hearts
  hunger: 18, // 9 drumsticks
};

export const Storage = {
  getTasks: (): QuestTask[] => {
    try {
      const data = localStorage.getItem('voxelquill_tasks');
      return data ? JSON.parse(data) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  },
  saveTasks: (tasks: QuestTask[]) => {
    try {
      localStorage.setItem('voxelquill_tasks', JSON.stringify(tasks));
    } catch {
      // Ignore
    }
  },
  getNotes: (): QuillNote[] => {
    try {
      const data = localStorage.getItem('voxelquill_notes');
      return data ? JSON.parse(data) : INITIAL_NOTES;
    } catch {
      return INITIAL_NOTES;
    }
  },
  saveNotes: (notes: QuillNote[]) => {
    try {
      localStorage.setItem('voxelquill_notes', JSON.stringify(notes));
    } catch {
      // Ignore
    }
  },
  getStats: (): PlayerStats => {
    try {
      const data = localStorage.getItem('voxelquill_stats');
      return data ? JSON.parse(data) : INITIAL_STATS;
    } catch {
      return INITIAL_STATS;
    }
  },
  saveStats: (stats: PlayerStats) => {
    try {
      localStorage.setItem('voxelquill_stats', JSON.stringify(stats));
    } catch {
      // Ignore
    }
  },
};
