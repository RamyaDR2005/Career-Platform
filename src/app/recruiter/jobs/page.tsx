import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { JobsClientList } from "./jobs-client-list";

export default async function JobsPage() {
  const session = await auth();
  let jobs: any[] = [];

  try {
    const user = await prisma.user.findUnique({
      where: { id: session?.user?.id }
    });

    if (user?.companyId) {
      jobs = await prisma.job.findMany({
        where: { companyId: user.companyId },
        include: {
          _count: {
            select: { applications: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    }
  } catch (error) {
    console.error("Recruiter jobs page query error:", error);
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Job Postings</h1>
          <p className="text-muted-foreground mt-2">Manage your active job listings.</p>
        </div>
        <Button asChild className="bg-primary text-primary-foreground hover:opacity-90 rounded-full px-6">
          <Link href="/recruiter/jobs/create">
            <Plus className="w-4 h-4 mr-2" /> Post New Job
          </Link>
        </Button>
      </div>

      <JobsClientList initialJobs={jobs} />
    </div>
  );
}
