import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/** Pricing (PRD F8): starter $99 / pro $249 / scale $599; Pro brass-hairlined. */
const TIERS = [
  {
    name: "Starter",
    price: 99,
    blurb: "For boutique agencies getting their nights back.",
    features: [
      "5 active onboardings",
      "3 team seats",
      "ClickUp & Asana push",
      "Client portals + chase engine",
      "Email support",
    ],
    cta: "Start 14-day trial",
    popular: false,
  },
  {
    name: "Pro",
    price: 249,
    blurb: "For agencies onboarding every week.",
    features: [
      "20 active onboardings",
      "10 team seats",
      "White-label portal domain",
      "Slack escalations",
      "Priority support",
    ],
    cta: "Start 14-day trial",
    popular: true,
  },
  {
    name: "Scale",
    price: 599,
    blurb: "For high-volume teams and networks.",
    features: [
      "Unlimited onboardings",
      "Unlimited seats",
      "API + outbound webhooks",
      "Priority parse queue",
      "Dedicated support",
    ],
    cta: "Start 14-day trial",
    popular: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-24 py-24">
      <div className="text-center">
        <h2 className="font-display text-4xl font-semibold">
          One clean kickoff pays for the year.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-text-2">
          14-day trial on every plan. Overage at $12 per extra onboarding.
          Annual = 2 months free.
        </p>
      </div>
      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className="relative flex flex-col rounded-[var(--radius-card)] border border-border bg-surface p-7 shadow-e1"
            style={
              tier.popular
                ? { border: "var(--hairline-brass)", boxShadow: "var(--shadow-e2)" }
                : undefined
            }
          >
            {tier.popular && (
              <Badge variant="brass" className="absolute -top-3 left-6 bg-surface">
                Most popular
              </Badge>
            )}
            <h3 className="font-display text-xl font-semibold">{tier.name}</h3>
            <p className="mt-1 text-sm text-text-2">{tier.blurb}</p>
            <p className="mt-5">
              <span className="font-mono text-4xl font-semibold" data-mono>
                ${tier.price}
              </span>
              <span className="text-sm text-text-2"> /month</span>
            </p>
            <ul className="mt-6 flex-1 space-y-2.5 text-sm">
              {tier.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <Check
                    size={16}
                    strokeWidth={2.5}
                    className="mt-0.5 shrink-0 text-cleared"
                    aria-hidden
                  />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/dashboard" className="mt-7 block">
              <Button
                variant={tier.popular ? "primary" : "outline"}
                className="w-full"
              >
                {tier.cta}
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

const FAQS = [
  {
    q: "Our SOWs are messy — half of them are exported from Google Docs.",
    a: "That's the point. Groundcrew's two-pass extraction grounds every item against the source with page-level citations, and anything it can't verify lands in a Needs-review tray for a human decision. Nothing pushes to ClickUp or Asana without your explicit approval.",
  },
  {
    q: "We already have task templates for each service.",
    a: "Keep them. Groundcrew matches extracted services to your templates by similarity and suggests merges per deliverable — you accept or reject each one. It merges, it doesn't replace.",
  },
  {
    q: "Our clients won't log into another tool.",
    a: "They never make an account. Clients tap a magic link, land on your branded portal, and check items off. No passwords, no signups — completion rates stay high because friction stays low.",
  },
  {
    q: "What happens when a client goes quiet?",
    a: "The chase engine sends a gentle reminder at day 2, a firmer one at day 5, and escalates to the account manager via Slack at day 8 — with quiet hours, weekend skip, and per-item snooze. The crew never forgets a follow-up.",
  },
  {
    q: "Which tools do you push to?",
    a: "ClickUp and Asana at launch, with idempotent re-sync (edit the plan, push the diff — no duplicates) and 24-hour rollback. Monday and Jira are on the roadmap.",
  },
];

export function Faq() {
  return (
    <section className="mx-auto max-w-3xl py-24">
      <h2 className="font-display text-center text-4xl font-semibold">
        Fair questions.
      </h2>
      <div className="mt-12 space-y-3">
        {FAQS.map((f) => (
          <details
            key={f.q}
            className="group rounded-[var(--radius-item)] border border-border bg-surface px-5 py-4"
          >
            <summary className="cursor-pointer list-none text-[15px] font-medium marker:hidden">
              {f.q}
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-text-2">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
