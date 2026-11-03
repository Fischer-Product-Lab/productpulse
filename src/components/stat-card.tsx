"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const labelClass =
  "text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground";

export function StatCard({
  label,
  value,
  hint,
  definition,
  className,
  valueClassName,
  href,
  linkLabel,
}: {
  label: string;
  value: string;
  hint?: string;
  /** Plain-language explanation shown in a tooltip on hover/focus. */
  definition?: string;
  className?: string;
  valueClassName?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-xl border border-border bg-card px-5 py-4",
        className,
      )}
    >
      {definition ? (
        <TooltipProvider delay={150}>
          <Tooltip>
            <TooltipTrigger
              render={
                <span
                  tabIndex={0}
                  className={cn(
                    labelClass,
                    "cursor-help rounded-sm underline decoration-muted-foreground/50 decoration-dotted underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring",
                  )}
                />
              }
            >
              {label}
            </TooltipTrigger>
            <TooltipContent className="max-w-64 text-pretty">
              {definition}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <p className={labelClass}>{label}</p>
      )}
      <p
        className={cn(
          "mt-2 font-heading text-2xl font-semibold tracking-tight md:text-3xl",
          valueClassName,
        )}
      >
        {value}
      </p>
      {hint && (
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {hint}
        </p>
      )}
      {href && (
        <Link
          href={href}
          className="mt-auto flex min-h-10 items-center justify-between gap-2 pt-3 text-xs font-medium text-gold-light hover:underline"
        >
          {linkLabel ?? "Explore metric"}
          <ArrowUpRight aria-hidden className="size-3.5" />
        </Link>
      )}
    </div>
  );
}
