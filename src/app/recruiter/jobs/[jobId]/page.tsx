import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ApplicationTable } from "./application-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function JobApplicationsPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params;
  const session = await auth();
  const user = await prisma.user.findUnique({ where: { id: session?.user?.id } });

  const job = await prisma.job.findUnique({
    where: { id: jobId, companyId: user?.companyId! },
    include: {
      applications: {
        include: {
          studentProfile: {
            include: { user: true }
          }
        },
        // In reality, this would order by the specific job match score. For MVP we use the general atsScore.
        orderBy: { studentProfile: { atsScore: 'desc' } }
      }
    }
  });

  if (!job) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="text-zinc-400 hover:text-white">
          <Link href="/recruiter/jobs"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">{job.title} Candidates</h1>
          <p className="text-zinc-400 mt-1">Review and manage applicants for this position.</p>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        <ApplicationTable initialApplications={job.applications} />
      </div>
    </div>
  );
}
