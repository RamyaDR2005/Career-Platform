import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ProfileForm } from "./profile-form";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const profile = await prisma.studentProfile.findUnique({
    where: { userId: session.user.id },
    include: { user: true }
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">My Profile</h1>
        <p className="text-zinc-400 mt-2">Manage your academic and professional details.</p>
      </div>

      <ProfileForm initialData={profile || { user: session.user }} />
    </div>
  );
}
