import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-surface-2 text-text-2",
        cleared: "bg-cleared-soft text-cleared-strong",
        outline: "border border-border-strong text-text-2",
        marshal: "bg-marshal/10 text-marshal",
        warning: "bg-warning/10 text-warning",
        navy: "bg-primary/10 text-primary",
        brass: "border border-brass/30 text-brass",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
