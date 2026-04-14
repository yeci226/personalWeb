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

      {/* ── SCENE 2: BOT SHOWCASE ─────────────────── */}
      <section className="scene scene-bots">
        <div className="sc-label">
          <div className="sc-label-line" />
          <div className="sc-label-text">Discord Bots</div>
        </div>
        <div className="sc-counter">02 / 04</div>

        <div className="s2-top-strip" />
        <div className="s2-accent" />

        {/* Edge arrows */}
        <button className="s2-arrow left" onClick={prevBot} aria-label="Previous bot">
          <span className="s2-arrow-icon">‹</span>
        </button>
        <button className="s2-arrow right" onClick={nextBot} aria-label="Next bot">
          <span className="s2-arrow-icon">›</span>
        </button>

        {/* Left: bot info */}
        {currentBot && (
          <div className="s2-left">
            <div className="s2-bot-row">
              <div className="s2-bot-icon">
                {currentBot.icon
                  ? <img src={currentBot.icon} alt={currentBot.name} />
                  : currentBot.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="s2-bot-tag">
                  Bot · {String(botIndex + 1).padStart(2, '0')} / {String(SHOWCASE_BOTS.length).padStart(2, '0')}
                </div>
                <div className="s2-bot-name">{currentBot.name}</div>
              </div>
            </div>

            <div className="s2-online">
              <div className="s2-online-dot" />
              線上運行中
            </div>

            <p className="s2-desc">{currentBot.description}</p>

            <div className="s2-btns">
              <button className="s2-btn-primary">邀請至伺服器</button>
              <button className="s2-btn-ghost">指令列表</button>
            </div>
          </div>
        )}

        {/* Right: animated Discord chat */}
        {currentBot?.demo && (
          <div className="s2-right">
            <div className="discord-window" key={animKey}>
              <div className="dc-header">
                <span className="dc-hash">#</span>
                <span className="dc-channel-name">{currentBot.demo.channelName}</span>
                <div className="dc-live-dot" title="即時展示中" />
              </div>
              <div className="dc-body">
                {/* Round 1 */}
                <div className="dc-msg dc-anim" style={{ animationDelay: '0.3s' }}>
                  <div className="dc-avatar user" />
                  <div>
                    <div className="dc-username user-color">user</div>
                    <div className="dc-text">
                      {currentBot.demo.rounds[0].userCommand.split(' ').map((part, i) =>
                        i === 0
                          ? <span key={i} className="dc-cmd">{part}</span>
                          : <span key={i} className="dc-param"> {part}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="dc-typing dc-anim" style={{ animationDelay: '1.0s' }}>
                  <div className="dc-typing-dots">
                    <div className="dc-typing-dot" />
                    <div className="dc-typing-dot" />
                    <div className="dc-typing-dot" />
                  </div>
                  {currentBot.name} 正在輸入...
                </div>

                <div className="dc-msg dc-anim" style={{ animationDelay: '1.8s' }}>
                  <div className="dc-avatar bot" />
                  <div>
                    <div className="dc-username bot-color">{currentBot.name}</div>
                    <div className="dc-embed">
                      <div className="dc-embed-title">{currentBot.demo.rounds[0].botEmbed.title}</div>
                      <div className="dc-embed-desc">{currentBot.demo.rounds[0].botEmbed.description}</div>
                      <div className="dc-embed-fields">
                        {currentBot.demo.rounds[0].botEmbed.fields.map((f) => (
                          <div key={f.name} className="dc-field">
                            <div className="dc-field-name">{f.name}</div>
                            <div className="dc-field-value">{f.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Round 2 (if available) */}
                {currentBot.demo.rounds[1] && (
                  <>
                    <div className="dc-msg dc-anim" style={{ animationDelay: '3.2s' }}>
                      <div className="dc-avatar user" />
                      <div>
                        <div className="dc-username user-color">user</div>
                        <div className="dc-text">
                          {currentBot.demo.rounds[1].userCommand.split(' ').map((part, i) =>
                            i === 0
                              ? <span key={i} className="dc-cmd">{part}</span>
                              : <span key={i} className="dc-param"> {part}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="dc-typing dc-anim" style={{ animationDelay: '4.0s' }}>
                      <div className="dc-typing-dots">
                        <div className="dc-typing-dot" />
                        <div className="dc-typing-dot" />
                        <div className="dc-typing-dot" />
                      </div>
                      {currentBot.name} 正在輸入...
                    </div>

                    <div className="dc-msg dc-anim" style={{ animationDelay: '4.8s' }}>
                      <div className="dc-avatar bot" />
                      <div>
                        <div className="dc-username bot-color">{currentBot.name}</div>
                        <div className="dc-embed">
                          <div className="dc-embed-title">{currentBot.demo.rounds[1].botEmbed.title}</div>
                          <div className="dc-embed-desc">{currentBot.demo.rounds[1].botEmbed.description}</div>
                          <div className="dc-embed-fields">
                            {currentBot.demo.rounds[1].botEmbed.fields.map((f) => (
                              <div key={f.name} className="dc-field">
                                <div className="dc-field-name">{f.name}</div>
                                <div className="dc-field-value">{f.value}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Bottom dots */}
        <div className="s2-dots">
          {SHOWCASE_BOTS.map((_, i) => (
            <button
              key={i}
              className={`s2-dot${i === botIndex ? ' active' : ''}`}
              onClick={() => switchBot(i)}
              aria-label={`Bot ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ── SCENE 3: PROJECTS ─────────────────────── */}
      <section className="scene scene-projects">
        <div className="sc-label">
          <div className="sc-label-line" />
          <div className="sc-label-text">精選專案</div>
        </div>
        <div className="sc-counter">03 / 04</div>

        <div className="s3-inner">
          <div className="s3-head">
            <div className="s3-head-line" />
            <div className="s3-head-text">精選專案</div>
          </div>

          <div className="s3-repos">
            {projectRepos.length > 0
              ? projectRepos.map((repo) => (
                  <a
                    key={repo.id}
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="s3-repo"
                  >
                    <div className="s3-repo-name">{repo.name}</div>
                    <div className="s3-repo-desc">
                      {repo.description || '暫無描述'}
                    </div>
                    <div className="s3-repo-footer">
                      <div
                        className="s3-lang-dot"
                        style={{ backgroundColor: getLangColor(repo.language) }}
                      />
                      {repo.language ?? 'Other'} · ★ {repo.stargazers_count}
                    </div>
                  </a>
                ))
              : Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="s3-repo">
                    <div className="s3-repo-name" style={{ background: '#1a1a1a', height: 14, borderRadius: 4 }} />
                    <div className="s3-repo-desc" style={{ background: '#161616', height: 32, borderRadius: 4, marginTop: 4 }} />
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* ── SCENE 4: PLACEHOLDER ──────────────────── */}
      <section className="scene scene-contact" />

      <FloatingGif />
    </main>
  );
}
