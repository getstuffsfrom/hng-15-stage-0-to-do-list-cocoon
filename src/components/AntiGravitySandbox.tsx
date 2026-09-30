import React, { useRef, useEffect, useState, useCallback } from 'react';
import { QuestTask, QuillNote } from '../types';
import { BIOME_CONFIG } from '../utils/storage';
import { sound } from '../utils/audio';

interface AntiGravitySandboxProps {
  tasks: QuestTask[];
  notes: QuillNote[];
  onCompleteTask: (task: QuestTask) => void;
  onOpenTaskModal: () => void;
}

interface PhysicsBlock {
  id: string;
  type: 'task' | 'note' | 'material';
  title: string;
  category: string;
  color: string;
  icon: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  rotation: number;
  vRot: number;
  completed?: boolean;
  refData?: QuestTask | QuillNote;
}

export const AntiGravitySandbox: React.FC<AntiGravitySandboxProps> = ({
  tasks,
  notes,
  onCompleteTask,
  onOpenTaskModal,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [gravityMode, setGravityMode] = useState<'zero' | 'levitate' | 'feather' | 'normal'>('zero');
  const [blocks, setBlocks] = useState<PhysicsBlock[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<PhysicsBlock | null>(null);

  // Physics animation ref
  const animFrameRef = useRef<number | null>(null);
  const blocksRef = useRef<PhysicsBlock[]>([]);
  const isDraggingRef = useRef<{ id: string; startX: number; startY: number; lastX: number; lastY: number; lastTime: number } | null>(null);

  // Initialize physics blocks from tasks and notes
  useEffect(() => {
    const initialBlocks: PhysicsBlock[] = [];

    // Map tasks into blocks
    tasks.slice(0, 10).forEach((t, i) => {
      const biome = BIOME_CONFIG[t.category];
      initialBlocks.push({
        id: `block-task-${t.id}`,
        type: 'task',
        title: t.title,
        category: t.category,
        color: biome.color,
        icon: biome.icon,
        x: 60 + (i % 4) * 160 + Math.random() * 40,
        y: 80 + Math.floor(i / 4) * 100 + Math.random() * 40,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        width: 150,
        height: 72,
        rotation: (Math.random() - 0.5) * 10,
        vRot: (Math.random() - 0.5) * 0.4,
        completed: t.completed,
        refData: t,
      });
    });

    // Map notes into blocks
    notes.slice(0, 5).forEach((n, i) => {
      const biome = BIOME_CONFIG[n.category];
      initialBlocks.push({
        id: `block-note-${n.id}`,
        type: 'note',
        title: n.title,
        category: n.category,
        color: '#f4ecd8',
        icon: '🪶',
        x: 100 + i * 140 + Math.random() * 30,
        y: 220 + Math.random() * 60,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        width: 140,
        height: 68,
        rotation: (Math.random() - 0.5) * 8,
        vRot: (Math.random() - 0.5) * 0.3,
        refData: n,
      });
    });

    blocksRef.current = initialBlocks;
    setBlocks(initialBlocks);
  }, [tasks, notes]);

  // Physics Step loop
  const updatePhysics = useCallback(() => {
    if (!containerRef.current) return;
    const { clientWidth: w, clientHeight: h } = containerRef.current;
    if (w === 0 || h === 0) return;

    // Gravity vector
    let g = 0;
    if (gravityMode === 'normal') g = 0.35;
    else if (gravityMode === 'feather') g = 0.08;
    else if (gravityMode === 'levitate') g = -0.22;
    else g = 0; // zero-g

    const updated = blocksRef.current.map((block) => {
      // Don't update position if dragged by mouse
      if (isDraggingRef.current && isDraggingRef.current.id === block.id) {
        return block;
      }

      let vx = block.vx;
      let vy = block.vy + g;
      let rot = block.rotation + block.vRot;

      // Slight damping in zero-g atmosphere
      vx *= 0.998;
      vy *= 0.998;

      let x = block.x + vx;
      let y = block.y + vy;

      // Boundary collisions with bounce
      const halfW = block.width / 2;
      const halfH = block.height / 2;

      // Left & Right walls
      if (x - halfW < 0) {
        x = halfW;
        vx = -vx * 0.75;
      } else if (x + halfW > w) {
        x = w - halfW;
        vx = -vx * 0.75;
      }

      // Top & Bottom walls
      if (y - halfH < 0) {
        y = halfH;
        vy = -vy * 0.75;
      } else if (y + halfH > h) {
        y = h - halfH;
        vy = -vy * 0.75;
      }

      return {
        ...block,
        x,
        y,
        vx,
        vy,
        rotation: rot,
      };
    });

    blocksRef.current = updated;
    setBlocks(updated);

    animFrameRef.current = requestAnimationFrame(updatePhysics);
  }, [gravityMode]);

  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(updatePhysics);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [updatePhysics]);

  // Mouse / Touch handlers for dragging and tossing blocks
  const handlePointerDown = (block: PhysicsBlock, e: React.PointerEvent) => {
    e.stopPropagation();
    sound.playPop();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;

    isDraggingRef.current = {
      id: block.id,
      startX,
      startY,
      lastX: startX,
      lastY: startY,
      lastTime: performance.now(),
    };

    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    const now = performance.now();

    const dt = Math.max(1, now - isDraggingRef.current.lastTime);
    const vx = ((currentX - isDraggingRef.current.lastX) / dt) * 14;
    const vy = ((currentY - isDraggingRef.current.lastY) / dt) * 14;

    const id = isDraggingRef.current.id;
    blocksRef.current = blocksRef.current.map((b) => {
      if (b.id !== id) return b;
      return {
        ...b,
        x: currentX,
        y: currentY,
        vx: Math.max(-15, Math.min(15, vx)),
        vy: Math.max(-15, Math.min(15, vy)),
      };
    });

    isDraggingRef.current.lastX = currentX;
    isDraggingRef.current.lastY = currentY;
    isDraggingRef.current.lastTime = now;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDraggingRef.current) {
      sound.playClick();
      isDraggingRef.current = null;
    }
  };

  // Add random floating voxel item
  const handleTossRandomBlock = () => {
    sound.playLevitation();
    const icons = ['🌸', '🔮', '🌿', '⛏️', '🌻', '🍎', '💎'];
    const colors = ['#d6859e', '#ab79d6', '#7ba64c', '#656a7e', '#e5ad35', '#ff5555', '#55ffff'];
    const randIdx = Math.floor(Math.random() * icons.length);

    const newBlock: PhysicsBlock = {
      id: `block-free-${Date.now()}`,
      type: 'material',
      title: 'Floating Arcane Voxel',
      category: 'amethyst_geode',
      color: colors[randIdx],
      icon: icons[randIdx],
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 100,
      vx: (Math.random() - 0.5) * 6,
      vy: (Math.random() - 0.5) * 6,
      width: 130,
      height: 60,
      rotation: Math.random() * 30,
      vRot: (Math.random() - 0.5) * 0.8,
    };

    blocksRef.current = [newBlock, ...blocksRef.current];
    setBlocks(blocksRef.current);
  };

  return (
    <div className="space-y-4">
      {/* Anti-Gravity Control Dashboard */}
      <div className="mc-container p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌌</span>
            <h1 className="mc-font-hud text-3xl sm:text-4xl text-white">
              Anti-Gravity Voxel Chamber
            </h1>
          </div>
          {/* Zero-Pill metadata */}
          <div className="flex items-center gap-2 text-xs text-[#a59eb8] mt-1">
            <span>Zero-G Physics Sandbox</span>
            <span aria-hidden="true">·</span>
            <span>{blocks.length} Floating Voxel Blocks</span>
            <span aria-hidden="true">·</span>
            <span>Click & Drag to Toss with Momentum</span>
          </div>
        </div>

        {/* Gravity Mode Controls */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-[#a59eb8] mc-font-hud text-sm mr-1">Gravity Field:</span>
          {[
            { mode: 'zero', label: 'Zero-G 🛸' },
            { mode: 'levitate', label: 'Levitation 🫧' },
            { mode: 'feather', label: 'Feather Fall 🪶' },
            { mode: 'normal', label: 'Overworld 🌍' },
          ].map((item) => (
            <button
              key={item.mode}
              onClick={() => {
                sound.playLevitation();
                setGravityMode(item.mode as typeof gravityMode);
              }}
              className={`px-3 py-1 text-xs mc-font-pixel font-medium transition-colors ${
                gravityMode === item.mode
                  ? 'mc-button mc-button-primary border-[#e5a84b] text-white shadow-sm'
                  : 'mc-button text-[#a59eb8]'
              }`}
            >
              {item.label}
            </button>
          ))}

          <button
            onClick={handleTossRandomBlock}
            className="mc-button mc-button-cherry px-3 py-1 text-xs mc-font-pixel font-semibold ml-1"
          >
            + Toss Voxel
          </button>
        </div>
      </div>

      {/* Physics Interactive Canvas Area */}
      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="w-full h-[540px] mc-panel-dark relative overflow-hidden select-none border-2 border-[#3b3252] shadow-inner cursor-grab active:cursor-grabbing"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(106, 67, 135, 0.12) 0%, transparent 70%),
            linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 32px 32px, 32px 32px',
        }}
      >
        {/* Floating atmospheric particles (Cherry blossoms & amethyst dust) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-none bg-[#f2a7be]/30 petal-drift pointer-events-none"
              style={{
                left: `${10 + i * 11}%`,
                animationDelay: `${i * 1.5}s`,
                animationDuration: `${10 + i * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Floating Blocks */}
        {blocks.map((block) => {
          return (
            <div
              key={block.id}
              onPointerDown={(e) => handlePointerDown(block, e)}
              onClick={() => setSelectedBlock(block)}
              style={{
                width: `${block.width}px`,
                height: `${block.height}px`,
                transform: `translate(${block.x - block.width / 2}px, ${
                  block.y - block.height / 2
                }px) rotate(${block.rotation}deg)`,
                borderColor: block.color,
              }}
              className={`absolute top-0 left-0 p-2 border-2 cursor-pointer transition-shadow mc-container ${
                block.completed ? 'opacity-50' : 'hover:scale-105 active:scale-95'
              }`}
            >
              <div className="flex items-center gap-1.5 justify-between">
                <span className="text-xs">{block.icon}</span>
                <span
                  className="text-xs font-semibold truncate flex-1 ml-1 text-white"
                  title={block.title}
                >
                  {block.title}
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-[#a59eb8] mt-1.5">
                <span className="mc-font-hud text-xs text-[#55ffff]">
                  {block.type.toUpperCase()}
                </span>
                <span className="text-[#55ff55]">
                  {block.completed ? '✓ DONE' : 'ACTIVE'}
                </span>
              </div>
            </div>
          );
        })}

        {/* Selected Block Inspection Overlay Drawer */}
        {selectedBlock && (
          <div className="absolute bottom-4 right-4 z-20 mc-container p-4 w-72 sm:w-80 shadow-2xl border-2 border-[#e5a84b]">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{selectedBlock.icon}</span>
                <h4 className="text-sm font-bold text-white truncate">
                  {selectedBlock.title}
                </h4>
              </div>
              <button
                onClick={() => setSelectedBlock(null)}
                className="text-xs text-[#8c82a2] hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mt-3 flex items-center gap-2">
              {selectedBlock.type === 'task' && selectedBlock.refData && (
                <button
                  onClick={() => {
                    onCompleteTask(selectedBlock.refData as QuestTask);
                    setSelectedBlock(null);
                  }}
                  className="mc-button mc-button-primary flex-1 py-1 text-xs mc-font-pixel font-semibold"
                >
                  Toggle Quest Done
                </button>
              )}
              <button
                onClick={() => {
                  sound.playPop();
                  // Give block a sudden upward zero-G boost
                  const id = selectedBlock.id;
                  blocksRef.current = blocksRef.current.map((b) =>
                    b.id === id ? { ...b, vy: -12, vRot: (Math.random() - 0.5) * 2 } : b
                  );
                }}
                className="mc-button px-3 py-1 text-xs mc-font-pixel"
              >
                🚀 Blast Up
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
