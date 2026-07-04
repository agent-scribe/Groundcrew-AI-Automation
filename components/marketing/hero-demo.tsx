"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCcw, FileText, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

/**
 * Interactive sample-SOW demo (G8): pre-baked extraction steps replayed
 * with timed reveals — deterministic, instant, free. No live LLM.
 */
const ITEMS = [
  { t: "Technical SEO audit — 47 checkpoints", pg: 3, verified: true },
  { t: "Keyword strategy: 120 target terms", pg: 4, verified: true },
  { t: "Content: 8 briefs / month", pg: 5, verified: true },
  { t: "Link outreach — DR 40+ placements", pg: 7, verified: true },
  { t: "Monthly reporting dashboard", pg: 9, verified: false },
  { t: "Kickoff milestone — within 2 weeks", pg: 2, verified: true },
];

const STAGES = [
  "Reading manifest… 12 pages",
  "Extracting deliverables… 6 found",
  "Verifying citations… 5/6 grounded",
  "Manifest ready for review",
];

export function HeroDemo() {
  const [step, setStep] = useState(0);
  const [stage, setStage] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const play = () => {
    setStep(0);
    setStage(0);
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => {
      setStep((s) => {
        const next = s + 1;
        setStage(Math.min(Math.floor(next / 2), STAGES.length - 1));
        if (next >= ITEMS.length) {
          setStage(STAGES.length - 1);
          if (timer.current) clearInterval(timer.current);
        }
        return next;
      });
    }, 900);
  };

  useEffect(() => {
    play();
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const done = step >= ITEMS.length;

  return (
    <div className="w-full max-w-xl rounded-[var(--radius-card)] border border-border bg-surface shadow-e3">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-ink-300" />
        <span className="size-2.5 rounded-full bg-ink-300" />
        <span className="size-2.5 rounded-full bg-ink-300" />
        <span className="ml-3 flex-1 truncate rounded bg-surface-2 px-2 py-0.5 font-mono text-[11px] text-text-2" data-mono>
          www.groundcrew.online/onboardings/acme-seo/review
        </span>
        <button
          type="button"
          onClick={play}
          aria-label="Replay demo"
          className="rounded p-1 text-text-2 hover:bg-surface-2 hover:text-text"
        >
          <RotateCcw size={14} strokeWidth={1.5} />
        </button>
      </div>

      <div className="grid grid-cols-5">
        {/* Document pane */}
        <div className="col-span-2 border-r border-border p-3">
          <div className="mb-2 flex items-center gap-1.5 text-[11px] text-text-2">
            <FileText size={12} strokeWidth={1.5} aria-hidden />
            <span className="font-mono" data-mono>acme-seo-sow.pdf</span>
          </div>
          <div className="space-y-1.5" aria-hidden>
            {Array.from({ length: 14 }).map((_, i) => (
              <div
                key={i}
                className={
                  "h-1.5 rounded-full transition-colors duration-500 " +
                  ([2, 5, 9].includes(i) && step > i / 2.5
                    ? "bg-highlight"
                    : "bg-surface-2")
                }
                style={{ width: `${72 + ((i * 37) % 28)}%`, backgroundColor: [2, 5, 9].includes(i) && step > i / 2.5 ? "var(--highlight)" : undefined }}
              />
            ))}
          </div>
        </div>

        {/* Plan pane */}
        <div className="col-span-3 p-3">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-text-2">
            Extracted manifest
          </p>
          <ul className="space-y-1.5">
            {ITEMS.map((item, i) => (
              <li
                key={item.t}
                className={
                  "flex items-start gap-2 rounded-lg border border-border px-2.5 py-1.5 text-[12.5px] leading-snug transition-all duration-300 " +
                  (i < step ? "opacity-100" : "translate-y-1 opacity-0")
                }
              >
                <span
                  className={
                    "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full " +
                    (item.verified
                      ? "bg-cleared-soft text-cleared-strong"
                      : "border border-border-strong text-text-2")
                  }
                >
                  {item.verified && <Check size={10} strokeWidth={3} aria-hidden />}
                </span>
                <span className="flex-1 text-text">{item.t}</span>
                <span className="font-mono text-[10px] text-text-2" data-mono>
                  p.{item.pg}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Stage log */}
      <div className="flex items-center justify-between border-t border-border px-4 py-2.5">
        <span className="font-mono text-[11.5px] text-text-2" data-mono aria-live="polite">
          {STAGES[stage]}
        </span>
        {done ? (
          <Badge variant="cleared">5 of 6 verified</Badge>
        ) : (
          <span className="relative h-1 w-24 overflow-hidden rounded-full bg-surface-2">
            <span
              className="absolute inset-y-0 left-0 rounded-full bg-cleared transition-all duration-700"
              style={{ width: `${(step / ITEMS.length) * 100}%` }}
            />
          </span>
        )}
      </div>
    </div>
  );
}
