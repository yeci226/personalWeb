"use client";

import { useLanyard } from "@/hooks/useLanyard";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Gamepad2 } from "lucide-react";

export function DiscordStatus() {
  const data = useLanyard();

  if (!data) return null;

  // Find non-Spotify, non-Custom activities (e.g., VS Code, Games)
  const activity = data.activities.find(
    (act) => act.type !== 2 && act.type !== 4 && act.name !== "Spotify",
  );

  const spotify = data.spotify;

  return (
    <div className="discord-status-container">
      <AnimatePresence mode="popLayout">
        {/* Spotify Card */}
        {spotify && (
          <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="discord-card spotify-card"
          >
            <div className="card-image-wrapper">
              <img
                src={spotify.album_art_url}
                alt={spotify.album}
                className="card-image spotify-spin"
              />
              <div className="card-image-overlay">
                <Music size={16} className="overlay-icon" />
              </div>
            </div>
            <div className="card-content">
              <div className="card-header spotify-header">
                Listening to Spotify
              </div>
              <div className="card-title">{spotify.song}</div>
              <div className="card-subtitle">by {spotify.artist}</div>
            </div>
          </motion.div>
        )}

        {/* Other Activity (VS Code, Games) */}
        {activity && (
          <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="discord-card activity-card"
          >
            <div className="card-image-wrapper">
              {activity.assets?.large_image ? (
                <img
                  src={`https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.png`}
                  alt={activity.name}
                  className="card-image"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              ) : (
                <Gamepad2 size={24} className="default-icon" />
              )}
            </div>
            <div className="card-content">
              <div className="card-header activity-header">
                {activity.name === "Visual Studio Code"
                  ? "Coding in"
                  : "Playing"}
              </div>
              <div className="card-title">{activity.name}</div>
              <div className="card-subtitle">
                {activity.state} {activity.details && `- ${activity.details}`}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function StatusDot() {
  const data = useLanyard();
  const status = data?.discord_status || "offline";

  const colors = {
    online: "#43b581",
    idle: "#faa61a",
    dnd: "#f04747",
    offline: "#747f8d",
  };

  return (
    <div
      className="status-badge"
      style={{
        backgroundColor: "#0d1117",
        borderColor: colors[status],
        color: colors[status],
        width: "28px",
        height: "28px",
        bottom: "15px",
        right: "15px",
        fontSize: "20px",
        transition: "all 0.3s ease",
      }}
      title={status}
    >
      <div
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          background: "currentColor",
          boxShadow: `0 0 10px ${colors[status]}`,
        }}
      />
    </div>
  );
}
