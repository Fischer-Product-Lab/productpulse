export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-8 max-w-3xl">
      <p className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-gold">
        {eyebrow}
      </p>
      <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
        {title}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
        {description}
      </p>
    </div>
  );
}

export function ComingInNextStep({ items }: { items: string[] }) {
  return (
    <section
      aria-label="Planned content"
      className="rounded-xl border border-dashed border-border bg-card/40 p-6"
    >
      <h2 className="font-heading text-sm font-medium text-foreground">
        Wired up in the next build step
      </h2>
      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5">
            <span
              aria-hidden
              className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold/60"
            />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
