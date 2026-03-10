import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'AgoroScores - Global Real-Time Football',
  description: 'Ultra-fast live football scores, deep analytics, and news.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <nav className="navbar">
            <div className="nav-brand">
              <Link href="/">
                <span className="logo-text">Agoro</span>
                <span className="logo-accent">Scores</span>
              </Link>
            </div>
            <div className="nav-links">
              <Link href="/">Home</Link>
              <Link href="/matches">Matches</Link>
              <Link href="/news">News</Link>
              <Link href="/stats">Stats</Link>
              <Link href="/bets">Bets</Link>
            </div>
            <div className="nav-profile">
              <Link href="/profile">Profile</Link>
            </div>
          </nav>
          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
