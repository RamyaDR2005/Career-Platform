import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { SidebarNav, NavItem } from "@/components/sidebar-nav";
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
      <div className="flex h-screen flex-col items-center justify-center bg-background text-foreground p-6 text-center space-y-4">
        <div className="w-16 h-16 bg-destructive/10 text-red-500 rounded-full flex items-center justify-center border border-destructive/20">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">403 Unauthorized Access</h1>
        <p className="text-muted-foreground max-w-md">
          You do not have student credentials to access this portal.
        </p>
        <Button asChild className="bg-primary text-primary-foreground hover:opacity-90 rounded-full px-6 mt-4">
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    );
  }

  const studentNavItems: NavItem[] = [
    { title: "Dashboard", href: "/dashboard", iconName: "home" },
    { title: "My Profile", href: "/dashboard/profile", iconName: "user" },
    { title: "Resume Center", href: "/dashboard/resume", iconName: "file-text" },
    { title: "Career Roadmap", href: "/dashboard/roadmap", iconName: "roadmap", badge: "AI", badgeClass: "bg-primary0/20 text-primary border border-primary0/30" },
    { title: "Job Openings", href: "/dashboard/jobs", iconName: "jobs" },
    { title: "Mock Interviews", href: "/dashboard/interviews", iconName: "interviews", badge: "AI", badgeClass: "bg-primary0/20 text-primary border border-primary0/30" },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground selection:bg-primary0/30 font-sans">
      <SidebarNav
        portalName="Student Portal"
        items={studentNavItems}
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
