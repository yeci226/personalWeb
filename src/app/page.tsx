'use client';

import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import FloatingGif from '@/components/FloatingGif';
import { BOTS_DATA, BotData } from '@/data/bots';

// ── Types ──────────────────────────────────────────
interface Repo {
  id: number;
  name: string;
  description: string;
  stargazers_count: number;
  language: string | null;
  html_url: string;
}

function getLangColor(lang: string | null): string {
  if (!lang) return '#555';
  const map: Record<string, string> = {
    TypeScript: '#3178c6',
    JavaScript: '#f1e05a',
    Python: '#3572A5',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Go: '#00ADD8',
    Java: '#b07219',
  };
  return map[lang] ?? '#555';
}

// ── Showcase bots (only those with demo data) ──────
const SHOWCASE_BOTS: BotData[] = BOTS_DATA.filter((b) => b.demo).slice(0, 3);

// ── Bot IDs for filtering projects ─────────────────
const BOT_IDS = new Set(BOTS_DATA.map((b) => b.id));

export default function Home() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [botIndex, setBotIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const mainRef = useRef<HTMLElement>(null);

  // Fetch GitHub repos
  useEffect(() => {
    fetch('/api/github')
      .then((r) => r.json())
      .then((data) => { if (data.repos) setRepos(data.repos); })
      .catch((err) => console.error('[GitHub fetch]', err));
  }, []);

  // Filter out bot repos from projects scene
  const projectRepos = useMemo(
    () => repos.filter((r) => !BOT_IDS.has(r.name.toLowerCase())).slice(0, 6),
    [repos],
  );

  const switchBot = useCallback((idx: number) => {
    setBotIndex(idx);
    setAnimKey((k) => k + 1);
  }, []);

  const prevBot = () => switchBot((botIndex - 1 + SHOWCASE_BOTS.length) % SHOWCASE_BOTS.length);
  const nextBot = () => switchBot((botIndex + 1) % SHOWCASE_BOTS.length);

  const currentBot = SHOWCASE_BOTS[botIndex];

  return (
    <main ref={mainRef} style={{ position: 'relative' }}>

      {/* ── SCENE 1: HERO ─────────────────────────── */}
      <section className="scene scene-hero">
        <div className="sc-label">
          <div className="sc-label-line" />
          <div className="sc-label-text">yeci226</div>
        </div>
        <div className="sc-counter">01 / 04</div>

        <div className="s1-grid" />
        <div className="s1-pink" />
        <div className="s1-ghost">YC</div>

        <div className="s1-content">
          <div className="s1-eyebrow">Hello, World</div>
          <div className="s1-name">
            <div className="white">我是</div>
            <div className="pink">Yeci.</div>
          </div>
          <p className="s1-desc">熱衷於開發 Discord Bot、網頁以及探索新技術。</p>
        </div>

        <div className="scroll-hint">
          SCROLL
          <div className="scroll-arr" />
        </div>
      </section>

      {/* ── SCENE 2: PLACEHOLDER ──────────────────── */}
      <section className="scene scene-bots" />

      {/* ── SCENE 3: PLACEHOLDER ──────────────────── */}
      <section className="scene scene-projects" />

      {/* ── SCENE 4: PLACEHOLDER ──────────────────── */}
      <section className="scene scene-contact" />

      <FloatingGif />
    </main>
  );
}
