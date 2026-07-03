import { cn } from "@/lib/utils";

export function Card({
  className,
  brass,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { brass?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-card)] border border-border bg-surface shadow-e1",
        className
      )}
      style={brass ? { border: "var(--hairline-brass)" } : undefined}
      {...props}
    />
  );
}
