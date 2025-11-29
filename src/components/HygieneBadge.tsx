import { Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface HygieneBadgeProps {
  rating: number;
}

export const HygieneBadge = ({ rating }: HygieneBadgeProps) => {
  return (
    <Badge variant="secondary" className="gap-1.5 px-2.5 py-1">
      <Shield className="w-3.5 h-3.5 text-secondary" />
      <span className="text-xs font-medium">Hygiene {rating}/5</span>
    </Badge>
  );
};
