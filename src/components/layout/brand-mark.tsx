import Link from "next/link";

export function BrandMark() {
  return (
    <Link href="/" className="group flex items-center gap-3">
      <span
        aria-hidden
        className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-gold to-gold-light font-heading text-lg font-semibold text-primary-foreground"
      >
        P
      </span>
      <span className="flex flex-col leading-tight">
        <span className="font-heading text-lg font-semibold tracking-tight">
          Product<span className="text-gold-gradient">Pulse</span>
        </span>
        <span className="whitespace-nowrap text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          Fischer Product Lab
        </span>
      </span>
    </Link>
  );
}
