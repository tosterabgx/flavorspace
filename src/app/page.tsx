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

      <main>
        <p>
          <span>14</span> dishes cooked so far
        </p>
      </main>
    </div>
  );
}
