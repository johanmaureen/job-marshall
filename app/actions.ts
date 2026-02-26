"use server";

import z from "zod";
import { requireUser } from "./utlis/requireUser";
import { companySchema, jobSchema, jobSeekerSchema } from "./utlis/zodSchemas";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import arcjet, { detectBot, shield } from "./utlis/arcjet";
import { request } from "@arcjet/next";
import { stripe } from "./utlis/stripe";
import { jobListingDurationPricing } from "./utlis/pricingTiers";

const aj = arcjet
  .withRule(
    shield({
      mode: "LIVE",
    }),
  )
  .withRule(
    detectBot({
      mode: "LIVE",
      allow: [],
    }),
  );

export async function createCompany(data: z.infer<typeof companySchema>) {
  const session = await requireUser();

  if (!session?.user) {
    throw new Error("no user, please login");
  }
  const req = await request();
  const decision = await aj.protect(req);
  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }

  const validateData = companySchema.parse(data);
  await prisma.user.update({
    where: {
      id: session.user?.id,
    },
    data: {
      onBoardingCompleted: true,
      userType: "COMPANY",
      Company: {
        create: {
          ...validateData,
        },
      },
    },
  });

  return redirect("/");
}

export async function createJobSeeker(data: z.infer<typeof jobSeekerSchema>) {
  const session = await requireUser();

  if (!session?.user) {
    throw new Error("no user, please login");
  }
  const req = await request();
  const decision = await aj.protect(req);
  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }

  const validatedData = jobSeekerSchema.parse(data);

  await prisma.user.update({
    where: {
      id: session.user?.id,
    },
    data: {
      onBoardingCompleted: true,
      userType: "JOB_SEEKER",
      JobSeeker: {
        create: {
          ...validatedData,
        },
      },
    },
  });

  return redirect("/");
}

export async function createJob(data: z.infer<typeof jobSchema>) {
  const session = await requireUser();

  if (!session?.user) {
    throw new Error("no user, please login");
  }

  const req = await request();
  const decision = await aj.protect(req);
  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }

  const validatedData = jobSchema.parse(data);

  const company = await prisma.company.findUnique({
    where: {
      userId: session.user.id,
    },
    select: {
      id: true,
      user: {
        select: {
          stripeCustomerId: true,
        },
      },
    },
  });

  if (!company?.id) {
    return redirect("/");
  }

  let stripeCustomerId = company.user.stripeCustomerId;

  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: session.user.email as string,
      name: session.user.name as string,
    });
    stripeCustomerId = customer.id;
  }

  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      stripeCustomerId: stripeCustomerId,
    },
  });

  const jobPost = await prisma.jobPost.create({
    data: {
      companyId: company.id,
      jobDescription: validatedData.jobDescription,
      jobTitle: validatedData.jobTitle,
      employmentType: validatedData.employmentType,
      location: validatedData.location,
      salaryFrom: validatedData.salaryFrom,
      salaryTo: validatedData.salaryTo,
      listingDuration: validatedData.listingDuration,
      benefits: validatedData.benefits,
    },
    select: {
      id: true,
    },
  });

  const pricingTier = jobListingDurationPricing.find(
    (tier) => tier.days === validatedData.listingDuration,
  );

  if (!pricingTier) {
    throw new Error("Invalid Listing duration selected");
  }

  const stripeSession = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    line_items: [
      {
        price_data: {
          product_data: {
            name: `Job Posting - ${pricingTier.days} Days`,
            description: pricingTier.description,
            images: [
              "https://wmc43tpuyw.ufs.sh/f/fpPKTfIq2LuO3z7eS6fR1AJKZdO0DyTq2NewVtGIgfM9sQXE",
            ],
          },
          currency: "USD",
          unit_amount: pricingTier.price * 100, // Convert to cents for Stripe
        },
        quantity: 1,
      },
    ],
    metadata: {
      jobId: jobPost.id,
    },
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_URL}/payment/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/payment/cancel`,
  });

  if (!stripeSession.url) {
    throw new Error("Stripe error returned no url");
  }

  return redirect(stripeSession.url);
}
