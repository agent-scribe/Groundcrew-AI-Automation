"use client";

import { Mark } from "@/components/logo";

/**
 * Runway loader (Plan 10 §5): chevrons taxiing across a runway line.
 * Reduced motion → static progress bar (global CSS kills the animation).
 */
export function RunwayLoader() {
  return (
    <div className="relative h-10 w-64 overflow-hidden" role="presentation">
      {/* runway centreline */}
      <div
        className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, var(--border-strong) 0 12px, transparent 12px 22px)",
        }}
      />
      <div
        className="absolute top-1/2 -translate-y-1/2 text-cleared"
        style={{ animation: "gc-taxi 2.2s linear infinite" }}
      >
        <Mark size={22} />
      </div>
    </div>
  );
}
