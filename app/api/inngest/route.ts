import { inngest } from "@/app/utlis/inngest/client";
import { serve } from "inngest/next";
import { handleJobExpiration, sendPreriodicJobListing } from "./functions";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [handleJobExpiration, sendPreriodicJobListing],
});
