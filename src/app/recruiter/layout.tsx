import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Building2, Briefcase, Users, LogOut } from "lucide-react";
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
      <div className="flex h-screen items-center justify-center bg-zinc-950 text-white">
        <h1 className="text-2xl font-bold">Unauthorized Access</h1>
      </div>
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { companyId: true }
  });

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800 bg-zinc-900/50 hidden md:flex flex-col">
        <div className="p-6">
          <h2 className="text-lg font-bold text-white">Career Platform</h2>
          <p className="text-sm text-zinc-400">Recruiter Portal</p>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href="/recruiter" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-zinc-800 transition-colors">
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </Link>
          <Link href="/recruiter/company" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-zinc-800 transition-colors">
            <Building2 className="h-4 w-4" /> Company Profile
          </Link>
          {user?.companyId ? (
            <>
              <Link href="/recruiter/jobs" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-zinc-800 transition-colors">
                <Briefcase className="h-4 w-4" /> Job Postings
              </Link>
            </>
          ) : (
            <div className="px-3 py-2 text-xs text-orange-400 opacity-80 border border-orange-900/30 bg-orange-900/10 rounded-md mt-4">
              Setup Company Profile to unlock Job Postings.
            </div>
          )}
        </nav>
        <div className="p-4 border-t border-zinc-800">
          <Button variant="ghost" className="w-full justify-start text-zinc-400 hover:text-white" asChild>
            <Link href="/api/auth/signout">
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Link>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
