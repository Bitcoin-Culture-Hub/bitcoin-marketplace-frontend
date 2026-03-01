import { Skeleton } from "@/components/ui/skeleton";

const TemplateTileSkeleton = () => {
  return (
    <div className="space-y-3">
      {/* Image skeleton */}
      <Skeleton className="aspect-[3/4] w-full rounded-none" />
      
      {/* Title skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4 rounded-none" />
        <Skeleton className="h-3 w-1/2 rounded-none" />
      </div>
      
      {/* Market signal skeleton */}
      <div className="flex items-center justify-between pt-1 border-t border-border">
        <Skeleton className="h-4 w-20 rounded-none" />
        <Skeleton className="h-4 w-24 rounded-none" />
      </div>
    </div>
  );
};

export default TemplateTileSkeleton;
