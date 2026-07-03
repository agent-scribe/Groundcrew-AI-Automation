"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, CircleAlert, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChaseTimeline } from "@/components/onboarding/chase-timeline";
import { DELIVERABLES, MILESTONES, CITATIONS } from "@/lib/review-fixture";
import { cn } from "@/lib/utils";
import type { DemoOnboarding } from "@/lib/demo-data";

const TABS = ["Manifest", "Preflight", "Chase", "Activity"] as const;
type Tab = (typeof TABS)[number];

const PORTAL_STATUS = [
  { title: "Brand questionnaire", status: "verified" },
  { title: "Logo pack upload", status: "submitted" },
  { title: "GA4 access grant", status: "pending" },
  { title: "Search Console access", status: "pending" },
  { title: "Kickoff call", status: "verified" },
] as const;

const ACTIVITY = [
  ["Jul 03 · 08:15", "Chase escalated to @maya (Slack)"],
  ["Jul 02 · 10:00", "T+5 reminder sent to dana@acmeoutdoor.com"],
  ["Jun 28 · 16:20", "Logo pack uploaded (3 files) — awaiting verification"],
  ["Jun 27 · 11:03", "Plan approved by Saad B. — pushed to ClickUp (6 deliverables)"],
  ["Jun 27 · 09:02", "Portal sent to client"],
  ["Jun 26 · 14:47", "SOW parsed — 23 items, 91.3% verified"],
] as const;

export function DetailTabs({ onboarding }: { onboarding: DemoOnboarding }) {
  const [tab, setTab] = useState<Tab>("Manifest");
  return (
    <div>
      <div role="tablist" aria-label="Onboarding detail" className="flex gap-1 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={cn(
              "-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
              tab === t
                ? "border-primary text-text"
                : "border-transparent text-text-2 hover:text-text"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="pt-6">
        {tab === "Manifest" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-text-2">
                Read-only snapshot · approved Jun 27 ·{" "}
                <span className="font-mono" data-mono>v1</span>
              </p>
              <Link href={`/onboardings/${onboarding.id}/review`}>
                <Button size="sm" variant="outline">
                  Open in review <ExternalLink size={13} aria-hidden />
                </Button>
              </Link>
            </div>
            <ul className="space-y-2.5">
              {DELIVERABLES.map((d) => (
                <li
                  key={d.id}
                  className="flex items-center justify-between gap-3 rounded-[var(--radius-item)] border border-border bg-surface px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{d.title}</p>
                    <p className="text-xs text-text-2">{d.tasks.length} tasks</p>
                  </div>
                  {d.citeId && CITATIONS[d.citeId].confidence === "verified" ? (
                    <Badge variant="cleared">
                      <Check size={11} strokeWidth={3} aria-hidden /> verified
                    </Badge>
                  ) : (
                    <Badge variant="outline">waived</Badge>
                  )}
                </li>
              ))}
            </ul>
            <div>
              <h4 className="text-sm font-semibold">Milestones</h4>
              <ul className="mt-2 space-y-2">
                {MILESTONES.map((m) => (
                  <li key={m.id} className="flex justify-between rounded-[var(--radius-item)] border border-border bg-surface px-4 py-2.5 text-sm">
                    <span>{m.title}</span>
                    <span className="font-mono text-xs text-text-2" data-mono>{m.due}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {tab === "Preflight" && (
          <ul className="space-y-2.5">
            {PORTAL_STATUS.map((p) => (
              <li
                key={p.title}
                className="flex items-center justify-between gap-3 rounded-[var(--radius-item)] border border-border bg-surface px-4 py-3"
              >
                <p className="text-sm font-medium">{p.title}</p>
                <div className="flex items-center gap-2">
                  {p.status === "verified" && (
                    <Badge variant="cleared">
                      <Check size={11} strokeWidth={3} aria-hidden /> verified
                    </Badge>
                  )}
                  {p.status === "submitted" && (
                    <>
                      <Badge variant="navy">submitted</Badge>
                      <Button size="sm" variant="outline">Verify</Button>
                    </>
                  )}
                  {p.status === "pending" && (
                    <Badge variant="warning">
                      <CircleAlert size={11} aria-hidden /> pending
                    </Badge>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        {tab === "Chase" && <ChaseTimeline />}

        {tab === "Activity" && (
          <ol className="relative ml-1.5 space-y-4 border-l border-border pl-6">
            {ACTIVITY.map(([when, what]) => (
              <li key={when} className="relative">
                <span className="absolute -left-[30px] top-1.5 size-2 rounded-full bg-ink-400 ring-4 ring-bg" />
                <p className="font-mono text-[11px] text-text-2" data-mono>{when}</p>
                <p className="text-sm">{what}</p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
