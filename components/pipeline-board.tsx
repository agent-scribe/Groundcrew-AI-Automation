import Link from "next/link";
import { STAGES, byStage, HEALTH_LABEL, type DemoOnboarding } from "@/lib/demo-data";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * PipelineBoard (Plan 10 §7.5): 5 columns, health dot, days-in-stage (mono),
 * next-chase countdown. Drag disabled — status is system-driven; cards link.
 */
function HealthDot({ health }: { health: DemoOnboarding["health"] }) {
  return (
    <span
      title={HEALTH_LABEL[health]}
      aria-label={`Health: ${HEALTH_LABEL[health]}`}
      className={cn(
        "size-2.5 shrink-0 rounded-full",
        health === "green" && "bg-cleared",
        health === "amber" && "bg-warning",
        health === "red" && "bg-marshal"
      )}
    />
  );
}

function OnboardingCard({ o }: { o: DemoOnboarding }) {
  const href =
    o.stage === "review"
      ? `/onboardings/${o.id}/review`
      : `/onboardings/${o.id}`;
  return (
    <Link
      href={href}
      className="block rounded-[var(--radius-item)] border border-border bg-surface p-3.5 shadow-e1 transition-shadow duration-[140ms] hover:shadow-e2"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-sm font-semibold">{o.client}</p>
        <HealthDot health={o.health} />
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {o.services.map((s) => (
          <Badge key={s} variant="outline" className="text-[10.5px]">
            {s}
          </Badge>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between font-mono text-[11px] text-text-2" data-mono>
        <span>
          {o.daysInStage}d in stage
        </span>
        {o.nextChaseDays !== null && (
          <span className={o.nextChaseDays === 0 ? "font-semibold text-marshal" : ""}>
            chase {o.nextChaseDays === 0 ? "today" : `in ${o.nextChaseDays}d`}
          </span>
        )}
      </div>
    </Link>
  );
}

export function PipelineBoard() {
  return (
    <div className="overflow-x-auto pb-2">
      <div className="grid min-w-[900px] grid-cols-5 gap-4">
        {STAGES.map((stage) => {
          const cards = byStage(stage.key);
          return (
            <section key={stage.key} aria-label={stage.label}>
              <header className="mb-3 flex items-center justify-between px-1">
                <h3 className="text-[13px] font-semibold text-text">
                  {stage.label}
                </h3>
                <span className="font-mono text-xs text-text-2" data-mono>
                  {cards.length}
                </span>
              </header>
              <div className="space-y-3 rounded-[var(--radius-card)] bg-surface-2/60 p-2.5 min-h-28">
                {cards.length === 0 ? (
                  <p className="px-2 py-6 text-center text-xs text-text-2">
                    Empty
                  </p>
                ) : (
                  cards.map((o) => <OnboardingCard key={o.id} o={o} />)
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
