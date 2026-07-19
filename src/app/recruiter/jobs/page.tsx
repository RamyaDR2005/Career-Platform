import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { JobsClientList } from "./jobs-client-list";

export default async function JobsPage() {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id }
  });

  const jobs = await prisma.job.findMany({
    where: { companyId: user?.companyId! },
    include: {
      _count: {
        select: { applications: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Job Postings</h1>
          <p className="text-zinc-400 mt-2">Manage your active job listings.</p>
        </div>
        <Button asChild className="bg-white text-zinc-950 hover:bg-zinc-200">
          <Link href="/recruiter/jobs/create">
            <Plus className="w-4 h-4 mr-2" /> Post New Job
          </Link>
        </Button>
      </div>

      <JobsClientList initialJobs={jobs} />
    </div>
  );
}
