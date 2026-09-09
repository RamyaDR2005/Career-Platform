import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { verifyRecruiter, approveEditRequest, rejectEditRequest } from "@/actions/admin";
import { RejectButton } from "./reject-button";
import Link from "next/link";
import { FileText, CheckCircle, XCircle } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function AdminRecruitersPage() {
  const session = await auth();

  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/");
  }

  const pendingRecruiters = await prisma.recruiterProfile.findMany({
    where: { isVerified: false },
    include: { user: true },
    orderBy: { createdAt: "desc" }
  });

  const editRequests = await prisma.recruiterProfile.findMany({
    where: { NOT: { editRequest: { equals: Prisma.AnyNull } } },
    include: { user: true },
    orderBy: { updatedAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Recruiter Verifications</h1>
      <p className="text-muted-foreground">Review pending recruiter applications and verify their identities.</p>

      <Card className="bg-card border-border text-foreground">
        <CardHeader>
          <CardTitle>Pending Approvals ({pendingRecruiters.length})</CardTitle>
          <CardDescription className="text-muted-foreground">
            Ensure recruiters have provided valid employment documentation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingRecruiters.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No pending recruiter applications.</p>
            </div>
          ) : (
            <div className="rounded-md border border-border">
              <Table>
                <TableHeader className="bg-background/50">
                  <TableRow className="border-border hover:bg-card/50">
                    <TableHead className="text-muted-foreground">Name</TableHead>
                    <TableHead className="text-muted-foreground">Email</TableHead>
                    <TableHead className="text-muted-foreground">Company</TableHead>
                    <TableHead className="text-muted-foreground">Emp ID</TableHead>
                    <TableHead className="text-muted-foreground">Document</TableHead>
                    <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingRecruiters.map((profile) => (
                    <TableRow key={profile.id} className="border-border hover:bg-muted">
                      <TableCell className="font-medium">{profile.user.name}</TableCell>
                      <TableCell className="text-muted-foreground">{profile.user.email}</TableCell>
                      <TableCell>{profile.companyName}</TableCell>
                      <TableCell>{profile.employeeId}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" asChild className="border-border bg-muted text-muted-foreground hover:bg-zinc-700 hover:text-foreground">
                          <Link href={profile.verificationDocUrl} target="_blank">
                            <FileText className="w-4 h-4 mr-2" /> View Doc
                          </Link>
                        </Button>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <form className="inline" action={async () => {
                          "use server";
                          await verifyRecruiter(profile.id);
                        }}>
                          <Button size="sm" type="submit" className="bg-primary hover:bg-primary0 text-foreground">
                            <CheckCircle className="w-4 h-4 mr-1" /> Approve
                          </Button>
                        </form>
                        <RejectButton profileId={profile.id} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pending Edit Requests Section */}
      <Card className="bg-card border-border text-foreground mt-8">
        <CardHeader>
          <CardTitle>Pending Edit Requests ({editRequests.length})</CardTitle>
          <CardDescription className="text-muted-foreground">
            Verified recruiters requesting updates to their company details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {editRequests.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No pending edit requests.</p>
            </div>
          ) : (
            <div className="rounded-md border border-border">
              <Table>
                <TableHeader className="bg-background/50">
                  <TableRow className="border-border hover:bg-card/50">
                    <TableHead className="text-muted-foreground">Recruiter</TableHead>
                    <TableHead className="text-muted-foreground">Current Data</TableHead>
                    <TableHead className="text-muted-foreground">Requested Changes</TableHead>
                    <TableHead className="text-muted-foreground">Document</TableHead>
                    <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {editRequests.map((profile) => {
                    const req = profile.editRequest as any;
                    return (
                      <TableRow key={profile.id} className="border-border hover:bg-muted">
                        <TableCell>
                          <div className="font-medium">{profile.user.name}</div>
                          <div className="text-xs text-muted-foreground">{profile.user.email}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm"><span className="text-muted-foreground">Co:</span> {profile.companyName}</div>
                          <div className="text-sm"><span className="text-muted-foreground">ID:</span> {profile.employeeId}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-semibold text-primary"><span className="text-muted-foreground font-normal">Co:</span> {req.companyName || profile.companyName}</div>
                          <div className="text-sm font-semibold text-primary"><span className="text-muted-foreground font-normal">ID:</span> {req.employeeId || profile.employeeId}</div>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" asChild className="border-border bg-muted text-muted-foreground hover:bg-zinc-700 hover:text-foreground">
                            <Link href={req.verificationDocUrl || profile.verificationDocUrl} target="_blank">
                              <FileText className="w-4 h-4 mr-2" /> View New Doc
                            </Link>
                          </Button>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <form className="inline" action={async () => {
                            "use server";
                            await approveEditRequest(profile.id);
                          }}>
                            <Button size="sm" type="submit" className="bg-primary hover:bg-primary0 text-foreground">
                              <CheckCircle className="w-4 h-4 mr-1" /> Approve
                            </Button>
                          </form>
                          <form className="inline" action={async () => {
                            "use server";
                            await rejectEditRequest(profile.id);
                          }}>
                            <Button size="sm" variant="destructive" type="submit" className="bg-red-900 hover:bg-red-800 text-foreground">
                              <XCircle className="w-4 h-4 mr-1" /> Reject
                            </Button>
                          </form>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
