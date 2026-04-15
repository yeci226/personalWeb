# Bot Command Showcase in Discord Demo — Design Spec

**Date:** 2026-04-15  
**Status:** Approved (updated)

## Goal

Add `demo` data for every bot in `bots.ts` so the homepage Discord chat simulation showcases each bot's commands. Remove the `/bots` standalone page once migration is complete.

## Data Layer — `src/data/bots.ts`

### Type change

`BotDemoRound.botImageUrl` changes from `string` to `string | string[]`:

```ts
export interface BotDemoRound {
  userCommand: string;
  botEmbed?: BotDemoEmbed;
  botImageUrl?: string | string[];  // single or multi-image carousel
  botText?: string;
}
```

### SHOWCASE_BOTS filter change

`page.tsx` currently filters to only bots that have `demo`:

```ts
const SHOWCASE_BOTS = BOTS_DATA.filter((b) => b.demo).slice(0, 3);
```

Change to include all bots (no filter, no slice):

```ts
const SHOWCASE_BOTS = BOTS_DATA;
```

### Rounds per bot

All 9 bots need `demo` data. Bots that already have `demo` get new rounds appended; the rest get a new `demo` object created.

#### Bots with image rounds

| Bot | userCommand → image(s) |
|---|---|
| HSR 星鐵小助手 *(existing demo, append)* | `/daily` → daily.png · `/note` → note.png · `/memory` → [memory.png, story.png, boss.png] · `/profile` → [profile.png, profile-char.png] · `/leaderboard` → leaderboard.png · `/warp log` → warp-log.png · `/warp simulator` → warp-sim.png · `/atlas character` → atlas.png |
| ZZZ 以色列 *(existing demo, append)* | `/note` → note.png · `/profile` → [profile.png, profile-char.png] · `/shiyudefense` → shiyudefense.png · `/deadlyassault` → deadlyassault.png · `/signal-log` → signal-log.png |
| 終末地小助手 *(existing demo, append)* | `/daily claim` → daily-check.png · `/profile` → [profile.webp, profile-char.webp] · `/gacha` → gacha.png · `/news bind` → notify.png |
| BA Arona *(new demo)* | `/student` → student.png · `/builder` → teambuild.png · `/gacha pull` → pull.png · `/gacha` → gacha.png · `/notification setup` → notify.png |
| FFXIV 塔塔露 *(new demo)* | `/news bind` → notify.png |
| NIKKE Shifty *(new demo)* | `/character` → [profile-char.png, profile-all.png] · `/team build` → teambuild.png · `/profile` → profile.png · `/notification setup` → notify.png |

#### Bots without images — embed-based rounds

For bots with no screenshots, create `botEmbed` rounds that describe capabilities:

| Bot | Rounds |
|---|---|
| animeguess *(new demo)* | `/stats` → embed (猜對次數, 勝率, 最近猜對角色) · `/leaderboard` → embed (排行榜) |
| Haneko *(new demo)* | `/nhentai search` → botText 說明 · `/list` → embed (收藏列表示意) |
| Outo *(new demo)* | `/quiz` → embed (題目生成說明) · `/add` → embed (新增詞彙示意) |

Each new bot gets a `channelName` matching pattern `<bot-id>-bot-demo`.

## UI Layer — `src/app/page.tsx`

### Image carousel in `DiscordChat`

When `botImageUrl` is `string[]` with length > 1, render a carousel:

- Left `‹` / Right `›` arrow buttons overlaid on the image
- Auto-advances every **2.5 seconds**, loops infinitely, resets timer on manual click
- Dot indicators below the image (reuse `.lightbox-dot` style from `globals.css`)
- Clicking the image still opens the lightbox (all images in the array, same arrow navigation)
- Single string `botImageUrl` remains unchanged (plain image)

### Scene 2 button change

Remove the "指令列表" `Link` that points to `/bots`. Keep the "邀請至伺服器" button; update its `href` to each bot's actual invite URL (first link in its README category with label `"邀請機器人"`). Add an `inviteUrl` field to `BotData` to make this easy to access:

```ts
export interface BotData {
  // ...existing fields...
  inviteUrl?: string;
}
```

## Deletions

| Path | Reason |
|---|---|
| `src/app/bots/` (entire directory) | Page no longer needed |
| `src/components/BotsShowcase.tsx` | Component no longer used |
| `src/components/bots.css` | Styles no longer needed (lightbox already in globals.css) |

## Implementation order

1. Update types (`BotDemoRound.botImageUrl`, add `BotData.inviteUrl`)
2. Add `inviteUrl` to all bot entries + add `demo` data for the 6 bots that lack it + append image rounds to 3 existing demos
3. Update `SHOWCASE_BOTS` to include all bots
4. Add carousel UI + auto-advance logic to `DiscordChat`
5. Update Scene 2 invite button to use `bot.inviteUrl`
6. Delete `/bots` page, `BotsShowcase.tsx`, `bots.css`
