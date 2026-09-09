import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileText, Target, BrainCircuit, Sparkles, CheckCircle2, Clock, Calendar, ArrowRight, Award } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  let profile: any = null;
  let dbError = false;

  try {
    profile = await prisma.studentProfile.findUnique({
      where: { userId: session?.user?.id },
      include: {
        applications: {
          include: { 
            job: { include: { company: true } },
            interviews: true
          },
          orderBy: { createdAt: 'desc' }
        },
        roadmaps: {
          orderBy: { createdAt: 'desc' },
          take: 1
        },
        mockInterviews: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    });
  } catch (err) {
    console.error("Dashboard DB query error:", err);
    dbError = true;
  }

  const score = profile?.atsScore || 0;
  
  // Calculate mock interview bonus points (e.g. up to 20 points)
  let mockBonus = profile?.mockInterviews?.length ? Math.min(profile.mockInterviews.length * 5, 20) : 0;
  
  const totalReadinessScore = Math.min(score + mockBonus, 100);

  // Extract scheduled interviews
  const upcomingInterviews = profile?.applications?.flatMap((app: any) => 
    app.interviews.map((inv: any) => ({ ...inv, job: app.job }))
  ).filter((inv: any) => inv.status === 'SCHEDULED')
  .sort((a: any, b: any) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()) || [];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-[#c95a2e] border-0 p-6 sm:p-8">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 border border-white/20 text-white text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Placement Mentor Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome back, <span className="text-white">{session?.user?.name || "Student"}</span>!
            </h1>
            <p className="text-white/90 text-sm leading-relaxed">
              Track your career readiness, ATS resume optimization, skill gaps, and interview prep in real time.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild className="bg-[#fff9f2] hover:bg-white text-[#c95a2e] font-semibold text-xs rounded-xl shadow-lg px-5 h-10 transition-all">
              <Link href="/dashboard/resume" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Upload & Analyze Resume</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        {/* Readiness Score */}
        <Card className="bg-card/60 border-white/10 backdrop-blur-xl relative overflow-hidden group hover:border-primary0/30 transition-all">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary0 to-primary0" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Placement Readiness</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-primary0/10 flex items-center justify-center text-primary">
              <Target className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-foreground tracking-tight">
                {totalReadinessScore ? `${totalReadinessScore}` : "0"}
              </span>
              <span className="text-sm font-semibold text-muted-foreground">/ 100</span>
            </div>
            <div className="w-full bg-muted/80 rounded-full h-2 mt-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-primary0 to-primary0 h-full rounded-full transition-all duration-500"
                style={{ width: `${totalReadinessScore}%` }}
              />
            </div>
            <p className="text-[11px] text-muted-foreground mt-2 flex items-center justify-between">
              <span>Overall placement readiness index</span>
              <span className="text-primary font-semibold">{totalReadinessScore >= 70 ? "High" : totalReadinessScore >= 40 ? "Moderate" : "Needs Work"}</span>
            </p>
          </CardContent>
        </Card>
        
        {/* ATS Resume Score */}
        <Card className="bg-card/60 border-white/10 backdrop-blur-xl relative overflow-hidden group hover:border-primary0/30 transition-all">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary0 to-primary0" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">ATS Resume Score</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-primary0/10 flex items-center justify-center text-primary">
              <FileText className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-foreground tracking-tight">
                {score ? `${score}` : "--"}
              </span>
              <span className="text-sm font-semibold text-muted-foreground">{score ? "/ 100" : ""}</span>
            </div>
            <div className="w-full bg-muted/80 rounded-full h-2 mt-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-primary0 to-primary0 h-full rounded-full transition-all duration-500"
                style={{ width: `${score}%` }}
              />
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">
              {score ? "Watsonx AI ATS compatibility score" : "No resume uploaded yet"}
            </p>
          </CardContent>
        </Card>

        {/* Skill Gap */}
        <Card className="bg-card/60 border-white/10 backdrop-blur-xl relative overflow-hidden group hover:border-primary0/30 transition-all">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary0 to-pink-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Skill Gap Status</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-primary0/10 flex items-center justify-center text-primary">
              <BrainCircuit className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-foreground tracking-tight">
              {profile?.roadmaps?.length ? (
                `${(profile.roadmaps[0].data as any)?.missingSkills?.length || 0} skills`
              ) : "Not generated"}
            </div>
            <p className="text-xs text-primary font-medium mt-1">
              {profile?.roadmaps?.length ? `Target: ${(profile.roadmaps[0] as any).targetRole}` : "Generate your AI career roadmap"}
            </p>
            <Button asChild variant="link" className="px-0 h-auto text-[11px] text-primary hover:text-primary mt-2">
              <Link href="/dashboard/roadmap" className="flex items-center gap-1">
                <span>View Learning Roadmap</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Grid: Applications & Next Steps */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Applications */}
        <Card className="bg-card/60 border-white/10 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base text-foreground font-bold">Recent Applications</CardTitle>
              <CardDescription className="text-muted-foreground text-xs mt-0.5">Track your submitted job applications</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm" className="bg-background border-white/10 text-xs hover:bg-muted">
              <Link href="/dashboard/jobs">Browse Jobs</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {!profile?.applications?.length ? (
              <div className="text-center py-8 px-4 border border-dashed border-border rounded-xl bg-background/40">
                <p className="text-xs text-muted-foreground">You haven't applied to any jobs yet.</p>
                <Button asChild variant="link" className="text-primary text-xs mt-1">
                  <Link href="/dashboard/jobs">Explore top software role recommendations</Link>
                </Button>
              </div>
            ) : (
              profile.applications.slice(0, 4).map((app: any) => (
                <div key={app.id} className="flex items-center justify-between p-3.5 bg-background/60 rounded-xl border border-white/5 hover:border-white/10 transition-all">
                  <div>
                    <h4 className="font-semibold text-sm text-foreground">{app.job.title}</h4>
                    <p className="text-xs text-muted-foreground">{app.job.company.name} • {app.job.location || "Remote"}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                      app.status === "HIRED" ? "bg-primary0/20 text-primary border border-primary0/30" :
                      app.status === "SHORTLISTED" ? "bg-primary0/20 text-primary border border-primary0/30" :
                      app.status === "REJECTED" ? "bg-red-500/20 text-red-300 border border-red-500/30" :
                      "bg-muted text-muted-foreground border border-border"
                    }`}>
                      {app.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Readiness Checklist */}
        <Card className="bg-card/60 border-white/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-base text-foreground font-bold">Placement Action Items</CardTitle>
            <CardDescription className="text-muted-foreground text-xs mt-0.5">Recommended tasks to maximize hiring callbacks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
              score ? 'bg-primary/5 border-primary/20' : 'bg-background/60 border-border'
            }`}>
              <div className="flex items-center gap-3">
                <CheckCircle2 className={`w-5 h-5 ${score ? 'text-primary' : 'text-muted-foreground'}`} />
                <div>
                  <h4 className="font-semibold text-xs text-foreground">1. Optimize Resume with Watsonx AI</h4>
                  <p className="text-[11px] text-muted-foreground">{score ? `Current Score: ${score}/100` : "Upload PDF resume for instant feedback"}</p>
                </div>
              </div>
              <Button asChild size="sm" variant="outline" className="bg-card border-border text-xs text-foreground hover:bg-muted">
                <Link href="/dashboard/resume">{score ? "View Details" : "Upload"}</Link>
              </Button>
            </div>

            <div className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
              profile?.roadmaps?.length ? 'bg-[#78957f]/10 border-[#78957f]/30' : 'bg-background/60 border-border'
            }`}>
              <div className="flex items-center gap-3">
                <BrainCircuit className={`w-5 h-5 ${profile?.roadmaps?.length ? 'text-[#78957f]' : 'text-muted-foreground'}`} />
                <div>
                  <h4 className="font-semibold text-xs text-foreground">2. Generate Career Roadmap</h4>
                  <p className="text-[11px] text-muted-foreground">Target missing skills & project recommendations</p>
                </div>
              </div>
              <Button asChild size="sm" variant="outline" className="bg-card border-border text-xs text-foreground hover:bg-muted">
                <Link href="/dashboard/roadmap">Generate</Link>
              </Button>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-background/60 rounded-xl border border-border">
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-primary" />
                <div>
                  <h4 className="font-semibold text-xs text-foreground">3. AI Technical Mock Interview</h4>
                  <p className="text-[11px] text-muted-foreground">Simulate live technical & behavioral questions</p>
                </div>
              </div>
              <Button asChild size="sm" className="bg-primary hover:opacity-90 text-primary-foreground text-xs font-semibold">
                <Link href="/dashboard/interviews">Start Mock</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Scheduled Interviews */}
      <Card className="bg-card/60 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <CardTitle className="text-base text-foreground font-bold">Scheduled Interviews</CardTitle>
          </div>
          <CardDescription className="text-muted-foreground text-xs">Confirmed interview sessions with recruiters</CardDescription>
        </CardHeader>
        <CardContent>
          {!upcomingInterviews.length ? (
            <div className="text-center py-6 text-xs text-muted-foreground border border-dashed border-border rounded-xl bg-background/40">
              No upcoming live interviews scheduled yet. Applications in progress will appear here when scheduled.
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {upcomingInterviews.map((inv: any) => (
                <div key={inv.id} className="p-4 bg-gradient-to-r from-primary/30 to-primary/20 rounded-xl border border-primary0/20 flex flex-col justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-primary tracking-wider">Confirmed Slot</span>
                    <h4 className="font-bold text-sm text-foreground mt-1">{inv.job.company.name}</h4>
                    <p className="text-xs text-muted-foreground">{inv.job.title}</p>
                    <p className="text-xs text-primary font-medium mt-2 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(inv.scheduledAt).toLocaleString()}</span>
                    </p>
                  </div>
                  {inv.link && (
                    <Button asChild size="sm" className="bg-primary hover:bg-primary0 text-foreground text-xs font-semibold w-full">
                      <a href={inv.link} target="_blank" rel="noreferrer">Join Video Interview</a>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
