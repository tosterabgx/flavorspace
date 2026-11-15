import {
  pgTable,
  timestamp,
  uuid,
  text,
  integer,
  primaryKey,
  boolean,
  index,
  pgEnum,
} from "drizzle-orm/pg-core";
import { authUsers } from "drizzle-orm/supabase";

const createdAt = () => timestamp({ withTimezone: true }).notNull().defaultNow();

export const dishLevel = pgEnum("dish_level", ["easy", "medium", "hard"]);

export const profiles = pgTable("profiles", {
  id: uuid()
    .primaryKey()
    .references(() => authUsers.id, { onDelete: "cascade" }),
  username: text().notNull().unique(),
  displayName: text(),
  avatarUrl: text(),
  createdAt: createdAt(),
});

export const recipes = pgTable("recipes", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  slug: text().notNull().unique(),
  name: text().notNull(),
  country: text(),
  description: text(),
  minutes: integer(),
  level: dishLevel(),
  serves: integer(),
  ingredients: text().array().notNull(),
  steps: text().array().notNull(),
  imageUrl: text(),
});

export const challenges = pgTable("challenges", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  slug: text().notNull().unique(),
  title: text().notNull(),
  description: text().notNull(),
  isPublished: boolean().notNull().default(true),
  createdAt: createdAt(),
});

export const dishes = pgTable("dishes", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  challengeId: integer()
    .notNull()
    .references(() => challenges.id, { onDelete: "cascade" }),
  recipeId: integer()
    .notNull()
    .references(() => recipes.id, { onDelete: "cascade" }),
});

export const challengeMembers = pgTable(
  "challenge_members",
  {
    userId: uuid()
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    challengeId: integer()
      .notNull()
      .references(() => challenges.id, { onDelete: "cascade" }),
    joinedAt: createdAt(),
    completedAt: timestamp({ withTimezone: true }),
  },
  (t) => [primaryKey({ columns: [t.userId, t.challengeId] }), index().on(t.challengeId)],
);
