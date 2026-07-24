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
      <div className="flex flex-col items-center justify-center min-h-[65vh] space-y-5 text-center p-6 bg-zinc-900/40 border border-white/10 rounded-2xl backdrop-blur-xl">
        <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-500/10">
          <Building2 className="w-8 h-8" />
        </div>
        <div className="max-w-md space-y-2">
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Setup Corporate Profile</h2>
          <p className="text-zinc-400 text-sm">
            To post jobs, review AI-ranked candidate resumes, and schedule interviews, please complete your company profile details.
          </p>
        </div>
        <Button asChild className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-6 h-10 rounded-xl shadow-lg shadow-blue-600/20 transition-all mt-2">
          <Link href="/recruiter/company">Setup Company Profile</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950/50 via-zinc-900/60 to-indigo-950/40 border border-white/10 p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Watsonx AI Candidate Ranking Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {user.company?.name} Dashboard
            </h1>
            <p className="text-zinc-400 text-sm">
              Manage your job openings, automated AI match scoring, and candidate pipelines.
            </p>
          </div>
          <Button asChild className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-5 h-10 rounded-xl shadow-lg shadow-blue-600/25 transition-all shrink-0">
            <Link href="/recruiter/jobs/create" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span>Post New Job</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-zinc-900/60 border-white/10 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-blue-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-zinc-400">Active Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-white tracking-tight">{jobsCount}</div>
            <p className="text-[11px] text-zinc-500 mt-1">Total open listings</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/60 border-white/10 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-indigo-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-zinc-400">Total Applicants</CardTitle>
            <Users className="h-4 w-4 text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-white tracking-tight">{applicationsCount}</div>
            <p className="text-[11px] text-zinc-500 mt-1">Submissions across all jobs</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/60 border-white/10 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-amber-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-zinc-400">Shortlisted</CardTitle>
            <UserCheck className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-white tracking-tight">{shortlistedCount}</div>
            <p className="text-[11px] text-zinc-500 mt-1">Qualified candidates</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/60 border-white/10 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-emerald-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-zinc-400">Hired Candidates</CardTitle>
            <Calendar className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-white tracking-tight">{hiredCount}</div>
            <p className="text-[11px] text-zinc-500 mt-1">Offers accepted</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Jobs Section */}
      <Card className="bg-zinc-900/60 border-white/10 backdrop-blur-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base text-zinc-100 font-bold">Recent Job Postings</CardTitle>
            <CardDescription className="text-zinc-400 text-xs mt-0.5">Click a job to view AI candidate ranking & application table</CardDescription>
          </div>
          <Button asChild variant="outline" size="sm" className="bg-zinc-950 border-white/10 text-xs hover:bg-zinc-800">
            <Link href="/recruiter/jobs">View All Postings</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {!jobs.length ? (
            <div className="text-center py-10 border border-dashed border-zinc-800 rounded-xl bg-zinc-950/40">
              <p className="text-xs text-zinc-500">No jobs posted yet.</p>
              <Button asChild className="bg-blue-600 hover:bg-blue-500 text-white text-xs mt-3">
                <Link href="/recruiter/jobs/create">Create Your First Job Posting</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between p-4 bg-zinc-950/60 rounded-xl border border-white/5 hover:border-blue-500/30 transition-all group">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm text-zinc-100 group-hover:text-blue-400 transition-colors">{job.title}</h4>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        job.status === "OPEN" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-zinc-800 text-zinc-400"
                      }`}>
                        {job.status}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">
                      {job.location || "Remote"} • Salary: {job.salary || "Competitive"}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs font-bold text-white">{job._count.applications} Applicants</p>
                      <p className="text-[10px] text-zinc-500">Submissions</p>
                    </div>
                    <Button asChild size="sm" variant="ghost" className="text-zinc-400 hover:text-white hover:bg-white/5">
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
