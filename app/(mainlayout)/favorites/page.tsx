import { prisma } from "@/lib/db";
import { requireUser } from "@/app/utlis/requireUser";
import { EmptyState } from "@/components/general/EmtyState";
import { JobCard } from "@/components/general/JobCard";

async function getFavorites(userId: string) {
  const data = await prisma.savedJobPost.findMany({
    where: {
      userId: userId,
    },
    select: {
      job: {
        select: {
          id: true,
          jobTitle: true,
          salaryFrom: true,
          salaryTo: true,
          employmentType: true,
          location: true,
          createdAt: true,
          company: {
            select: {
              name: true,
              logo: true,
              location: true,
              about: true,
            },
          },
        },
      },
    },
  });

  return data;
}

export default async function FavoritesPage() {
  const session = await requireUser();
  const data = await getFavorites(session?.user?.id as string);
  if (data.length === 0) {
    return (
      <EmptyState
        title="No favorites found"
        descripton="You dont have any favorites yet"
        buttonText="Find a job"
        href="/"
      />
    );
  }
  return (
    <div className="gird gird-cols-1 mt-5 gap-4">
      {data.map((favorite) => (
        <JobCard key={favorite.job.id} job={favorite.job} />
      ))}
    </div>
  );
}
