import { JobFilters } from "@/components/general/JobFilters";
import { JobListing } from "@/components/general/JobListings";
import { JobListingLoading } from "@/components/general/JobListingsLoading";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="grid grid-cols-3 gap-8">
      <JobFilters />
      <div className="col-span-2 flex flex-col gap-6">
        <Suspense fallback={<JobListingLoading />}>
          <JobListing />
        </Suspense>
      </div>
    </div>
  );
}
