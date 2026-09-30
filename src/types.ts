export type BiomeCategory = 
  | 'cherry_grove' 
  | 'lush_cave' 
  | 'amethyst_geode' 
  | 'deepslate' 
  | 'sunflower';

export type PriorityTier = 'emerald' | 'diamond' | 'amethyst' | 'netherite' | 'gold';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface QuestTask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  category: BiomeCategory;
  priority: PriorityTier;
  xpReward: number;
  dueDate?: string;
  subtasks: SubTask[];
  pinned?: boolean;
  createdAt: number;
}

export interface QuillNote {
  id: string;
  title: string;
  pages: string[];
  category: BiomeCategory;
  tags: string[];
  bookmarked: boolean;
  inkColor: string; // e.g. '#241a14', '#472d59', '#1d3e2a', '#1e2c52'
  fontStyle: 'pixel' | 'parchment' | 'clean';
  createdAt: number;
  updatedAt: number;
}

export interface PlayerStats {
  xp: number;
  level: number;
  tasksCompleted: number;
  notesWritten: number;
  currentStreakDays: number;
  health: number; // 0 - 20 (10 hearts)
  hunger: number; // 0 - 20 (10 drumsticks)
}

export type ActiveTab = 
  | 'tasks' 
  | 'notes' 
  | 'antigravity' 
  | 'categories' 
  | 'crafting' 
  | 'stats' 
  | 'deploy';
