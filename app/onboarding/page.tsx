import { OnboardingForm } from "@/components/forms/onboarding/OnboardingForm";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { requireUser } from "../utlis/requireUser";

async function checkIfUserHasFinishedOnBoarding(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      onBoardingCompleted: true,
    },
  });
  if (user?.onBoardingCompleted === true) {
    return redirect("/");
  }

  return user;
}

export default async function OnBoardingPage() {
  const session = await requireUser();
  if (!session?.user) {
    return redirect("/login");
  }
  await checkIfUserHasFinishedOnBoarding(session.user.id as string);
  return (
    <div className="min-h-screen w-screen py-10 flex flex-col items-center justify-center">
      <OnboardingForm />
    </div>
  );
}
