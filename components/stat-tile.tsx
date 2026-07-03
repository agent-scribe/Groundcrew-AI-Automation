export function StatTile({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-[var(--radius-card)] border border-border bg-surface p-6 shadow-e1">
      <p className="text-sm font-medium text-text-2">{label}</p>
      <p className="mt-2 font-mono text-3xl font-semibold tracking-tight" data-mono>
        {value}
      </p>
      {sub && <p className="mt-2 text-xs text-text-2">{sub}</p>}
    </div>
  );
}
