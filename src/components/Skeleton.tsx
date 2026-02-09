export const Skeleton = ({ className = "" }: { className?: string }) => (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

export const ProductSkeleton = () => (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm min-w-[280px]">
        <div className="aspect-[4/3] w-full bg-gray-100 rounded-lg mb-4 animate-pulse" />
        <div className="h-4 bg-gray-100 rounded w-3/4 mb-2 animate-pulse" />
        <div className="h-4 bg-gray-100 rounded w-1/2 mb-4 animate-pulse" />
        <div className="flex justify-between items-center mt-4">
            <div className="h-6 w-20 bg-gray-100 rounded animate-pulse" />
            <div className="h-8 w-8 bg-gray-100 rounded-full animate-pulse" />
        </div>
    </div>
);
