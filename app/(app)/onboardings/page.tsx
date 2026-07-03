import Link from "next/link";
import { AppTopbar } from "@/components/app-topbar";
import { Badge } from "@/components/ui/badge";
import { DEMO_ONBOARDINGS, STAGES, HEALTH_LABEL } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

export const metadata = { title: "Onboardings" };

export default function OnboardingsPage() {
  return (
    <>
      <AppTopbar title="Onboardings" />
      <main id="main" className="p-6">
        <div className="overflow-x-auto rounded-[var(--radius-card)] border border-border bg-surface">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-text-2">
                <th className="px-5 py-3 font-medium">Client</th>
                <th className="px-5 py-3 font-medium">Services</th>
                <th className="px-5 py-3 font-medium">Stage</th>
                <th className="px-5 py-3 font-medium">Health</th>
                <th className="px-5 py-3 font-medium">Verified</th>
                <th className="px-5 py-3 font-medium">Kickoff</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_ONBOARDINGS.map((o) => (
                <tr key={o.id} className="border-b border-border last:border-0 hover:bg-surface-2/50">
                  <td className="px-5 py-3.5">
                    <Link
                      href={
                        o.stage === "review"
                          ? `/onboardings/${o.id}/review`
                          : `/onboardings/${o.id}`
                      }
                      className="font-medium hover:underline"
                    >
                      {o.client}
                    </Link>
                  </td>
                  <td className="px-5 py-3.5 text-text-2">
                    {o.services.join(", ")}
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge variant={o.stage === "wheels_up" ? "cleared" : "default"}>
                      {STAGES.find((s) => s.key === o.stage)?.label}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center gap-2">
                      <span
                        className={cn(
                          "size-2.5 rounded-full",
                          o.health === "green" && "bg-cleared",
                          o.health === "amber" && "bg-warning",
                          o.health === "red" && "bg-marshal"
                        )}
                      />
                      <span className="text-text-2">{HEALTH_LABEL[o.health]}</span>
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs" data-mono>
                    {o.verifiedPct > 0 ? `${o.verifiedPct}%` : "—"}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-text-2" data-mono>
                    {o.kickoff ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
