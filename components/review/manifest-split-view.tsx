"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  CircleAlert,
  FileText,
  Pencil,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  BUDGET,
  CITATIONS,
  DELIVERABLES,
  DOC_PAGES,
  MILESTONES,
  extractionStats,
} from "@/lib/review-fixture";

type NavItem = { id: string; citeId: string | null; label: string };

export function ManifestSplitView({ onboardingId }: { onboardingId: string }) {
  const router = useRouter();
  const stats = extractionStats();
  const docRef = useRef<HTMLDivElement>(null);
  const planRef = useRef<HTMLDivElement>(null);

  const [titles, setTitles] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState<string | null>(null);
  const [resolved, setResolved] = useState<Set<string>>(new Set());
  const [activeCite, setActiveCite] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [cursor, setCursor] = useState(-1);
  const [waiveOpen, setWaiveOpen] = useState(false);
  const [target, setTarget] = useState<"clickup" | "asana">("clickup");
  const [pushing, setPushing] = useState(false);
  const [pushedRows, setPushedRows] = useState(0);
  const [swept, setSwept] = useState(false);

  const trayItems = useMemo(() => {
    const t: { id: string; label: string; reason: string }[] = [];
    for (const d of DELIVERABLES)
      if (!d.citeId && !resolved.has(d.id))
        t.push({ id: d.id, label: titles[d.id] ?? d.title, reason: "No source quote — inferred" });
    for (const b of BUDGET)
      if (b.citeId && CITATIONS[b.citeId].confidence === "low" && !resolved.has(b.id))
        t.push({ id: b.id, label: `${b.label} ${b.amount}`, reason: "Low-confidence citation" });
    return t;
  }, [resolved, titles]);

  const navItems: NavItem[] = useMemo(() => {
    const arr: NavItem[] = [];
    for (const d of DELIVERABLES) arr.push({ id: d.id, citeId: d.citeId, label: d.title });
    for (const m of MILESTONES) arr.push({ id: m.id, citeId: m.citeId, label: m.title });
    for (const b of BUDGET) arr.push({ id: b.id, citeId: b.citeId, label: b.label });
    return arr;
  }, []);

  const jumpToCite = useCallback((citeId: string | null, itemId?: string) => {
    if (itemId) setActiveItem(itemId);
    if (!citeId) return;
    setActiveCite(citeId);
    const el = document.getElementById(`cite-${citeId}`);
    if (el && docRef.current) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.remove("gc-pulse");
      void el.offsetWidth; // restart animation
      el.classList.add("gc-pulse");
    }
  }, []);

  const jumpToItem = useCallback((citeId: string) => {
    const owner =
      DELIVERABLES.find((d) => d.citeId === citeId) ??
      MILESTONES.find((m) => m.citeId === citeId) ??
      BUDGET.find((b) => b.citeId === citeId);
    if (!owner) return;
    setActiveItem(owner.id);
    setActiveCite(citeId);
    const el = document.getElementById(`item-${owner.id}`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  // Keyboard path: [ ] cycle items, Enter jump-to-citation (Plan 10 §9)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) return;
      if (e.key === "]" || e.key === "[") {
        e.preventDefault();
        setCursor((c) => {
          const next =
            e.key === "]"
              ? (c + 1) % navItems.length
              : (c - 1 + navItems.length) % navItems.length;
          const item = navItems[next];
          setActiveItem(item.id);
          document
            .getElementById(`item-${item.id}`)
            ?.scrollIntoView({ behavior: "smooth", block: "center" });
          return next;
        });
      } else if (e.key === "Enter" && cursor >= 0) {
        e.preventDefault();
        jumpToCite(navItems[cursor].citeId, navItems[cursor].id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cursor, navItems, jumpToCite]);

  const verifiedPct = (
    ((stats.verified + (stats.needsReview - trayItems.length)) / stats.items) *
    100
  ).toFixed(1);

  const startPush = () => {
    setPushing(true);
    setPushedRows(0);
    DELIVERABLES.forEach((_, i) => {
      setTimeout(() => setPushedRows(i + 1), 550 * (i + 1));
    });
    setTimeout(() => {
      setSwept(true);
      setTimeout(() => router.push(`/onboardings/${onboardingId}?pushed=1`), 1100);
    }, 550 * DELIVERABLES.length + 500);
  };

  const onApprove = () => {
    if (trayItems.length > 0) setWaiveOpen(true);
    else startPush();
  };

  return (
    <div className="flex h-screen flex-col">
      {/* Top bar */}
      <header className="flex h-[60px] shrink-0 items-center gap-4 border-b border-border bg-surface px-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-sm text-text-2 hover:text-text"
        >
          <ArrowLeft size={16} aria-hidden /> Back
        </Link>
        <div className="h-6 w-px bg-border" />
        <h1 className="font-display text-lg font-semibold">Acme Outdoor Co</h1>
        <Badge variant="cleared">{verifiedPct}% verified</Badge>
        {trayItems.length > 0 && (
          <Badge variant="warning">
            <CircleAlert size={12} aria-hidden /> Needs review ({trayItems.length})
          </Badge>
        )}
        <div className="ml-auto flex items-center gap-3">
          <div
            role="radiogroup"
            aria-label="Push target"
            className="flex rounded-full border border-border p-0.5 text-sm"
          >
            {(["clickup", "asana"] as const).map((t) => (
              <button
                key={t}
                role="radio"
                aria-checked={target === t}
                onClick={() => setTarget(t)}
                className={cn(
                  "rounded-full px-3.5 py-1 font-medium capitalize transition-colors duration-[140ms]",
                  target === t ? "bg-primary text-primary-fg" : "text-text-2 hover:text-text"
                )}
              >
                {t === "clickup" ? "ClickUp" : "Asana"}
              </button>
            ))}
          </div>
          <Button variant="approve" onClick={onApprove}>
            <Check size={16} strokeWidth={2.5} aria-hidden />
            Approve & push
          </Button>
        </div>
      </header>

      {/* Split view 48/52 */}
      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[48fr_52fr]">
        {/* Document pane */}
        <div
          ref={docRef}
          className="hidden min-h-0 overflow-y-auto border-r border-border bg-surface-2/50 p-6 lg:block"
          aria-label="Source document"
        >
          <div className="mx-auto max-w-xl space-y-6">
            <p className="flex items-center gap-2 font-mono text-xs text-text-2" data-mono>
              <FileText size={13} aria-hidden /> acme-seo-sow.pdf · 12 pages
            </p>
            {DOC_PAGES.map((pg) => (
              <section
                key={pg.n}
                className="rounded-[var(--radius-card)] border border-border bg-surface p-8 shadow-e1"
                aria-label={`Page ${pg.n}`}
              >
                <p className="mb-4 font-mono text-[10.5px] uppercase tracking-widest text-text-2" data-mono>
                  Page {pg.n}
                </p>
                <h3 className="font-display mb-3 text-[17px] font-semibold">
                  {pg.heading}
                </h3>
                <div className="gc-doc-body space-y-3 text-text">
                  {pg.paras.map((para, pi) => (
                    <p key={pi}>
                      {para.map((seg, si) =>
                        seg.citeId ? (
                          <mark
                            key={si}
                            id={`cite-${seg.citeId}`}
                            onClick={() => jumpToItem(seg.citeId!)}
                            className={cn(
                              "cursor-pointer rounded px-0.5 transition-shadow",
                              activeCite === seg.citeId && "ring-2 ring-ring"
                            )}
                            style={{ backgroundColor: "var(--highlight)" }}
                          >
                            {seg.text}
                          </mark>
                        ) : (
                          <span key={si}>{seg.text}</span>
                        )
                      )}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>

        {/* Plan pane */}
        <div ref={planRef} className="min-h-0 overflow-y-auto p-6" aria-label="Extracted plan">
          {/* Needs-review tray */}
          {trayItems.length > 0 && (
            <div className="mb-5 rounded-[var(--radius-card)] border border-warning/40 bg-warning/5 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-text">
                <CircleAlert size={16} className="text-warning" aria-hidden />
                Needs review — {trayItems.length} item{trayItems.length > 1 ? "s" : ""}
              </p>
              <ul className="mt-3 space-y-2">
                {trayItems.map((t) => (
                  <li
                    key={t.id}
                    className="flex items-center justify-between gap-3 rounded-[var(--radius-item)] border border-border bg-surface px-3 py-2 text-sm"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{t.label}</p>
                      <p className="text-xs text-text-2">{t.reason}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setResolved((r) => new Set(r).add(t.id))}
                    >
                      Mark reviewed
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="mb-3 text-xs text-text-2">
            Keyboard: <kbd className="rounded border border-border bg-surface-2 px-1 font-mono">[</kbd>{" "}
            <kbd className="rounded border border-border bg-surface-2 px-1 font-mono">]</kbd> cycle ·{" "}
            <kbd className="rounded border border-border bg-surface-2 px-1 font-mono">Enter</kbd> jump to citation
          </p>

          {/* Deliverables */}
          <h2 className="font-display text-lg font-semibold">Deliverables</h2>
          <ul className="mt-3 space-y-3">
            {DELIVERABLES.map((d) => {
              const cite = d.citeId ? CITATIONS[d.citeId] : null;
              const isVerified = !!cite && cite.confidence === "verified";
              const title = titles[d.id] ?? d.title;
              return (
                <li
                  key={d.id}
                  id={`item-${d.id}`}
                  className={cn(
                    "rounded-[var(--radius-card)] border bg-surface p-4 transition-colors",
                    activeItem === d.id ? "border-ring" : "border-border"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      {editing === d.id ? (
                        <input
                          autoFocus
                          defaultValue={title}
                          onBlur={(e) => {
                            setTitles((t) => ({ ...t, [d.id]: e.target.value || title }));
                            setEditing(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                            if (e.key === "Escape") setEditing(null);
                          }}
                          className="w-full rounded border border-ring bg-surface px-2 py-1 text-[15px] font-semibold outline-none"
                        />
                      ) : (
                        <button
                          className="group flex items-center gap-2 text-left"
                          onClick={() => jumpToCite(d.citeId, d.id)}
                        >
                          <span className="text-[15px] font-semibold">{title}</span>
                          <Pencil
                            size={13}
                            aria-label="Edit title"
                            className="shrink-0 text-text-2 opacity-0 transition-opacity group-hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditing(d.id);
                            }}
                          />
                        </button>
                      )}
                      <p className="mt-0.5 text-sm text-text-2">{d.description}</p>
                    </div>
                    {isVerified ? (
                      <Badge variant="cleared" className="shrink-0">
                        <Check size={11} strokeWidth={3} aria-hidden /> verified · p.{cite!.page}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="shrink-0" title="No source quote — review">
                        {resolved.has(d.id) ? "reviewed" : "inferred"}
                      </Badge>
                    )}
                  </div>
                  <ul className="mt-3 space-y-1.5 border-t border-border pt-3">
                    {d.tasks.map((t) => (
                      <li key={t.id} className="flex items-center gap-2 text-sm">
                        <ChevronRight size={13} className="shrink-0 text-text-2" aria-hidden />
                        <span className="flex-1 truncate">{t.title}</span>
                        <span className="font-mono text-[11px] text-text-2" data-mono>
                          {t.estimateH}h · d+{t.dueOffsetDays} · {t.owner}
                        </span>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>

          {/* Milestones */}
          <h2 className="font-display mt-8 text-lg font-semibold">Milestones</h2>
          <ul className="mt-3 space-y-2">
            {MILESTONES.map((m) => (
              <li
                key={m.id}
                id={`item-${m.id}`}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-[var(--radius-item)] border bg-surface px-4 py-3",
                  activeItem === m.id ? "border-ring" : "border-border"
                )}
              >
                <button className="text-left text-sm font-medium" onClick={() => jumpToCite(m.citeId, m.id)}>
                  {m.title}
                </button>
                <span className="flex items-center gap-2">
                  <span className="font-mono text-xs text-text-2" data-mono>{m.due}</span>
                  {m.citeId && (
                    <Badge variant="cleared">
                      <Check size={11} strokeWidth={3} aria-hidden /> p.{CITATIONS[m.citeId].page}
                    </Badge>
                  )}
                </span>
              </li>
            ))}
          </ul>

          {/* Budget */}
          <h2 className="font-display mt-8 text-lg font-semibold">Budget</h2>
          <ul className="mt-3 space-y-2 pb-12">
            {BUDGET.map((b) => {
              const cite = b.citeId ? CITATIONS[b.citeId] : null;
              const low = cite?.confidence === "low";
              return (
                <li
                  key={b.id}
                  id={`item-${b.id}`}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-[var(--radius-item)] border bg-surface px-4 py-3",
                    activeItem === b.id ? "border-ring" : "border-border"
                  )}
                >
                  <button className="text-left text-sm font-medium" onClick={() => jumpToCite(b.citeId, b.id)}>
                    {b.label}
                  </button>
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-sm font-semibold" data-mono>{b.amount}</span>
                    {cite &&
                      (low && !resolved.has(b.id) ? (
                        <Badge variant="warning">
                          <CircleAlert size={11} aria-hidden /> low · p.{cite.page}
                        </Badge>
                      ) : (
                        <Badge variant="cleared">
                          <Check size={11} strokeWidth={3} aria-hidden /> p.{cite.page}
                        </Badge>
                      ))}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Waive dialog */}
      {waiveOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Waive unreviewed items"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/40 p-4"
        >
          <div className="w-full max-w-md rounded-[var(--radius-modal)] bg-surface p-6 shadow-e3">
            <div className="flex items-start justify-between">
              <h3 className="font-display text-lg font-semibold">
                Approve with {trayItems.length} unreviewed item{trayItems.length > 1 ? "s" : ""}?
              </h3>
              <button aria-label="Close" onClick={() => setWaiveOpen(false)} className="rounded p-1 text-text-2 hover:bg-surface-2">
                <X size={16} aria-hidden />
              </button>
            </div>
            <ul className="mt-4 space-y-2">
              {trayItems.map((t) => (
                <li key={t.id} className="rounded-[var(--radius-item)] border border-warning/40 bg-warning/5 px-3 py-2 text-sm">
                  <p className="font-medium">{t.label}</p>
                  <p className="text-xs text-text-2">{t.reason}</p>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-text-2">
              Waived items push as-is and are logged to the audit trail.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setWaiveOpen(false)}>
                Go back
              </Button>
              <Button
                variant="approve"
                onClick={() => {
                  setWaiveOpen(false);
                  startPush();
                }}
              >
                Waive & approve
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Push modal */}
      {pushing && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Pushing plan"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/40 p-4"
        >
          <div className="w-full max-w-md overflow-hidden rounded-[var(--radius-modal)] bg-surface shadow-e3">
            <div className="p-6">
              <h3 className="font-display text-lg font-semibold">
                Pushing to {target === "clickup" ? "ClickUp" : "Asana"}
              </h3>
              <p className="mt-1 text-sm text-text-2">
                Idempotent push — re-running updates, never duplicates.
              </p>
              <ul className="mt-5 space-y-2">
                {DELIVERABLES.map((d, i) => (
                  <li key={d.id} className="flex items-center gap-2.5 text-sm">
                    {i < pushedRows ? (
                      <Check size={15} strokeWidth={2.5} className="shrink-0 text-cleared" aria-hidden />
                    ) : (
                      <span className={cn("size-3.5 shrink-0 rounded-full border-2", i === pushedRows ? "animate-pulse border-cleared" : "border-border-strong")} />
                    )}
                    <span className={i < pushedRows ? "text-text" : "text-text-2"}>
                      {titles[d.id] ?? d.title}
                    </span>
                    <span className="ml-auto font-mono text-[11px] text-text-2" data-mono>
                      create
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            {swept && (
              <div className="gc-sweep flex items-center justify-center gap-2 bg-cleared py-3 text-sm font-semibold text-white">
                <Check size={16} strokeWidth={3} aria-hidden /> Cleared for takeoff
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
