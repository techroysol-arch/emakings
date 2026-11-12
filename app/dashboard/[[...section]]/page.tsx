import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Workspace } from "@/components/workspace";
export const metadata = {
  title: "Your thoughtful space",
  robots: { index: false, follow: false },
};
export default async function Dashboard({
  params,
}: {
  params: Promise<{ section?: string[] }>;
}) {
  const { section } = await params;
  const selected = section?.[0] || "overview";
  if (
    (section?.length || 0) > 1 ||
    ![
      "overview",
      "people",
      "reminders",
      "ai-assistant",
      "insights",
      "settings",
    ].includes(selected)
  )
    notFound();
  return (
    <Suspense
      fallback={<main className="workspace-loading">Opening your space…</main>}
    >
      <Workspace section={selected} />
    </Suspense>
  );
}
