"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Role, Prisma } from "@prisma/client";
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

export async function deleteUserPermanently(id: string) {
  try {
    await checkAdminAuth();

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return { error: "User not found." };

    if (user.companyId) {
      const companyUserCount = await prisma.user.count({
        where: { companyId: user.companyId },
      });
      if (companyUserCount <= 1) {
        // Delete company if this is the last recruiter (cascades to jobs)
        await prisma.company.delete({ where: { id: user.companyId } });
      }
    }

    // Delete user (cascades to profiles, sessions, etc.)
    await prisma.user.delete({ where: { id } });

    revalidatePath("/admin/users");
    revalidatePath("/admin/recruiters");
    return { success: true };
  } catch (error: any) {
    console.error("Error permanently deleting user:", error);
    return { error: error.message || "Failed to delete user permanently." };
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

export async function bulkDeleteUsersPermanently(ids: string[]) {
  try {
    await checkAdminAuth();

    if (!ids || ids.length === 0) {
      return { error: "No users selected." };
    }

    // Must delete one by one to handle company cascading correctly
    for (const id of ids) {
      const user = await prisma.user.findUnique({ where: { id } });
      if (user?.companyId) {
        const companyUserCount = await prisma.user.count({ where: { companyId: user.companyId } });
        if (companyUserCount <= 1) {
          await prisma.company.delete({ where: { id: user.companyId } });
        }
      }
      await prisma.user.delete({ where: { id } }).catch(() => {}); // ignore individual errors
    }

    revalidatePath("/admin/users");
    revalidatePath("/admin/recruiters");
    return { success: true };
  } catch (error: any) {
    console.error("Error bulk permanent deleting users:", error);
    return { error: error.message || "Failed bulk permanent delete." };
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

export async function verifyRecruiter(id: string) {
  try {
    await checkAdminAuth();

    const recruiterProfile = await prisma.recruiterProfile.findUnique({
      where: { id }
    });

    if (!recruiterProfile) {
      return { error: "Recruiter profile not found." };
    }

    // Optionally assign or create Company here, but for now we just verify
    // You'd typically find a company by name or create it, then link it to the User

    await prisma.recruiterProfile.update({
      where: { id },
      data: { isVerified: true }
    });

    revalidatePath("/admin/recruiters");
    return { success: true };
  } catch (error: any) {
    console.error("Error verifying recruiter:", error);
    return { error: error.message || "Failed to verify recruiter." };
  }
}

export async function rejectRecruiter(id: string, note?: string) {
  try {
    await checkAdminAuth();

    const profile = await prisma.recruiterProfile.findUnique({ where: { id } });
    if (!profile) {
      return { error: "Recruiter profile not found." };
    }

    // Instead of deleting the user, we update the profile to rejected state with an optional note
    await prisma.recruiterProfile.update({
      where: { id },
      data: {
        isVerified: false,
        rejectionNote: note || "Your recruiter application was rejected by an administrator.",
      }
    });

    revalidatePath("/admin/recruiters");
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error: any) {
    console.error("Error rejecting recruiter:", error);
    return { error: error.message || "Failed to reject recruiter." };
  }
}

export async function approveEditRequest(id: string) {
  try {
    await checkAdminAuth();

    const profile = await prisma.recruiterProfile.findUnique({
      where: { id }
    });

    if (!profile || !profile.editRequest) {
      return { error: "No pending edit request found for this profile." };
    }

    const editData = profile.editRequest as any;

    await prisma.recruiterProfile.update({
      where: { id },
      data: {
        companyName: editData.companyName || profile.companyName,
        employeeId: editData.employeeId || profile.employeeId,
        verificationDocUrl: editData.verificationDocUrl || profile.verificationDocUrl,
        editRequest: Prisma.DbNull, // Clear the request
      }
    });

    revalidatePath("/admin/recruiters");
    return { success: true };
  } catch (error: any) {
    console.error("Error approving edit request:", error);
    return { error: error.message || "Failed to approve edit request." };
  }
}

export async function rejectEditRequest(id: string) {
  try {
    await checkAdminAuth();

    const profile = await prisma.recruiterProfile.findUnique({
      where: { id }
    });

    if (!profile || !profile.editRequest) {
      return { error: "No pending edit request found for this profile." };
    }

    // Just clear the edit request without applying the changes
    await prisma.recruiterProfile.update({
      where: { id },
      data: {
        editRequest: Prisma.DbNull,
      }
    });

    revalidatePath("/admin/recruiters");
    return { success: true };
  } catch (error: any) {
    console.error("Error rejecting edit request:", error);
    return { error: error.message || "Failed to reject edit request." };
  }
}

