import TabBar from "@/components/tab-bar";

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <div className="pb-28">{children}</div>
      <TabBar />
    </>
  );
}
