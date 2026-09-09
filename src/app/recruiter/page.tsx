import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Briefcase, Users, Building2, Plus, Sparkles, ChevronRight, UserCheck, Calendar } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function RecruiterDashboard() {
  const session = await auth();
  let user: any = null;
  let jobs: any[] = [];
  let jobsCount = 0;
  let applicationsCount = 0;
  let shortlistedCount = 0;
  let hiredCount = 0;

  try {
    user = await prisma.user.findUnique({
      where: { id: session?.user?.id },
      include: { company: true }
    });

    if (user?.companyId) {
      jobs = await prisma.job.findMany({
        where: { companyId: user.companyId },
        include: {
          _count: {
            select: { applications: true }
          }
        },
        orderBy: { createdAt: "desc" },
        take: 5
      });
      jobsCount = jobs.length;

      applicationsCount = await prisma.application.count({
        where: { job: { companyId: user.companyId } }
      });

      shortlistedCount = await prisma.application.count({
        where: { job: { companyId: user.companyId }, status: "SHORTLISTED" }
      });

      hiredCount = await prisma.application.count({
        where: { job: { companyId: user.companyId }, status: "HIRED" }
      });
    }
  } catch (error) {
    console.error("Recruiter dashboard query error:", error);
  }

  if (!user?.companyId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[65vh] space-y-5 text-center p-6 bg-card/40 border border-white/10 rounded-2xl backdrop-blur-xl">
        <div className="w-16 h-16 bg-primary0/10 rounded-2xl flex items-center justify-center text-primary border border-primary0/20 shadow-lg shadow-primary0/10">
          <Building2 className="w-8 h-8" />
        </div>
        <div className="max-w-md space-y-2">
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Setup Corporate Profile</h2>
          <p className="text-muted-foreground text-sm">
            To post jobs, review AI-ranked candidate resumes, and schedule interviews, please complete your company profile details.
          </p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary0 text-foreground font-semibold text-xs px-6 h-10 rounded-xl shadow-lg shadow-primary/20 transition-all mt-2">
          <Link href="/recruiter/company">Setup Company Profile</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/50 via-zinc-900/60 to-primary/40 border border-white/10 p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary0/10 border border-primary0/20 text-primary text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Watsonx AI Candidate Ranking Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {user.company?.name} Dashboard
            </h1>
            <p className="text-muted-foreground text-sm">
              Manage your job openings, automated AI match scoring, and candidate pipelines.
            </p>
          </div>
          <Button asChild className="bg-primary hover:bg-primary0 text-foreground font-semibold text-xs px-5 h-10 rounded-xl shadow-lg shadow-primary/25 transition-all shrink-0">
            <Link href="/recruiter/jobs/create" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span>Post New Job</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card/60 border-white/10 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-primary0" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Active Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-foreground tracking-tight">{jobsCount}</div>
            <p className="text-[11px] text-muted-foreground mt-1">Total open listings</p>
          </CardContent>
        </Card>

        <Card className="bg-card/60 border-white/10 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-primary0" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Applicants</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-foreground tracking-tight">{applicationsCount}</div>
            <p className="text-[11px] text-muted-foreground mt-1">Submissions across all jobs</p>
          </CardContent>
        </Card>

        <Card className="bg-card/60 border-white/10 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-amber-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Shortlisted</CardTitle>
            <UserCheck className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-foreground tracking-tight">{shortlistedCount}</div>
            <p className="text-[11px] text-muted-foreground mt-1">Qualified candidates</p>
          </CardContent>
        </Card>

        <Card className="bg-card/60 border-white/10 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-primary0" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Hired Candidates</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-foreground tracking-tight">{hiredCount}</div>
            <p className="text-[11px] text-muted-foreground mt-1">Offers accepted</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Jobs Section */}
      <Card className="bg-card/60 border-white/10 backdrop-blur-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base text-foreground font-bold">Recent Job Postings</CardTitle>
            <CardDescription className="text-muted-foreground text-xs mt-0.5">Click a job to view AI candidate ranking & application table</CardDescription>
          </div>
          <Button asChild variant="outline" size="sm" className="bg-background border-white/10 text-xs hover:bg-muted">
            <Link href="/recruiter/jobs">View All Postings</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {!jobs.length ? (
            <div className="text-center py-10 border border-dashed border-border rounded-xl bg-background/40">
              <p className="text-xs text-muted-foreground">No jobs posted yet.</p>
              <Button asChild className="bg-primary hover:bg-primary0 text-foreground text-xs mt-3">
                <Link href="/recruiter/jobs/create">Create Your First Job Posting</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between p-4 bg-background/60 rounded-xl border border-white/5 hover:border-primary0/30 transition-all group">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{job.title}</h4>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        job.status === "OPEN" ? "bg-primary0/20 text-primary border border-primary0/30" : "bg-muted text-muted-foreground"
                      }`}>
                        {job.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {job.location || "Remote"} • Salary: {job.salary || "Competitive"}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs font-bold text-foreground">{job._count.applications} Applicants</p>
                      <p className="text-[10px] text-muted-foreground">Submissions</p>
                    </div>
                    <Button asChild size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-white/5">
                      <Link href={`/recruiter/jobs/${job.id}`}>
                        <span>Review</span>
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
