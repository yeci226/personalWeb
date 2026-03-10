"use client";

import React from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: string;
  trend?: "up" | "down" | "neutral";
  deltaText?: string;
  color?: "cyan" | "green" | "orange" | "red" | "purple";
}

export function StatCard({
  label,
  value,
  unit,
  icon,
  trend,
  deltaText,
  color = "cyan",
}: StatCardProps) {
  const displayValue =
    typeof value === "number" ? value.toLocaleString("zh-TW") : value;

  return (
    <div className={`stat-card stat-card--${color}`}>
      {icon && <div className="stat-card__icon">{icon}</div>}
      <div className="stat-card__content">
        <div className="stat-card__label">{label}</div>
        <div className="stat-card__value-row">
          <div className="stat-card__value">
            {displayValue}
            {unit && <span className="stat-card__unit">{unit}</span>}
          </div>
          {deltaText && <div className="stat-card__delta">{deltaText}</div>}
        </div>
        {trend && (
          <div className={`stat-card__trend stat-card__trend--${trend}`}>
            {trend === "up" && "↑"}
            {trend === "down" && "↓"}
            {trend === "neutral" && "→"}
          </div>
        )}
      </div>
    </div>
  );
}

interface BotStatRowProps {
  botName: string;
  commands24h: number;
  errors24h: number;
  usersTotal: number;
  serversTotal: number;
  users24h: number;
  servers24h: number;
  avgMs: number;
  uptime: number;
  errorRate: number;
}

export function BotStatRow({
  botName,
  commands24h,
  errors24h,
  usersTotal,
  serversTotal,
  users24h,
  servers24h,
  avgMs,
  uptime,
  errorRate,
}: BotStatRowProps) {
  return (
    <tr className="bot-stat-row">
      <td className="bot-stat-row__name">
        <span className="bot-stat-row__icon">🤖</span>
        {botName}
      </td>
      <td className="bot-stat-row__cell">{commands24h}</td>
      <td className="bot-stat-row__cell">{usersTotal} <span className="bot-stat-row__delta">(+{users24h})</span></td>
      <td className="bot-stat-row__cell">{serversTotal} <span className="bot-stat-row__delta">(+{servers24h})</span></td>
      <td className="bot-stat-row__cell">{avgMs}ms</td>
      <td
        className={`bot-stat-row__cell ${
          uptime >= 99.9 ? "excellent" : uptime >= 99 ? "good" : "warning"
        }`}
      >
        {uptime}%
      </td>
      <td
        className={`bot-stat-row__cell error ${
          errorRate > 2 ? "critical" : errorRate > 1 ? "warning" : "good"
        }`}
      >
        {errorRate}%
      </td>
      <td className="bot-stat-row__cell">{errors24h}</td>
    </tr>
  );
}

interface CommandRankProps {
  rank: number;
  name: string;
  bot: string;
  count: number;
  avgTimeMs: number;
}

export function CommandRank({
  rank,
  name,
  bot,
  count,
  avgTimeMs,
}: CommandRankProps) {
  const getRankMedal = (r: number) => {
    if (r === 1) return "🥇";
    if (r === 2) return "🥈";
    if (r === 3) return "🥉";
    return `#${r}`;
  };

  return (
    <div className="command-rank">
      <div className="command-rank__rank">{getRankMedal(rank)}</div>
      <div className="command-rank__info">
        <div className="command-rank__name">{name}</div>
        <div className="command-rank__bot">{bot}</div>
      </div>
      <div className="command-rank__stats">
        <span className="command-rank__count">{count}x</span>
        <span className="command-rank__time">{avgTimeMs}ms</span>
      </div>
    </div>
  );
}

interface HealthIndicatorProps {
  label: string;
  value: number;
  max?: number;
  showPercentage?: boolean;
}

export function HealthIndicator({
  label,
  value,
  max = 100,
  showPercentage = true,
}: HealthIndicatorProps) {
  const percentage = (value / max) * 100;
  const getColor = (pct: number) => {
    if (pct >= 95) return "excellent";
    if (pct >= 90) return "good";
    if (pct >= 80) return "warning";
    return "critical";
  };

  const color = getColor(percentage);

  return (
    <div className="health-indicator">
      <div className="health-indicator__header">
        <span className="health-indicator__label">{label}</span>
        {showPercentage && (
          <span className={`health-indicator__value health-indicator__value--${color}`}>
            {percentage.toFixed(1)}%
          </span>
        )}
      </div>
      <div className="health-indicator__bar">
        <div
          className={`health-indicator__fill health-indicator__fill--${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

interface SparklineProps {
  data: number[];
  label: string;
  color?: string;
  height?: number;
}

export function Sparkline({
  data,
  label,
  color = "#7dd3fc",
  height = 40,
}: SparklineProps) {
  if (data.length === 0) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((value - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="sparkline">
      <svg
        viewBox={`0 0 100 ${height}`}
        width="100%"
        height={height}
        preserveAspectRatio="none"
        className="sparkline__svg"
      >
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="sparkline__label">{label}</div>
    </div>
  );
}
