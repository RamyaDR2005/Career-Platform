import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { submitEditRequest } from "@/actions/recruiter";
import { Clock, AlertCircle } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function RecruiterProfilePage() {
  const session = await auth();
  
  if (!session || (session.user as any).role !== "RECRUITER") {
    redirect("/");
  }

  const profile = await prisma.recruiterProfile.findUnique({
    where: { userId: session.user.id }
  });

  if (!profile) {
    return <div>Profile not found.</div>;
  }

  const hasPendingRequest = profile.editRequest && (profile.editRequest as any).status === "PENDING";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">Manage your recruiter information and account details.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card border-border text-foreground">
          <CardHeader>
            <CardTitle>Crucial Information</CardTitle>
            <CardDescription className="text-muted-foreground">
              This information is locked after verification. You must submit a request to change it.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Company Name</Label>
              <div className="p-3 bg-background rounded-md border border-border text-muted-foreground">
                {profile.companyName}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Employee ID</Label>
              <div className="p-3 bg-background rounded-md border border-border text-muted-foreground">
                {profile.employeeId}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Verification Document</Label>
              <div className="p-3 bg-background rounded-md border border-border text-primary break-all">
                <a href={profile.verificationDocUrl} target="_blank" className="hover:underline">
                  View Document
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border text-foreground">
          <CardHeader>
            <CardTitle>Request Changes</CardTitle>
            <CardDescription className="text-muted-foreground">
              Submit a structured request to the administration team to update your crucial info.
            </CardDescription>
          </CardHeader>
          
          {hasPendingRequest ? (
            <CardContent>
              <div className="bg-amber-950/30 border border-amber-900/50 text-amber-500 p-4 rounded-md flex flex-col items-center justify-center text-center space-y-2">
                <Clock className="w-8 h-8" />
                <p className="font-medium">You have a pending edit request.</p>
                <p className="text-sm text-amber-600/80">Please wait for admin approval before submitting another request.</p>
              </div>
            </CardContent>
          ) : (
            <form action={async (formData) => {
              "use server";
              await submitEditRequest({
                companyName: formData.get("companyName") as string,
                employeeId: formData.get("employeeId") as string,
                reason: formData.get("reason") as string,
              });
            }}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">New Company Name (Optional)</Label>
                  <Input 
                    id="companyName" 
                    name="companyName" 
                    placeholder="Leave blank to keep current" 
                    className="bg-background border-border text-foreground placeholder:text-zinc-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employeeId">New Employee ID (Optional)</Label>
                  <Input 
                    id="employeeId" 
                    name="employeeId" 
                    placeholder="Leave blank to keep current"
                    className="bg-background border-border text-foreground placeholder:text-zinc-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Change (Required)</Label>
                  <Input 
                    id="reason" 
                    name="reason" 
                    required
                    placeholder="e.g. Switched departments, changed legal entity"
                    className="bg-background border-border text-foreground placeholder:text-zinc-600"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-zinc-200">
                  Submit Request
                </Button>
              </CardFooter>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
