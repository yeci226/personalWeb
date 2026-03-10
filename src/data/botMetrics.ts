export interface BotMetricSnapshot {
  botId: string;
  commandUses24h: number;
  commandUsesPrev24h: number;
  uptimePercent7d: number;
  totalUsers: number;
  uniqueUsers24h: number;
  totalGuilds: number;
  uniqueGuilds24h: number;
  updatedAt: string;
}

export interface BotMetricsOverview {
  totalCommands24h: number;
  totalUniqueUsers24h: number;
  totalUniqueGuilds24h: number;
  avgUptimePercent7d: number;
  updatedAt: string;
}

const nowIso = new Date().toISOString();

// TODO: Replace this static table with your telemetry source (DB/Redis/ClickHouse).
export const BOT_METRICS: BotMetricSnapshot[] = [
  {
    botId: "hsr-discord-bot",
    commandUses24h: 18420,
    commandUsesPrev24h: 17110,
    uptimePercent7d: 99.93,
    totalUsers: 28540,
    uniqueUsers24h: 4211,
    totalGuilds: 4520,
    uniqueGuilds24h: 1320,
    updatedAt: nowIso,
  },
  {
    botId: "zzz",
    commandUses24h: 13960,
    commandUsesPrev24h: 12140,
    uptimePercent7d: 99.87,
    totalUsers: 22015,
    uniqueUsers24h: 3388,
    totalGuilds: 3280,
    uniqueGuilds24h: 1095,
    updatedAt: nowIso,
  },
  {
    botId: "endfield",
    commandUses24h: 9240,
    commandUsesPrev24h: 8890,
    uptimePercent7d: 99.91,
    totalUsers: 12840,
    uniqueUsers24h: 2148,
    totalGuilds: 1980,
    uniqueGuilds24h: 801,
    updatedAt: nowIso,
  },
  {
    botId: "nikke",
    commandUses24h: 15730,
    commandUsesPrev24h: 14950,
    uptimePercent7d: 99.89,
    totalUsers: 24880,
    uniqueUsers24h: 3712,
    totalGuilds: 3540,
    uniqueGuilds24h: 1187,
    updatedAt: nowIso,
  },
  {
    botId: "ba-discord-bot",
    commandUses24h: 11480,
    commandUsesPrev24h: 10320,
    uptimePercent7d: 99.84,
    totalUsers: 18950,
    uniqueUsers24h: 2861,
    totalGuilds: 2840,
    uniqueGuilds24h: 978,
    updatedAt: nowIso,
  },
  {
    botId: "ff14",
    commandUses24h: 4060,
    commandUsesPrev24h: 3820,
    uptimePercent7d: 99.77,
    totalUsers: 5240,
    uniqueUsers24h: 1029,
    totalGuilds: 1360,
    uniqueGuilds24h: 402,
    updatedAt: nowIso,
  },
  {
    botId: "outo",
    commandUses24h: 2890,
    commandUsesPrev24h: 2730,
    uptimePercent7d: 99.68,
    totalUsers: 3680,
    uniqueUsers24h: 715,
    totalGuilds: 920,
    uniqueGuilds24h: 301,
    updatedAt: nowIso,
  },
  {
    botId: "haneko",
    commandUses24h: 3650,
    commandUsesPrev24h: 3420,
    uptimePercent7d: 99.74,
    totalUsers: 4920,
    uniqueUsers24h: 911,
    totalGuilds: 1180,
    uniqueGuilds24h: 355,
    updatedAt: nowIso,
  },
  {
    botId: "animeguess",
    commandUses24h: 2170,
    commandUsesPrev24h: 1960,
    uptimePercent7d: 99.59,
    totalUsers: 3180,
    uniqueUsers24h: 639,
    totalGuilds: 1080,
    uniqueGuilds24h: 284,
    updatedAt: nowIso,
  },
];

export function getBotMetricsOverview(): BotMetricsOverview {
  const totals = BOT_METRICS.reduce(
    (acc, item) => {
      acc.totalCommands24h += item.commandUses24h;
      acc.avgUptimePercent7d += item.uptimePercent7d;
      return acc;
    },
    {
      totalCommands24h: 0,
      avgUptimePercent7d: 0,
    },
  );

  const avgUptimePercent7d = Number(
    (totals.avgUptimePercent7d / BOT_METRICS.length).toFixed(2),
  );

  return {
    totalCommands24h: totals.totalCommands24h,
    // Cross-bot de-duplicated figures (replace with real aggregation query).
    totalUniqueUsers24h: 11892,
    totalUniqueGuilds24h: 3561,
    avgUptimePercent7d,
    updatedAt: nowIso,
  };
}
