import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { BottomNav } from "../components/BottomNav";

export const metadata: Metadata = {
  title: "ThePublicWire",
  description: "See what is happening. Understand the story.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <Link href="/" className="brand">ThePublic<span>Wire</span></Link>
          <div className="header-actions">
            <Link href="/explore">Search</Link>
            <Link href="/ai">Ask AI</Link>
            <Link href="/updates" aria-label="Updates">◌</Link>
          </div>
        </header>
        {children}
        <footer className="site-footer">
          <Link href="/community-rules">Community Rules</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/security">Security</Link>
          <Link href="/support">Verified Support</Link>
          <Link href="/contact">Contact</Link>
        </footer>
        <BottomNav />
      </body>
    </html>
  );
}
