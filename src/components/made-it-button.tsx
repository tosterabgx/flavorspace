"use client";
import { useFormStatus } from "react-dom";

export default function MadeItButton() {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      className="h-12 w-full rounded-xl bg-tomato font-semibold text-white hover:cursor-pointer disabled:opacity-60"
    >
      {pending ? "Saving..." : "I made it"}
    </button>
  );
}
