import { loadEnvConfig } from "@next/env";
import postgres from "postgres";
import { challenges, dishes, recipes } from "./schema";
import { drizzle } from "drizzle-orm/postgres-js";

loadEnvConfig(process.cwd());

const client = postgres(process.env.DATABASE_URL!, { prepare: false });
const db = drizzle({ client });

async function main() {
  await db.delete(dishes);
  await db.delete(challenges);
  await db.delete(recipes);

  const [challenge] = await db
    .insert(challenges)
    .values({
      slug: "pan-passport",
      title: "Pan Passport",
      description: "Cook one dish from 30 countries.",
    })
    .returning();

  const newRecipes = await db
    .insert(recipes)
    .values([
      {
        slug: "shakshuka",
        name: "Shakshuka",
        country: "Tunisia",
        minutes: 30,
        level: "easy",
        serves: 2,
        ingredients: ["4 eggs", "1 can tomatoes", "1 onion", "1 tsp cumin"],
        steps: [
          "Fry onion.",
          "Add tomatoes and cumin, simmer 10 min.",
          "Crack in eggs, cover until set.",
        ],
      },
      {
        slug: "pad-thai",
        name: "Pad Thai",
        country: "Thailand",
        minutes: 25,
        level: "medium",
        serves: 2,
        ingredients: [],
        steps: [],
      },
    ])
    .returning();

  await db
    .insert(dishes)
    .values(newRecipes.map((r) => ({ challengeId: challenge.id, recipeId: r.id })));

  console.log("Seeded");
}

main().finally(() => client.end());
