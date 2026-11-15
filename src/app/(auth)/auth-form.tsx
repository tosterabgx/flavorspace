"use client";
import { useActionState } from "react";
import { logIn, signUp } from "./actions";
import Logo from "@/components/logo";
import Link from "next/link";

const input =
  "w-full rounded-xl bg-surface px-4 py-3 text-ink outline-none focus:ring-2 focus:ring-tomato";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const isSignup = mode === "signup";
  const [state, action, pending] = useActionState(isSignup ? signUp : logIn, {});

  return (
    <form action={action} className="flex flex-col gap-3 pt-10">
      <Logo />
      <h1 className="mb-4 font-display text-3xl font-bold text-ink">
        {isSignup ? "Create account" : "Welcome back"}
      </h1>

      {isSignup && (
        <label className="flex flex-col gap-1 text-sm text-muted">
          Username
          <input name="username" required autoComplete="username" className={input} />
        </label>
      )}
      <label className="flex flex-col gap-1 text-sm text-muted">
        Email
        <input name="email" type="email" required autoComplete="email" className={input} />
      </label>
      <label className="flex flex-col gap-1 text-sm text-muted">
        Password
        <input
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete="password"
          className={input}
        />
      </label>

      {state.error && <p className="text-sm text-tomato">{state.error}</p>}

      <button
        disabled={pending}
        className="mt-2 rounded-xl bg-tomato py-3 font-semibold text-white disabled:opacity-60"
      >
        {pending ? "..." : isSignup ? "Sign up" : "Log in"}
      </button>

      <Link href={isSignup ? "/login" : "/signup"} className="text-center text-sm text-muted">
        {isSignup ? "Have an account? Log in" : "New here? Sign up"}
      </Link>
    </form>
  );
}
