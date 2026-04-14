'use client';

import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import FloatingGif from '@/components/FloatingGif';
import { BOTS_DATA, BotData, BotDemoEmbed } from '@/data/bots';

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

// ── Discord demo user config ─────
// Customize name / color / optional avatar image once; reused everywhere
const DEMO_USER = { name: 'Yeci', color: '#5865F2', avatarUrl: '96086308fc5a5a9b2a872a2d233de95a.webp' };

// ── DiscordChat component ──────────────────────────
type ChatMsg =
  | { type: 'user'; text: string }
  | { type: 'bot'; botEmbed?: BotDemoEmbed; botImageUrl?: string; botText?: string; thinking: boolean; replyTo: string };

function DiscordChat({ bot, animKey }: { bot: BotData; animKey: number }) {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [inputText, setInputText] = useState('');
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([]);
    setInputText('');

    if (!bot.demo?.rounds.length) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    let cancelled = false;

    const sleep = (ms: number) =>
      new Promise<void>((res) => { timers.push(setTimeout(res, ms)); });

    async function run() {
      await sleep(500);
      for (const round of bot.demo!.rounds) {
        if (cancelled) return;
        // Type command char by char
        const cmd = round.userCommand;
        for (let i = 1; i <= cmd.length; i++) {
          if (cancelled) return;
          setInputText(cmd.slice(0, i));
          await sleep(55);
        }
        if (cancelled) return;
        await sleep(300);
        // Send user message, clear input
        setInputText('');
        setMessages((prev) => [...prev, { type: 'user', text: cmd }]);
        if (cancelled) return;
        await sleep(400);
        // Bot appears with thinking state
        setMessages((prev) => [...prev, {
          type: 'bot',
          botEmbed: round.botEmbed,
          botImageUrl: round.botImageUrl,
          botText: round.botText,
          thinking: true,
          replyTo: cmd,
        }]);
        if (cancelled) return;
        await sleep(1800);
        if (cancelled) return;
        // "Edit" the last message — reveal the embed
        setMessages((prev) => {
          const copy = [...prev];
          const last = copy[copy.length - 1];
          if (last?.type === 'bot') copy[copy.length - 1] = { ...last, thinking: false };
          return copy;
        });
        if (cancelled) return;
        await sleep(2200);
      }
    }

    run();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [animKey, bot]);

  useEffect(() => {
    const el = messagesRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  if (!bot.demo) return null;

  return (
    <div className="discord-window">
      <div className="dc-header">
        <span className="dc-hash">#</span>
        <span className="dc-channel-name">{bot.demo.channelName}</span>
      </div>

      <div className="dc-messages" ref={messagesRef}>
        {/* spacer pushes messages to bottom */}
        <div className="dc-spacer" />

        {messages.map((msg, i) => {
          // User messages are surfaced via the bot's reply reference — don't render separately
          if (msg.type === 'user') return null;

          // Parse reply reference
          const replyParts = msg.replyTo.split(' ');
          const replyCmd = replyParts[0];
          const replyArgs = replyParts.slice(1).join(' ');
          return (
            <div key={i} className="dc-group dc-msg-appear">
              {/* Reply reference row */}
              <div className="dc-reply">
                <div className="dc-reply-mini-avatar" style={!DEMO_USER.avatarUrl ? { background: DEMO_USER.color } : undefined}>
                  {DEMO_USER.avatarUrl && <img src={DEMO_USER.avatarUrl} alt={DEMO_USER.name} />}
                </div>
                <span className="dc-reply-who" style={{ color: DEMO_USER.color }}>
                  {DEMO_USER.name}
                </span>
                <span className="dc-reply-label"> 已使用 </span>
                <span className="dc-reply-cmd">{replyCmd}</span>
                {replyArgs && <span className="dc-reply-arg"> {replyArgs}</span>}
              </div>
              {/* Actual bot message */}
              <div className="dc-msg">
                <div className="dc-avatar bot">
                  {bot.icon && <img src={bot.icon} alt={bot.name} />}
                </div>
                <div>
                  <div className="dc-username bot-color">
                    {bot.name}
                    <span className="dc-app-badge">APP</span>
                  </div>
                  {msg.thinking ? (
                    <div className="dc-thinking">
                      <div className="dc-typing-dots">
                        <div className="dc-typing-dot" />
                        <div className="dc-typing-dot" />
                        <div className="dc-typing-dot" />
                      </div>
                      <span className="dc-thinking-label">{bot.name} 正在思考...</span>
                    </div>
                  ) : msg.botImageUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={msg.botImageUrl} alt="" className="dc-bot-image dc-embed-appear" />
                  ) : msg.botText ? (
                    <div className="dc-text dc-embed-appear">{msg.botText}</div>
                  ) : msg.botEmbed ? (
                    <div className="dc-embed dc-embed-appear">
                      <div className="dc-embed-title">{msg.botEmbed.title}</div>
                      <div className="dc-embed-desc">{msg.botEmbed.description}</div>
                      <div className="dc-embed-fields">
                        {msg.botEmbed.fields.map((f) => (
                          <div key={f.name} className="dc-field">
                            <div className="dc-field-name">{f.name}</div>
                            <div className="dc-field-value">{f.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="dc-input-bar">
        <div className="dc-input-inner">
          {inputText
            ? <><span className="dc-input-text">{inputText}</span><span className="dc-cursor" /></>
            : <span className="dc-placeholder">輸入指令...</span>
          }
        </div>
      </div>
    </div>
  );
}

// ── Bot IDs for filtering projects ─────────────────
const BOT_IDS = new Set(BOTS_DATA.map((b) => b.id.toLowerCase()));

export default function Home() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [botIndex, setBotIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const mainRef = useRef<HTMLElement>(null);
  const [heroIn, setHeroIn] = useState(false);

  useEffect(() => {
    setTimeout(() => setHeroIn(true), 80);
  }, []);

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
      <section className={"scene scene-hero" + (heroIn ? " scene-hero-in" : "") }>
        <div className="sc-label">
          <div className="sc-label-line" />
          <div className="sc-label-text">yeci226</div>
        </div>
        <div className="sc-counter">01 / 04</div>

        <div className="s1-grid" />
        <div className="s1-pink" />
        <div className="s1-ghost">Hello</div>

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
            <DiscordChat key={animKey} bot={currentBot} animKey={animKey} />
          </div>
        )}

        {/* Bottom bot-avatar nav */}
        <div className="s2-bots-nav">
          {SHOWCASE_BOTS.map((bot, i) => (
            <button
              key={i}
              className={`s2-bot-nav-btn${i === botIndex ? ' active' : ''}`}
              onClick={() => switchBot(i)}
              aria-label={bot.name}
            >
              <div className="s2-bot-nav-icon">
                {bot.icon
                  ? <img src={bot.icon} alt={bot.name} />
                  : bot.name.charAt(0).toUpperCase()}
              </div>
              <span className="s2-bot-nav-name">{bot.name}</span>
            </button>
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
          <div className="s3-repos">
            {projectRepos.length > 0
              ? projectRepos.map((repo, idx) => (
                  <a
                    key={repo.id}
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="s3-repo"
                    style={{
                      '--lang-color': getLangColor(repo.language),
                      animationDelay: `${idx * 70}ms`,
                    } as React.CSSProperties}
                  >
                    <div className="s3-repo-top">
                      <div className="s3-repo-name">{repo.name}</div>
                      {repo.stargazers_count > 0 && (
                        <div className="s3-repo-stars">★ {repo.stargazers_count}</div>
                      )}
                    </div>
                    <div className="s3-repo-desc">
                      {repo.description || '暫無描述'}
                    </div>
                    <div className="s3-repo-footer">
                      <div
                        className="s3-lang-dot"
                        style={{ backgroundColor: getLangColor(repo.language) }}
                      />
                      {repo.language ?? 'Other'}
                    </div>
                  </a>
                ))
              : Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="s3-repo" style={{ '--lang-color': '#333' } as React.CSSProperties}>
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
  您可以透過以下方式 <span>與我聯絡</span>
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
              href="https://discord.com/users/283946584461410305"
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
              href="mailto:shawnyin226@gmail.com"
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
