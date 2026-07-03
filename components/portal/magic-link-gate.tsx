"use client";

import { useRef, useState } from "react";
import { Mark } from "@/components/logo";
import { Button } from "@/components/ui/button";

/**
 * MagicLinkGate (Plan 10 §7.10): OTP entry — six digits, auto-advance.
 * Demo build: any 6 digits pass; no accounts, ever (PRD F4).
 */
export function MagicLinkGate({
  onVerified,
  clientEmail,
}: {
  onVerified: () => void;
  clientEmail: string;
}) {
  const [sent, setSent] = useState(false);
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const setDigit = (i: number, v: string) => {
    const d = v.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[i] = d;
      if (d && next.every((x) => x !== "")) {
        setTimeout(onVerified, 350);
      }
      return next;
    });
    if (d && i < 5) refs.current[i + 1]?.focus();
  };

  return (
    <div className="flex flex-col items-center py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-2xl bg-ink-950 text-cleared">
        <Mark size={26} />
      </span>
      <h1 className="font-display mt-6 text-3xl font-semibold">
        Your pre-flight checklist
      </h1>
      {!sent ? (
        <>
          <p className="mt-3 max-w-sm text-text-2">
            We'll email a six-digit code to{" "}
            <span className="font-medium text-text">{clientEmail}</span>. No
            account, no password.
          </p>
          <Button size="lg" className="mt-8" onClick={() => setSent(true)}>
            Email me the code
          </Button>
        </>
      ) : (
        <>
          <p className="mt-3 max-w-sm text-text-2">
            Enter the code we sent to{" "}
            <span className="font-medium text-text">{clientEmail}</span>.
            <span className="mt-1 block text-sm">(Demo: any six digits work.)</span>
          </p>
          <div className="mt-8 flex gap-2.5" role="group" aria-label="Six digit code">
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                inputMode="numeric"
                aria-label={`Digit ${i + 1}`}
                value={d}
                autoFocus={i === 0}
                onChange={(e) => setDigit(i, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && !digits[i] && i > 0)
                    refs.current[i - 1]?.focus();
                }}
                className="size-12 rounded-[var(--radius-ctl)] border border-border-strong bg-surface text-center font-mono text-xl outline-none focus-visible:border-ring sm:size-14"
                data-mono
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => setSent(false)}
            className="mt-6 text-sm text-text-2 underline-offset-2 hover:underline"
          >
            Use a different email
          </button>
        </>
      )}
    </div>
  );
}
