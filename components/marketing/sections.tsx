import { FileText, Wand2, Send, Check, BellRing } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function LogoStrip() {
  const names = ["ClickUp", "Asana", "Slack", "Google", "Stripe", "Resend"];
  return (
    <section className="border-y border-border bg-surface py-8">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <p className="text-center text-xs font-medium uppercase tracking-widest text-text-2">
          Plays nicely with the tools you run on
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
          {names.map((n) => (
            <span
              key={n}
              className="font-display text-lg font-semibold text-ink-400"
            >
              {n}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  {
    icon: FileText,
    kicker: "01 · Manifest",
    title: "Upload the signed SOW",
    body: "PDF or DOCX, drag-drop or forward by email. Groundcrew reads every page and extracts deliverables, milestones, budgets, and stakeholders — each with a page-level citation you can click.",
  },
  {
    icon: Wand2,
    kicker: "02 · Clear",
    title: "Review, then approve",
    body: "A split view: document left, extracted plan right. Verified items wear the green check; anything inferred waits in a Needs-review tray. Nothing moves until you say cleared for takeoff.",
  },
  {
    icon: Send,
    kicker: "03 · Chase",
    title: "Push, portal, and chase",
    body: "One click builds the project in ClickUp or Asana, spins up a branded client portal, and starts chasing missing assets automatically until onboarding is done.",
  },
];

export function HowItWorks() {
  return (
    <section id="product" className="scroll-mt-24 py-24">
      <h2 className="font-display text-center text-4xl font-semibold">
        Three steps between signed and started.
      </h2>
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {STEPS.map((s) => (
          <div
            key={s.kicker}
            className="rounded-[var(--radius-card)] border border-border bg-surface p-7 shadow-e1"
          >
            <div className="flex size-11 items-center justify-center rounded-[var(--radius-ctl)] bg-surface-2 text-primary">
              <s.icon size={22} strokeWidth={1.5} aria-hidden />
            </div>
            <p className="mt-5 font-mono text-xs font-medium uppercase tracking-wide text-text-2" data-mono>
              {s.kicker}
            </p>
            <h3 className="mt-1.5 font-display text-xl font-semibold">
              {s.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-text-2">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const PORTAL_ITEMS = [
  { label: "Brand questionnaire", done: true },
  { label: "Logo pack upload", done: true },
  { label: "GA4 access grant", done: true },
  { label: "Ad account access", done: false },
  { label: "Kickoff call scheduled", done: false },
];

export function PortalSection() {
  return (
    <section className="py-24">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <Badge variant="cleared" className="mb-4">Client portal</Badge>
          <h2 className="font-display text-4xl font-semibold">
            Your clients never make an account. They just tap a link.
          </h2>
          <p className="mt-5 max-w-lg leading-relaxed text-text-2">
            Every onboarding ships with a branded portal — kickoff checklist,
            intake questionnaire, asset uploads, and step-by-step access-grant
            instructions for GA4, Meta, Search Console and more. Magic-link
            sign-in, mobile-perfect, your logo on top.
          </p>
        </div>
        {/* Phone mockup */}
        <div className="mx-auto w-full max-w-[300px]">
          <div className="rounded-[36px] border-4 border-ink-900 bg-surface p-4 shadow-e3">
            <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-ink-300" />
            <p className="font-display text-sm font-semibold">
              Acme Co × Northbeam
            </p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
              <div className="h-full w-3/5 rounded-full bg-cleared" />
            </div>
            <p className="mt-1 font-mono text-[10px] text-text-2" data-mono>
              3 of 5 complete
            </p>
            <ul className="mt-4 space-y-2">
              {PORTAL_ITEMS.map((item) => (
                <li
                  key={item.label}
                  className="flex items-center gap-2.5 rounded-[var(--radius-item)] border border-border px-3 py-2.5 text-[12px]"
                >
                  <span
                    className={
                      "flex size-5 items-center justify-center rounded-full " +
                      (item.done
                        ? "bg-cleared text-white"
                        : "border-2 border-border-strong")
                    }
                  >
                    {item.done && <Check size={11} strokeWidth={3} aria-hidden />}
                  </span>
                  <span className={item.done ? "text-text-2 line-through" : ""}>
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

const CHASE_EVENTS = [
  { day: "Day 0", text: "Portal sent to client", tone: "ink" },
  { day: "Day 2", text: "Gentle reminder — “2 items waiting”", tone: "ink" },
  { day: "Day 5", text: "Firmer nudge, AM cc'd", tone: "ink" },
  { day: "Day 8", text: "Slack escalation to account manager", tone: "marshal" },
  { day: "Day 9", text: "Client completes access grants", tone: "cleared" },
];

export function ChaseSection() {
  return (
    <section className="py-24">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="order-2 lg:order-1">
          <ol className="relative ml-3 space-y-6 border-l border-border pl-8">
            {CHASE_EVENTS.map((e) => (
              <li key={e.day} className="relative">
                <span
                  className={
                    "absolute -left-[38.5px] top-1 size-3 rounded-full ring-4 ring-bg " +
                    (e.tone === "marshal"
                      ? "bg-marshal"
                      : e.tone === "cleared"
                        ? "bg-cleared"
                        : "bg-ink-400")
                  }
                />
                <p className="font-mono text-xs text-text-2" data-mono>
                  {e.day}
                </p>
                <p className="mt-0.5 text-[15px] font-medium">{e.text}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="order-1 lg:order-2">
          <Badge variant="marshal" className="mb-4">
            <BellRing size={12} strokeWidth={2} aria-hidden /> Chase engine
          </Badge>
          <h2 className="font-display text-4xl font-semibold">
            The crew never forgets a follow-up.
          </h2>
          <p className="mt-5 max-w-lg leading-relaxed text-text-2">
            Outstanding items get chased on your schedule — gentle at day 2,
            firmer at day 5, Slack escalation at day 8. Quiet hours respected,
            weekends skipped, every send logged to the timeline. Pause any
            item with one click.
          </p>
        </div>
      </div>
    </section>
  );
}

const INTEGRATIONS = [
  ["ClickUp", "Projects, lists, custom fields, assignees"],
  ["Asana", "Projects, sections, tasks, owners"],
  ["Slack", "Escalations + event notifications"],
  ["Resend", "Branded portal + chase emails"],
  ["Stripe", "Billing, trials, overage"],
  ["Webhooks", "HMAC-signed event stream"],
] as const;

export function IntegrationsGrid() {
  return (
    <section id="integrations" className="scroll-mt-24 py-24">
      <h2 className="font-display text-center text-4xl font-semibold">
        Pushes where your team already works.
      </h2>
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {INTEGRATIONS.map(([name, desc]) => (
          <div
            key={name}
            className="rounded-[var(--radius-card)] border border-border bg-surface p-6"
          >
            <p className="font-display text-lg font-semibold">{name}</p>
            <p className="mt-1 text-sm text-text-2">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
