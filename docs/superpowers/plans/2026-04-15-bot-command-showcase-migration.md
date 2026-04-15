# Bot Command Showcase Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate all bot command showcase content into the homepage Discord chat demo, add carousel support for multi-image rounds, and delete the standalone `/bots` page.

**Architecture:** Update `bots.ts` types and data (add `inviteUrl`, extend `botImageUrl` to `string | string[]`, add `demo` to all 9 bots). Add `BotImageCarousel` and `PageLightbox` components in `page.tsx`. Update `SHOWCASE_BOTS` to include all bots. Remove `/bots` page, `BotsShowcase.tsx`, `bots.css`.

**Tech Stack:** Next.js 14 (App Router), TypeScript, React hooks, CSS (globals.css)

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/data/bots.ts` | Modify | Add types, `inviteUrl`, `demo` data for all 9 bots |
| `src/app/page.tsx` | Modify | Carousel + lightbox components, SHOWCASE_BOTS, invite button |
| `src/app/globals.css` | Modify | Carousel CSS styles |
| `src/app/bots/page.tsx` | Delete | No longer needed |
| `src/components/BotsShowcase.tsx` | Delete | No longer needed |
| `src/components/bots.css` | Delete | No longer needed |

---

### Task 1: Update TypeScript types in bots.ts

**Files:**
- Modify: `src/data/bots.ts:1-58`

- [ ] **Open `src/data/bots.ts` and make two type changes**

Change `BotDemoRound.botImageUrl` from `string` to `string | string[]`, and add `inviteUrl` to `BotData`:

```ts
// Line ~39 — change botImageUrl type:
export interface BotDemoRound {
  userCommand: string;
  botEmbed?: BotDemoEmbed;
  botImageUrl?: string | string[];
  botText?: string;
}

