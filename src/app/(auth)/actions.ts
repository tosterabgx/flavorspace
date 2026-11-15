"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { profiles } from "@/db/schema";
import { db } from "@/index";
import { createClient } from "@/lib/server";

export type AuthState = { error?: string };

export async function signUp(_: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email")).trim();
  const username = String(formData.get("username")).trim().toLowerCase();
  const password = String(formData.get("password"));

  if (username.length < 3 || username.length > 20) {
    return { error: "Username must be 3-20 letters" };
  }

  if (!/^[a-z0-9_]+$/.test(username)) {
    return { error: "Username must contain letter, numbers or _" };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 symbols" };
  }

  const [taken] = await db
    .select({ id: profiles.id })
    .from(profiles)
    .where(eq(profiles.username, username))
    .limit(1);
  if (taken) return { error: "Username is taken" };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error || !data.user) return { error: error?.message ?? "Signup failed" };

  await db.insert(profiles).values({ id: data.user.id, username, displayName: username });
  redirect("/");
}

export async function logIn(_: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(formData.get("email")).trim(),
    password: String(formData.get("password")),
  });
  if (error) return { error: error.message };
  redirect("/");
}

export async function logOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
