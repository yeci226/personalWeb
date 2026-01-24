import { BotsShowcase } from "@/components/BotsShowcase";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "yeci226 | 我的 Discord Bots",
  description: "查看我開發的所有 Discord 機器人及使用指令指南",
};

export default function BotsPage() {
  return (
    <main className="main-viewport" style={{ overflowY: "auto" }}>
      <BotsShowcase />
    </main>
  );
}
