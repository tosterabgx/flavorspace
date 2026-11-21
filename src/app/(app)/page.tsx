import Confetti from "@/components/confetti";
import Logo from "@/components/logo";
import { challengeMembers, challenges, cookLogs, dishes, profiles, recipes } from "@/db/schema";
import { db } from "@/index";
import { createClient } from "@/lib/server";
import { eq, count, isNull, and, desc, gte, sql, countDistinct } from "drizzle-orm";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="flex flex-col gap-6 p-5">
      <Suspense fallback={null}>
        <Confetti />
      </Suspense>

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
      id: challenges.id,
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

  const [[total], [week], [progress], recent] = await Promise.all([
    db.select({ n: count() }).from(cookLogs).where(eq(cookLogs.userId, user.id)),
    db
      .select({ n: count() })
      .from(cookLogs)
      .where(
        and(eq(cookLogs.userId, user.id), gte(cookLogs.createdAt, sql`now() - interval '7 days'`)),
      ),
    active
      ? db
          .select({ n: countDistinct(cookLogs.recipeId) })
          .from(cookLogs)
          .innerJoin(dishes, eq(dishes.recipeId, cookLogs.recipeId))
          .where(and(eq(cookLogs.userId, user.id), eq(dishes.challengeId, active.id)))
      : [{ n: 0 }],
    db
      .select({
        id: cookLogs.id,
        name: recipes.name,
        slug: recipes.slug,
        imageUrl: recipes.imageUrl,
      })
      .from(cookLogs)
      .innerJoin(recipes, eq(recipes.id, cookLogs.recipeId))
      .where(eq(cookLogs.userId, user.id))
      .orderBy(desc(cookLogs.createdAt))
      .limit(3),
  ]);

  const name = profile?.displayName ?? profile?.username ?? "?";
  const pct = active && active.total > 0 ? Math.round((progress.n / active.total) * 100) : 0;

  return (
    <>
      <header className="mt-2 flex items-center justify-between">
        <Logo />
        <Link
          href="/me"
          className="flex size-11 items-center justify-center rounded-full bg-mustard font-display font-bold uppercase"
        >
          {name[0]}
        </Link>
      </header>

      {total.n != 0 && (
        <p className="flex items-baseline gap-2.5">
          <span className="font-display text-5xl leading-none font-bold tracking-tighter">
            {total.n}
          </span>
          <span className="text-lg leading-snug text-muted">
            dishes cooked so far
            <br />
            {week.n != 0 && <>{week.n} this week</>}
          </span>
        </p>
      )}

      {active ? (
        <Link
          href={`/challenges`}
          className="flex flex-col gap-1.5 rounded-3xl bg-ink p-5 text-white"
        >
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold tracking-wide text-mustard">ACTIVE CHALLENGE</span>
            <span className="text-white/75">
              {progress.n} / {active.total}
            </span>
          </div>
          <h2 className="font-display text-3xl font-bold">{active.title}</h2>
          <p className="text-sm text-white/75">{active.description}</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/15">
            <div className="h-full rounded-full bg-mustard" style={{ width: `${pct}%` }} />
          </div>
        </Link>
      ) : (
        <Link href="/challenges" className="flex flex-col gap-2 rounded-3xl bg-surface p-5">
          <h2 className="font-display text-2xl font-bold">Pick your first challenge</h2>
          <span className="mt-2 self-start rounded-xl bg-tomato px-4 py-3 text-sm font-semibold text-white">
            Browse
          </span>
        </Link>
      )}

      {recent.length != 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="font-display text-xl font-bold">Recently cooked</h2>
          <ul className="grid grid-cols-3 gap-2.5">
            {recent.map((r) => (
              <li key={r.id}>
                <Link href={`/recipe/${r.slug}`} className="flex flex-col gap-1.5">
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-surface">
                    <Image
                      src={r.imageUrl ?? "/recipe.svg"}
                      alt=""
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                  </div>
                  <span className="text-[13px] font-medium">{r.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
