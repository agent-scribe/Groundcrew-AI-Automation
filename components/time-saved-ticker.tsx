"use client";

import { useEffect, useRef, useState } from "react";

/**
 * TimeSavedTicker (Plan 10 §7.7): dashboard hero stat — hours saved vs the
 * 18-hr manual baseline. Geist Mono count-up, brass hairline card.
 */
export function TimeSavedTicker({ hours }: { hours: number }) {
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const dur = 1100;
    const t0 = performance.now();
    let raf: number;
    const tick = (t: number) => {
      const p = Math.min((t - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(hours * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [hours]);

  return (
    <div
      className="rounded-[var(--radius-card)] bg-surface p-6 shadow-e1"
      style={{ border: "var(--hairline-brass)" }}
    >
      <p className="text-sm font-medium text-text-2">
        Hours returned to the team
      </p>
      <p className="mt-2 font-mono text-5xl font-semibold tracking-tight" data-mono>
        {display.toFixed(1)}
        <span className="ml-1 text-xl text-text-2">hrs</span>
      </p>
      <p className="mt-2 text-xs text-text-2">
        vs the 18-hour manual onboarding baseline
      </p>
    </div>
  );
}
