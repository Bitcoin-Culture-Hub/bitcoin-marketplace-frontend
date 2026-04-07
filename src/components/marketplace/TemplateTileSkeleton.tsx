import { Skeleton } from "@/components/ui/skeleton";

const TemplateTileSkeleton = () => {
  return (
    <div className="w-full p-4 bg-white shadow-card rounded-card">
      {/* Image area skeleton */}
      <Skeleton className="h-[169px] w-full rounded-card-inner" />

      {/* Content skeleton */}
      <div className="flex flex-col gap-3 mt-3">
        {/* Title */}
        <Skeleton className="h-[17px] w-3/4 rounded-sm" />

        {/* Divider */}
        <div className="border-t border-[rgba(175,175,175,0.2)]" />

        {/* Category line */}
        <Skeleton className="h-[14px] w-1/2 rounded-sm" />

        {/* Divider */}
        <div className="border-t border-[rgba(175,175,175,0.2)]" />

        {/* Bottom row */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <Skeleton className="h-[14px] w-10 rounded-sm" />
            <Skeleton className="h-[17px] w-20 rounded-sm" />
          </div>
          <Skeleton className="h-[40px] w-[80px] rounded-btn" />
        </div>
      </div>
    </div>
  );
};

export default TemplateTileSkeleton;
