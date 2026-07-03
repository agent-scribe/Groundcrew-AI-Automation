"use client";

import { useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  ClipboardList,
  ExternalLink,
  KeyRound,
  UploadCloud,
  CalendarDays,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ItemKind = "questionnaire" | "asset" | "access" | "schedule";

interface PortalItem {
  id: string;
  kind: ItemKind;
  title: string;
  hint: string;
}

const ITEMS: PortalItem[] = [
  { id: "q1", kind: "questionnaire", title: "Brand questionnaire", hint: "5 quick questions · 3 min" },
  { id: "a1", kind: "asset", title: "Logo pack upload", hint: ".zip, .png or .svg — full set if you have it" },
  { id: "g1", kind: "access", title: "Google Analytics 4 access", hint: "Viewer access for reporting" },
  { id: "g2", kind: "access", title: "Search Console access", hint: "Full user on the property" },
  { id: "s1", kind: "schedule", title: "Kickoff call", hint: "45 minutes with your account team" },
];

const KIND_ICON: Record<ItemKind, typeof Check> = {
  questionnaire: ClipboardList,
  asset: UploadCloud,
  access: KeyRound,
  schedule: CalendarDays,
};

const GA4_STEPS = [
  "Open admin.google.com → Analytics → Admin.",
  "Under “Property access management”, choose Add users.",
  "Enter crew@northbeamdigital.com and select the Viewer role.",
  "Click Add — then mark this item granted below.",
];

export function PreflightChecklist() {
  const [done, setDone] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState<string | null>("q1");
  const [justDone, setJustDone] = useState<string | null>(null);
  const [q, setQ] = useState({ audience: "", voice: "", goal: "", competitors: "", channel: "" });
  const [files, setFiles] = useState<string[]>([]);

  const complete = (id: string) => {
    setDone((d) => new Set(d).add(id));
    setJustDone(id);
    setOpen(null);
    setTimeout(() => setJustDone(null), 900);
  };

  const pct = useMemo(() => Math.round((done.size / ITEMS.length) * 100), [done]);
  const allDone = done.size === ITEMS.length;

  return (
    <div>
      {/* Branded header (tenant = Northbeam demo) */}
      <header className="flex items-center justify-between">
        <span className="font-display text-lg font-semibold tracking-tight">
          Northbeam<span className="text-cleared">.</span>
        </span>
        <span className="text-sm text-text-2">Acme Outdoor Co onboarding</span>
      </header>

      {/* Welcome */}
      <section className="mt-8">
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">
          Welcome aboard, Dana.
        </h1>
        <p className="mt-3 leading-relaxed text-text-2">
          Five quick items and your SEO engagement is cleared for takeoff. This
          usually takes about ten minutes — no account needed, progress saves
          as you go.
        </p>
      </section>

      {/* Sticky progress */}
      <div className="sticky top-0 z-10 -mx-5 mt-8 border-y border-border bg-bg/95 px-5 py-3 backdrop-blur-sm">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">
            {allDone ? "All items complete — wheels up! ✈" : `${done.size} of ${ITEMS.length} complete`}
          </span>
          <span className="font-mono text-xs text-text-2" data-mono>
            {pct}%
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full rounded-full bg-cleared transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Checklist — oversized rows (Plan 10 §7.3) */}
      <ul className="mt-6 space-y-3">
        {ITEMS.map((item) => {
          const Icon = KIND_ICON[item.kind];
          const isDone = done.has(item.id);
          const isOpen = open === item.id;
          return (
            <li
              key={item.id}
              className={cn(
                "rounded-[var(--radius-item)] border border-border bg-surface",
                justDone === item.id && "gc-row-cleared"
              )}
            >
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => !isDone && setOpen(isOpen ? null : item.id)}
                className="flex min-h-16 w-full items-center gap-4 px-4 py-3 text-left"
              >
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                    isDone
                      ? "border-cleared bg-cleared text-white"
                      : "border-border-strong"
                  )}
                >
                  {isDone && <Check size={15} strokeWidth={3} aria-hidden />}
                </span>
                <Icon size={20} strokeWidth={1.5} className="shrink-0 text-text-2" aria-hidden />
                <span className="min-w-0 flex-1">
                  <span className={cn("block font-medium", isDone && "text-text-2 line-through")}>
                    {item.title}
                  </span>
                  <span className="block text-sm text-text-2">{item.hint}</span>
                </span>
                {!isDone && (
                  <ChevronDown
                    size={18}
                    className={cn("shrink-0 text-text-2 transition-transform", isOpen && "rotate-180")}
                    aria-hidden
                  />
                )}
              </button>

              {isOpen && !isDone && (
                <div className="border-t border-border px-5 py-5">
                  {item.kind === "questionnaire" && (
                    <div className="space-y-4">
                      {(
                        [
                          ["audience", "Who is your primary audience?", "Outdoor families, 28–45, US West"],
                          ["voice", "Three words for your brand voice", "Rugged, warm, practical"],
                          ["goal", "What does success look like in 6 months?", "Organic revenue +40%"],
                        ] as const
                      ).map(([key, label, ph]) => (
                        <label key={key} className="block text-sm">
                          <span className="font-medium">{label}</span>
                          <input
                            value={q[key]}
                            onChange={(e) => setQ((s) => ({ ...s, [key]: e.target.value }))}
                            placeholder={ph}
                            className="mt-1.5 h-11 w-full rounded-[var(--radius-ctl)] border border-border bg-surface px-3 outline-none focus-visible:border-ring"
                          />
                        </label>
                      ))}
                      <label className="block text-sm">
                        <span className="font-medium">Top competitors (comma-separated)</span>
                        <textarea
                          value={q.competitors}
                          onChange={(e) => setQ((s) => ({ ...s, competitors: e.target.value }))}
                          rows={2}
                          placeholder="TrailPeak, Summit & Co, WildwayGear"
                          className="mt-1.5 w-full rounded-[var(--radius-ctl)] border border-border bg-surface px-3 py-2 outline-none focus-visible:border-ring"
                        />
                      </label>
                      <Button
                        className="w-full sm:w-auto"
                        disabled={!q.audience || !q.voice}
                        onClick={() => complete(item.id)}
                      >
                        Submit answers
                      </Button>
                    </div>
                  )}

                  {item.kind === "asset" && (
                    <div>
                      <label
                        className="flex cursor-pointer flex-col items-center rounded-[var(--radius-card)] border-2 border-dashed border-border-strong px-4 py-8 text-center hover:border-ink-400"
                      >
                        <UploadCloud size={26} strokeWidth={1.5} className="text-text-2" aria-hidden />
                        <span className="mt-2 text-sm font-medium">
                          Drop files or tap to browse
                        </span>
                        <span className="mt-0.5 text-xs text-text-2">.zip .png .svg — up to 200MB</span>
                        <input
                          type="file"
                          multiple
                          accept=".zip,.png,.svg"
                          className="sr-only"
                          onChange={(e) =>
                            setFiles(Array.from(e.target.files ?? []).map((f) => f.name))
                          }
                        />
                      </label>
                      {files.length > 0 && (
                        <ul className="mt-3 flex flex-wrap gap-2">
                          {files.map((f) => (
                            <li
                              key={f}
                              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-2 py-1 pl-3 pr-1.5 text-xs"
                            >
                              <span className="font-mono" data-mono>{f}</span>
                              <button
                                aria-label={`Remove ${f}`}
                                onClick={() => setFiles((fs) => fs.filter((x) => x !== f))}
                                className="rounded-full p-0.5 hover:bg-surface"
                              >
                                <X size={12} aria-hidden />
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                      <Button
                        className="mt-4 w-full sm:w-auto"
                        disabled={files.length === 0}
                        onClick={() => complete(item.id)}
                      >
                        Upload {files.length > 0 ? `${files.length} file${files.length > 1 ? "s" : ""}` : ""}
                      </Button>
                    </div>
                  )}

                  {item.kind === "access" && (
                    <div>
                      <ol className="space-y-2.5">
                        {GA4_STEPS.map((s, i) => (
                          <li key={s} className="flex gap-3 text-sm">
                            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-surface-2 font-mono text-xs font-semibold" data-mono>
                              {i + 1}
                            </span>
                            <span className="pt-0.5">{s}</span>
                          </li>
                        ))}
                      </ol>
                      <a
                        href="https://analytics.google.com"
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                      >
                        Open Google Analytics <ExternalLink size={14} aria-hidden />
                      </a>
                      <div className="mt-4">
                        <Button variant="approve" className="w-full sm:w-auto" onClick={() => complete(item.id)}>
                          <Check size={15} strokeWidth={2.5} aria-hidden /> Mark granted
                        </Button>
                      </div>
                    </div>
                  )}

                  {item.kind === "schedule" && (
                    <div className="text-sm">
                      <p className="text-text-2">
                        Pick any slot that suits you — the crew calendar stays
                        current.
                      </p>
                      <div className="mt-3 grid gap-2 sm:grid-cols-3">
                        {["Tue Jul 7 · 10:00", "Wed Jul 8 · 14:30", "Thu Jul 9 · 09:00"].map((slot) => (
                          <button
                            key={slot}
                            onClick={() => complete(item.id)}
                            className="rounded-[var(--radius-ctl)] border border-border bg-surface px-3 py-2.5 font-mono text-xs hover:border-primary hover:text-primary"
                            data-mono
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {/* Key dates */}
      <section className="mt-10 rounded-[var(--radius-card)] border border-border bg-surface p-5">
        <h2 className="text-sm font-semibold">Key dates</h2>
        <dl className="mt-3 grid gap-3 font-mono text-sm sm:grid-cols-3" data-mono>
          <div>
            <dt className="text-xs text-text-2">Kickoff</dt>
            <dd className="mt-0.5 font-medium">Jul 14, 2026</dd>
          </div>
          <div>
            <dt className="text-xs text-text-2">Audit delivered</dt>
            <dd className="mt-0.5 font-medium">Aug 13, 2026</dd>
          </div>
          <div>
            <dt className="text-xs text-text-2">First content batch</dt>
            <dd className="mt-0.5 font-medium">Aug 28, 2026</dd>
          </div>
        </dl>
      </section>

      {/* Contacts */}
      <footer className="mt-8 pb-16 text-sm text-text-2">
        <p>
          Questions? Your crew:{" "}
          <a href="mailto:crew@northbeamdigital.com" className="font-medium text-primary hover:underline">
            crew@northbeamdigital.com
          </a>
        </p>
        <p className="mt-6 text-xs">Powered by Groundcrew</p>
      </footer>
    </div>
  );
}
