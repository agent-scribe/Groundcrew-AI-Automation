import { AppTopbar } from "@/components/app-topbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DEMO_ONBOARDINGS } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

export const metadata = { title: "Tower" };

const WEBHOOKS = [
  ["https://hooks.groundcrew.online/webhook", "onboarding.completed · chase.escalated", true],
  ["https://zapier.com/hooks/catch/48812", "portal.item_completed", false],
] as const;

export default function TowerPage() {
  return (
    <>
      <AppTopbar title="Tower" />
      <main id="main" className="space-y-10 p-6">
        <section>
          <h2 className="font-display text-lg font-semibold">Clients</h2>
          <div className="mt-4 overflow-x-auto rounded-[var(--radius-card)] border border-border bg-surface">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-text-2">
                  <th className="px-5 py-3 font-medium">Client</th>
                  <th className="px-5 py-3 font-medium">Health</th>
                  <th className="px-5 py-3 font-medium">Portal visits</th>
                  <th className="px-5 py-3 font-medium">Time saved</th>
                </tr>
              </thead>
              <tbody>
                {DEMO_ONBOARDINGS.filter((o) => o.stage !== "parsing").map((o) => (
                  <tr key={o.id} className="border-b border-border last:border-0">
                    <td className="px-5 py-3 font-medium">{o.client}</td>
                    <td className="px-5 py-3">
                      <span
                        className={cn(
                          "inline-block size-2.5 rounded-full",
                          o.health === "green" && "bg-cleared",
                          o.health === "amber" && "bg-warning",
                          o.health === "red" && "bg-marshal"
                        )}
                      />
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-text-2" data-mono>
                      {(o.id.length * 3) % 14 + 2}
                    </td>
                    <td className="px-5 py-3 font-mono text-xs" data-mono>
                      {o.timeSavedHours > 0 ? `${o.timeSavedHours}h` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold">Branding</h2>
          <div className="mt-4 grid max-w-3xl gap-5 sm:grid-cols-2">
            <div className="rounded-[var(--radius-card)] border border-border bg-surface p-5">
              <label className="block text-sm">
                <span className="font-medium">Portal display name</span>
                <input
                  defaultValue="Northbeam."
                  className="mt-1.5 h-10 w-full rounded-[var(--radius-ctl)] border border-border bg-surface px-3 outline-none focus-visible:border-ring"
                />
              </label>
              <label className="mt-4 block text-sm">
                <span className="font-medium">Brand color</span>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="size-9 rounded-[8px] border border-border bg-primary" />
                  <input
                    defaultValue="#1E3A8A"
                    className="h-10 w-full rounded-[var(--radius-ctl)] border border-border bg-surface px-3 font-mono text-sm outline-none focus-visible:border-ring"
                    data-mono
                  />
                </div>
              </label>
              <label className="mt-4 block text-sm">
                <span className="font-medium">Portal domain</span>
                <div className="mt-1.5 flex gap-2">
                  <input
                    defaultValue="portal.northbeamdigital.com"
                    className="h-10 w-full rounded-[var(--radius-ctl)] border border-border bg-surface px-3 font-mono text-sm outline-none focus-visible:border-ring"
                    data-mono
                  />
                  <Button size="sm" variant="outline" className="h-10 shrink-0">
                    Verify DNS
                  </Button>
                </div>
              </label>
            </div>
            <div className="flex flex-col items-center justify-center rounded-[var(--radius-card)] border border-dashed border-border-strong p-5 text-center">
              <p className="text-sm font-medium">Live portal preview</p>
              <p className="mt-1 text-xs text-text-2">
                Open the client portal with draft branding applied.
              </p>
              <a href="/p/preview-demo" className="mt-4">
                <Button size="sm" variant="outline">Open preview</Button>
              </a>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold">Webhooks</h2>
          <div className="mt-4 max-w-3xl space-y-3">
            {WEBHOOKS.map(([url, events, active]) => (
              <div key={url} className="flex items-center justify-between gap-3 rounded-[var(--radius-item)] border border-border bg-surface px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate font-mono text-sm" data-mono>{url}</p>
                  <p className="mt-0.5 font-mono text-xs text-text-2" data-mono>{events}</p>
                </div>
                {active ? (
                  <Badge variant="cleared">active</Badge>
                ) : (
                  <Badge variant="outline">disabled</Badge>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
