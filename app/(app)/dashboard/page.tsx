import { AppTopbar } from "@/components/app-topbar";

export const metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <>
      <AppTopbar title="Dashboard" />
      <main id="main" className="p-6">
        <p className="text-sm text-text-2">
          Dashboard lands in Phase 3 — PipelineBoard, TimeSavedTicker, stat
          tiles.
        </p>
      </main>
    </>
  );
}
