import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FloatingActionButtonProps {
  onClick?: () => void;
  className?: string;
}

export const FloatingActionButton = ({
  onClick,
  className,
}: FloatingActionButtonProps) => {
  return (
    <Button
      onClick={onClick}
      size="lg"
      className={cn(
        "fixed bottom-24 right-6 h-14 w-14 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.2)] transition-all duration-200 hover:scale-110 active:scale-95 bg-primary text-white z-40 border-0",
        className
      )}
    >
      <Plus className="w-6 h-6" />
    </Button>
  );
};
