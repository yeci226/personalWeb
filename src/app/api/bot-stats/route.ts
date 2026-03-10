/**
 * 機器人統計聚合 API
 * 提供實時和歷史統計數據
 * 從機器人推送的實時數據和默認值綜合
 */

import { NextResponse } from "next/server";

const STATS_INGEST_TOKEN = process.env.STATS_INGEST_TOKEN;
const LIVE_THRESHOLD_MS = 5 * 60 * 1000;
const KV_REST_API_URL = process.env.KV_REST_API_URL;
const KV_REST_API_TOKEN = process.env.KV_REST_API_TOKEN;
const KV_KEY = "bot_stats_storage_v1";

// 在內存中存儲各機器人的最新統計
// 機器人會定期推送更新
const STATS_STORAGE: Record<string, any> = {
  "zzz": {
    botId: "zzz",
    botName: "ZZZ",
    repoUrl: "https://github.com/yeci226/ZZZ",
    totalCommands24h: 1250,
    totalErrors24h: 12,
    uniqueUsers24h: 180,
    uniqueServers24h: 45,
    totalUsers: 3388,
    totalServers: 1095,
    avgExecutionMs: 450,
    uptime: 99.8,
    lastUpdated: Date.now(),
    topCommands: [
      { name: "/account", count: 320, avgTimeMs: 350 },
      { name: "/daily", count: 280, avgTimeMs: 200 },
      { name: "/codes", count: 210, avgTimeMs: 150 },
      { name: "/profile", count: 180, avgTimeMs: 480 },
      { name: "/signal", count: 160, avgTimeMs: 520 },
    ],
  },
  "endfield": {
    botId: "endfield",
    botName: "Endfield",
    repoUrl: "https://github.com/yeci226/endfield-discord-bot",
    totalCommands24h: 890,
    totalErrors24h: 8,
    uniqueUsers24h: 120,
    uniqueServers24h: 32,
    totalUsers: 2150,
    totalServers: 640,
    avgExecutionMs: 380,
    uptime: 99.9,
    lastUpdated: Date.now(),
    topCommands: [
      { name: "/team", count: 250, avgTimeMs: 400 },
      { name: "/quest", count: 180, avgTimeMs: 300 },
      { name: "/news", count: 150, avgTimeMs: 200 },
      { name: "/character", count: 140, avgTimeMs: 520 },
      { name: "/help", count: 170, avgTimeMs: 100 },
    ],
  },
  "hsr-discord-bot": {
    botId: "hsr-discord-bot",
    botName: "HSR Bot",
    repoUrl: "https://github.com/Yec1/hsr-discord-bot",
    totalCommands24h: 1450,
    totalErrors24h: 15,
    uniqueUsers24h: 220,
    uniqueServers24h: 55,
    totalUsers: 4200,
    totalServers: 1300,
    avgExecutionMs: 520,
    uptime: 99.6,
    lastUpdated: Date.now(),
    topCommands: [
      { name: "/character", count: 380, avgTimeMs: 600 },
      { name: "/build", count: 320, avgTimeMs: 700 },
      { name: "/search", count: 280, avgTimeMs: 450 },
      { name: "/stats", count: 260, avgTimeMs: 380 },
      { name: "/team", count: 210, avgTimeMs: 550 },
    ],
  },
  "nikke": {
    botId: "nikke",
    botName: "NIKKE",
    repoUrl: "https://github.com/yeci226/nikke",
    totalCommands24h: 650,
    totalErrors24h: 6,
    uniqueUsers24h: 95,
    uniqueServers24h: 28,
    totalUsers: 1700,
    totalServers: 520,
    avgExecutionMs: 320,
    uptime: 99.95,
    lastUpdated: Date.now(),
    topCommands: [
      { name: "/characters", count: 200, avgTimeMs: 350 },
      { name: "/gacha", count: 150, avgTimeMs: 280 },
      { name: "/equips", count: 120, avgTimeMs: 320 },
      { name: "/stage", count: 100, avgTimeMs: 300 },
      { name: "/info", count: 80, avgTimeMs: 200 },
    ],
  },
  "ba-discord-bot": {
    botId: "ba-discord-bot",
    botName: "BA Bot",
    repoUrl: "https://github.com/yeci226/BA-discord-bot",
    totalCommands24h: 580,
    totalErrors24h: 5,
    uniqueUsers24h: 85,
    uniqueServers24h: 22,
    totalUsers: 1460,
    totalServers: 430,
    avgExecutionMs: 290,
    uptime: 99.92,
    lastUpdated: Date.now(),
    topCommands: [
      { name: "/character", count: 180, avgTimeMs: 300 },
      { name: "/student", count: 140, avgTimeMs: 320 },
      { name: "/guide", count: 120, avgTimeMs: 250 },
      { name: "/tier", count: 90, avgTimeMs: 280 },
      { name: "/equip", count: 50, avgTimeMs: 290 },
    ],
  },
  "ff14": {
    botId: "ff14",
    botName: "FFXIV",
    repoUrl: "https://github.com/yeci226/ff14",
    totalCommands24h: 420,
    totalErrors24h: 4,
    uniqueUsers24h: 65,
    uniqueServers24h: 18,
    totalUsers: 980,
    totalServers: 300,
    avgExecutionMs: 410,
    uptime: 99.88,
    lastUpdated: Date.now(),
    topCommands: [
      { name: "/monster", count: 140, avgTimeMs: 450 },
      { name: "/quest", count: 110, avgTimeMs: 380 },
      { name: "/item", count: 90, avgTimeMs: 420 },
      { name: "/status", count: 50, avgTimeMs: 350 },
      { name: "/duty", count: 30, avgTimeMs: 480 },
    ],
  },
  "haneko": {
    botId: "haneko",
    botName: "Haneko",
    repoUrl: "https://github.com/Yec1/Haneko",
    totalCommands24h: 520,
    totalErrors24h: 6,
    uniqueUsers24h: 78,
    uniqueServers24h: 25,
    totalUsers: 1200,
    totalServers: 380,
    avgExecutionMs: 360,
    uptime: 99.85,
    lastUpdated: Date.now(),
    topCommands: [
      { name: "/roll", count: 200, avgTimeMs: 250 },
      { name: "/info", count: 150, avgTimeMs: 320 },
      { name: "/search", count: 100, avgTimeMs: 400 },
      { name: "/help", count: 40, avgTimeMs: 150 },
      { name: "/stats", count: 30, avgTimeMs: 480 },
    ],
  },
};

