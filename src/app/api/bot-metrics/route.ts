import { NextResponse } from "next/server";
import { BOT_METRICS, getBotMetricsOverview } from "@/data/botMetrics";

function normalizeBotId(botId: string): string {
  return botId.trim().toLowerCase();
}

export async function GET() {
  const overview = getBotMetricsOverview();
  const byBot = Object.fromEntries(
    BOT_METRICS.map((item) => [normalizeBotId(item.botId), item]),
  );

  return NextResponse.json(
    {
      overview,
      byBot,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
