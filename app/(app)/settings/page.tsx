import { AppTopbar } from "@/components/app-topbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata = { title: "Settings" };

const INTEGRATIONS = [
  { name: "ClickUp", status: "active", scopes: "tasks · lists · spaces", detail: "Workspace: Northbeam HQ" },
  { name: "Asana", status: "expired", scopes: "projects · tasks", detail: "Token expired Jun 30 — reconnect" },
  { name: "Slack", status: "active", scopes: "chat:write · im:write", detail: "#onboarding-alerts + AM DMs" },
  { name: "Google Drive", status: "not_connected", scopes: "asset archive", detail: "Optional asset backup" },
] as const;

export default function SettingsPage() {
  return (
    <>
      <AppTopbar title="Settings" />
      <main id="main" className="space-y-10 p-6">
        <section>
          <h2 className="font-display text-lg font-semibold">Integrations</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {INTEGRATIONS.map((i) => (
              <div
                key={i.name}
                className={cn(
                  "rounded-[var(--radius-card)] border bg-surface p-5 shadow-e1",
                  i.status === "expired" ? "border-warning" : "border-border"
                )}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-base font-semibold">{i.name}</h3>
                  {i.status === "active" && <Badge variant="cleared">active</Badge>}
                  {i.status === "expired" && <Badge variant="warning">expired</Badge>}
                  {i.status === "not_connected" && <Badge variant="outline">not connected</Badge>}
                </div>
                <p className="mt-2 font-mono text-xs text-text-2" data-mono>{i.scopes}</p>
                <p className="mt-1 text-sm text-text-2">{i.detail}</p>
                <div className="mt-4">
                  {i.status === "active" && (
                    <Button size="sm" variant="outline">Health check</Button>
                  )}
                  {i.status === "expired" && <Button size="sm">Reconnect</Button>}
                  {i.status === "not_connected" && (
                    <Button size="sm" variant="outline">Connect</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold">Plan & usage</h2>
          <div className="mt-4 max-w-xl rounded-[var(--radius-card)] border border-border bg-surface p-6" style={{ border: "var(--hairline-brass)" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-display text-base font-semibold">Pro plan</p>
                <p className="text-sm text-text-2">
                  <span className="font-mono" data-mono>$249</span>/mo · renews Aug 1, 2026
                </p>
              </div>
              <Button size="sm" variant="outline">Manage billing</Button>
            </div>
            <div className="mt-5">
              <div className="flex justify-between text-sm">
                <span className="text-text-2">Active onboardings</span>
                <span className="font-mono font-medium" data-mono>5 / 20</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-2">
                <div className="h-full w-1/4 rounded-full bg-primary" />
              </div>
              <p className="mt-2 text-xs text-text-2">
                Overage beyond 20: <span className="font-mono" data-mono>$12</span> per onboarding.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
