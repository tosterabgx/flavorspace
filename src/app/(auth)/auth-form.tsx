"use client";
import { useActionState } from "react";
import { logIn, signUp } from "./actions";
import Logo from "@/components/logo";
import Link from "next/link";

const input =
  "h-12 w-full rounded-xl bg-surface px-4 font-normal text-ink outline-none focus:ring-2 focus:ring-tomato";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const isSignup = mode === "signup";
  const [state, action, pending] = useActionState(isSignup ? signUp : logIn, {});

  return (
    <div className="flex min-h-dvh flex-col px-5 pt-14 pb-8">
      <Logo />

      <h1 className="my-8 font-display text-4xl font-bold tracking-tight">
        {isSignup ? "Create account" : "Welcome back"}
      </h1>

      <form action={action} className="flex flex-col gap-4">
        {isSignup && (
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Username
            <input name="username" required autoComplete="username" className={input} />
          </label>
        )}
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Email
          <input name="email" type="email" required autoComplete="email" className={input} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
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

        {state.error && (
          <p className="rounded-xl bg-tomato/10 px-4 py-3 text-sm text-tomato">{state.error}</p>
        )}

        <button
          disabled={pending}
          className="mt-2 h-12 rounded-xl bg-tomato font-semibold text-white disabled:opacity-60"
        >
          {pending ? "..." : isSignup ? "Sign up" : "Log in"}
        </button>

        <p className="text-center text-sm text-muted">
          {isSignup ? "Have an account? " : "New here? "}
          <Link href={isSignup ? "/login" : "/signup"} className="font-semibold text-tomato">
            {isSignup ? "Log in" : "Sign up"}
          </Link>
        </p>
      </form>
    </div>
  );
}
