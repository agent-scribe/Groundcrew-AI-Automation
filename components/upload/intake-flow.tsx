"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  UploadCloud,
  FileText,
  Copy,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { RunwayLoader } from "@/components/upload/runway-loader";

const MAX_MB = 50;
const ACCEPT = [".pdf", ".docx"];

/** Honest-progress stage log (Plan 10 §8) — simulated pipeline for the demo build. */
const STAGE_LOG = [
  { at: 400, line: "Uploading manifest… done" },
  { at: 1300, line: "Reading manifest… 12 pages" },
  { at: 2600, line: "Layout extraction… text + tables" },
  { at: 4000, line: "Extracting deliverables… 6 found" },
  { at: 5400, line: "Extracting milestones… 3 found" },
  { at: 6600, line: "Verifying citations… 5/6 grounded" },
  { at: 7600, line: "Building plan tree… done" },
  { at: 8400, line: "Manifest ready for review" },
];

type Phase = "form" | "processing";

export function IntakeFlow() {
  const router = useRouter();
  const search = useSearchParams();
  const [phase, setPhase] = useState<Phase>("form");
  const [file, setFile] = useState<{ name: string; size: number } | null>(null);
  const [client, setClient] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const startProcessing = useCallback(() => {
    setPhase("processing");
    setLog([]);
    STAGE_LOG.forEach((s) => {
      setTimeout(() => setLog((l) => [...l, s.line]), s.at);
    });
    setTimeout(() => router.push("/onboardings/acme-seo/review"), 9300);
  }, [router]);

  // Sample-SOW instant path (dashboard empty-state CTA)
  useEffect(() => {
    if (search.get("sample") === "1" && phase === "form") {
      setFile({ name: "acme-seo-sow.pdf", size: 1_240_000 });
      setClient("Acme Outdoor Co");
      setEmail("dana@acmeoutdoor.com");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const validate = (f: File) => {
    const ext = "." + (f.name.split(".").pop() ?? "").toLowerCase();
    if (!ACCEPT.includes(ext)) return `Only ${ACCEPT.join(", ")} accepted.`;
    if (f.size > MAX_MB * 1024 * 1024) return `Max ${MAX_MB}MB.`;
    return null;
  };

  const onFiles = (files: FileList | null) => {
    const f = files?.[0];
    if (!f) return;
    const err = validate(f);
    setError(err);
    if (!err) setFile({ name: f.name, size: f.size });
  };

  const copyEmailIn = async () => {
    try {
      await navigator.clipboard.writeText("sow@northbeam.groundcrew.app");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  if (phase === "processing") {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center py-16 text-center">
        <RunwayLoader />
        <h2 className="font-display mt-6 text-2xl font-semibold">
          Crew is reading the manifest
        </h2>
        <p className="mt-2 text-sm text-text-2">
          Two-pass extraction with page-level citation grounding.
        </p>
        <div
          className="mt-8 w-full rounded-[var(--radius-card)] border border-border bg-surface p-5 text-left"
          aria-live="polite"
        >
          <ul className="space-y-2 font-mono text-[13px]" data-mono>
            {log.map((line, i) => (
              <li key={line} className="flex items-center gap-2.5 text-text-2">
                {i === log.length - 1 && log.length < STAGE_LOG.length ? (
                  <span className="size-3.5 shrink-0 animate-pulse rounded-full border-2 border-cleared" />
                ) : (
                  <Check size={14} strokeWidth={2.5} className="shrink-0 text-cleared" aria-hidden />
                )}
                {line}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload SOW — PDF or DOCX up to 50 megabytes"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          onFiles(e.dataTransfer.files);
        }}
        className={
          "flex cursor-pointer flex-col items-center justify-center rounded-[var(--radius-card)] border-2 border-dashed px-6 py-14 text-center transition-colors duration-[140ms] " +
          (dragOver
            ? "border-primary bg-primary/5"
            : "border-border-strong bg-surface hover:border-ink-400")
        }
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT.join(",")}
          className="sr-only"
          onChange={(e) => onFiles(e.target.files)}
        />
        <UploadCloud size={32} strokeWidth={1.5} className="text-text-2" aria-hidden />
        <p className="mt-4 font-medium">
          Drop the signed SOW here, or click to browse
        </p>
        <p className="mt-1 text-sm text-text-2">
          PDF or DOCX · up to {MAX_MB}MB · 100 pages
        </p>
        {file && (
          <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface-2 py-1.5 pl-3 pr-2 text-sm">
            <FileText size={14} aria-hidden />
            <span className="font-mono text-[12.5px]" data-mono>
              {file.name}
            </span>
            <button
              type="button"
              aria-label="Remove file"
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
              }}
              className="rounded-full p-0.5 hover:bg-surface"
            >
              <X size={13} aria-hidden />
            </button>
          </span>
        )}
        {error && (
          <p role="alert" className="mt-3 text-sm font-medium text-danger">
            {error}
          </p>
        )}
      </div>

      {/* Email-in */}
      <div className="mt-4 flex items-center justify-between rounded-[var(--radius-item)] border border-border bg-surface px-4 py-3 text-sm">
        <span className="text-text-2">
          Or forward it to{" "}
          <span className="font-mono text-text" data-mono>
            sow@northbeam.groundcrew.app
          </span>
        </span>
        <button
          type="button"
          onClick={copyEmailIn}
          className="inline-flex items-center gap-1.5 rounded-[8px] px-2 py-1 font-medium text-primary hover:bg-surface-2"
        >
          {copied ? <Check size={14} aria-hidden /> : <Copy size={14} aria-hidden />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      {/* Client fields */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium">Client name</span>
          <input
            value={client}
            onChange={(e) => setClient(e.target.value)}
            placeholder="Acme Outdoor Co"
            className="mt-1.5 h-10 w-full rounded-[var(--radius-ctl)] border border-border bg-surface px-3 outline-none focus-visible:border-ring"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium">Client contact email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="dana@acmeoutdoor.com"
            className="mt-1.5 h-10 w-full rounded-[var(--radius-ctl)] border border-border bg-surface px-3 outline-none focus-visible:border-ring"
          />
        </label>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <p className="text-xs text-text-2">
          Demo build: parsing is simulated on the sample fixture.
        </p>
        <Button
          size="lg"
          disabled={!file || !client}
          onClick={startProcessing}
        >
          Start pre-flight
        </Button>
      </div>
    </div>
  );
}
