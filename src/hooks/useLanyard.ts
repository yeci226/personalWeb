"use client";

import { useEffect, useState } from "react";

const DISCORD_ID = "283946584461410305";

export interface LanyardData {
  spotify: {
    track_id: string;
    timestamps: {
      start: number;
      end: number;
    };
    song: string;
    artist: string;
    album_art_url: string;
    album: string;
  } | null;
  listening_to_spotify: boolean;
  discord_user: {
    username: string;
    public_flags: number;
    id: string;
    discriminator: string;
    avatar: string;
  };
  discord_status: "online" | "idle" | "dnd" | "offline";
  activities: {
    type: number;
    state: string;
    name: string;
    id: string;
    details?: string;
    application_id?: string;
    emoji?: {
      name: string;
      id?: string;
      animated?: boolean;
    };
    created_at: number;
    timestamps?: {
      start: number;
      end?: number;
    };
    assets?: {
      large_image?: string;
      large_text?: string;
      small_image?: string;
      small_text?: string;
    };
  }[];
  active_on_discord_web: boolean;
  active_on_discord_mobile: boolean;
  active_on_discord_desktop: boolean;
}

export function useLanyard() {
  const [data, setData] = useState<LanyardData | null>(null);

  useEffect(() => {
    let ws: WebSocket;
    let heartbeatInterval: NodeJS.Timeout;

    const connect = () => {
      ws = new WebSocket("wss://api.lanyard.rest/socket");

      ws.onopen = () => {
        // Initialize
        ws.send(
          JSON.stringify({
            op: 2,
            d: {
              subscribe_to_id: DISCORD_ID,
            },
          }),
        );
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        const { op, t, d } = message;

        switch (op) {
          case 0: // Event Dispatch
            if (t === "INIT_STATE" || t === "PRESENCE_UPDATE") {
              setData(d || null);
            }
            break;
          case 1: // Hello -> Start Heartbeat
            const heartbeatMs = d.heartbeat_interval;
            heartbeatInterval = setInterval(() => {
              ws.send(JSON.stringify({ op: 3 }));
            }, heartbeatMs);
            break;
        }
      };

      ws.onclose = () => {
        clearInterval(heartbeatInterval);
        // Reconnect after 5s
        setTimeout(connect, 5000);
      };
    };

    connect();

    return () => {
      clearInterval(heartbeatInterval);
      if (ws) ws.close();
    };
  }, []);

  return data;
}
