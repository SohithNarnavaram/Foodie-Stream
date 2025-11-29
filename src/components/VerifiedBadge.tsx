import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const VerifiedBadge = () => {
  return (
    <Badge variant="secondary" className="gap-1.5 px-2.5 py-1">
      <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
      <span className="text-xs font-medium">Verified</span>
    </Badge>
  );
};
