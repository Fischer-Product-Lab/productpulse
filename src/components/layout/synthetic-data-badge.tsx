import { Badge } from "@/components/ui/badge";

export function SyntheticDataBadge() {
  return (
    <Badge
      variant="outline"
      className="border-gold/40 bg-gold/5 text-xs font-medium text-gold-light"
    >
      <span aria-hidden className="size-1.5 rounded-full bg-gold" />
      Synthetic demo data
    </Badge>
  );
}
