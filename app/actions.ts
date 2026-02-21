"use server";

import z from "zod";
import { requireUser } from "./utlis/requireUser";
import { companySchema, jobSeekerSchema } from "./utlis/zodSchemas";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export async function createCompany(data: z.infer<typeof companySchema>) {
  const session = await requireUser();

  if (!session?.user) {
    throw new Error("no user, please login");
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
