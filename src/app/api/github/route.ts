import { NextResponse } from "next/server";

export const revalidate = 3600; // Cache for 1 hour

const ACCOUNTS = [
  { name: "yeci226", type: "users" },
  { name: "Yec1", type: "orgs" },
  { name: "NerdyHomeReOpen", type: "orgs" },
];

export async function GET() {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  };

  if (GITHUB_TOKEN) {
    headers.Authorization = `token ${GITHUB_TOKEN}`;
  }

  try {
    // 1. Fetch User Profile
    const userResponse = await fetch("https://api.github.com/users/yeci226", {
      headers,
      next: { revalidate: 3600 },
    });
    const userData = userResponse.ok ? await userResponse.json() : null;

    // 2. Fetch Repos from all accounts
    const repoPromises = ACCOUNTS.map(async (acc) => {
      try {
        const res = await fetch(
          `https://api.github.com/${acc.type}/${acc.name}/repos?per_page=100&sort=updated`,
          { headers, next: { revalidate: 3600 } },
        );
        if (!res.ok) return [];
        return await res.json();
      } catch (err) {
        console.error(`Error fetching ${acc.name}:`, err);
        return [];
      }
    });

    const results = await Promise.all(repoPromises);
    const combinedRepos = results
      .flat()
      .filter((repo) => repo && repo.name && !repo.fork)
      // Sort by stars descending as a default
      .sort((a, b) => b.stargazers_count - a.stargazers_count);

    return NextResponse.json({
      user: userData,
      repos: combinedRepos,
    });
  } catch (error) {
    console.error("GitHub Proxy Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch GitHub data" },
      { status: 500 },
    );
  }
}
