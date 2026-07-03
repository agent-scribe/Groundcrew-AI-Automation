"use client";

import { Search } from "lucide-react";

export function AppTopbar({ title }: { title?: string }) {
  return (
    <header className="sticky top-0 z-10 flex h-[60px] items-center justify-between border-b border-border bg-bg/90 px-6 backdrop-blur-sm">
      <h1 className="font-display text-xl font-semibold">{title ?? ""}</h1>
      <button
        type="button"
        className="flex h-9 w-64 items-center gap-2 rounded-[var(--radius-ctl)] border border-border bg-surface px-3 text-sm text-text-2 hover:border-border-strong"
        aria-label="Search (Command K)"
      >
        <Search size={16} strokeWidth={1.5} aria-hidden />
        <span className="flex-1 text-left">Search…</span>
        <kbd className="rounded border border-border bg-surface-2 px-1.5 font-mono text-[11px]" data-mono>
          ⌘K
        </kbd>
      </button>
    </header>
  );
}
