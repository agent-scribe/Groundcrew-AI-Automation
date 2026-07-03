"use client";

import { useState } from "react";
import { Pause, Play, BellRing } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Tone = "sent" | "opened" | "escalated" | "completed";

const EVENTS: { when: string; tone: Tone; subject: string; meta: string }[] = [
  { when: "Jun 27 · 09:02", tone: "sent", subject: "Your Northbeam pre-flight checklist is ready", meta: "Portal invite · delivered" },
  { when: "Jun 27 · 09:41", tone: "opened", subject: "Portal opened — 2 items completed", meta: "Questionnaire + logo pack" },
  { when: "Jun 29 · 10:00", tone: "sent", subject: "Two quick items are still waiting on you", meta: "T+2 gentle reminder · email" },
  { when: "Jul 02 · 10:00", tone: "sent", subject: "Almost cleared — GA4 access still pending", meta: "T+5 firmer reminder · AM cc'd" },
  { when: "Jul 03 · 08:15", tone: "escalated", subject: "Escalated to account manager", meta: "T+8 · Slack DM to @maya" },
];

const TONE_STYLE: Record<Tone, string> = {
  sent: "bg-ink-400",
  opened: "bg-primary",
  escalated: "bg-marshal",
  completed: "bg-cleared",
};

export function ChaseTimeline() {
  const [paused, setPaused] = useState(false);
  return (
    <div className="rounded-[var(--radius-card)] border border-border bg-surface p-5">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <BellRing size={16} strokeWidth={1.5} aria-hidden /> Chase timeline
        </h3>
        <div className="flex items-center gap-2">
          {paused ? (
            <Badge variant="warning">Paused</Badge>
          ) : (
            <Badge variant="cleared">Next: Jul 8 · 10:00</Badge>
          )}
          <Button size="sm" variant="outline" onClick={() => setPaused((p) => !p)}>
            {paused ? (
              <>
                <Play size={14} aria-hidden /> Resume
              </>
            ) : (
              <>
                <Pause size={14} aria-hidden /> Pause
              </>
            )}
          </Button>
        </div>
      </div>
      <ol className="relative ml-1.5 mt-5 space-y-5 border-l border-border pl-6">
        {EVENTS.map((e, i) => (
          <li key={e.when} className="relative">
            <span
              className={cn(
                "absolute -left-[30px] top-1 size-2.5 rounded-full ring-4 ring-surface",
                TONE_STYLE[e.tone],
                e.tone === "escalated" && i === EVENTS.length - 1 && "gc-shake"
              )}
            />
            <p className="font-mono text-[11px] text-text-2" data-mono>
              {e.when}
            </p>
            <p className="mt-0.5 text-sm font-medium">{e.subject}</p>
            <p className="text-xs text-text-2">{e.meta}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
