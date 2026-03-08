import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingJobPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="space-y-8 col-span-2">
          <div className="flex items-start justify-between">
            <div>
              <Skeleton className="h-9 w-75 mb-2" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-37.5" />
                <Skeleton className="h-5 w-30" />
              </div>
            </div>
          </div>

          <section className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
          </section>

          <section>
            <Skeleton className="h-6 w-50 mb-4" />
            <div className="flex flex-wrap gap-3">
              {[...Array(24)].map((i, index) => (
                <Skeleton key={index} className="h-8 w-35 rounded-full" />
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <Skeleton className="h-6 w-25 mb-2" />
                <Skeleton className="h-4 w-full" />
              </div>

              <Skeleton className="h-10 w-full" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-6 w-37.5" />

              <div className="space-y-2">
                {[...Array(4)].map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <Skeleton className="h-4 w-25" />
                    <Skeleton className="h-4 w-30" />
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="rounded-full size-12" />
                <div>
                  <Skeleton className="h-5 w-37.5 mb-2" />
                  <Skeleton className="h-5 w-50" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
