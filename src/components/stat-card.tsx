import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  className,
  valueClassName,
}: {
  label: string;
  value: string;
  hint?: string;
  className?: string;
  valueClassName?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card px-5 py-4",
        className,
      )}
    >
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>
      <p
        className={cn(
          "mt-2 font-heading text-2xl font-semibold tracking-tight md:text-3xl",
          valueClassName,
        )}
      >
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
