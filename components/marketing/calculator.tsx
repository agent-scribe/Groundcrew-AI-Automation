"use client";

import { useState } from "react";

/**
 * Onboarding Time Calculator (Plan 10 §8): clients/mo × rate → annual
 * waste (marshal), flips to Groundcrew savings (cleared).
 */
export function Calculator() {
  const [clients, setClients] = useState(4);
  const [rate, setRate] = useState(85);

  const manualHours = 18;
  const gcHours = 0.15; // 9 minutes
  const annualWaste = Math.round(clients * 12 * manualHours * rate);
  const annualWithGc = Math.round(clients * 12 * gcHours * rate);
  const saved = annualWaste - annualWithGc;

  const fmt = (n: number) => "$" + n.toLocaleString("en-US");

  return (
    <div className="mx-auto w-full max-w-2xl rounded-[var(--radius-card)] border border-border bg-surface p-6 shadow-e2 sm:p-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-text">
            New clients per month
          </span>
          <input
            type="range"
            min={1}
            max={20}
            value={clients}
            onChange={(e) => setClients(Number(e.target.value))}
            className="mt-3 w-full accent-[var(--primary)]"
          />
          <span className="mt-1 block font-mono text-lg font-medium" data-mono>
            {clients}
          </span>
        </label>
        <label className="block">
          <span className="text-sm font-medium text-text">
            Team hourly rate
          </span>
          <input
            type="range"
            min={40}
            max={250}
            step={5}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="mt-3 w-full accent-[var(--primary)]"
          />
          <span className="mt-1 block font-mono text-lg font-medium" data-mono>
            ${rate}/hr
          </span>
        </label>
      </div>

      <div className="mt-8 grid gap-4 border-t border-border pt-6 sm:grid-cols-2">
        <div>
          <p className="text-sm text-text-2">
            Annual onboarding cost today ({manualHours}h × client)
          </p>
          <p className="mt-1 font-mono text-3xl font-semibold text-marshal" data-mono>
            {fmt(annualWaste)}
          </p>
        </div>
        <div>
          <p className="text-sm text-text-2">You keep with Groundcrew</p>
          <p className="mt-1 font-mono text-3xl font-semibold text-cleared" data-mono>
            {fmt(saved)}
          </p>
        </div>
      </div>
      <p className="mt-4 text-xs text-text-2">
        Assumes the 15–20 hr industry baseline vs 9 minutes of review time per
        onboarding.
      </p>
    </div>
  );
}
