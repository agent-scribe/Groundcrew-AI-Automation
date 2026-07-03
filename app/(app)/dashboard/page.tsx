import Link from "next/link";
import { CalendarDays, BellRing, ArrowUpRight } from "lucide-react";
import { AppTopbar } from "@/components/app-topbar";
import { TimeSavedTicker } from "@/components/time-saved-ticker";
import { StatTile } from "@/components/stat-tile";
import { PipelineBoard } from "@/components/pipeline-board";
import { DEMO_ONBOARDINGS, totalTimeSaved } from "@/lib/demo-data";

export const metadata = { title: "Dashboard" };

export default function DashboardPage() {
  const active = DEMO_ONBOARDINGS.filter(
    (o) => o.stage !== "wheels_up"
  ).length;
  const awaitingClient = DEMO_ONBOARDINGS.filter(
    (o) => o.stage === "in_progress"
  ).length;
  const clearedThisMonth = DEMO_ONBOARDINGS.filter((o) =>
    ["cleared", "in_progress", "wheels_up"].includes(o.stage)
  ).length;
  const kickoffs = DEMO_ONBOARDINGS.filter((o) => o.kickoff).sort((a, b) =>
    a.kickoff! < b.kickoff! ? -1 : 1
  );
  const chasesToday = DEMO_ONBOARDINGS.filter(
    (o) => o.nextChaseDays === 0 || o.nextChaseDays === 1
  ).length;

  return (
    <>
      <AppTopbar title="Dashboard" />
      <main id="main" className="p-6">
        <div className="grid gap-4 lg:grid-cols-4">
          <TimeSavedTicker hours={totalTimeSaved()} />
          <StatTile
            label="Active onboardings"
            value={String(active)}
            sub="of 20 on the Pro plan"
          />
          <StatTile
            label="Awaiting client"
            value={String(awaitingClient)}
            sub="portals with open items"
          />
          <StatTile
            label="Cleared this month"
            value={String(clearedThisMonth)}
            sub="plans approved & pushed"
          />
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_280px]">
          <section aria-label="Pipeline">
            <h2 className="font-display mb-4 text-lg font-semibold">
              Pipeline
            </h2>
            <PipelineBoard />
          </section>

          <aside className="space-y-6">
            <section
              aria-label="Upcoming kickoffs"
              className="rounded-[var(--radius-card)] border border-border bg-surface p-5"
            >
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <CalendarDays size={16} strokeWidth={1.5} aria-hidden />
                Upcoming kickoffs
              </h3>
              <ul className="mt-4 space-y-3">
                {kickoffs.slice(0, 4).map((o) => (
                  <li key={o.id} className="flex items-center justify-between gap-2 text-sm">
                    <Link
                      href={`/onboardings/${o.id}`}
                      className="truncate font-medium hover:underline"
                    >
                      {o.client}
                    </Link>
                    <span className="font-mono text-xs text-text-2" data-mono>
                      {o.kickoff}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section
              aria-label="Chase digest"
              className="rounded-[var(--radius-card)] border border-border bg-surface p-5"
            >
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <BellRing size={16} strokeWidth={1.5} aria-hidden />
                Chase digest
              </h3>
              <p className="mt-3 text-sm text-text-2">
                <span className="font-mono font-semibold text-text" data-mono>
                  {chasesToday}
                </span>{" "}
                reminders scheduled in the next 24h.
              </p>
              <Link
                href="/onboardings"
                className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                View timeline <ArrowUpRight size={14} aria-hidden />
              </Link>
            </section>
          </aside>
        </div>
      </main>
    </>
  );
}
