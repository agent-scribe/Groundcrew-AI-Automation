"use client";

import { useRef, useState, use } from "react";
import { createClient } from "@/lib/supabase/client";
import { Mark } from "@/components/logo";
import { Button } from "@/components/ui/button";

export function LoginForm({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = use(searchParams);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // OTP entry
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const [verifying, setVerifying] = useState(false);

  const handleSendOtp = async () => {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    });
    setLoading(false);
    if (err) {
      setError(err.message);
    } else {
      setSent(true);
    }
  };

  const verifyOtp = async (code: string) => {
    setVerifying(true);
    setError(null);
    const supabase = createClient();
    const { error: err } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "email",
    });
    setVerifying(false);
    if (err) {
      setError(err.message);
      setDigits(Array(6).fill(""));
      refs.current[0]?.focus();
    } else {
      window.location.href = next || "/dashboard";
    }
  };

  const setDigit = (i: number, v: string) => {
    const d = v.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const n = [...prev];
      n[i] = d;
      if (d && n.every((x) => x !== "")) {
        verifyOtp(n.join(""));
      }
      return n;
    });
    if (d && i < 5) refs.current[i + 1]?.focus();
  };

  return (
    <div className="flex w-full max-w-sm flex-col items-center text-center">
      <span className="flex size-12 items-center justify-center rounded-2xl bg-ink-950 text-cleared">
        <Mark size={26} />
      </span>
      <h1 className="font-display mt-6 text-3xl font-semibold">
        Sign in to Groundcrew
      </h1>

      {!sent ? (
        <>
          <p className="mt-3 text-text-2">
            Enter your email. We&rsquo;ll send a six-digit code&mdash;no
            password needed.
          </p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && email && handleSendOtp()}
            placeholder="you@company.com"
            autoFocus
            className="mt-8 w-full rounded-[var(--radius-ctl)] border border-border-strong bg-surface px-4 py-2.5 text-sm outline-none placeholder:text-text-2/50 focus-visible:border-ring"
          />
          {error && (
            <p className="mt-2 text-sm text-marshal">{error}</p>
          )}
          <Button
            size="lg"
            className="mt-4 w-full"
            disabled={!email || loading}
            onClick={handleSendOtp}
          >
            {loading ? "Sending…" : "Send me a code"}
          </Button>
        </>
      ) : (
        <>
          <p className="mt-3 text-text-2">
            Enter the code we sent to{" "}
            <span className="font-medium text-text">{email}</span>.
          </p>
          <div
            className="mt-8 flex gap-2.5"
            role="group"
            aria-label="Six digit code"
          >
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => { refs.current[i] = el; }}
                inputMode="numeric"
                aria-label={`Digit ${i + 1}`}
                value={d}
                autoFocus={i === 0}
                disabled={verifying}
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
          {error && (
            <p className="mt-3 text-sm text-marshal">{error}</p>
          )}
          {verifying && (
            <p className="mt-3 text-sm text-text-2">Verifying…</p>
          )}
          <button
            type="button"
            onClick={() => { setSent(false); setDigits(Array(6).fill("")); }}
            className="mt-6 text-sm text-text-2 underline-offset-2 hover:underline"
          >
            Use a different email
          </button>
        </>
      )}
    </div>
  );
}
