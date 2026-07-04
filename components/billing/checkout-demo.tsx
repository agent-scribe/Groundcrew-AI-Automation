"use client";

import { useState } from "react";
import { Check, CreditCard, Lock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Mark } from "@/components/logo";

const PLANS = [
  {
    id: "pro",
    name: "Pro",
    price: "$149",
    period: "/mo",
    description: "For growing agencies",
    features: [
      "Unlimited SOW extractions",
      "Asana + ClickUp push",
      "Branded client portal",
      "Chase automation (3-tier)",
      "Email support",
    ],
    cta: "Start Pro",
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For teams at scale",
    features: [
      "Everything in Pro",
      "Custom integrations",
      "SSO / SAML",
      "Dedicated success manager",
      "SLA & priority support",
    ],
    cta: "Contact sales",
    popular: false,
  },
];

export function CheckoutDemo() {
  const [selected, setSelected] = useState("pro");
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="flex max-w-md flex-col items-center text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-cleared/10 text-cleared">
          <Check size={32} strokeWidth={2.5} />
        </span>
        <h2 className="font-display mt-6 text-2xl font-semibold">
          You&rsquo;re all set!
        </h2>
        <p className="mt-3 text-text-2">
          This is a demo checkout. In production, Stripe processes the payment
          and activates your plan instantly.
        </p>
        <Button
          size="lg"
          className="mt-8"
          onClick={() => {
            setSubmitted(false);
            setShowForm(false);
          }}
        >
          Back to plans
        </Button>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="w-full max-w-md">
        <button
          type="button"
          onClick={() => setShowForm(false)}
          className="mb-6 text-sm text-text-2 hover:text-text"
        >
          ← Back to plans
        </button>

        <div className="rounded-[var(--radius-card)] border border-border bg-surface p-6">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-ink-950 text-cleared">
              <Mark size={20} />
            </span>
            <div>
              <p className="font-medium">Groundcrew {selected === "pro" ? "Pro" : "Enterprise"}</p>
              <p className="text-sm text-text-2">
                {selected === "pro" ? "$149/month" : "Custom pricing"}
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <label className="block text-sm">
              <span className="font-medium">Email</span>
              <input
                type="email"
                placeholder="you@company.com"
                className="mt-1.5 h-10 w-full rounded-[var(--radius-ctl)] border border-border bg-bg px-3 outline-none focus-visible:border-ring"
              />
            </label>

            <label className="block text-sm">
              <span className="font-medium">Card number</span>
              <div className="relative mt-1.5">
                <input
                  placeholder="4242 4242 4242 4242"
                  className="h-10 w-full rounded-[var(--radius-ctl)] border border-border bg-bg pl-3 pr-10 outline-none focus-visible:border-ring"
                />
                <CreditCard
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-2"
                />
              </div>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm">
                <span className="font-medium">Expiry</span>
                <input
                  placeholder="MM / YY"
                  className="mt-1.5 h-10 w-full rounded-[var(--radius-ctl)] border border-border bg-bg px-3 outline-none focus-visible:border-ring"
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium">CVC</span>
                <input
                  placeholder="123"
                  className="mt-1.5 h-10 w-full rounded-[var(--radius-ctl)] border border-border bg-bg px-3 outline-none focus-visible:border-ring"
                />
              </label>
            </div>
          </div>

          <Button
            size="lg"
            className="mt-6 w-full"
            onClick={() => setSubmitted(true)}
          >
            <Lock size={14} className="mr-2" />
            {selected === "pro" ? "Subscribe — $149/mo" : "Contact for pricing"}
          </Button>

          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-text-2">
            <Lock size={12} />
            <span>Demo mode — no charges. Stripe integration ready for production.</span>
          </div>
        </div>

        <div className="mt-4 rounded-[var(--radius-card)] border border-dashed border-primary/30 bg-primary/5 p-4 text-sm text-text-2">
          <p className="font-medium text-text">
            <Zap size={14} className="mr-1 inline text-primary" />
            Stripe integration ready
          </p>
          <p className="mt-1">
            This checkout form is a demo. To activate live billing, add your
            Stripe publishable and secret keys to the environment variables.
            Groundcrew uses Stripe Checkout for PCI-compliant payment processing.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl">
      <div className="text-center">
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">
          Choose your plan
        </h1>
        <p className="mt-3 text-text-2">
          Start free, upgrade when you&rsquo;re ready.
        </p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            onClick={() => setSelected(plan.id)}
            className={
              "relative cursor-pointer rounded-[var(--radius-card)] border p-6 transition-all duration-[140ms] " +
              (selected === plan.id
                ? "border-primary bg-surface shadow-sm"
                : "border-border bg-surface hover:border-border-strong")
            }
          >
            {plan.popular && (
              <span className="absolute -top-3 left-4 rounded-full bg-primary px-3 py-0.5 text-xs font-medium text-primary-fg">
                Most popular
              </span>
            )}
            <h3 className="font-display text-xl font-semibold">{plan.name}</h3>
            <p className="mt-1 text-sm text-text-2">{plan.description}</p>
            <p className="mt-4">
              <span className="text-3xl font-bold">{plan.price}</span>
              <span className="text-text-2">{plan.period}</span>
            </p>
            <ul className="mt-6 space-y-2.5">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <Check size={16} className="shrink-0 text-cleared" />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              size="lg"
              className="mt-6 w-full"
              variant={selected === plan.id ? "primary" : "outline"}
              onClick={(e) => {
                e.stopPropagation();
                setSelected(plan.id);
                setShowForm(true);
              }}
            >
              {plan.cta}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
