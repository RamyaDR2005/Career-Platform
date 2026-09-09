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
  let job: any = null;

  try {
    const user = await prisma.user.findUnique({ where: { id: session?.user?.id } });
    if (user?.companyId) {
      job = await prisma.job.findUnique({
        where: { id: jobId, companyId: user.companyId },
        include: {
          applications: {
            include: {
              studentProfile: {
                include: { user: true }
              }
            },
            orderBy: { aiScore: 'desc' }
          }
        }
      });
    }
  } catch (error) {
    console.error("Job applications query error:", error);
  }

  if (!job) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="text-muted-foreground hover:text-foreground">
          <Link href="/recruiter/jobs"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{job.title} Candidates</h1>
          <p className="text-muted-foreground mt-1">Review and manage applicants for this position.</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <ApplicationTable initialApplications={job.applications} />
      </div>
    </div>
  );
}
