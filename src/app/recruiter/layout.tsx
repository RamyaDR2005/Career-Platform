import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ShieldAlert, Clock } from "lucide-react";
import { SidebarNav, NavItem } from "@/components/sidebar-nav";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { SignOutButton } from "@/components/sign-out-button";
import { ReapplyForm } from "./reapply-form";

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
      <div className="flex h-screen flex-col items-center justify-center bg-background text-foreground p-6 text-center space-y-4">
        <div className="w-16 h-16 bg-destructive/10 text-red-500 rounded-full flex items-center justify-center border border-destructive/20">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">403 Unauthorized Access</h1>
        <p className="text-muted-foreground max-w-md">
          You do not have recruiter permissions to access this portal.
        </p>
        <Button asChild className="bg-primary text-primary-foreground hover:opacity-90 rounded-full px-6 mt-4">
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    );
  }

  let user: any = null;

  try {
    user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { 
        companyId: true,
        recruiterProfile: true 
      }
    });
  } catch (error) {
    console.error("Recruiter layout query error:", error);
  }

  const isVerified = user?.recruiterProfile?.isVerified ?? false;

  if (!isVerified) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4" style={{ backgroundColor: "#f7f1e7", color: "#1c211d", fontFamily: "'Canela', serif" }}>
        <div className="max-w-md w-full bg-[#fff9f2] p-8 rounded-2xl shadow-[rgba(201,90,46,0.35)_0px_8px_25px_0px] text-center space-y-6 border border-[#ded3c5]">
          {user?.recruiterProfile?.rejectionNote ? (
            <>
              <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
                <ShieldAlert className="w-10 h-10" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-red-600">Application Rejected</h1>
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-left">
                <p className="text-sm font-semibold text-red-700 mb-1">Reason for rejection:</p>
                <p className="text-sm text-red-600/90">{user.recruiterProfile.rejectionNote}</p>
              </div>
              <p style={{ color: "#706b63" }} className="text-sm">
                Your recruiter account could not be verified. Please resolve the issues mentioned above and contact support, or re-upload your document below.
              </p>
              <ReapplyForm />
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-[#c95a2e]/10 text-[#c95a2e] rounded-full flex items-center justify-center mx-auto border border-[#c95a2e]/20">
                <Clock className="w-10 h-10" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Pending Verification</h1>
              <p style={{ color: "#706b63" }}>
                Your recruiter account is currently being reviewed by our administrative team.
                Once your identity and employment details are verified, you will gain full access to the portal.
              </p>
            </>
          )}
          <div className="pt-4 flex flex-col space-y-3">
            <SignOutButton className="w-full text-foreground transition-colors" style={{ backgroundColor: "#c95a2e", borderRadius: "33554400px" }} />
          </div>
        </div>
      </div>
    );
  }

  const recruiterNavItems: NavItem[] = [
    { title: "Dashboard", href: "/recruiter", iconName: "dashboard" },
    { title: "My Profile", href: "/recruiter/profile", iconName: "profile" as any },
    { title: "Company Profile", href: "/recruiter/company", iconName: "company", badge: !user?.companyId ? "Setup Required" : undefined, badgeClass: "bg-amber-500/20 text-amber-300 border border-amber-500/30" },
    ...(user?.companyId ? [{ title: "Job Postings", href: "/recruiter/jobs", iconName: "jobs" as const }] : []),
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground selection:bg-primary0/30 font-sans">
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
