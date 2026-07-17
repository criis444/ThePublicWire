import Link from "next/link";

const items = [
  { href: "/", icon: "◉", label: "Now" },
  { href: "/explore", icon: "⌕", label: "Explore" },
  { href: "/share", icon: "+", label: "Share" },
  { href: "/updates", icon: "◌", label: "Updates" },
  { href: "/you", icon: "◒", label: "You" },
];

export function BottomNav() {
  return (
    <nav aria-label="Primary" className="bottom-nav">
      {items.map((item) => (
        <Link href={item.href} key={item.href} className="bottom-nav-item">
          <span aria-hidden="true" className="bottom-nav-icon">{item.icon}</span>
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
