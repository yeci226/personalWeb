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
const BOT_IDS = new Set(BOTS_DATA.map((b) => b.id.toLowerCase()));

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
              <Link href="/bots" className="s2-btn-primary">邀請至伺服器</Link>
              <Link href="/bots" className="s2-btn-ghost">指令列表</Link>
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

      {/* ── SCENE 4: CONTACT ──────────────────────── */}
      <section className="scene scene-contact">
        <div className="sc-label">
          <div className="sc-label-line" />
          <div className="sc-label-text">聯絡</div>
        </div>
        <div className="sc-counter">04 / 04</div>

        <div className="s4-inner">
          <div className="s4-eyebrow">Get in touch</div>

          <div className="s4-title">
            來找<span>我</span>聊聊。
          </div>

          <div className="s4-icons">
            <a
              href="https://github.com/yeci226"
              target="_blank"
              rel="noopener noreferrer"
              className="s4-icon-btn primary"
              data-label="GitHub"
            >
              <svg viewBox="0 0 24 24" fill="#fff">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
            </a>

            <a
              href="https://discord.com/users/yeci226"
              target="_blank"
              rel="noopener noreferrer"
              className="s4-icon-btn ghost"
              data-label="Discord"
            >
              <svg viewBox="0 0 24 24" fill="#f0f0f0">
                <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z" />
              </svg>
            </a>

            <a
              href="mailto:yeci226@gmail.com"
              className="s4-icon-btn ghost"
              data-label="Email"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="#f0f0f0" strokeWidth="1.5">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M2 7l10 7 10-7" />
              </svg>
            </a>
          </div>
        </div>

        <div className="s4-footer">
          <span className="s4-copy">© 2026 yeci226</span>
          <div className="s4-sep" />
          <Link href="/tos" className="s4-footer-link">Terms of Service</Link>
          <div className="s4-sep" />
          <Link href="/privacy" className="s4-footer-link">Privacy Policy</Link>
        </div>
      </section>

      <FloatingGif />
    </main>
  );
}
