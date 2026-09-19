import { SkeletonReferenceCard, PremiumSkeleton } from "@/components/ui/premium-skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen py-16 px-4 max-w-5xl mx-auto space-y-8">
      <div className="space-y-3 text-center max-w-xl mx-auto">
        <PremiumSkeleton className="h-6 w-32 rounded-full mx-auto" />
        <PremiumSkeleton className="h-10 w-72 rounded-2xl mx-auto" />
        <PremiumSkeleton className="h-4 w-96 rounded-lg mx-auto" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <SkeletonReferenceCard />
        <SkeletonReferenceCard />
        <SkeletonReferenceCard />
        <SkeletonReferenceCard />
      </div>
    </div>
  );
}
