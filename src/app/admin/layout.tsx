import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, LogOut, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if ((session?.user as any)?.role !== "ADMIN") {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-zinc-950 text-white p-6 text-center space-y-4">
        <div className="w-16 h-16 bg-red-950/30 text-red-500 rounded-full flex items-center justify-center border border-red-900/50">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">403 Unauthorized Access</h1>
        <p className="text-zinc-400 max-w-md">
          You do not have the required permissions to access the administrator portal.
        </p>
        <Button asChild className="bg-white text-zinc-950 hover:bg-zinc-200 mt-4">
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800 bg-zinc-900/50 hidden md:flex flex-col">
        <div className="p-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            Career Platform
          </h2>
          <p className="text-sm text-zinc-400">Admin Portal</p>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-zinc-800 transition-colors">
            <LayoutDashboard className="h-4 w-4 text-zinc-400" /> Dashboard
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-zinc-800 transition-colors">
            <Users className="h-4 w-4 text-zinc-400" /> User Management
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
