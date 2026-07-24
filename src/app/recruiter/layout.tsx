import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { SidebarNav, NavItem } from "@/components/sidebar-nav";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";

export default async function RecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (session?.user?.role !== "RECRUITER") {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-zinc-950 text-white p-6 text-center space-y-4">
        <div className="w-16 h-16 bg-red-950/30 text-red-500 rounded-full flex items-center justify-center border border-red-900/50">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">403 Unauthorized Access</h1>
        <p className="text-zinc-400 max-w-md">
          You do not have recruiter permissions to access this portal.
        </p>
        <Button asChild className="bg-white text-zinc-950 hover:bg-zinc-200 mt-4">
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    );
  }

  let user: any = null;

  try {
    user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { companyId: true }
    });
  } catch (error) {
    console.error("Recruiter layout query error:", error);
  }

  const recruiterNavItems: NavItem[] = [
    { title: "Dashboard", href: "/recruiter", iconName: "dashboard" },
    { title: "Company Profile", href: "/recruiter/company", iconName: "company", badge: !user?.companyId ? "Setup Required" : undefined, badgeClass: "bg-amber-500/20 text-amber-300 border border-amber-500/30" },
    ...(user?.companyId ? [{ title: "Job Postings", href: "/recruiter/jobs", iconName: "jobs" as const }] : []),
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#030409] text-zinc-100 selection:bg-blue-500/30 font-sans">
      <SidebarNav
        portalName="Recruiter Portal"
        items={recruiterNavItems}
        user={session.user}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-14 md:pt-0">
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
