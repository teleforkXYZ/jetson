import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/header";
import { Machine } from "@/components/machine";

export const Route = createFileRoute("/bus")({ component: BusPage });

function BusPage() {
  return (
    <main className="min-h-dvh bg-sun text-ink">
      <SiteHeader />
      <Machine />
    </main>
  );
}
