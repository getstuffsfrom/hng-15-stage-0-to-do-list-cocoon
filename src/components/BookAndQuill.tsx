import React, { useState } from 'react';
import { BiomeCategory, QuillNote } from '../types';
import { BIOME_CONFIG } from '../utils/storage';
import { sound } from '../utils/audio';

interface BookAndQuillProps {
  notes: QuillNote[];
  onUpdateNotes: (notes: QuillNote[]) => void;
  onAddXp: (amount: number) => void;
}

export const BookAndQuill: React.FC<BookAndQuillProps> = ({
  notes,
  onUpdateNotes,
  onAddXp,
}) => {
  const [activeNoteId, setActiveNoteId] = useState<string>(notes[0]?.id || '');
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingTitle, setEditingTitle] = useState<boolean>(false);

  const activeNote = notes.find((n) => n.id === activeNoteId) || notes[0];

  // Helper to update current active note
  const updateCurrentNote = (updater: (note: QuillNote) => QuillNote) => {
    if (!activeNote) return;
    const updated = notes.map((n) => (n.id === activeNote.id ? updater(n) : n));
    onUpdateNotes(updated);
  };

  // Create new blank note
  const handleCreateNote = () => {
    sound.playPageFlip();
    const newNote: QuillNote = {
      id: `note-${Date.now()}`,
      title: 'Untitled Expedition Note',
      pages: [''],
      category: 'cherry_grove',
      tags: ['Journal'],
      bookmarked: false,
      inkColor: '#2b231d',
      fontStyle: 'parchment',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    onUpdateNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
    setCurrentPageIndex(0);
    onAddXp(15);
  };

  // Delete note
  const handleDeleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    const updated = notes.filter((n) => n.id !== id);
    onUpdateNotes(updated);
    if (activeNoteId === id && updated.length > 0) {
      setActiveNoteId(updated[0].id);
      setCurrentPageIndex(0);
    }
  };

  // Handle page flip
  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      sound.playPageFlip();
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  const handleNextPage = () => {
    if (!activeNote) return;
    sound.playPageFlip();
    if (currentPageIndex < activeNote.pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    } else {
      // Add a new blank page to the book!
      updateCurrentNote((n) => ({
        ...n,
        pages: [...n.pages, ''],
        updatedAt: Date.now(),
      }));
      setCurrentPageIndex(activeNote.pages.length);
    }
  };

  // Current page text
  const currentPageText = activeNote?.pages[currentPageIndex] ?? '';

  const handlePageTextChange = (text: string) => {
    updateCurrentNote((n) => {
      const nextPages = [...n.pages];
      nextPages[currentPageIndex] = text;
      return {
        ...n,
        pages: nextPages,
        updatedAt: Date.now(),
      };
    });
  };

  // Filter notes
  const filteredNotes = notes.filter((n) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      n.title.toLowerCase().includes(q) ||
      n.pages.some((p) => p.toLowerCase().includes(q)) ||
      n.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  const totalWords = activeNote?.pages.reduce((acc, p) => acc + (p.trim() ? p.trim().split(/\s+/).length : 0), 0) || 0;
  const readTimeMin = Math.max(1, Math.ceil(totalWords / 180));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Sidebar: Notes Library & Index */}
      <div className="lg:col-span-4 space-y-4">
        <div className="mc-container p-4">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h2 className="mc-font-hud text-2xl text-white">Quill Library</h2>
            <button
              onClick={handleCreateNote}
              className="mc-button mc-button-cherry px-2.5 py-1 text-xs mc-font-pixel font-semibold"
            >
              + New Note
            </button>
          </div>

          {/* Search bar */}
          <div className="relative mb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search parchment notes..."
              className="w-full bg-[#13101c] border border-[#2b253c] text-xs text-white px-3 py-1.5 focus:border-[#c97d93] outline-none"
            />
          </div>

          {/* Notes list */}
          <div className="space-y-2 max-h-[540px] overflow-y-auto pr-1">
            {filteredNotes.map((note) => {
              const biome = BIOME_CONFIG[note.category];
              const isSelected = note.id === activeNote?.id;

              return (
                <div
                  key={note.id}
                  onClick={() => {
                    sound.playPageFlip();
                    setActiveNoteId(note.id);
                    setCurrentPageIndex(0);
                  }}
                  className={`p-3 border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#292238] border-[#c97d93] shadow-md'
                      : 'bg-[#181424] border-[#221c32] hover:bg-[#201b30]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <h3 className="text-sm font-semibold text-white truncate flex-1">
                      {note.title || 'Untitled Note'}
                    </h3>
                    <button
                      onClick={(e) => handleDeleteNote(note.id, e)}
                      title="Discard note"
                      className="text-xs text-[#8c82a2] hover:text-[#ff6b6b] px-1"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Clean unboxed metadata per constitution */}
                  <div className="flex items-center gap-1.5 text-xs text-[#a59eb8] mt-1">
                    <span style={{ color: biome.color }}>{biome.icon} {biome.name}</span>
                    <span aria-hidden="true">·</span>
                    <span>{note.pages.length} {note.pages.length === 1 ? 'page' : 'pages'}</span>
                  </div>

                  <p className="text-xs text-[#9d93b3] mt-1.5 line-clamp-2 leading-relaxed">
                    {note.pages[0] || '(Blank page)'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Column: Parchment Book Reader & Writer */}
      <div className="lg:col-span-8">
        {activeNote ? (
          <div className="space-y-4">
            {/* Top Toolbar for Active Note */}
            <div className="mc-panel-dark p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[#a59eb8]">Biome Theme:</span>
                <select
                  value={activeNote.category}
                  onChange={(e) => {
                    sound.playClick();
                    updateCurrentNote((n) => ({ ...n, category: e.target.value as BiomeCategory }));
                  }}
                  aria-label="Select note biome theme"
                  className="bg-[#14111f] border border-[#2e2640] text-white px-2 py-1 outline-none text-xs"
                >
                  {Object.entries(BIOME_CONFIG).map(([key, config]) => (
                    <option key={key} value={key}>
                      {config.icon} {config.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ink Color picker */}
              <div className="flex items-center gap-1.5">
                <span className="text-[#a59eb8]">Ink:</span>
                {[
                  { color: '#2b231d', label: 'Charcoal' },
                  { color: '#542940', label: 'Cherry Bark' },
                  { color: '#2d4224', label: 'Moss Green' },
                  { color: '#382550', label: 'Amethyst' },
                ].map((ink) => (
                  <button
                    key={ink.color}
                    onClick={() => {
                      sound.playClick();
                      updateCurrentNote((n) => ({ ...n, inkColor: ink.color }));
                    }}
                    title={ink.label}
                    className={`w-5 h-5 rounded-none border transition-transform ${
                      activeNote.inkColor === ink.color ? 'scale-125 border-white ring-1 ring-[#e5a84b]' : 'border-[#000]'
                    }`}
                    style={{ backgroundColor: ink.color }}
                  />
                ))}
              </div>

              {/* Font Style Toggle */}
              <div className="flex items-center gap-1 bg-[#13101c] p-0.5 border border-[#2e2640]">
                <button
                  onClick={() => {
                    sound.playClick();
                    updateCurrentNote((n) => ({ ...n, fontStyle: 'pixel' }));
                  }}
                  className={`px-2 py-0.5 text-xs mc-font-pixel ${
                    activeNote.fontStyle === 'pixel' ? 'bg-[#3b3350] text-white' : 'text-[#8c82a2]'
                  }`}
                >
                  Pixel
                </button>
                <button
                  onClick={() => {
                    sound.playClick();
                    updateCurrentNote((n) => ({ ...n, fontStyle: 'parchment' }));
                  }}
                  className={`px-2 py-0.5 text-xs font-serif ${
                    activeNote.fontStyle === 'parchment' ? 'bg-[#3b3350] text-white' : 'text-[#8c82a2]'
                  }`}
                >
                  Serif
                </button>
                <button
                  onClick={() => {
                    sound.playClick();
                    updateCurrentNote((n) => ({ ...n, fontStyle: 'clean' }));
                  }}
                  className={`px-2 py-0.5 text-xs font-sans ${
                    activeNote.fontStyle === 'clean' ? 'bg-[#3b3350] text-white' : 'text-[#8c82a2]'
                  }`}
                >
                  Clean
                </button>
              </div>
            </div>

            {/* The Parchment Page Container */}
            <div className="mc-parchment p-6 sm:p-8 min-h-[480px] flex flex-col justify-between relative shadow-2xl">
              {/* Quill ornament in corner */}
              <div className="absolute top-4 right-4 opacity-30 pointer-events-none text-2xl">
                🪶
              </div>

              <div>
                {/* Note Title */}
                {editingTitle ? (
                  <input
                    type="text"
                    value={activeNote.title}
                    autoFocus
                    onBlur={() => setEditingTitle(false)}
                    onChange={(e) => {
                      updateCurrentNote((n) => ({ ...n, title: e.target.value }));
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') setEditingTitle(false);
                    }}
                    className="w-full text-2xl font-bold bg-transparent border-b-2 border-[#82674e] outline-none text-[#2d2218] mb-4 pb-1"
                  />
                ) : (
                  <h1
                    onClick={() => setEditingTitle(true)}
                    title="Click to rename note"
                    className="text-2xl font-bold text-[#2d2218] mb-3 cursor-pointer hover:underline flex items-center gap-2"
                  >
                    <span>{activeNote.title || 'Untitled Note'}</span>
                    <span className="text-xs text-[#7d6852] font-normal font-sans">✎</span>
                  </h1>
                )}

                {/* Clean unboxed metadata */}
                <div className="flex items-center gap-2 text-xs text-[#705a46] mb-6 pb-2 border-b border-[#cfbe9e]">
                  <span>Page {currentPageIndex + 1} of {activeNote.pages.length}</span>
                  <span aria-hidden="true">·</span>
                  <span>{totalWords} words</span>
                  <span aria-hidden="true">·</span>
                  <span>{readTimeMin} min read</span>
                </div>

                {/* Parchment Textarea */}
                <textarea
                  value={currentPageText}
                  onChange={(e) => handlePageTextChange(e.target.value)}
                  placeholder="Inscribe your thoughts, coordinates, potion recipes, or quest notes..."
                  style={{
                    color: activeNote.inkColor,
                    fontFamily:
                      activeNote.fontStyle === 'pixel'
                        ? "'Pixelify Sans', monospace"
                        : activeNote.fontStyle === 'parchment'
                        ? "Georgia, 'Times New Roman', serif"
                        : "'Plus Jakarta Sans', sans-serif",
                    lineHeight: '1.75',
                  }}
                  className="w-full h-80 bg-transparent resize-none outline-none text-base font-normal tracking-wide placeholder:text-[#9c8973]/70"
                />
              </div>

              {/* Bottom Page Navigation Controls */}
              <div className="pt-4 border-t border-[#cfbe9e] flex items-center justify-between">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPageIndex === 0}
                  className={`px-3 py-1.5 text-xs font-semibold mc-button ${
                    currentPageIndex === 0 ? 'opacity-40 cursor-not-allowed' : ''
                  }`}
                >
                  ◀ Previous Page
                </button>

                <div className="mc-font-hud text-lg text-[#523d2b] font-bold">
                  {currentPageIndex + 1} / {activeNote.pages.length}
                </div>

                <button
                  onClick={handleNextPage}
                  className="px-3 py-1.5 text-xs font-semibold mc-button mc-button-cherry"
                >
                  {currentPageIndex < activeNote.pages.length - 1 ? 'Next Page ▶' : '+ Add Page 🪶'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mc-container p-12 text-center">
            <h3 className="mc-font-hud text-2xl text-white">No Notes Opened</h3>
            <button
              onClick={handleCreateNote}
              className="mt-3 mc-button mc-button-cherry px-4 py-2 text-xs mc-font-pixel font-semibold"
            >
              + Create First Parchment Note
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
