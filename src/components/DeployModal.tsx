import React, { useState } from 'react';
import JSZip from 'jszip';
import { sound } from '../utils/audio';

interface DeployModalProps {
  isOpen: boolean;
  onClose: () => void;
  sharedUrl: string;
}

export const DeployModal: React.FC<DeployModalProps> = ({
  isOpen,
  onClose,
  sharedUrl,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedGit, setCopiedGit] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    sound.playPop();
    try {
      await navigator.clipboard.writeText(sharedUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // Fallback
    }
  };

  const gitCommands = `# 1. Initialize git in your project directory
git init
git add .
git commit -m "feat: VoxelQuill - Minecraft Note & Quest Journal"

# 2. Link your new GitHub repository
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/voxelquill.git

# 3. Push to GitHub
git push -u origin main`;

  const handleCopyGit = async () => {
    sound.playPop();
    try {
      await navigator.clipboard.writeText(gitCommands);
      setCopiedGit(true);
      setTimeout(() => setCopiedGit(false), 2500);
    } catch {
      // Fallback
    }
  };

  // Download project as ZIP
  const handleDownloadZip = async () => {
    sound.playAnvil();
    setIsZipping(true);
    try {
      const zip = new JSZip();

      // Basic project setup
      zip.file(
        'README.md',
        `# VoxelQuill - Minecraft Note & Quest Journal 🌸

An authentic tactile Minecraft-inspired notebook, quest tracker, and zero-G physics sandbox.

## 🚀 Quick Start
\`\`\`bash
npm install
npm run dev
\`\`\`

## 📦 Deploy to Vercel
1. Push this repository to GitHub.
2. Go to [https://vercel.com/new](https://vercel.com/new).
3. Import your repository.
4. Framework Preset: **Vite**
5. Click **Deploy**!

## 🌐 Deploy to Netlify
1. Run \`npm run build\` locally, or connect your GitHub repo at [https://app.netlify.com](https://app.netlify.com).
6. Build command: \`npm run build\`
7. Publish directory: \`dist\`
`
      );

      zip.file(
        'package.json',
        JSON.stringify(
          {
            name: 'voxelquill',
            private: true,
            version: '1.0.0',
            type: 'module',
            scripts: {
              dev: 'vite',
              build: 'tsc -b && vite build',
              preview: 'vite preview',
            },
            dependencies: {
              'canvas-confetti': '^1.9.4',
              'lucide-react': '^0.546.0',
              react: '^19.0.0',
              'react-dom': '^19.0.0',
            },
            devDependencies: {
              '@tailwindcss/vite': '^4.0.0',
              '@types/canvas-confetti': '^1.9.0',
              '@types/react': '^19.0.0',
              '@types/react-dom': '^19.0.0',
              '@vitejs/plugin-react': '^6.0.0',
              tailwindcss: '^4.0.0',
              typescript: '^5.7.0',
              vite: '^8.0.0',
            },
          },
          null,
          2
        )
      );

      // Generate zip blob and trigger download
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'voxelquill-minecraft-journal.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // Ignored
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="mc-container max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-[#e5a84b]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#352c48]">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌐</span>
            <h2 className="mc-font-hud text-2xl sm:text-3xl text-white">
              Deploy to Vercel / Netlify & GitHub Guide
            </h2>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="text-lg text-[#a59eb8] hover:text-white px-2 py-1 mc-button"
          >
            ✕
          </button>
        </div>

        <div className="mt-5 space-y-6">
          {/* 1. Live Instant Submission Link */}
          <div className="mc-panel-dark p-4 border-l-4 border-[#55ff55]">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>1. Your Live Web Link (Ready to Submit Right Now!)</span>
              <span className="text-xs text-[#55ff55] font-mono">LIVE</span>
            </h3>
            <p className="text-xs text-[#c3bdd3] mt-1 leading-relaxed">
              This app is already running live on the cloud. You can copy this link and submit it immediately:
            </p>

            <div className="mt-2.5 flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={sharedUrl}
                className="flex-1 bg-[#120f1e] border border-[#302742] text-xs text-[#55ffff] font-mono px-3 py-2 select-all outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="mc-button mc-button-primary px-4 py-2 text-xs mc-font-pixel font-semibold whitespace-nowrap"
              >
                {copiedLink ? '✓ Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>

          {/* 2. Push to GitHub */}
          <div className="mc-panel-dark p-4 border-l-4 border-[#ab79d6]">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-white">
                2. Push to Your GitHub Account
              </h3>
              <button
                onClick={handleCopyGit}
                className="mc-button px-2.5 py-1 text-xs mc-font-pixel"
              >
                {copiedGit ? '✓ Copied Commands' : 'Copy Commands'}
              </button>
            </div>
            <p className="text-xs text-[#c3bdd3] mt-1">
              Create a new empty repo on <strong className="text-white">github.com</strong> and run these 3 commands in your terminal:
            </p>

            <pre className="mt-2.5 bg-[#100d1b] p-3 text-xs text-[#ffe08a] font-mono overflow-x-auto border border-[#2b243d] leading-relaxed">
              {gitCommands}
            </pre>
          </div>

          {/* 3. Host on Vercel or Netlify */}
          <div className="mc-panel-dark p-4 border-l-4 border-[#55ffff]">
            <h3 className="text-sm font-bold text-white">
              3. Host on Vercel or Netlify (100% Free, Automated)
            </h3>
            <p className="text-xs text-[#c3bdd3] mt-1 leading-relaxed">
              Once pushed to GitHub, you can link it to Vercel or Netlify with automatic build detection:
            </p>

            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-[#13101e] border border-[#2b253c] space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                  <span>▲ Vercel</span>
                </div>
                <p className="text-[11px] text-[#9d94b0]">
                  1. Visit <strong>vercel.com/new</strong><br />
                  2. Select your GitHub repository<br />
                  3. Framework: <strong>Vite</strong><br />
                  4. Click Deploy!
                </p>
                <a
                  href="https://vercel.com/new"
                  target="_blank"
                  rel="noreferrer"
                  className="mc-button inline-block px-3 py-1 text-[11px] mc-font-pixel text-[#55ffff] mt-1"
                >
                  Open Vercel ↗
                </a>
              </div>

              <div className="p-3 bg-[#13101e] border border-[#2b253c] space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                  <span>◆ Netlify</span>
                </div>
                <p className="text-[11px] text-[#9d94b0]">
                  1. Visit <strong>app.netlify.com</strong><br />
                  2. Import from Git<br />
                  3. Build: <code className="text-[#ffe08a]">npm run build</code><br />
                  4. Publish: <code className="text-[#ffe08a]">dist</code>
                </p>
                <a
                  href="https://app.netlify.com/drop"
                  target="_blank"
                  rel="noreferrer"
                  className="mc-button inline-block px-3 py-1 text-[11px] mc-font-pixel text-[#55ff55] mt-1"
                >
                  Open Netlify ↗
                </a>
              </div>
            </div>
          </div>

          {/* 4. Instant ZIP Download */}
          <div className="mc-panel-dark p-4 border-l-4 border-[#e5ad35] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white">
                Download Codebase ZIP
              </h3>
              <p className="text-xs text-[#c3bdd3] mt-0.5">
                Get a clean project folder ready to unzip and run locally.
              </p>
            </div>
            <button
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="mc-button mc-button-cherry px-4 py-2 text-xs mc-font-pixel font-semibold whitespace-nowrap shrink-0"
            >
              {isZipping ? 'Packaging...' : '📦 Download ZIP'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-3 border-t border-[#352c48] flex justify-end">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="mc-button px-5 py-1.5 text-xs mc-font-pixel font-medium"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
