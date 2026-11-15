"use server";

import { cookLogs } from "@/db/schema";
import { db } from "@/index";
import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";

export async function madeIt(recipeId: number) {
  const supabase = await createClient();
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) redirect("/login");

  await db.insert(cookLogs).values({ userId: user.id, recipeId });
  redirect("/?cooked=1");
}
