"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

// Security helper
async function checkAdminAuth() {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    throw new Error("Unauthorized. Admin access only.");
  }
  return session;
}

export async function updateUser(id: string, data: { name: string; email: string; role: Role }) {
  try {
    await checkAdminAuth();

    if (!data.name?.trim() || !data.email?.trim() || !data.role) {
      return { error: "All fields are required." };
    }

    // Verify email uniqueness
    const existing = await prisma.user.findUnique({
      where: { email: data.email.trim() },
    });

    if (existing && existing.id !== id) {
      return { error: "Email address is already in use by another user." };
    }

    await prisma.user.update({
      where: { id },
      data: {
        name: data.name.trim(),
        email: data.email.trim(),
        role: data.role,
      },
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating user:", error);
    return { error: error.message || "Failed to update user." };
  }
}

export async function setUserStatus(id: string, isActive: boolean) {
  try {
    await checkAdminAuth();

    await prisma.user.update({
      where: { id },
      data: { isActive },
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error: any) {
    console.error("Error changing user status:", error);
    return { error: error.message || "Failed to change user status." };
  }
}

export async function softDeleteUser(id: string) {
  try {
    await checkAdminAuth();

    await prisma.user.update({
      where: { id },
      data: { isDeleted: true },
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error: any) {
    console.error("Error soft deleting user:", error);
    return { error: error.message || "Failed to soft delete user." };
  }
}

export async function restoreUser(id: string) {
  try {
    await checkAdminAuth();

    await prisma.user.update({
      where: { id },
      data: { 
        isDeleted: false,
        isActive: true // automatically enable restored accounts
      },
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error: any) {
    console.error("Error restoring user:", error);
    return { error: error.message || "Failed to restore user." };
  }
}

export async function bulkSetUserStatus(ids: string[], isActive: boolean) {
  try {
    await checkAdminAuth();

    if (!ids || ids.length === 0) {
      return { error: "No users selected." };
    }

    await prisma.user.updateMany({
      where: { id: { in: ids } },
      data: { isActive },
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error: any) {
    console.error("Error bulk updating status:", error);
    return { error: error.message || "Failed bulk update." };
  }
}

export async function bulkSoftDeleteUsers(ids: string[]) {
  try {
    await checkAdminAuth();

    if (!ids || ids.length === 0) {
      return { error: "No users selected." };
    }

    await prisma.user.updateMany({
      where: { id: { in: ids } },
      data: { isDeleted: true },
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error: any) {
    console.error("Error bulk soft deleting users:", error);
    return { error: error.message || "Failed bulk soft delete." };
  }
}

export async function bulkRestoreUsers(ids: string[]) {
  try {
    await checkAdminAuth();

    if (!ids || ids.length === 0) {
      return { error: "No users selected." };
    }

    await prisma.user.updateMany({
      where: { id: { in: ids } },
      data: {
        isDeleted: false,
        isActive: true
      },
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error: any) {
    console.error("Error bulk restoring users:", error);
    return { error: error.message || "Failed bulk restore." };
  }
}
