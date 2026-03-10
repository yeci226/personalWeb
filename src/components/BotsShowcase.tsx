"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  ChevronRight,
  Layout,
  Command as CommandIcon,
  MessageSquare,
  ArrowLeft,
  Copy,
  Check,
} from "lucide-react";
import { BOTS, BotData, CommandCategory, Command } from "@/data/bots";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import "./bots.css";

interface BotMetricSnapshot {
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

interface BotMetricsOverview {
  totalCommands24h: number;
  totalUniqueUsers24h: number;
  totalUniqueGuilds24h: number;
  avgUptimePercent7d: number;
  updatedAt: string;
}

function normalizeBotId(id: string): string {
  return id.trim().toLowerCase();
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("zh-TW").format(value);
}

function formatDeltaPercent(current: number, previous: number): string {
  if (!previous) return "+0.0%";
  const delta = ((current - previous) / previous) * 100;
  const sign = delta >= 0 ? "+" : "";
  return `${sign}${delta.toFixed(1)}%`;
}

export function BotsShowcase() {
  const [selectedBot, setSelectedBot] = useState<BotData>(BOTS[0]);
  const [selectedCategory, setSelectedCategory] = useState<CommandCategory>(
    BOTS[0].categories[0],
  );
  const [overview, setOverview] = useState<BotMetricsOverview | null>(null);
  const [metricsByBot, setMetricsByBot] = useState<
    Record<string, BotMetricSnapshot>
  >({});
  const [syncedByBot, setSyncedByBot] = useState<
    Record<string, CommandCategory>
  >({});

  const handleBotChange = (bot: BotData) => {
    setSelectedBot(bot);
    setSelectedCategory(bot.categories[0]);
  };

  React.useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch("/api/bot-metrics", {
          cache: "no-store",
        });
        if (!response.ok) return;
        const data = await response.json();
        setOverview(data.overview || null);
        setMetricsByBot(data.byBot || {});
      } catch (error) {
        console.error("Failed to load bot metrics:", error);
      }
    };

    fetchMetrics();
  }, []);

  React.useEffect(() => {
    const fetchSyncedCommands = async () => {
      try {
        const response = await fetch("/api/showcase-commands", {
          cache: "no-store",
        });
        if (!response.ok) return;
        const data = await response.json();
        const byBot = data.byBot || {};

        const mapped: Record<string, CommandCategory> = {};
        for (const [botId, commands] of Object.entries(byBot)) {
          const list = Array.isArray(commands)
            ? commands.map((item: any) => ({
                name: item.name,
                usage: item.name,
                description: `來源檔案: \`${item.sourceFile}\`\n\n最後更新: ${new Date(item.updatedAt).toLocaleString("zh-TW")}`,
              }))
            : [];

          if (list.length > 0) {
            mapped[botId] = {
              name: "最新同步指令",
              commands: list,
            };
          }
        }

        setSyncedByBot(mapped);
      } catch (error) {
        console.error("Failed to sync showcase commands:", error);
      }
    };

    fetchSyncedCommands();
  }, []);

  const selectedStats = metricsByBot[normalizeBotId(selectedBot.id)] || null;

  const displayedCategories = React.useMemo(() => {
    const normalizedId = normalizeBotId(selectedBot.id);
    const synced = syncedByBot[normalizedId];
    return synced ? [...selectedBot.categories, synced] : selectedBot.categories;
  }, [selectedBot, syncedByBot]);

  React.useEffect(() => {
    if (!displayedCategories.some((cat) => cat.name === selectedCategory.name)) {
      setSelectedCategory(displayedCategories[0]);
    }
  }, [displayedCategories, selectedCategory.name]);

  return (
    <div className="bots-page-container">
      {/* Top Left Navigation */}
      <nav className="top-nav">
        <Link href="/" className="back-link">
          <ArrowLeft size={16} /> 返回首頁
        </Link>
      </nav>

      <div className="showcase-container">
        <div className="showcase-grid">
          {/* Bot Selector (Sidebar) */}
          <div className="bot-sidebar">
            <h2 className="sidebar-label">選擇機器人</h2>
            {overview && (
              <section className="overview-panel">
                <h3 className="overview-title">整體營運統計 (24H/7D)</h3>
                <div className="overview-grid">
                  <div className="overview-item">
                    <span className="metric-label">總指令量(24H)</span>
                    <span className="metric-value">
                      {formatNumber(overview.totalCommands24h)}
                    </span>
                  </div>
                  <div className="overview-item">
                    <span className="metric-label">不重複使用者</span>
                    <span className="metric-value">
                      {formatNumber(overview.totalUniqueUsers24h)}
                    </span>
                  </div>
                  <div className="overview-item">
                    <span className="metric-label">不重複伺服器</span>
                    <span className="metric-value">
                      {formatNumber(overview.totalUniqueGuilds24h)}
                    </span>
                  </div>
                  <div className="overview-item">
                    <span className="metric-label">平均上線率(7D)</span>
                    <span className="metric-value">
                      {overview.avgUptimePercent7d.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </section>
            )}
            <div className="bot-list">
              {BOTS.map((bot) => (
                <motion.button
                  key={bot.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleBotChange(bot)}
                  className={`bot-item ${selectedBot.id === bot.id ? "active" : ""}`}
                >
                  <div
                    className="bot-card-banner"
                    style={
                      bot.banner
                        ? {
                            backgroundImage: `url(${bot.banner})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }
                        : {}
                    }
                  />
                  <div className="bot-card-header">
                    <img src={bot.icon} alt={bot.name} className="bot-icon" />
                  </div>
                  <div className="bot-info">
                    <span className="bot-name">{bot.name}</span>
                    <span className="bot-desc-full">{bot.description}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Console (Main Content) */}
          <div className="bot-console">
            <div className="console-header">
              {selectedStats && (
                <section className="selected-metrics-bar">
                  <div className="selected-metric-card">
                    <span className="metric-label">指令使用率</span>
                    <span className="metric-value">
                      {(selectedStats.commandUses24h / 24).toFixed(1)} / hr
                    </span>
                    <span className="metric-delta">
                      {formatDeltaPercent(
                        selectedStats.commandUses24h,
                        selectedStats.commandUsesPrev24h,
                      )} vs 昨日
                    </span>
                  </div>
                  <div className="selected-metric-card">
                    <span className="metric-label">上線率 (7D)</span>
                    <span className="metric-value">
                      {selectedStats.uptimePercent7d.toFixed(2)}%
                    </span>
                  </div>
                  <div className="selected-metric-card">
                    <span className="metric-label">不重複使用者 (總)</span>
                    <span className="metric-value">
                      {formatNumber(selectedStats.totalUsers)}
                      <span className="metric-delta">
                        +{formatNumber(selectedStats.uniqueUsers24h)}
                      </span>
                    </span>
                  </div>
                  <div className="selected-metric-card">
                    <span className="metric-label">不重複伺服器 (總)</span>
                    <span className="metric-value">
                      {formatNumber(selectedStats.totalGuilds)}
                      <span className="metric-delta">
                        +{formatNumber(selectedStats.uniqueGuilds24h)}
                      </span>
                    </span>
                  </div>
                </section>
              )}
              <div className="console-tabs">
                {displayedCategories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat)}
                    className={`console-tab ${selectedCategory.name === cat.name ? "active" : ""}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="console-body">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selectedBot.id}-${selectedCategory.name}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="command-list"
                >
                  {selectedCategory.commands.map((cmd) => (
                    <CommandItem key={cmd.name} command={cmd} />
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CommandItem({ command }: { command: Command }) {
  const [copied, setCopied] = useState(false);
  const [copiedName, setCopiedName] = useState(false);
  const [optionValues, setOptionValues] = useState<Record<string, string>>(
    () => {
      const initialValues: Record<string, string> = {};
      command.options?.forEach((opt) => {
        initialValues[opt.key] =
          opt.defaultValue ||
          (opt.type === "input" ? "" : opt.choices?.[0]?.value || "");
      });
      return initialValues;
    },
  );

  const getUsageString = (isDisplay = false) => {
    if (!command.usage) return "";
    let usage = command.usage;
    command.options?.forEach((opt) => {
      const value = optionValues[opt.key];
      if (!value && !opt.required) {
        // Remove the option and preceding space if optional and empty
        const regex = new RegExp(`\\s?${opt.key}:\\[${opt.key}\\]`, "g");
        usage = usage.replace(regex, "");
      } else {
        // For display, replace the technical key with the label
        if (isDisplay) {
          usage = usage.replace(
            `${opt.key}:[${opt.key}]`,
            `${opt.label}:${value || `[${opt.label}]`}`,
          );
        } else {
          usage = usage.replace(`[${opt.key}]`, value || `[${opt.key}]`);
        }
      }
    });
    return usage;
  };

  const currentUsage = getUsageString(false);
  const displayUsage = getUsageString(true);

  const handleCopy = async () => {
    if (!currentUsage) return;
    try {
      await navigator.clipboard.writeText(currentUsage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleCopyName = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(command.name);
      setCopiedName(true);
      setTimeout(() => setCopiedName(false), 2000);
    } catch (err) {
      console.error("Failed to copy command name:", err);
    }
  };

  const handleOptionChange = (key: string, value: string) => {
    setOptionValues((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="command-item">
      <div className="command-header">
        <div className="command-icon">
          <Terminal size={14} />
        </div>
        <div className="command-title-group">
          {command.label && (
            <span className="command-label">{command.label}</span>
          )}
          <div
            className="command-name-wrapper"
            onClick={handleCopyName}
            title="點擊複製名稱"
          >
            <code className="command-name">{command.name}</code>
            {copiedName && <Check size={12} className="name-copy-success" />}
          </div>
        </div>
      </div>
      <div className="command-description">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {command.description}
        </ReactMarkdown>
      </div>

      {/* Community Links */}
      {command.links && command.links.length > 0 && (
        <div className="command-links">
          {command.links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`command-link-btn ${link.secondary ? "secondary" : "primary"}`}
            >
              {link.label}
              <ChevronRight size={14} />
            </a>
          ))}
        </div>
      )}

      {/* Showcase Images */}
      {command.images && command.images.length > 0 && (
        <div className="command-showcase-gallery">
          {command.images.map((img, index) => (
            <div key={index} className="command-showcase-image">
              <img src={img} alt={`${command.name} showcase ${index + 1}`} />
            </div>
          ))}
        </div>
      )}

      {/* Usage Section */}
      {command.usage && (
        <div className="command-usage-section">
          <span className="usage-label">用法</span>

          {/* Options Controls inside Usage Section */}
          {command.options && command.options.length > 0 && (
            <div className="command-options-grid">
              {command.options.map((opt) => (
                <div key={opt.key} className="option-control">
                  <label className="option-label">{opt.label}</label>
                  {opt.type === "select" ? (
                    <select
                      value={optionValues[opt.key]}
                      onChange={(e) =>
                        handleOptionChange(opt.key, e.target.value)
                      }
                      className="option-select"
                    >
                      {opt.choices?.map((choice) => (
                        <option key={choice.value} value={choice.value}>
                          {choice.label}
                        </option>
                      ))}
                    </select>
                  ) : opt.type === "boolean" ? (
                    <div className="boolean-group">
                      {opt.choices?.map((choice) => (
                        <button
                          key={choice.value}
                          onClick={() =>
                            handleOptionChange(opt.key, choice.value)
                          }
                          className={`boolean-btn ${optionValues[opt.key] === choice.value ? "active" : ""}`}
                        >
                          {choice.label}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <input
                      type="text"
                      placeholder={opt.placeholder}
                      value={optionValues[opt.key]}
                      onChange={(e) =>
                        handleOptionChange(opt.key, e.target.value)
                      }
                      className="option-input"
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          <div
            className="usage-code-container clickable-copy"
            onClick={handleCopy}
            title="點擊複製用法"
          >
            <code className="usage-code">{displayUsage}</code>
            <div className="copy-indicator">
              {copied ? (
                <Check size={14} className="success-icon" />
              ) : (
                <Copy size={14} />
              )}
              <span className="indicator-text">
                {copied ? "已複製!" : "複製"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
