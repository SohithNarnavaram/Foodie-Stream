import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export const LiveCardSkeleton = () => {
  return (
    <Card className="overflow-hidden border-0 shadow-md">
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="p-3">
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </Card>
  );
};

export const VendorProfileSkeleton = () => {
  return (
    <div className="space-y-4">
      <Skeleton className="h-48 w-full" />
      <div className="px-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
};
