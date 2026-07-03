import { cn } from "@/lib/utils";

/**
 * Groundcrew mark — "Cleared to Proceed" (Plan 10 §2).
 * Marshaller's proceed signal: double chevron rising left-to-right,
 * rounded wand strokes, 12° upward rotation. Reads at 16px.
 */
export function Mark({ className, size = 24 }: { className?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M4 15.5 L10 9.5 L4 3.5"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity=".55"
        transform="rotate(-12 12 12) translate(1 3)"
      />
      <path
        d="M11 18 L17 12 L11 6"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="rotate(-12 12 12) translate(1 3)"
      />
    </svg>
  );
}

/** Full lockup: mark + lowercase Fraunces wordmark (Plan 10 §2). */
export function Logo({
  className,
  markClassName = "text-cleared",
  size = 24,
}: {
  className?: string;
  markClassName?: string;
  size?: number;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <Mark className={markClassName} size={size} />
      <span
        className="font-display font-semibold lowercase text-text"
        style={{ letterSpacing: "-0.01em", fontSize: size * 0.92 }}
      >
        groundcrew
      </span>
    </span>
  );
}
