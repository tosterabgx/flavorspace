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
        description:
          "Thailand's best-known noodle dish: rice noodles stir-fried with egg, tofu and bean sprouts in a sweet, sour and salty tamarind sauce, topped with peanuts and lime.",
        minutes: 40,
        level: "medium",
        serves: 2,
        ingredients: [
          "200 g flat rice noodles (5 mm)",
          "3 tbsp tamarind paste",
          "2 tbsp fish sauce",
          "2 tbsp palm or brown sugar",
          "2 tbsp neutral oil",
          "150 g firm tofu or 200 g shrimp",
          "2 cloves garlic, minced",
          "1 shallot, sliced",
          "2 eggs",
          "1 cup bean sprouts",
          "3 spring onions, cut into 3 cm pieces",
          "3 tbsp roasted peanuts, chopped",
          "1 lime, cut into wedges",
          "Chili flakes, to taste",
        ],
        steps: [
          "Soak the noodles in warm water for 25–30 minutes until bendy but still firm. Drain.",
          "Stir tamarind, fish sauce and sugar in a small bowl until the sugar dissolves.",
          "Heat oil in a wok over high heat. Fry the tofu or shrimp until golden, then push to the side.",
          "Add garlic and shallot and stir for 30 seconds until fragrant.",
          "Crack in the eggs, scramble until just set, then mix everything together.",
          "Add the noodles and sauce. Toss for 2–3 minutes until the noodles soak up the sauce and turn soft.",
          "Add bean sprouts and spring onions and toss for 30 seconds more.",
          "Serve topped with peanuts and chili flakes, with lime wedges on the side.",
        ],
      },
    ])
    .returning();

  await db
    .insert(dishes)
    .values(newRecipes.map((r) => ({ challengeId: challenge.id, recipeId: r.id })));

  console.log("Seeded");
}

main().finally(() => client.end());
