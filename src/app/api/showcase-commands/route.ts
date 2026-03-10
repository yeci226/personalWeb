import { NextResponse } from "next/server";
import path from "node:path";

interface SyncedCommand {
  name: string;
  sourceFile: string;
  updatedAt: string;
}

type SyncedCommandsByBot = Record<string, SyncedCommand[]>;

interface RepoConfig {
  owner: string;
  repo: string;
  branch: string;
  commandsPath: string;
}

const SHOWCASE_BOT_ALLOWLIST = [
  "hsr-discord-bot",
  "zzz",
  "endfield",
  "nikke",
  "ba-discord-bot",
  "ff14",
  "haneko",
  // intentionally excluding "accounting"
] as const;

const BOT_REPOS: Record<string, RepoConfig> = {
  "hsr-discord-bot": {
    owner: "Yec1",
    repo: "hsr-discord-bot",
    branch: "rebuild",
    commandsPath: "src/commands",
  },
  zzz: {
    owner: "yeci226",
    repo: "ZZZ",
    branch: "main",
    commandsPath: "src/commands",
  },
  endfield: {
    owner: "yeci226",
    repo: "endfield-discord-bot",
    branch: "main",
    commandsPath: "src/commands",
  },
  nikke: {
    owner: "yeci226",
    repo: "nikke",
    branch: "main",
    commandsPath: "src/commands",
  },
  "ba-discord-bot": {
    owner: "yeci226",
    repo: "BA-discord-bot",
    branch: "main",
    commandsPath: "src/commands",
  },
  ff14: {
    owner: "yeci226",
    repo: "ff14",
    branch: "main",
    commandsPath: "src/commands",
  },
  haneko: {
    owner: "Yec1",
    repo: "Haneko",
    branch: "main",
    commandsPath: "src/commands",
  },
};

const CACHE_TTL_MS = 15 * 60 * 1000;
const MAX_FILES_PER_BOT = 120;
const FETCH_TIMEOUT_MS = 6000;

let cache: {
  expiresAt: number;
  payload: { byBot: SyncedCommandsByBot; syncedAt: string };
} | null = null;

function githubHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;
  return {
    Accept: "application/vnd.github+json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function fetchWithTimeout(url: string, init?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

function extractCommandName(filePath: string, content: string): string {
  const slashBuilderMatch = content.match(
    /new\s+SlashCommandBuilder\(\)[\s\S]{0,700}?\.setName\(\s*["'`]([^"'`]+)["'`]\s*\)/,
  );
  if (slashBuilderMatch?.[1]) {
    return slashBuilderMatch[1].trim();
  }

  const dataNameMatch = content.match(
    /data\s*:\s*\{[\s\S]{0,220}?name\s*:\s*["'`]([^"'`]+)["'`]/,
  );
  if (dataNameMatch?.[1]) {
    return dataNameMatch[1].trim();
  }

  const base = path.basename(filePath).replace(/\.[^.]+$/, "");
  return base.replace(/[_\s]+/g, "-").toLowerCase();
}

function normalizeBotId(id: string): string {
  return id.trim().toLowerCase();
}

function getEnabledBots(): string[] {
  return [...SHOWCASE_BOT_ALLOWLIST];
}

function normalizeCommandName(name: string): string {
  const trimmed = (name || "").trim();
  if (!trimmed) return "";
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

function parseBotManifestMapFromEnv(): Record<string, string> {
  const raw = process.env.SHOWCASE_BOT_MANIFESTS_JSON;
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw) as Record<string, string>;
    return Object.fromEntries(
      Object.entries(parsed)
        .map(([botId, url]) => [normalizeBotId(botId), String(url).trim()])
        .filter(([, url]) => Boolean(url)),
    );
  } catch {
    return {};
  }
}

function normalizeManifestPayload(payload: any): SyncedCommand[] {
  if (!payload) return [];

  const fromArray = Array.isArray(payload)
    ? payload
    : Array.isArray(payload.commands)
      ? payload.commands
      : Array.isArray(payload.items)
        ? payload.items
        : [];

  const dedup = new Map<string, SyncedCommand>();
  for (const item of fromArray) {
    const normalizedName = normalizeCommandName(
      item?.name || item?.command || item?.id || "",
    );
    if (!normalizedName) continue;

    const key = normalizedName.toLowerCase();
    if (!dedup.has(key)) {
      dedup.set(key, {
        name: normalizedName,
        sourceFile: String(item?.sourceFile || item?.source || "manifest"),
        updatedAt: String(item?.updatedAt || new Date().toISOString()),
      });
    }
  }

  return [...dedup.values()].sort((a, b) => a.name.localeCompare(b.name));
}

async function loadBotFromManifestUrl(url: string): Promise<SyncedCommand[]> {
  try {
    const response = await fetchWithTimeout(url, {
      headers: githubHeaders(),
    });
    if (!response.ok) return [];

    const payload = await response.json();
    return normalizeManifestPayload(payload);
  } catch {
    return [];
  }
}

async function listRepoCommandFiles(config: RepoConfig): Promise<string[]> {
  const treeUrl = `https://api.github.com/repos/${config.owner}/${config.repo}/git/trees/${config.branch}?recursive=1`;
  const response = await fetchWithTimeout(treeUrl, { headers: githubHeaders() });
  if (!response.ok) return [];

  const json = (await response.json()) as {
    tree?: Array<{ path: string; type: string }>;
  };

  const files = (json.tree || [])
    .filter((item) => item.type === "blob")
    .map((item) => item.path)
    .filter((filePath) => filePath.startsWith(`${config.commandsPath}/`))
    .filter((filePath) => filePath.endsWith(".ts") || filePath.endsWith(".js"))
    .slice(0, MAX_FILES_PER_BOT);

  return files;
}

async function runWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  worker: (item: T) => Promise<R>,
): Promise<R[]> {
  const result: R[] = [];
  let index = 0;

  const tasks = Array.from({ length: Math.min(concurrency, items.length) }).map(
    async () => {
      while (index < items.length) {
        const current = index;
        index += 1;
        result[current] = await worker(items[current]);
      }
    },
  );

  await Promise.all(tasks);
  return result;
}

async function loadCommandsForBot(config: RepoConfig): Promise<SyncedCommand[]> {
  const files = await listRepoCommandFiles(config);
  if (!files.length) return [];

  const commands = new Map<string, SyncedCommand>();
  const syncedAt = new Date().toISOString();

  await runWithConcurrency(files, 8, async (filePath) => {
    const rawUrl = `https://raw.githubusercontent.com/${config.owner}/${config.repo}/${config.branch}/${filePath}`;
    const response = await fetchWithTimeout(rawUrl, {
      headers: githubHeaders(),
    });

    if (!response.ok) return;
    const content = await response.text();
    const name = extractCommandName(filePath, content);
    const normalized = name.toLowerCase();

    if (!commands.has(normalized)) {
      commands.set(normalized, {
        name: name.startsWith("/") ? name : `/${name}`,
        sourceFile: `${config.owner}/${config.repo}/${filePath}`,
        updatedAt: syncedAt,
      });
    }
  });

  return [...commands.values()].sort((a, b) => a.name.localeCompare(b.name));
}

async function loadAllSyncedCommands(): Promise<{ byBot: SyncedCommandsByBot; syncedAt: string }> {
  const byBot: SyncedCommandsByBot = {};
  const enabledBots = getEnabledBots();
  const manifestMap = parseBotManifestMapFromEnv();

  await Promise.all(
    enabledBots.map(async (botId) => {
      const normalized = normalizeBotId(botId);
      const manifestUrl = manifestMap[normalized];

      if (manifestUrl) {
        const fromManifest = await loadBotFromManifestUrl(manifestUrl);
        if (fromManifest.length > 0) {
          byBot[normalized] = fromManifest;
          return;
        }
      }

      const config = BOT_REPOS[normalized];
      if (!config) {
        byBot[normalized] = [];
        return;
      }

      byBot[normalized] = await loadCommandsForBot(config);
    }),
  );

  return {
    byBot,
    syncedAt: new Date().toISOString(),
  };
}

export async function GET() {
  // Optional global manifest for all bots at once.
  const manifestUrl = process.env.SHOWCASE_COMMANDS_MANIFEST_URL;
  if (manifestUrl) {
    try {
      const response = await fetchWithTimeout(manifestUrl, {
        headers: githubHeaders(),
      });
      if (response.ok) {
        const payload = await response.json();
        return NextResponse.json(payload, {
          headers: {
            "Cache-Control": "no-store",
          },
        });
      }
    } catch {
      // Fall back to GitHub repo scan below.
    }
  }

  const now = Date.now();
  if (cache && cache.expiresAt > now) {
    return NextResponse.json(cache.payload, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  }

  const payload = await loadAllSyncedCommands();
  cache = {
    payload,
    expiresAt: now + CACHE_TTL_MS,
  };

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
