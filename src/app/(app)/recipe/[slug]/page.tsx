import Back from "@/components/back";
import { recipes } from "@/db/schema";
import { db } from "@/index";
import { cacheLife } from "next/cache";
import Image from "next/image";
import { eq } from "drizzle-orm";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import MadeItButton from "@/components/made-it-button";
import { madeIt } from "./actions";

async function getRecipe(slug: string) {
  "use cache";
  cacheLife("hours");
  const [recipe] = await db.select().from(recipes).where(eq(recipes.slug, slug));
  return recipe;
}

export default function RecipePage(props: PageProps<"/recipe/[slug]">) {
  return (
    <Suspense fallback={<div className="h-72 animate-pulse bg-surface" />}>
      <Recipe params={props.params} />
    </Suspense>
  );
}

async function Recipe({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const recipe = await getRecipe(slug);
  if (!recipe) notFound();

  const stats = [
    { label: "Time", value: recipe.minutes ? `${recipe.minutes} min` : "-" },
    { label: "Level", value: recipe.level ?? "-" },
    { label: "Serves", value: recipe.serves ?? "-" },
  ];

  return (
    <div>
      <header className="relative h-72 w-full">
        <Image
          src={recipe.imageUrl ?? "/recipe.svg"}
          alt={`Photo of ${recipe.name}`}
          fill
          priority
          loading="eager"
          className="object-cover"
        />
        <Back href="/" className="absolute top-5 left-5" />
      </header>

      <section className="flex flex-col gap-4 p-5">
        <div>
          {recipe.country && (
            <span className="text-sm font-semibold text-muted">{recipe.country}</span>
          )}
          <h2 className="font-display text-4xl font-bold tracking-tighter">{recipe.name}</h2>
          {recipe.description && <p className="mt-2 text-muted">{recipe.description}</p>}
        </div>

        <div className="grid grid-cols-3 gap-2">
          {stats.map(({ label, value }) => (
            <div key={label} className="flex flex-col rounded-xl bg-surface px-3 py-2.5">
              <span className="text-xs text-muted">{label}</span>
              <span className="font-display text-base font-bold">{value}</span>
            </div>
          ))}
        </div>

        <div>
          <h2 className="mb-2 font-display text-xl font-bold">Ingredients</h2>
          <ul className="flex flex-col divide-y divide-surface">
            {recipe.ingredients.map((item) => (
              <li key={item} className="py-2.5">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-3 font-display text-xl font-bold">Steps</h2>
          <ol className="flex flex-col gap-4">
            {recipe.steps.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-mustard font-display text-sm font-bold">
                  {i + 1}
                </span>
                <p className="pt-0.5">{step}</p>
              </li>
            ))}
          </ol>
        </div>

        <form action={madeIt.bind(null, recipe.id)}>
          <MadeItButton />
        </form>
      </section>
    </div>
  );
}