// Line ~50 — add inviteUrl field to BotData:
export interface BotData {
  id: string;
  name: string;
  icon: string;
  banner?: string;
  description: string;
  inviteUrl?: string;
  demo?: BotDemo;
  categories: CommandCategory[];
}
```

- [ ] **Commit**

```bash
git add src/data/bots.ts
git commit -m "feat: extend BotDemoRound.botImageUrl to string | string[] and add BotData.inviteUrl"
```

---

### Task 2: Add inviteUrl + demo to animeguess

**Files:**
- Modify: `src/data/bots.ts` (animeguess entry, currently around line 258)

- [ ] **Find the animeguess bot entry (`id: "animeguess"`) and add `inviteUrl` and `demo`**

Insert `inviteUrl` after the `description` field, and add a `demo` object before `categories`:

```ts
{
  id: "animeguess",
  name: "二次元角色猜猜吧",
  icon: "/bots/animeguess/pfp.webp",
  description: "一個可以讓你在 Discord 上透過 AI 對話猜二次元角色的有趣機器人。機器人會以角色的語氣回覆你，挑戰你的動漫知識！",
  inviteUrl: "https://discord.com/api/oauth2/authorize?client_id=1130327421111001158&permissions=8&scope=bot%20applications.commands",
  demo: {
    channelName: 'animeguess-bot-demo',
    rounds: [
      {
        userCommand: '/stats',
        botEmbed: {
          title: '📊 您的個人戰績',
          description: '挑戰動漫知識，看看你的成績如何！',
          fields: [
            { name: '猜對次數', value: '42' },
            { name: '總場次', value: '58' },
            { name: '勝率', value: '72.4%' },
          ],
        },
      },
      {
        userCommand: '/leaderboard',
        botEmbed: {
          title: '🏆 全球排行榜',
          description: '競爭動漫知識之巔！',
          fields: [
            { name: '# 1', value: 'Yeci — 勝率 89%' },
            { name: '# 2', value: 'Arona — 勝率 82%' },
            { name: '# 3', value: 'Himari — 勝率 75%' },
          ],
        },
      },
    ],
  },
  categories: [ /* unchanged */ ],
},
```

- [ ] **Commit**

```bash
git add src/data/bots.ts
git commit -m "feat: add demo and inviteUrl to animeguess bot"
```

---

### Task 3: Add inviteUrl + demo to BA Arona

**Files:**
- Modify: `src/data/bots.ts` (ba-discord-bot entry, currently around line 312)

- [ ] **Find the `id: "ba-discord-bot"` entry and add `inviteUrl` and `demo`**

Insert after `description`:

```ts
inviteUrl: "https://discord.com/api/oauth2/authorize?client_id=1028212108740923412&permissions=8&scope=bot%20applications.commands",
demo: {
  channelName: 'ba-bot-demo',
  rounds: [
    { userCommand: '/student', botImageUrl: 'bots/ba/student.png' },
    { userCommand: '/builder', botImageUrl: 'bots/ba/teambuild.png' },
    { userCommand: '/gacha pull', botImageUrl: 'bots/ba/pull.png' },
    { userCommand: '/gacha', botImageUrl: 'bots/ba/gacha.png' },
    { userCommand: '/notification setup', botImageUrl: 'bots/ba/notify.png' },
  ],
},
```

- [ ] **Commit**

```bash
git add src/data/bots.ts
git commit -m "feat: add demo and inviteUrl to BA Arona bot"
```

---

### Task 4: Add inviteUrl + demo to FF14 塔塔露

**Files:**
- Modify: `src/data/bots.ts` (ff14 entry, currently around line 544)

- [ ] **Find the `id: "ff14"` entry and add `inviteUrl` and `demo`**

Insert after `description`:

```ts
inviteUrl: "https://discord.com/oauth2/authorize?client_id=1006747370060533760",
demo: {
  channelName: 'ff14-bot-demo',
  rounds: [
    { userCommand: '/news bind', botImageUrl: 'bots/ff14/notify.png' },
  ],
},
```

- [ ] **Commit**

```bash
git add src/data/bots.ts
git commit -m "feat: add demo and inviteUrl to FF14 塔塔露 bot"
```

---

### Task 5: Add inviteUrl + demo to NIKKE Shifty

**Files:**
- Modify: `src/data/bots.ts` (nikke entry, currently around line 1133)

- [ ] **Find the `id: "nikke"` entry and add `inviteUrl` and `demo`**

Insert after `description`:

```ts
inviteUrl: "https://discord.com/oauth2/authorize?client_id=1368793547133816903",
demo: {
  channelName: 'nikke-bot-demo',
  rounds: [
    { userCommand: '/character', botImageUrl: ['bots/nikke/profile-char.png', 'bots/nikke/profile-all.png'] },
    { userCommand: '/team build', botImageUrl: 'bots/nikke/teambuild.png' },
    { userCommand: '/profile', botImageUrl: 'bots/nikke/profile.png' },
    { userCommand: '/notification setup', botImageUrl: 'bots/nikke/notify.png' },
  ],
},
```

- [ ] **Commit**

```bash
git add src/data/bots.ts
git commit -m "feat: add demo and inviteUrl to NIKKE Shifty bot"
```

---

### Task 6: Add inviteUrl + demo to Haneko

**Files:**
- Modify: `src/data/bots.ts` (Haneko entry, currently around line 1267)

- [ ] **Find the `id: "Haneko"` entry and add `inviteUrl` and `demo`**

Insert after `description`:

```ts
inviteUrl: "https://discord.com/oauth2/authorize?client_id=998934498274181132",
demo: {
  channelName: 'haneko-bot-demo',
  rounds: [
    {
      userCommand: '/nhentai search',
      botEmbed: {
        title: '🔍 搜尋結果',
        description: '找到 1,247 個符合條件的結果',
        fields: [
          { name: '篩選', value: 'tag: maid' },
          { name: '排序', value: '最熱門' },
        ],
      },
    },
    {
      userCommand: '/list',
      botEmbed: {
        title: '💖 我的收藏夾',
        description: '共 23 個項目',
        fields: [
          { name: '稍後觀看', value: '12 個' },
          { name: '收藏夾', value: '11 個' },
        ],
      },
    },
  ],
},
```

- [ ] **Commit**

```bash
git add src/data/bots.ts
git commit -m "feat: add demo and inviteUrl to Haneko bot"
```

---

### Task 7: Add inviteUrl + demo to Outo

**Files:**
- Modify: `src/data/bots.ts` (Outo entry, currently around line 1445)

- [ ] **Find the `id: "Outo"` entry and add `inviteUrl` and `demo`**

Insert after `description`:

```ts
inviteUrl: "https://discord.com/oauth2/authorize?client_id=1369294751618039808",
demo: {
  channelName: 'outo-bot-demo',
  rounds: [
    {
      userCommand: '/quiz',
      botEmbed: {
        title: '🧠 友情大會考開始！',
        description: 'AI 正在分析頻道歷史紀錄，生成專屬題目中...',
        fields: [
          { name: '模式', value: '多人大會考' },
          { name: '題目數量', value: '20 題' },
          { name: '主題', value: '自動生成' },
        ],
      },
    },
    {
      userCommand: '/add',
      botEmbed: {
        title: '✅ 詞彙新增成功',
        description: '已將新的觸發詞加入詞庫',
        fields: [
          { name: '觸發詞', value: '早安' },
          { name: '回覆', value: '早安！新的一天加油！' },
          { name: '觸發機率', value: '80%' },
        ],
      },
    },
  ],
},
```

- [ ] **Commit**

```bash
git add src/data/bots.ts
git commit -m "feat: add demo and inviteUrl to Outo bot"
```

---

### Task 8: Add inviteUrl + append rounds to endfield

**Files:**
- Modify: `src/data/bots.ts` (endfield entry, currently around line 78)

- [ ] **Add `inviteUrl` to endfield after its `description` field**

```ts
inviteUrl: "https://discord.com/oauth2/authorize?client_id=1463410818791116831",
```

- [ ] **Append image rounds to endfield's existing `demo.rounds` array**

The existing rounds end with the `/news latest` embed round. Append after it:

```ts
{ userCommand: '/daily claim', botImageUrl: 'bots/endfield/daily-check.png' },
{ userCommand: '/profile', botImageUrl: ['bots/endfield/profile.webp', 'bots/endfield/profile-char.webp'] },
{ userCommand: '/gacha', botImageUrl: 'bots/endfield/gacha.png' },
{ userCommand: '/news bind', botImageUrl: 'bots/endfield/notify.png' },
```

- [ ] **Commit**

```bash
git add src/data/bots.ts
git commit -m "feat: add inviteUrl and image rounds to endfield demo"
```

---

### Task 9: Add inviteUrl + append rounds to HSR 星鐵小助手

**Files:**
- Modify: `src/data/bots.ts` (hsr-discord-bot entry, currently around line 627)

- [ ] **Add `inviteUrl` to HSR after its `description` field**

```ts
inviteUrl: "https://discord.com/oauth2/authorize?client_id=895191125512581171",
```

- [ ] **Append image rounds to HSR's existing `demo.rounds` array**

Existing rounds end with the `/news latest` embed round. Append after it:

```ts
{ userCommand: '/daily', botImageUrl: 'bots/hsr/daily.png' },
{ userCommand: '/note', botImageUrl: 'bots/hsr/note.png' },
{ userCommand: '/memory', botImageUrl: ['bots/hsr/memory.png', 'bots/hsr/story.png', 'bots/hsr/boss.png'] },
{ userCommand: '/profile', botImageUrl: ['bots/hsr/profile.png', 'bots/hsr/profile-char.png'] },
{ userCommand: '/leaderboard', botImageUrl: 'bots/hsr/leaderboard.png' },
{ userCommand: '/warp log', botImageUrl: 'bots/hsr/warp-log.png' },
{ userCommand: '/warp simulator', botImageUrl: 'bots/hsr/warp-sim.png' },
{ userCommand: '/atlas character', botImageUrl: 'bots/hsr/atlas.png' },
```

- [ ] **Commit**

```bash
git add src/data/bots.ts
git commit -m "feat: add inviteUrl and image rounds to HSR demo"
```

---

### Task 10: Add inviteUrl + append rounds to ZZZ 以色列

**Files:**
- Modify: `src/data/bots.ts` (zzz entry, currently around line 864)

- [ ] **Add `inviteUrl` to ZZZ after its `description` field**

```ts
inviteUrl: "https://discord.com/oauth2/authorize?client_id=1170366976162537543",
```

- [ ] **Append image rounds to ZZZ's existing `demo.rounds` array**

Existing rounds end with the last embed round. Append after it:

```ts
{ userCommand: '/note', botImageUrl: 'bots/zzz/note.png' },
{ userCommand: '/profile', botImageUrl: ['bots/zzz/profile.png', 'bots/zzz/profile-char.png'] },
{ userCommand: '/shiyudefense', botImageUrl: 'bots/zzz/shiyudefense.png' },
{ userCommand: '/deadlyassault', botImageUrl: 'bots/zzz/deadlyassault.png' },
{ userCommand: '/signal-log', botImageUrl: 'bots/zzz/signal-log.png' },
```

- [ ] **Commit**

```bash
git add src/data/bots.ts
git commit -m "feat: add inviteUrl and image rounds to ZZZ demo"
```

---

### Task 11: Add BotImageCarousel + PageLightbox to page.tsx

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Add `BotImageCarousel` component above `DiscordChat`**

Insert this component definition before the `function DiscordChat` line:

```tsx
function BotImageCarousel({
  images,
  onClickImage,
}: {
  images: string[];
  onClickImage: (index: number) => void;
}) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((i) => (i + 1) % images.length);
    }, 2500);
  }, [images.length]);

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [resetTimer]);

  const go = (idx: number) => {
    setCurrent(idx);
    resetTimer();
  };

  return (
    <div className="dc-carousel">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={images[current]}
        alt=""
        className="dc-bot-image dc-embed-appear clickable"
        onClick={() => onClickImage(current)}
      />
      <button className="dc-carousel-arrow left" onClick={() => go((current - 1 + images.length) % images.length)}>‹</button>
      <button className="dc-carousel-arrow right" onClick={() => go((current + 1) % images.length)}>›</button>
      <div className="dc-carousel-dots">
        {images.map((_, i) => (
          <span
            key={i}
            className={`lightbox-dot${i === current ? ' active' : ''}`}
            onClick={() => go(i)}
          />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Add `PageLightbox` component above `BotImageCarousel`**

```tsx
function PageLightbox({
  images,
  startIndex,
  onClose,
}: {
  images: string[];
  startIndex: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(startIndex);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setCurrent((i) => (i + 1) % images.length);
      if (e.key === 'ArrowLeft') setCurrent((i) => (i - 1 + images.length) % images.length);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [images.length, onClose]);

  return (
    <div className="lightbox-backdrop" onClick={onClose}>
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <button className="lightbox-close" onClick={onClose}>×</button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images[current]} alt="" className="lightbox-img" />
        {images.length > 1 && (
          <>
            <button className="lightbox-arrow left" onClick={() => setCurrent((i) => (i - 1 + images.length) % images.length)}>‹</button>
            <button className="lightbox-arrow right" onClick={() => setCurrent((i) => (i + 1) % images.length)}>›</button>
            <div className="lightbox-dots">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`lightbox-dot${i === current ? ' active' : ''}`}
                  onClick={() => setCurrent(i)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Update `DiscordChat` state — replace `lightboxSrc` with `lightboxImages` + `lightboxStartIndex`**

Find these lines inside `function DiscordChat`:
```tsx
const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
```
Replace with:
```tsx
const [lightboxImages, setLightboxImages] = useState<string[] | null>(null);
const [lightboxStartIndex, setLightboxStartIndex] = useState(0);

const openLightbox = useCallback((images: string[], index = 0) => {
  setLightboxImages(images);
  setLightboxStartIndex(index);
}, []);
```

- [ ] **Update the botImageUrl render block in `DiscordChat`**

Find the existing block that renders `msg.botImageUrl` (the single `<img>` with `onClick={() => setLightboxSrc(...)}`). Replace the entire ternary arm with:

```tsx
) : msg.botImageUrl ? (
  (() => {
    const imgs = Array.isArray(msg.botImageUrl) ? msg.botImageUrl : [msg.botImageUrl];
    if (imgs.length === 1) {
      return (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={imgs[0]}
          alt=""
          className="dc-bot-image dc-embed-appear clickable"
          onClick={() => openLightbox(imgs, 0)}
        />
      );
    }
    return (
      <BotImageCarousel
        images={imgs}
        onClickImage={(idx) => openLightbox(imgs, idx)}
      />
    );
  })()
```

- [ ] **Update the portal at the bottom of DiscordChat's return**

Find:
```tsx
{lightboxSrc && createPortal(
  <div className="lightbox-backdrop" onClick={() => setLightboxSrc(null)}>
    <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
      <button className="lightbox-close" onClick={() => setLightboxSrc(null)}>×</button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={lightboxSrc} alt="" className="lightbox-img" />
    </div>
  </div>,
  document.body
)}
```
Replace with:
```tsx
{lightboxImages && createPortal(
  <PageLightbox
    images={lightboxImages}
    startIndex={lightboxStartIndex}
    onClose={() => setLightboxImages(null)}
  />,
  document.body
)}
```

- [ ] **Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: add BotImageCarousel and PageLightbox components to DiscordChat"
```

---

### Task 12: Add carousel CSS to globals.css

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Append carousel styles at the end of globals.css (after the lightbox section)**

```css
/* ── Bot Image Carousel ─────────────────────────────── */
.dc-carousel {
  position: relative;
  display: inline-block;
  width: 100%;
}

.dc-carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #f0f6fc;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  z-index: 2;
}

.dc-carousel-arrow:hover {
  background: rgba(125, 211, 252, 0.25);
  border-color: rgba(125, 211, 252, 0.4);
}

.dc-carousel-arrow.left { left: 6px; }
.dc-carousel-arrow.right { right: 6px; }

.dc-carousel-dots {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 6px;
}
```

- [ ] **Commit**

```bash
git add src/app/globals.css
git commit -m "feat: add carousel CSS for multi-image bot demo rounds"
```

---

### Task 13: Update SHOWCASE_BOTS and Scene 2 invite button

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Update `SHOWCASE_BOTS` to include all bots**

Find:
```ts
const SHOWCASE_BOTS: BotData[] = BOTS_DATA.filter((b) => b.demo).slice(0, 3);
```
Replace with:
```ts
const SHOWCASE_BOTS: BotData[] = BOTS_DATA;
```

- [ ] **Update Scene 2 buttons**

Find the two `Link` buttons in Scene 2:
```tsx
<Link href="/bots" className="s2-btn-primary">邀請至伺服器</Link>
<Link href="/bots" className="s2-btn-ghost">指令列表</Link>
```
Replace with a single invite button using `currentBot.inviteUrl`:
```tsx
{currentBot?.inviteUrl && (
  <a href={currentBot.inviteUrl} target="_blank" rel="noopener noreferrer" className="s2-btn-primary">
    邀請至伺服器
  </a>
)}
```

- [ ] **Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: show all bots in showcase, use inviteUrl for invite button"
```

---

### Task 14: Delete obsolete files

**Files:**
- Delete: `src/app/bots/page.tsx`
- Delete: `src/components/BotsShowcase.tsx`
- Delete: `src/components/bots.css`

- [ ] **Delete the bots page and directory**

```bash
rm src/app/bots/page.tsx
rmdir src/app/bots
```

- [ ] **Delete BotsShowcase component and its CSS**

```bash
rm src/components/BotsShowcase.tsx
rm src/components/bots.css
```

- [ ] **Verify no remaining imports of deleted files**

```bash
grep -r "BotsShowcase\|from.*bots\.css\|from.*\/bots" src/ --include="*.ts" --include="*.tsx"
```

Expected: no output (or only the `bots.ts` data file, which is fine)

- [ ] **Commit**

```bash
git add -A
git commit -m "chore: remove /bots page, BotsShowcase component and bots.css"
```

---

## Self-Review

**Spec coverage:**
- ✅ `botImageUrl: string | string[]` — Task 1
- ✅ All 9 bots get `demo` data — Tasks 2–10
- ✅ `inviteUrl` on all bots — Tasks 2–10
- ✅ Image carousel with auto-advance + manual arrows — Task 11
- ✅ Carousel dots — Tasks 11–12
- ✅ Clicking carousel image opens lightbox with all images — Task 11
- ✅ `SHOWCASE_BOTS` includes all bots — Task 13
- ✅ Scene 2 invite button uses `inviteUrl`, removes "指令列表" — Task 13
- ✅ Delete `/bots`, `BotsShowcase.tsx`, `bots.css` — Task 14

**Type consistency check:**
- `BotImageCarousel` receives `images: string[]` and `onClickImage: (index: number) => void` — consistent with call sites in Task 11
- `PageLightbox` receives `images: string[]`, `startIndex: number`, `onClose: () => void` — consistent with portal call site in Task 11
- `openLightbox(images: string[], index?: number)` — consistent with all call sites
- `lightboxImages: string[] | null` — consistent with `PageLightbox` prop type

**No placeholders found.**
