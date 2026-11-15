"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  {
    href: "/",
    label: "Home",
    d: "M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z",
  },
  {
    href: "/challenges",
    label: "Lists",
    d: "M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01",
  },
  {
    href: "/friends",
    label: "Friends",
    d: "M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20c0-3 3-5 6-5s6 2 6 5M17 14c2.5 0 4 1.6 4 4",
  },
  {
    href: "/me",
    label: "Me",
    d: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4 4-6 8-6s8 2 8 6",
  },
];

function Tab({ href, label, d, active }: (typeof tabs)[number] & { active: boolean }) {
  return (
    <Link
      href={href}
      className={`flex min-w-14 flex-col items-center gap-1 text-[11px] ${active ? "font-semibold text-ink" : "font-medium text-muted"}`}
    >
      <svg
        aria-hidden="true"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={d} />
      </svg>
      {label}
    </Link>
  );
}

export default function TabBar({ pathname }: { pathname?: string }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 mx-auto flex h-21 max-w-md items-start justify-around border-t border-surface bg-white pt-2.5">
      <Tab {...tabs[0]} active={pathname === tabs[0].href} />
      <Tab {...tabs[1]} active={pathname === tabs[1].href} />
      <Link
        href="/log"
        className="-mt-1.5 flex size-13 items-center justify-center rounded-full bg-tomato text-white"
      >
        <svg
          aria-hidden="true"
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </Link>
      <Tab {...tabs[2]} active={pathname === tabs[2].href} />
      <Tab {...tabs[3]} active={pathname === tabs[3].href} />
    </nav>
  );
}

export function ActiveTabBar() {
  return <TabBar pathname={usePathname()} />;
}
