# Bot Command Showcase in Discord Demo — Design Spec

**Date:** 2026-04-15  
**Status:** Approved

## Goal

Move all bot command showcases from the standalone `/bots` page into the homepage's Discord chat simulation (Scene 2). Remove the `/bots` page entirely once all content is migrated.

## Data Layer — `src/data/bots.ts`

### Type change

`BotDemoRound.botImageUrl` changes from `string` to `string | string[]`:

```ts
export interface BotDemoRound {
  userCommand: string;
  botEmbed?: BotDemoEmbed;
  botImageUrl?: string | string[];  // single or carousel
  botText?: string;
}
```

### New rounds per bot

Each command that has at least one screenshot gets a new `BotDemoRound`. Multi-image commands pass an array.

| Bot | New rounds (userCommand → images) |
|---|---|
| HSR 星鐵小助手 | `/daily`, `/note`, `/memory` (3 imgs), `/profile` (2 imgs), `/leaderboard`, `/warp log`, `/warp simulator`, `/atlas character` |
| ZZZ 以色列 | `/note`, `/profile` (2 imgs), `/shiyudefense`, `/deadlyassault`, `/signal-log` |
| 終末地小助手 | `/daily claim`, `/profile` (2 imgs), `/gacha`, `/news bind` |
| BA 彩奈 | `/student`, `/builder`, `/gacha pull`, `/gacha`, `/notification` |
| FFXIV | `/news bind` |

Existing `demo.rounds` (embed-based rounds) are kept; new image rounds are appended after them.

## UI Layer — `src/app/page.tsx`

### Image carousel in `DiscordChat`

When a bot message has `botImageUrl` as an array with more than one item, render a carousel instead of a plain `<img>`:

- Left `‹` / Right `›` arrow buttons overlaid on the image
- Auto-advances every **2.5 seconds**, loops infinitely
- Dot indicators below the image (same style as lightbox dots in `globals.css`)
- Auto-advance resets when the user manually clicks an arrow
- Clicking the image still opens the lightbox (showing all images with arrow navigation)

When `botImageUrl` is a single string, behavior is unchanged (plain image, click to enlarge).

### Scene 2 button update

The "指令列表" `Link` that currently points to `/bots` is removed. The "邀請至伺服器" button is updated to use each bot's actual invite URL from `bots.ts` (first link in the README category that has label "邀請機器人").

## Deletions

| Path | Reason |
|---|---|
| `src/app/bots/` (entire dir) | Page no longer needed |
| `src/components/BotsShowcase.tsx` | Component no longer used |
| `src/components/bots.css` | Styles no longer needed |

> Note: lightbox CSS was already moved to `globals.css` in a prior change; `bots.css` only contains a comment pointing there.

## Out of scope

- Commands without images (description/embed-only commands) are not added as rounds
- No API-fetched or dynamic command data in the demo
- NIKKE bot is not included (no image commands identified in current data)
