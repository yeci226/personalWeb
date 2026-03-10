"use client";

import React, { useEffect, useState } from "react";
import {
  StatCard,
  BotStatRow,
  CommandRank,
  HealthIndicator,
} from "@/components/StatsComponents";
import "./stats.css";

interface AggregatedStats {
  timestamp: number;
  timeRange: string;
  totalBots: number;
  summary: {
    totalCommands24h: number;
    totalErrors24h: number;
    totalUsers: number;
    totalServers: number;
    newUsers24h: number;
    newServers24h: number;
    avgUptime: number;
    avgExecutionMs: number;
    errorRate: number;
  };
  bots: Array<{
    botId: string;
    botName: string;
    repoUrl: string;
    commands24h: number;
    errors24h: number;
    usersTotal: number;
    serversTotal: number;
    users24h: number;
    servers24h: number;
    avgMs: number;
    uptime: number;
    errorRate: number;
    topCommand: { name: string; count: number; avgTimeMs: number };
  }>;
  topCommands: Array<{
    name: string;
    count: number;
    avgTimeMs: number;
    bot: string;
    botId: string;
  }>;
}

export default function StatsPage() {
  const [stats, setStats] = useState<AggregatedStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/bot-stats");
      if (!response.ok) throw new Error("Failed to fetch stats");
      const data = await response.json();
      setStats(data);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    if (autoRefresh) {
      const interval = setInterval(fetchStats, 30_000); // 每 30 秒刷新
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  if (loading) {
    return (
      <div className="stats-page">
        <div className="stats-loading">加載統計數據中...</div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="stats-page">
        <div className="stats-error">⚠️ {error || "無法加載統計數據"}</div>
      </div>
    );
  }

  const lastUpdate = new Date(stats.timestamp);

  return (
    <div className="stats-page">
      {/* 標題和控制 */}
      <div className="stats-header">
        <div className="stats-header__content">
          <h1 className="stats-header__title">📊 機器人統計儀表板</h1>
          <p className="stats-header__subtitle">
            實時監控所有 {stats.totalBots} 個機器人的性能和使用情況
          </p>
        </div>
        <div className="stats-header__controls">
          <button
            className="stats-button"
            onClick={fetchStats}
            title="手動刷新"
          >
            🔄
          </button>
          <label className="stats-toggle">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            <span>自動刷新</span>
          </label>
          <span className="stats-timestamp">
            更新於 {lastUpdate.toLocaleTimeString("zh-TW")}
          </span>
        </div>
      </div>

      {/* 概述卡片 */}
      <section className="stats-section">
        <h2 className="stats-section__title">📈 概述</h2>
        <div className="stats-grid stats-grid--4col">
          <StatCard
            label="24 小時命令執行"
            value={stats.summary.totalCommands24h}
            icon="⚙️"
            color="cyan"
          />
          <StatCard
            label="不重複使用者 (總)"
            value={stats.summary.totalUsers}
            deltaText={`+${stats.summary.newUsers24h.toLocaleString("zh-TW")}`}
            icon="👥"
            color="purple"
          />
          <StatCard
            label="不重複伺服器 (總)"
            value={stats.summary.totalServers}
            deltaText={`+${stats.summary.newServers24h.toLocaleString("zh-TW")}`}
            icon="🖥️"
            color="green"
          />
          <StatCard
            label="平均執行時間"
            value={stats.summary.avgExecutionMs}
            unit="ms"
            icon="⏱️"
            color="orange"
          />
        </div>
        <div className="stats-grid stats-grid--2col">
          <StatCard
            label="錯誤率"
            value={stats.summary.errorRate}
            unit="%"
            icon="⚠️"
            color={stats.summary.errorRate > 2 ? "red" : "green"}
          />
          <StatCard
            label="平均可用性"
            value={stats.summary.avgUptime}
            unit="%"
            icon="✅"
            color={stats.summary.avgUptime >= 99.5 ? "green" : "orange"}
          />
        </div>
      </section>

      {/* 機器人詳細統計 */}
      <section className="stats-section">
        <h2 className="stats-section__title">🤖 機器人詳情</h2>
        <div className="stats-table-container">
          <table className="stats-table">
            <thead className="stats-table__head">
              <tr>
                <th>機器人</th>
                <th>24h 命令</th>
                <th>獨立用戶</th>
                <th>服務器</th>
                <th>平均 ms</th>
                <th>可用性</th>
                <th>錯誤率</th>
                <th>錯誤數</th>
              </tr>
            </thead>
            <tbody className="stats-table__body">
              {stats.bots.map((bot) => (
                <BotStatRow
                  key={bot.botId}
                  botName={bot.botName}
                  commands24h={bot.commands24h}
                  errors24h={bot.errors24h}
                  usersTotal={bot.usersTotal}
                  serversTotal={bot.serversTotal}
                  users24h={bot.users24h}
                  servers24h={bot.servers24h}
                  avgMs={bot.avgMs}
                  uptime={bot.uptime}
                  errorRate={bot.errorRate}
                />
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Top Commands */}
      <section className="stats-section">
        <h2 className="stats-section__title">🏆 最受歡迎的命令</h2>
        <div className="stats-grid stats-grid--3col">
          {stats.topCommands.slice(0, 15).map((cmd, index) => (
            <CommandRank
              key={`${cmd.botId}-${cmd.name}`}
              rank={index + 1}
              name={cmd.name}
              bot={cmd.bot}
              count={cmd.count}
              avgTimeMs={cmd.avgTimeMs}
            />
          ))}
        </div>
      </section>

      {/* 健康指標 */}
      <section className="stats-section">
        <h2 className="stats-section__title">💚 系統健康</h2>
        <div className="stats-health">
          {stats.bots.slice(0, 4).map((bot) => (
            <div key={bot.botId} className="stats-health__item">
              <h3 className="stats-health__name">{bot.botName}</h3>
              <HealthIndicator
                label="可用性"
                value={bot.uptime}
                max={100}
                showPercentage={true}
              />
              <div className="stats-health__detail">
                <span>執行時間: {bot.avgMs}ms</span>
                <span>錯誤: {bot.errors24h}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 機器人快速鏈接 */}
      <section className="stats-section">
        <h2 className="stats-section__title">🔗 快速鏈接</h2>
        <div className="stats-links">
          {stats.bots.map((bot) => (
            <a
              key={bot.botId}
              href={bot.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="stats-link"
              title={`Visit ${bot.botName} repo`}
            >
              {bot.botName}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
