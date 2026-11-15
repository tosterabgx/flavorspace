import Logo from "@/components/logo";
import { challengeMembers, challenges, dishes, profiles } from "@/db/schema";
import { db } from "@/index";
import { createClient } from "@/lib/server";
import { eq, count, isNull, and, desc } from "drizzle-orm";
import Link from "next/link";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="flex flex-col gap-6 p-5">
      <Suspense fallback={<div className="h-96 animate-pulse rounded-3xl bg-surface" />}>
        <HomeContent />
      </Suspense>
    </div>
  );
}

async function HomeContent() {
  const supabase = await createClient();
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return null;

  const [profile] = await db.select().from(profiles).where(eq(profiles.id, user.id));

  const [active] = await db
    .select({
      slug: challenges.slug,
      title: challenges.title,
      description: challenges.description,
      total: count(dishes.id),
    })
    .from(challengeMembers)
    .innerJoin(challenges, eq(challenges.id, challengeMembers.challengeId))
    .leftJoin(dishes, eq(dishes.challengeId, challenges.id))
    .where(and(eq(challengeMembers.userId, user.id), isNull(challengeMembers.completedAt)))
    .groupBy(challenges.id, challengeMembers.joinedAt)
    .orderBy(desc(challengeMembers.joinedAt))
    .limit(1);

  const name = profile?.displayName ?? profile?.username ?? "?";

  return (
    <>
      <header className="mt-2 flex items-center justify-between">
        <Logo />

        <Link
          href="/me"
          className="flex size-11 items-center justify-center rounded-full bg-mustard font-display font-bold"
        >
          {name[0]}
        </Link>
      </header>

      <main className="flex flex-col gap-6">
        {/* <p className="flex items-baseline gap-2.5">
          <span className="font-display text-6xl leading-none font-bold tracking-tighter">14</span>
          <span className="text-[15px] leading-snug text-muted">
            dishes cooked so far
            <br />9 this week
          </span>
        </p> */}

        {active ? (
          <Link
            href={`/challenges/${active.slug}`}
            className="flex flex-col gap-1.5 rounded-3xl bg-ink p-5 text-white"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wide text-mustard">
                ACTIVE CHALLENGE
              </span>
            </div>

            <h2 className="font-display text-3xl font-bold">{active.title}</h2>
            <p className="text-sm text-white/75">{active.description}</p>

            <div className="h-2 overflow-hidden rounded-full bg-white/15">
              <div className="h-full rounded-full bg-mustard" style={{ width: `${12}%` }} />
            </div>
          </Link>
        ) : (
          <Link href="/challenges" className="flex flex-col gap-2 rounded-3xl bg-surface p-5">
            <h2 className="font-display text-2xl font-bold">Pick your first challenge</h2>
            <p className="text-sm text-muted">Cook through it one dish at a time</p>
            <span className="mt-2 self-start rounded-xl bg-tomato px-4 py-3 text-sm font-semibold text-white">
              Browse challenges
            </span>
          </Link>
        )}
      </main>
    </>
  );
}
