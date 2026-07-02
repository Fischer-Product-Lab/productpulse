import type { InitiativeType } from "@/data/productpulse";
import { Badge } from "@/components/ui/badge";

export function InitiativeTypeBadge({ type }: { type: InitiativeType }) {
  return type === "AI" ? (
    <Badge variant="outline" className="border-gold/40 bg-gold/10 text-gold-light">
      AI
    </Badge>
  ) : (
    <Badge variant="outline" className="text-muted-foreground">
      Standard
    </Badge>
  );
}
