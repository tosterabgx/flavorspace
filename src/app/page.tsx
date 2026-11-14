"use client";

import Logo from "@/components/logo";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [recipe, setRecipe] = useState("Shakshuka");

  return (
    <main>
      <Logo />

      <input type="text" value={recipe} onChange={(e) => setRecipe(e.target.value)} />
      <br />
      <Link href={`/recipe/${recipe}`}>{recipe}</Link>
    </main>
  );
}