async function loadStorage(): Promise<Record<string, any>> {
  if (!KV_REST_API_URL || !KV_REST_API_TOKEN) {
    return STATS_STORAGE;
  }

  try {
    const response = await fetch(
      `${KV_REST_API_URL}/get/${encodeURIComponent(KV_KEY)}`,
      {
        headers: {
          Authorization: `Bearer ${KV_REST_API_TOKEN}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return STATS_STORAGE;
    }

    const payload = await response.json();
    const raw = payload?.result;
    if (!raw || typeof raw !== "string") {
      return STATS_STORAGE;
    }

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return STATS_STORAGE;
    }

    return { ...STATS_STORAGE, ...parsed };
  } catch {
    return STATS_STORAGE;
  }
}

async function saveStorage(storage: Record<string, any>): Promise<void> {
  Object.assign(STATS_STORAGE, storage);

  if (!KV_REST_API_URL || !KV_REST_API_TOKEN) {
    return;
  }

  try {
    await fetch(
      `${KV_REST_API_URL}/set/${encodeURIComponent(KV_KEY)}/${encodeURIComponent(
        JSON.stringify(storage)
      )}`,
      {
        headers: {
          Authorization: `Bearer ${KV_REST_API_TOKEN}`,
        },
        cache: "no-store",
      }
    );
  } catch {
    // 忽略 KV 寫入失敗，保留本次請求內存資料
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const botId = searchParams.get("bot");
  const timeRange = searchParams.get("range") || "24h"; // 24h, 7d, 30d

  try {
    const storage = await loadStorage();

    // 按單個機器人返回
    if (botId) {
      const stats = storage[botId.toLowerCase()];
      if (!stats) {
        return NextResponse.json(
          { error: "Bot not found" },
          { status: 404 }
        );
      }

      const isLive = Date.now() - (stats.lastUpdated || 0) <= LIVE_THRESHOLD_MS;
      return NextResponse.json(
        { bot: { ...stats, isLive }, timeRange },
        {
          headers: { "Cache-Control": "max-age=60" },
        }
      );
    }

    // 返回所有機器人的彙總統計
    const allBots = Object.values(storage);
    const aggregated = {
      timestamp: Date.now(),
      timeRange,
      totalBots: allBots.length,
      summary: {
        totalCommands24h: allBots.reduce((sum, b) => sum + b.totalCommands24h, 0),
        totalErrors24h: allBots.reduce((sum, b) => sum + b.totalErrors24h, 0),
        totalUsers: allBots.reduce(
          (sum, b) => sum + (b.totalUsers ?? b.uniqueUsers24h ?? 0),
          0
        ),
        totalServers: allBots.reduce(
          (sum, b) => sum + (b.totalServers ?? b.uniqueServers24h ?? 0),
          0
        ),
        newUsers24h: allBots.reduce((sum, b) => sum + (b.uniqueUsers24h ?? 0), 0),
        newServers24h: allBots.reduce((sum, b) => sum + (b.uniqueServers24h ?? 0), 0),
        avgUptime: Number(
          (allBots.reduce((sum, b) => sum + b.uptime, 0) / allBots.length).toFixed(2)
        ),
        avgExecutionMs: Number(
          (allBots.reduce((sum, b) => sum + b.avgExecutionMs, 0) / allBots.length).toFixed(0)
        ),
        errorRate: Number(
          (
            (allBots.reduce((sum, b) => sum + b.totalErrors24h, 0) /
              allBots.reduce((sum, b) => sum + b.totalCommands24h, 0)) *
            100
          ).toFixed(2)
        ),
      },
      bots: allBots.map((bot) => ({
        botId: bot.botId,
        botName: bot.botName,
        repoUrl: bot.repoUrl,
        commands24h: bot.totalCommands24h,
        errors24h: bot.totalErrors24h,
        usersTotal: bot.totalUsers ?? bot.uniqueUsers24h,
        serversTotal: bot.totalServers ?? bot.uniqueServers24h,
        users24h: bot.uniqueUsers24h,
        servers24h: bot.uniqueServers24h,
        avgMs: bot.avgExecutionMs,
        uptime: bot.uptime,
        isLive: Date.now() - (bot.lastUpdated || 0) <= LIVE_THRESHOLD_MS,
        lastUpdated: bot.lastUpdated,
        errorRate: Number(
          ((bot.totalErrors24h / bot.totalCommands24h) * 100).toFixed(2)
        ),
        topCommand: bot.topCommands[0],
      })),
      topCommands: allBots
        .flatMap((bot) =>
          bot.topCommands.map((cmd: any) => ({
            ...cmd,
            bot: bot.botName,
            botId: bot.botId,
          }))
        )
        .sort((a, b) => b.count - a.count)
        .slice(0, 15),
    };

    return NextResponse.json(aggregated, {
      headers: { "Cache-Control": "max-age=60" },
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch stats: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}

// 用於更新統計數據的 POST 端點（來自各個機器人）
export async function POST(request: Request) {
  try {
    if (STATS_INGEST_TOKEN) {
      const authHeader = request.headers.get("authorization");
      const expected = `Bearer ${STATS_INGEST_TOKEN}`;
      if (authHeader !== expected) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const data = await request.json();
    const { botId, botName, timestamp, stats } = data;

    if (!botId || !stats) {
      return NextResponse.json(
        { error: "Missing botId or stats" },
        { status: 400 }
      );
    }

    const botIdLower = botId.toLowerCase();
    const storage = await loadStorage();
    const existingData = storage[botIdLower] || {};

    // 計算平均執行時間
    let avgMs = existingData.avgExecutionMs || 0;
    if (stats.topCommands && Array.isArray(stats.topCommands) && stats.topCommands.length > 0) {
      const totalMs = stats.topCommands.reduce(
        (sum: number, cmd: any) => sum + (cmd.avgTimeMs || 0) * (cmd.count || 1),
        0
      );
      const totalCount = stats.topCommands.reduce(
        (sum: number, cmd: any) => sum + (cmd.count || 0),
        0
      );
      avgMs = totalCount > 0 ? Math.round(totalMs / totalCount) : avgMs;
    }

    // 更新存儲（合併新數據與現有數據）
    storage[botIdLower] = {
      botId: botIdLower,
      botName: botName || existingData.botName,
      repoUrl: existingData.repoUrl, // 保留現有的 repo URL
      totalCommands24h: stats.totalCommands24h || existingData.totalCommands24h || 0,
      totalErrors24h: stats.totalErrors24h || existingData.totalErrors24h || 0,
      uniqueUsers24h: stats.uniqueUsers24h || existingData.uniqueUsers24h || 0,
      uniqueServers24h: stats.uniqueServers24h || existingData.uniqueServers24h || 0,
      totalUsers: stats.totalUsers || existingData.totalUsers || stats.uniqueUsers24h || 0,
      totalServers: stats.totalServers || existingData.totalServers || stats.uniqueServers24h || 0,
      avgExecutionMs: avgMs,
      uptime: stats.uptime || existingData.uptime || 99.9,
      topCommands: stats.topCommands || existingData.topCommands || [],
      byCommand: stats.byCommand || existingData.byCommand || [],
      sourceTimestamp: timestamp || null,
      lastUpdated: Date.now(),
    };

    await saveStorage(storage);

    console.log(`[Stats API] Updated stats for ${botName || botIdLower}`);

    return NextResponse.json(
      { success: true, message: `Stats updated for ${botName || botIdLower}` },
      { status: 200 }
    );
  } catch (error) {
    console.error(`[Stats API] Error: ${(error as Error).message}`);
    return NextResponse.json(
      { error: `Failed to update stats: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}
