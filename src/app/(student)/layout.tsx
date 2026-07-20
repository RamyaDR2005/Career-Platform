import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Home, User, FileText, Briefcase, MessageSquare, LogOut, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (session?.user?.role !== "STUDENT") {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950 text-white">
        <h1 className="text-2xl font-bold">Unauthorized Access</h1>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800 bg-zinc-900/50 hidden md:flex flex-col">
        <div className="p-6">
          <h2 className="text-lg font-bold">Career Platform</h2>
          <p className="text-sm text-zinc-400">Student Portal</p>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-zinc-800 transition-colors">
            <Home className="h-4 w-4" /> Dashboard
          </Link>
          <Link href="/dashboard/profile" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-zinc-800 transition-colors">
            <User className="h-4 w-4" /> My Profile
          </Link>
          <Link href="/dashboard/resume" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-zinc-800 transition-colors">
            <FileText className="h-4 w-4" /> Resume Center
          </Link>
          <Link href="/dashboard/roadmap" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-zinc-800 transition-colors text-purple-400">
            <BrainCircuit className="h-4 w-4" /> Career Roadmap
          </Link>
          <Link href="/dashboard/jobs" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-zinc-800 transition-colors">
            <Briefcase className="h-4 w-4" /> Jobs
          </Link>
          <Link href="/dashboard/interviews" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-zinc-800 transition-colors">
            <MessageSquare className="h-4 w-4" /> Mock Interviews
          </Link>
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
