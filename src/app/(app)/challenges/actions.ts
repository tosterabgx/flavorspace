"use server";

import { challengeMembers } from "@/db/schema";
import { db } from "@/index";
import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";

export async function joinChallenge(challengeId: number) {
  const supabase = await createClient();
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) redirect("/login");

  await db.insert(challengeMembers).values({ userId: user.id, challengeId }).onConflictDoNothing();
  redirect("/");
}
