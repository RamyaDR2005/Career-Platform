import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CompanyForm } from "./company-form";

export default async function CompanyProfilePage() {
  const session = await auth();
  let user: any = null;

  try {
    user = await prisma.user.findUnique({
      where: { id: session?.user?.id },
      include: { company: true }
    });
  } catch (error) {
    console.error("Recruiter company profile query error:", error);
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Company Profile</h1>
        <p className="text-zinc-400 mt-2">Manage your organization's details.</p>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-zinc-100">Organization Details</CardTitle>
          <CardDescription className="text-zinc-400">
            This information will be visible to students applying for your jobs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CompanyForm initialData={user?.company} />
        </CardContent>
      </Card>
    </div>
  );
}
