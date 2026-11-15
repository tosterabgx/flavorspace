"use client";

import confetti from "canvas-confetti";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

const colors = ["#C8402A", "#F3C24B", "#2F6B4F"];

export default function Confetti() {
  const cooked = useSearchParams().get("cooked");
  const router = useRouter();

  useEffect(() => {
    if (!cooked) return;

    confetti({ particleCount: 80, angle: 60, spread: 45, origin: { x: -0.2, y: 0.7 }, colors });
    confetti({ particleCount: 80, angle: 120, spread: 45, origin: { x: 1.2, y: 0.7 }, colors });

    router.replace("/", { scroll: false });
  }, [cooked, router]);

  return null;
}
