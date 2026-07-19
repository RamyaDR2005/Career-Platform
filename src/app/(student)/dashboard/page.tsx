import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileText, Target, BrainCircuit } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  const profile = await prisma.studentProfile.findUnique({
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

  const score = profile?.atsScore || 0;
  
  // Calculate mock interview bonus points (e.g. up to 20 points)
  let mockBonus = profile?.mockInterviews?.length ? Math.min(profile.mockInterviews.length * 5, 20) : 0;
  
  const totalReadinessScore = Math.min(score + mockBonus, 100);

  // Extract upcoming interviews
  const upcomingInterviews = profile?.applications.flatMap(app => 
    app.interviews.map(inv => ({ ...inv, job: app.job }))
  ).filter(inv => inv.status === 'SCHEDULED' && new Date(inv.scheduledAt) > new Date())
  .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {session?.user?.name}</h1>
        <p className="text-zinc-400 mt-2">Here is your career readiness overview.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-100">Placement Readiness</CardTitle>
            <Target className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {totalReadinessScore ? `${totalReadinessScore}/100` : "Pending"}
            </div>
            <p className="text-xs text-zinc-400 mt-1">Holistic Score</p>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-100">ATS Score</CardTitle>
            <FileText className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{score ? `${score}/100` : "--"}</div>
            <p className="text-xs text-zinc-400 mt-1">{score ? "Analyzed by Watsonx AI" : "No resume analyzed yet"}</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-100">Skill Gap</CardTitle>
            <BrainCircuit className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {profile?.roadmaps?.length ? (
                `${(profile.roadmaps[0].data as any)?.missingSkills?.length || 0} missing`
              ) : "Unknown"}
            </div>
            <p className="text-xs text-zinc-400 mt-1">For your target role</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-zinc-100">Recent Applications</CardTitle>
            <CardDescription className="text-zinc-400">Track the status of your job applications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!profile?.applications?.length ? (
              <div className="text-sm text-zinc-500 text-center py-4">
                You haven't applied to any jobs yet.
                <Button asChild variant="link" className="text-blue-500 block mt-2">
                  <Link href="/dashboard/jobs">Browse Jobs</Link>
                </Button>
              </div>
            ) : (
              profile.applications.map((app) => (
                <div key={app.id} className="flex items-center justify-between p-4 bg-zinc-950 rounded-lg border border-zinc-800">
                  <div>
                    <h4 className="font-medium text-zinc-100">{app.job.title}</h4>
                    <p className="text-sm text-zinc-400">{app.job.company.name}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium px-2 py-1 bg-zinc-800 rounded-md text-zinc-300">
                      {app.status}
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-zinc-100">Next Steps</CardTitle>
            <CardDescription className="text-zinc-400">Complete these to get placement ready</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className={`flex items-center justify-between p-4 bg-zinc-950 rounded-lg border ${score ? 'border-emerald-900/50' : 'border-zinc-800'}`}>
              <div>
                <h4 className="font-medium text-zinc-100">1. Upload Resume</h4>
                <p className="text-sm text-zinc-400">Get your resume analyzed by AI</p>
              </div>
              <Button asChild variant="outline" className="bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700">
                <Link href="/dashboard/resume">{score ? "View Analysis" : "Upload"}</Link>
              </Button>
            </div>
            <div className={`flex items-center justify-between p-4 bg-zinc-950 rounded-lg border ${profile?.applications?.length ? 'border-emerald-900/50' : 'border-zinc-800'}`}>
              <div>
                <h4 className="font-medium text-zinc-100">2. Apply for Jobs</h4>
                <p className="text-sm text-zinc-400">Start sending out applications</p>
              </div>
              <Button asChild variant="outline" className="bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700">
                <Link href="/dashboard/jobs">Browse</Link>
              </Button>
            </div>
            <div className={`flex items-center justify-between p-4 bg-zinc-950 rounded-lg border border-zinc-800`}>
              <div>
                <h4 className="font-medium text-zinc-100">3. Take Mock Interview</h4>
                <p className="text-sm text-zinc-400">Practice your interviewing skills</p>
              </div>
              <Button asChild variant="outline" className="bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700">
                <Link href="/dashboard/interviews">Start</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-zinc-100">Upcoming Interviews</CardTitle>
            <CardDescription className="text-zinc-400">Your scheduled interviews with recruiters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!upcomingInterviews.length ? (
              <div className="text-sm text-zinc-500 text-center py-4">
                No upcoming interviews scheduled yet. Keep applying!
              </div>
            ) : (
              upcomingInterviews.map((inv: any) => (
                <div key={inv.id} className="flex items-center justify-between p-4 bg-blue-950/20 rounded-lg border border-blue-900/50">
                  <div>
                    <h4 className="font-medium text-white">{inv.job.company.name}</h4>
                    <p className="text-sm text-zinc-400">{inv.job.title}</p>
                    <p className="text-xs text-blue-400 mt-1 font-medium">{new Date(inv.scheduledAt).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    {inv.link && (
                      <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                        <a href={inv.link} target="_blank" rel="noreferrer">Join Meeting</a>
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
