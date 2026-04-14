import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | yeci226',
};

export default function TosPage() {
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
            Terms of<br /><span style={{ color: '#E6397C' }}>Service</span>
          </h1>
          <p style={{ fontSize: 13, color: '#555', marginTop: 16 }}>
            最後更新：2026 年 4 月 15 日
          </p>
        </div>

        {/* Content */}
        <div style={{ fontSize: 14, color: '#888', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: 32 }}>
          <Section title="1. 使用條款">
            使用本網站即表示您同意遵守以下服務條款。若您不同意這些條款，請勿使用本服務。
          </Section>

          <Section title="2. 服務說明">
            本網站為個人作品集網站，展示開發者的個人專案、Discord Bot 及相關資訊。本網站提供的 Discord Bot 服務由獨立條款管轄。
          </Section>

          <Section title="3. 智慧財產權">
            本網站所有內容（包括文字、圖像、程式碼）均為 yeci226 所有，受著作權法保護。未經書面同意，不得複製、修改或再發佈。
          </Section>

          <Section title="4. 免責聲明">
            本網站及其 Discord Bot 服務以「現狀」提供，不保證持續可用性。開發者不對因使用本服務而產生的任何損失負責。
          </Section>

          <Section title="5. 隱私政策">
            有關個人資料收集與使用方式，請參閱我們的{' '}
            <Link href="/privacy" style={{ color: '#E6397C' }}>隱私政策</Link>。
          </Section>

          <Section title="6. 條款修改">
            我們保留隨時修改這些條款的權利。重大變更將在本頁面更新。繼續使用本服務即表示您接受修改後的條款。
          </Section>

          <Section title="7. 聯絡方式">
            如有任何疑問，請透過 Discord 或電子郵件與我聯絡。
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
