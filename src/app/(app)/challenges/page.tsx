import { challengeMembers, challenges, dishes, recipes } from "@/db/schema";
import { db } from "@/index";
import { createClient } from "@/lib/server";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { Suspense } from "react";
import { joinChallenge } from "./actions";

export default function ChallengesPage() {
  return (
    <div className="flex flex-col gap-6 p-5">
      <h1 className="mt-2 font-display text-3xl font-bold">Challenges</h1>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-3xl bg-surface" />}>
        <ChallengeList />
      </Suspense>
    </div>
  );
}

async function ChallengeList() {
  const supabase = await createClient();
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return null;

  const [list, dishRows, joined] = await Promise.all([
    db.select().from(challenges).where(eq(challenges.isPublished, true)),
    db
      .select({
        challengeId: dishes.challengeId,
        name: recipes.name,
        slug: recipes.slug,
        country: recipes.country,
      })
      .from(dishes)
      .innerJoin(recipes, eq(recipes.id, dishes.recipeId))
      .orderBy(dishes.id),
    db
      .select({ id: challengeMembers.challengeId })
      .from(challengeMembers)
      .where(eq(challengeMembers.userId, user.id)),
  ]);

  const joinedIds = new Set(joined.map((j) => j.id));

  return list.map((c) => {
    const items = dishRows.filter((d) => d.challengeId === c.id);

    return (
      <section key={c.id} className="flex flex-col gap-4 rounded-3xl bg-surface p-5">
        <div>
          <h2 className="font-display text-2xl font-bold">{c.title}</h2>
          <p className="text-sm text-muted">{c.description}</p>
        </div>

        <ol className="flex flex-col divide-y divide-white">
          {items.map((d, i) => (
            <li key={d.slug}>
              <Link href={`/recipe/${d.slug}`} className="flex items-center gap-3 py-2.5">
                <span className="w-6 font-display text-sm font-bold text-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-medium">{d.name}</span>
                <span className="ml-auto text-sm text-muted">{d.country}</span>
              </Link>
            </li>
          ))}
        </ol>

        {joinedIds.has(c.id) ? (
          <span className="items-centerflex flex h-12 items-center justify-center rounded-xl bg-leaf/10 font-semibold text-leaf">
            Joined
          </span>
        ) : (
          <form action={joinChallenge.bind(null, c.id)}>
            <button className="h-12 w-full rounded-xl bg-tomato font-semibold text-white">
              Join challenge
            </button>
          </form>
        )}
      </section>
    );
  });
}
