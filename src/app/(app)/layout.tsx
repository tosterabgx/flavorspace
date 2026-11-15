import TabBar, { ActiveTabBar } from "@/components/tab-bar";
import { Suspense } from "react";

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <div className="pb-28">{children}</div>
      <Suspense fallback={<TabBar />}>
        <ActiveTabBar />
      </Suspense>
    </>
  );
}
