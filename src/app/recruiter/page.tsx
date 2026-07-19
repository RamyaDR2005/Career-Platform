import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Users, Building2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function RecruiterDashboard() {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id },
    include: { company: true }
  });

  if (!user?.companyId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Building2 className="w-16 h-16 text-zinc-600" />
        <h2 className="text-2xl font-bold text-white">Welcome to the Recruiter Portal</h2>
        <p className="text-zinc-400">Please set up your company profile to start posting jobs.</p>
        <Button asChild className="bg-white text-zinc-950 hover:bg-zinc-200 mt-4">
          <Link href="/recruiter/company">Setup Company Profile</Link>
        </Button>
      </div>
    );
  }

  const jobsCount = await prisma.job.count({
    where: { companyId: user.companyId }
  });

  const applicationsCount = await prisma.application.count({
    where: { job: { companyId: user.companyId } }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
        <p className="text-zinc-400 mt-2">Overview of {user.company?.name}'s recruitment activities.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-100">Active Job Postings</CardTitle>
            <Briefcase className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{jobsCount}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-100">Total Applications</CardTitle>
            <Users className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{applicationsCount}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
