import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | yeci226',
};

export default function PrivacyPage() {
  return (
    <main style={{
      background: '#111113',
      minHeight: '100vh',
      color: '#f0f0f0',
      fontFamily: "-apple-system, 'Segoe UI', sans-serif",
      padding: '0',
    }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '80px 32px 120px' }}>

        {/* Back link */}
        <Link href="/" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 12,
          color: '#E6397C',
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginBottom: 48,
          textDecoration: 'none',
        }}>
          ← 返回首頁
        </Link>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: '0.22em',
            color: '#E6397C',
            textTransform: 'uppercase',
            marginBottom: 16,
          }}>
            Legal
          </div>
          <h1 style={{ fontSize: 48, fontWeight: 900, letterSpacing: -2, lineHeight: 0.95 }}>
            Privacy<br /><span style={{ color: '#E6397C' }}>Policy</span>
          </h1>
          <p style={{ fontSize: 13, color: '#555', marginTop: 16 }}>
            最後更新：2026 年 4 月 15 日
          </p>
        </div>

        {/* Content */}
        <div style={{ fontSize: 14, color: '#888', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: 32 }}>
          <Section title="1. 收集的資料">
            本網站本身不收集任何個人識別資料。網站僅透過 GitHub API 取得公開資訊（如 repo 名稱、星數），以及透過 Lanyard API 顯示 Discord 線上狀態。
          </Section>

          <Section title="2. Discord Bot 資料">
            我們的 Discord Bot 可能收集以下資料以提供服務：Discord 使用者 ID、伺服器 ID、指令使用記錄。這些資料僅用於提供 Bot 功能，不會出售或分享給第三方。
          </Section>

          <Section title="3. Cookie 與追蹤">
            本網站不使用 Cookie 或任何追蹤技術。我們不使用 Google Analytics 或其他第三方分析工具。
          </Section>

          <Section title="4. 第三方服務">
            本網站連結至 GitHub 及 Discord 等第三方平台。這些平台有各自的隱私政策，我們不對其資料處理方式負責。
          </Section>

          <Section title="5. 資料保留">
            Discord Bot 收集的使用者資料會在您要求刪除後 30 天內從伺服器移除。您可以透過 Bot 的解除綁定指令或聯絡開發者來刪除您的資料。
          </Section>

          <Section title="6. 您的權利">
            您有權要求查閱、更正或刪除我們持有的您的個人資料。請透過 Discord 或電子郵件與我們聯絡。
          </Section>

          <Section title="7. 聯絡方式">
            如有任何隱私相關疑問，請透過 Discord 或電子郵件與我聯絡。
          </Section>
        </div>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 style={{
        fontSize: 16,
        fontWeight: 700,
        color: '#f0f0f0',
        marginBottom: 10,
        letterSpacing: -0.3,
      }}>
        {title}
      </h2>
      <p style={{ color: '#666' }}>{children}</p>
    </div>
  );
}
