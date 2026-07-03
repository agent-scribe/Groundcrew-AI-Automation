import { AppTopbar } from "@/components/app-topbar";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Templates" };

const SERVICE_TEMPLATES = [
  ["SEO Retainer", 14, "audit → strategy → content → links"],
  ["PPC Launch", 11, "account setup → tracking → campaigns"],
  ["Web Design & Dev", 22, "discovery → design → build → QA"],
  ["Social Media", 9, "voice → calendar → production"],
  ["Branding", 12, "research → identity → guidelines"],
  ["Email Marketing", 8, "ESP setup → flows → broadcasts"],
] as const;

const QUESTIONNAIRES = [
  ["Brand discovery", 12],
  ["Technical intake", 8],
  ["Access & accounts", 6],
] as const;

const SEQUENCES = [
  ["Default chase", "T+2 gentle → T+5 firm → T+8 Slack escalate"],
  ["Gentle-only", "T+3 → T+7 · no escalation"],
  ["Aggressive", "T+1 → T+3 → T+5 escalate · for deadline crunches"],
] as const;

export default function TemplatesPage() {
  return (
    <>
      <AppTopbar title="Templates" />
      <main id="main" className="space-y-10 p-6">
        <section>
          <h2 className="font-display text-lg font-semibold">Service templates</h2>
          <p className="mt-1 text-sm text-text-2">
            Auto-matched to extracted services by similarity — suggested as merges in review.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {SERVICE_TEMPLATES.map(([name, count, flow]) => (
              <div key={name} className="rounded-[var(--radius-card)] border border-border bg-surface p-5 shadow-e1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{name}</h3>
                  <Badge variant="outline">
                    <span className="font-mono" data-mono>{count}</span>&nbsp;tasks
                  </Badge>
                </div>
                <p className="mt-2 font-mono text-xs text-text-2" data-mono>{flow}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold">Questionnaire templates</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {QUESTIONNAIRES.map(([name, fields]) => (
              <div key={name} className="rounded-[var(--radius-card)] border border-border bg-surface p-5">
                <h3 className="font-medium">{name}</h3>
                <p className="mt-1 text-sm text-text-2">
                  <span className="font-mono" data-mono>{fields}</span> fields
                </p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold">Chase sequences</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {SEQUENCES.map(([name, desc]) => (
              <div key={name} className="rounded-[var(--radius-card)] border border-border bg-surface p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{name}</h3>
                  {name === "Default chase" && <Badge variant="cleared">default</Badge>}
                </div>
                <p className="mt-2 font-mono text-xs text-text-2" data-mono>{desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
