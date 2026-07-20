import prisma from "@/lib/prisma";
import { UsersTableClient } from "./users-table-client";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  if ((session?.user as any)?.role !== "ADMIN") {
    redirect("/");
  }

  const resolvedParams = await searchParams;

  const page = parseInt((resolvedParams.page as string) || "1", 10);
  const limit = 10;
  const skip = (page - 1) * limit;

  const q = ((resolvedParams.q as string) || "").trim();
  const role = (resolvedParams.role as string) || "";
  const status = (resolvedParams.status as string) || "";
  const dateRange = (resolvedParams.date as string) || "";
  const sort = (resolvedParams.sort as string) || "newest";

  const where: any = {};

  // Search Filter
  if (q) {
    const isRoleQuery = ["STUDENT", "RECRUITER", "ADMIN"].includes(q.toUpperCase());
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      ...(isRoleQuery ? [{ role: q.toUpperCase() as any }] : []),
    ];
  }

  // Role Filter
  if (role) {
    where.role = role;
  }

  // Status Filter
  if (status === "ACTIVE") {
    where.isDeleted = false;
    where.isActive = true;
  } else if (status === "DISABLED") {
    where.isDeleted = false;
    where.isActive = false;
  } else if (status === "DELETED") {
    where.isDeleted = true;
  } else {
    // Show non-deleted users by default
    where.isDeleted = false;
  }

  // Created Date Filter
  if (dateRange) {
    const now = new Date();
    const gteDate = new Date();
    if (dateRange === "today") {
      gteDate.setDate(now.getDate() - 1);
    } else if (dateRange === "week") {
      gteDate.setDate(now.getDate() - 7);
    } else if (dateRange === "month") {
      gteDate.setMonth(now.getMonth() - 1);
    } else if (dateRange === "year") {
      gteDate.setFullYear(now.getFullYear() - 1);
    }
    where.createdAt = { gte: gteDate };
  }

  // Sorting
  let orderBy: any = { createdAt: "desc" };
  if (sort === "name-asc") {
    orderBy = { name: "asc" };
  } else if (sort === "name-desc") {
    orderBy = { name: "desc" };
  } else if (sort === "oldest") {
    orderBy = { createdAt: "asc" };
  }

  let users: any[] = [];
  let totalCount = 0;

  try {
    const [fetchedUsers, fetchedCount] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          studentProfile: true,
          company: true,
        },
      }),
      prisma.user.count({ where }),
    ]);
    users = fetchedUsers;
    totalCount = fetchedCount;
  } catch (error) {
    console.error("Error fetching users list:", error);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">User Management</h1>
        <p className="text-zinc-400 mt-2">Manage student, recruiter, and administrator accounts.</p>
      </div>

      <UsersTableClient
        initialUsers={users}
        totalCount={totalCount}
        currentPage={page}
        limit={limit}
        initialFilters={{ q, role, status, date: dateRange, sort }}
      />
    </div>
  );
}
