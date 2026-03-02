import arcjet, { detectBot, tokenBucket } from "@/app/utlis/arcjet";
import { auth } from "@/app/utlis/auth";
import { getFlagEmoji } from "@/app/utlis/countrysList";
import { benefits } from "@/app/utlis/listOfBenefits";
import { JsonToHtml } from "@/components/general/JsonTohtml";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { cn } from "@/lib/utils";
import { request } from "@arcjet/next";
import { Heart } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

const aj = arcjet.withRule(
  detectBot({
    mode: "LIVE",
    allow: ["CATEGORY:SEARCH_ENGINE", "CATEGORY:PREVIEW"],
  }),
);

function getClient(session: boolean) {
  if (session) {
    return aj.withRule(
      tokenBucket({
        mode: "DRY_RUN",
        capacity: 100,
        interval: 60,
        refillRate: 30,
      }),
    );
  } else {
    return aj.withRule(
      tokenBucket({
        mode: "DRY_RUN",
        capacity: 100,
        interval: 60,
        refillRate: 10,
      }),
    );
  }
}

async function getJob(jobId: string) {
  const jobData = await prisma.jobPost.findUnique({
    where: {
      status: "ACTIVE",
      id: jobId,
    },
    select: {
      jobTitle: true,
      jobDescription: true,
      location: true,
      employmentType: true,
      benefits: true,
      createdAt: true,
      listingDuration: true,
      company: {
        select: {
          name: true,
          logo: true,
          location: true,
          about: true,
        },
      },
    },
  });

  if (!jobData) {
    return notFound();
  }

  return jobData;
}

type Params = Promise<{ jobId: string }>;

export default async function JobIdPage({ params }: { params: Params }) {
  const { jobId } = await params;
  const session = auth();
  const req = await request();
  const decision = await getClient(!!session).protect(req, { requested: 10 });

  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }

  const data = await getJob(jobId);
  const locationFlag = getFlagEmoji(data.location);
  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="space-y-8 col-span-2">
        <div className="flex items-center justify-between">
          <div className="">
            <h1 className="text-3xl font-bold">{data.jobTitle}</h1>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <p className="font-medium">{data.company.name}</p>
            <Badge className="rounded-full" variant="secondary">
              {data.employmentType}
            </Badge>
            <span className="hidden md:inline text-muted-foreground">*</span>
            <Badge className="rounded-full">
              {locationFlag && <span className="mr-1">{locationFlag}</span>}
              {data.location}
            </Badge>
          </div>
          <Button variant="outline">
            <Heart className="size-4" />
            Save Job
          </Button>
        </div>
        <section>
          <JsonToHtml json={JSON.parse(data.jobDescription)} />{" "}
        </section>
        <section>
          <h3 className="font-semibold mb-4">
            Benefits
            <span className="text-sm ml-2 font-normal text-primary">
              (blue is offered)
            </span>
          </h3>
          <div className="flex flex-wrap gap-3">
            {benefits.map((benefit) => {
              const isOffered = data.benefits.includes(benefit.id);
              return (
                <Badge
                  key={benefit.id}
                  variant={isOffered ? "default" : "outline"}
                  className={cn(
                    isOffered
                      ? ""
                      : "opacity-75 cursor-not-allowed text-sm px-4 py-1.5 rounded-full",
                  )}
                >
                  <span className="flex items-center gap-2">
                    {benefit.icon}
                    {benefit.label}
                  </span>
                </Badge>
              );
            })}
          </div>
        </section>
      </div>
      <div className="space-y-6">
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Apply now</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Please let {data.company.name} know you found this job on
                JobMarshall. This help us grow!
              </p>
            </div>
            <Button className="w-full">Apply now</Button>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold">About the Job</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Apply before
              </span>
              <span className="text-sm">
                {new Date(
                  data.createdAt.getTime() +
                    data.listingDuration * 24 * 60 * 60 * 100,
                ).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Posted on</span>
              <span className="text-sm">
                {data.createdAt.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}{" "}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Employment Type
              </span>
              <span className="text-sm">{data.employmentType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Location</span>
              <span className="text-sm">
                {locationFlag && <span className="mr-1">{locationFlag}</span>}
                {data.location}
              </span>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Image
                src={data.company.logo}
                alt="data.company.name"
                width={48}
                height={48}
                className="rounded-full size-12"
              />
              <div className="flex flex-col">
                <h3 className="font-semibold">{data.company.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {data.company.about}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
