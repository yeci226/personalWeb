"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Github,
  Star,
  Mail,
  Terminal,
  Book,
  MapPin,
  Clock,
} from "lucide-react";
import React, { useEffect, useState, useMemo, memo } from "react";
import Link from "next/link";
import { DiscordStatus, StatusDot } from "@/components/DiscordStatus";

// Types
interface Repo {
  id: number;
  name: string;
  description: string;
  stargazers_count: number;
  language: string;
  html_url: string;
  forks_count: number;
  owner: {
    login: string;
  };
}

interface GitHubUser {
  avatar_url: string;
  name: string;
  login: string;
  bio: string;
  location: string;
  blog: string;
}

// Default Repos for initial state
const DEFAULT_REPOS: Repo[] = [
  {
    id: 1,
    name: "Project-Sky",
    description: "Advanced visualization system",
    stargazers_count: 128,
    language: "TypeScript",
    html_url: "",
    forks_count: 32,
    owner: { login: "yeci226" },
  },
  {
    id: 2,
    name: "Harmony-Core",
    description: "High-performance framework",
    stargazers_count: 256,
    language: "Go",
    html_url: "",
    forks_count: 64,
    owner: { login: "Yec1" },
  },
  {
    id: 3,
    name: "Bot-Master",
    description: "Versatile Discord bot",
    stargazers_count: 512,
    language: "JavaScript",
    html_url: "",
    forks_count: 128,
    owner: { login: "yeci226" },
  },
  {
    id: 4,
    name: "UI-Kit-Pro",
    description: "Premium component library",
    stargazers_count: 1024,
    language: "TypeScript",
    html_url: "",
    forks_count: 256,
    owner: { login: "NerdyHomeReOpen" },
  },
];

// Memoized Repo Card for Background
const RepoCard = memo(({ repo }: { repo: Repo }) => (
  <div className="github-card">
    <div className="repo-title">
      <Book size={12} className="repo-icon" />
      <span className="owner">{repo.owner?.login} /</span>
      <span>{repo.name}</span>
    </div>
    <p className="repo-description">
      {repo.description || "Building something cool."}
    </p>
    <div className="card-footer">
      <div className="lang-item">
        <span
          className="lang-dot"
          style={{ backgroundColor: getLangColor(repo.language) }}
        />
        <span>{repo.language || "Other"}</span>
      </div>
      <div className="meta-item">
        <Star size={10} />
        <span>{repo.stargazers_count}</span>
      </div>
    </div>
  </div>
));
RepoCard.displayName = "RepoCard";

// Decoupled Live Clock Component to prevent Home re-renders
const LiveClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date, timeZone?: string) => {
    return date.toLocaleTimeString("zh-TW", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: timeZone,
    });
  };

  return (
    <div className="clock-details">
      <div className="time-row">
        <span className="time-label">My Time</span>
        <span className="time-value">{formatTime(time, "Asia/Taipei")}</span>
      </div>
      <div className="time-row viewer-time">
        <span className="time-label">Yours</span>
        <span className="time-value">{formatTime(time)}</span>
      </div>
    </div>
  );
};

export default function Home() {
  const [repos, setRepos] = useState<Repo[]>(DEFAULT_REPOS);
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const fetchGitHubData = async () => {
      try {
        const response = await fetch("/api/github");
        if (!response.ok) throw new Error("API Proxy failed");

        const data = await response.json();

        // Update user info
        if (data.user) {
          setUser({
            ...data.user,
            name: data.user.name || "Yeci",
            login: data.user.login || "yeci226",
            bio: data.user.bio || "Making Discord Bot",
            location: data.user.location || "Taiwan",
          });
        }

        // Update repos
        if (data.repos && data.repos.length > 0) {
          setRepos(data.repos);
        }
      } catch (err) {
        console.error("Error fetching combined GitHub data:", err);
      }
    };

    fetchGitHubData();
    const timer = setTimeout(() => setIsExpanded(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  const columns = useMemo(() => {
    // Only randomize and generate full columns on client side to avoid hydration mismatch
    if (!mounted || repos.length === 0)
      return Array.from({ length: 4 }, () => []);

    return Array.from({ length: 4 }, () => {
      // Limit cards per column to reduce DOM node count
      // ~15-20 cards per column is usually enough for the animation loop
      const shuffled = [...repos].sort(() => 0.5 - Math.random()).slice(0, 20);
      // Double for infinite loop instead of quadruple to save memory
      return [...shuffled, ...shuffled];
    });
  }, [repos, mounted]);

  return (
    <main className="main-viewport">
      {/* Auto-scrolling Background Layer */}
      <div className="bg-repos-container">
        {mounted &&
          columns.map((colRepos, colIndex) => (
            <motion.div
              key={colIndex}
              className="bg-column"
              animate={{ y: colIndex % 2 === 0 ? [0, -1000] : [-1000, 0] }}
              transition={{
                duration: 40 + colIndex * 15,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {colRepos.map((repo, idx) => (
                <RepoCard key={`${repo.id}-${colIndex}-${idx}`} repo={repo} />
              ))}
            </motion.div>
          ))}
      </div>

      <section className="hero">
        <motion.div
          layout
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="hero-layout"
          style={{
            maxWidth: isExpanded ? "1100px" : "320px",
            padding: isExpanded ? "40px 60px" : "40px",
          }}
        >
          {/* Profile Section */}
          <motion.div layout className="profile-card">
            <div className="avatar-container">
              <motion.img
                layout
                src={user?.avatar_url || "https://github.com/yeci226.png"}
                className="avatar"
                alt="Avatar"
              />
              <StatusDot />
            </div>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  key="profile-details"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="profile-names">
                    <h2 className="profile-name">{user?.name || "Yeci"}</h2>
                    <p className="profile-username">
                      {user?.login || "yeci226"}
                    </p>
                  </div>
                  <p className="profile-bio">
                    {user?.bio || "Making Discord Bot"}
                  </p>

                  <div
                    className="profile-info-list"
                    style={{ marginTop: "10px" }}
                  >
                    <div className="info-item">
                      <MapPin size={14} /> {user?.location || "Taiwan"}
                    </div>
                    <div
                      className="info-item"
                      style={{ alignItems: "flex-start" }}
                    >
                      <Clock size={14} style={{ marginTop: "3px" }} />
                      <LiveClock />
                    </div>
                  </div>
                  <DiscordStatus />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Greeting Section */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                key="greeting-content"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="hero-content"
              >
                <div className="badge">
                  <Terminal size={14} />
                  <span>HELLO, WORLD!</span>
                </div>
                <h1 className="title">
                  我是 <span className="gradient-text">Yeci</span>
                </h1>
                <p className="description">
                  熱衷於開發 Discord Bot、網頁以及探索新技術。
                </p>
                <div className="hero-actions">
                  <Link href="/bots" className="btn-primary">
                    <Terminal size={18} />
                    <span>查看我的機器人</span>
                  </Link>
                  <a
                    href="https://github.com/yeci226"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                  >
                    <Github size={18} />
                    <span>GitHub</span>
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      <footer className="footer">
        <p>© 2026 yeci226. Built with Passion.</p>
      </footer>
    </main>
  );
}

function getLangColor(lang: string | null): string {
  if (!lang) return "#888";
  const colors: Record<string, string> = {
    TypeScript: "#3178c6",
    JavaScript: "#f1e05a",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Python: "#3572A5",
    Java: "#b07219",
  };
  return colors[lang] || "#888";
}
