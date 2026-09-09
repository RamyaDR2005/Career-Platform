import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, UserCheck, GraduationCap, Shield, Building2, Briefcase, FileSpreadsheet, MessageSquare, Award } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  let totalStudents = 0;
  let totalRecruiters = 0;
  let totalAdmins = 0;
  let totalCompanies = 0;
  let totalJobs = 0;
  let totalApplications = 0;
  let totalInterviews = 0;
  let totalPlacements = 0;

  let recentUsers: any[] = [];
  let recentRecruiters: any[] = [];
  let recentCompanies: any[] = [];

  try {
    const counts = await Promise.all([
      prisma.user.count({ where: { role: "STUDENT", isDeleted: false } }),
      prisma.user.count({ where: { role: "RECRUITER", isDeleted: false } }),
      prisma.user.count({ where: { role: "ADMIN", isDeleted: false } }),
      prisma.company.count(),
      prisma.job.count(),
      prisma.application.count(),
      prisma.interview.count(),
      prisma.application.count({ where: { status: "HIRED" } }),
    ]);

    totalStudents = counts[0] ?? 0;
    totalRecruiters = counts[1] ?? 0;
    totalAdmins = counts[2] ?? 0;
    totalCompanies = counts[3] ?? 0;
    totalJobs = counts[4] ?? 0;
    totalApplications = counts[5] ?? 0;
    totalInterviews = counts[6] ?? 0;
    totalPlacements = counts[7] ?? 0;
  } catch (error) {
    console.error("Error fetching admin dashboard metrics:", error);
  }

  try {
    recentUsers = await prisma.user.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: "desc" },
      take: 5,
    });
  } catch (error) {
    console.error("Error fetching recent users:", error);
  }

  try {
    recentRecruiters = await prisma.user.findMany({
      where: { role: "RECRUITER", isDeleted: false },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        company: true,
      },
    });
  } catch (error) {
    console.error("Error fetching recent recruiters:", error);
  }

  try {
    recentCompanies = await prisma.company.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    });
  } catch (error) {
    console.error("Error fetching recent companies:", error);
  }

  const statCards = [
    { title: "Total Students", value: totalStudents, icon: Users, color: "text-primary" },
    { title: "Total Recruiters", value: totalRecruiters, icon: UserCheck, color: "text-primary" },
    { title: "Total Admins", value: totalAdmins, icon: Shield, color: "text-pink-400" },
    { title: "Total Companies", value: totalCompanies, icon: Building2, color: "text-amber-400" },
    { title: "Total Jobs", value: totalJobs, icon: Briefcase, color: "text-sky-400" },
    { title: "Total Applications", value: totalApplications, icon: FileSpreadsheet, color: "text-primary" },
    { title: "Total Interviews", value: totalInterviews, icon: MessageSquare, color: "text-primary" },
    { title: "Total Placements", value: totalPlacements, icon: Award, color: "text-yellow-400" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">Platform status overview and statistics.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Card key={idx} className="bg-card border-border shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
                <Icon className={`h-5 w-5 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground tracking-tight">
                  {card.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Total in Database</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Lists Section */}
      <div className="grid gap-6 md:grid-cols-3">
        
        {/* Recent Users */}
        <Card className="bg-card border-border shadow-md">
          <CardHeader>
            <CardTitle className="text-lg text-foreground font-semibold">Recent Users</CardTitle>
            <CardDescription className="text-muted-foreground">Newly registered members.</CardDescription>
          </CardHeader>
          <CardContent>
            {recentUsers.length === 0 ? (
              <div className="text-center text-zinc-600 py-6 text-sm">No recent users.</div>
            ) : (
              <div className="space-y-4">
                {recentUsers.map((u) => (
                  <div key={u.id} className="flex items-center gap-3 border-b border-border pb-3 last:border-0 last:pb-0">
                    <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-bold text-xs uppercase">
                      {u.name ? u.name.slice(0, 2) : "U"}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm text-zinc-200 font-medium truncate">{u.name || "Unnamed User"}</p>
                      <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                    </div>
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground bg-zinc-850 px-2 py-0.5 rounded-full">
                      {u.role.replace("_", " ")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Recruiters */}
        <Card className="bg-card border-border shadow-md">
          <CardHeader>
            <CardTitle className="text-lg text-foreground font-semibold">Recent Recruiters</CardTitle>
            <CardDescription className="text-muted-foreground">Recruiters representing firms.</CardDescription>
          </CardHeader>
          <CardContent>
            {recentRecruiters.length === 0 ? (
              <div className="text-center text-zinc-600 py-6 text-sm">No recent recruiters.</div>
            ) : (
              <div className="space-y-4">
                {recentRecruiters.map((r) => (
                  <div key={r.id} className="flex items-center gap-3 border-b border-border pb-3 last:border-0 last:pb-0">
                    <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-bold text-xs uppercase">
                      {r.name ? r.name.slice(0, 2) : "R"}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm text-zinc-200 font-medium truncate">{r.name || "Unnamed Recruiter"}</p>
                      <p className="text-xs text-muted-foreground truncate">{r.company?.name || "No Company linked"}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Companies */}
        <Card className="bg-card border-border shadow-md">
          <CardHeader>
            <CardTitle className="text-lg text-foreground font-semibold">Recent Companies</CardTitle>
            <CardDescription className="text-muted-foreground">Recently created corporate profiles.</CardDescription>
          </CardHeader>
          <CardContent>
            {recentCompanies.length === 0 ? (
              <div className="text-center text-zinc-600 py-6 text-sm">No recent companies.</div>
            ) : (
              <div className="space-y-4">
                {recentCompanies.map((c) => (
                  <div key={c.id} className="flex items-center gap-3 border-b border-border pb-3 last:border-0 last:pb-0">
                    <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-bold text-xs uppercase">
                      {c.name ? c.name.slice(0, 2) : "C"}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm text-zinc-200 font-medium truncate">{c.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{c.website || "No website"}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
