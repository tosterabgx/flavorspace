import Logo from "@/components/logo";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-6 p-5">
      <header className="mt-2 flex items-center justify-between">
        <Logo />

        <Link
          href="/profile"
          className="flex size-11 items-center justify-center rounded-full bg-mustard font-display font-bold"
        >
          A
        </Link>
      </header>

      <main className="flex flex-col gap-6">
        <p className="flex items-baseline gap-2.5">
          <span className="font-display text-6xl leading-none font-bold tracking-tighter">14</span>
          <span className="text-[15px] leading-snug text-muted">
            dishes cooked so far
            <br />9 this week
          </span>
        </p>

        <Link
          href="/lists/active"
          className="flex flex-col gap-1.5 rounded-3xl bg-ink p-5 text-white"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide text-mustard">
              ACTIVE CHALLENGE
            </span>
          </div>

          <h2 className="font-display text-3xl font-bold">Challenge Name</h2>
          <p className="text-sm text-white/75">Challenge description</p>

          <div className="h-2 overflow-hidden rounded-full bg-white/15">
            <div className="h-full rounded-full bg-mustard" style={{ width: `${12}%` }} />
          </div>
        </Link>

        <section className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between"></div>
        </section>
      </main>
    </div>
  );
}
