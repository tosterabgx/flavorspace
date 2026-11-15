import Link from "next/link";

export default function Back({ href, className }: { href: string; className?: string }) {
  return (
    <Link
      href={href}
      className={`flex size-11 items-center justify-center rounded-full bg-white text-ink ${className ?? ""}`}
    >
      <svg
        aria-hidden="true"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15 5l-7 7 7 7" />
      </svg>
    </Link>
  );
}
