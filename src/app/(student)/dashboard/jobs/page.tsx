import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { MapPin, DollarSign, Building2, Briefcase } from "lucide-react";
import { ApplyButton } from "./apply-button";
import { CoverLetterModal } from "./cover-letter-modal";
import { CustomCoverLetterModal } from "./custom-cover-letter-modal";
import { StudentJobsClientList } from "./student-jobs-client-list";

export default async function JobsBoardPage() {
  const session = await auth();
  let jobs: any[] = [];
  let appliedJobIds = new Set<string>();

  try {
    const user = await prisma.user.findUnique({
      where: { id: session?.user?.id },
      include: { studentProfile: true }
    });

    const fetchedJobs = await prisma.job.findMany({
      include: { company: true },
      orderBy: { createdAt: 'desc' }
    });
    jobs = fetchedJobs;

    const applications = user?.studentProfile 
      ? await prisma.application.findMany({
          where: { studentProfileId: user.studentProfile.id },
          select: { jobId: true }
        })
      : [];
      
    appliedJobIds = new Set(applications.map(a => a.jobId));
  } catch (error) {
    console.error("Student jobs page query error:", error);
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Jobs Board</h1>
        <p className="text-muted-foreground mt-2">Discover and apply to new opportunities.</p>
      </div>

      <Card className="bg-gradient-to-r from-primary/20 to-primary/10 border-primary/30">
        <CardContent className="flex flex-col sm:flex-row items-center justify-between p-6 gap-4">
          <div>
            <h3 className="font-semibold text-foreground text-lg">Applying somewhere else?</h3>
            <p className="text-sm text-muted-foreground">Generate a tailored cover letter for any external job posting.</p>
          </div>
          <CustomCoverLetterModal />
        </CardContent>
      </Card>

      <StudentJobsClientList initialJobs={jobs} appliedJobIds={Array.from(appliedJobIds)} />
    </div>
  );
}
