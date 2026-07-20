"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  Eye,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  RotateCcw,
  User,
  MoreVertical,
  X
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogClose 
} from "@/components/ui/dialog";
import { 
  updateUser, 
  setUserStatus, 
  softDeleteUser, 
  restoreUser,
  bulkSetUserStatus,
  bulkSoftDeleteUsers,
  bulkRestoreUsers
} from "@/actions/admin";
import { Role } from "@prisma/client";

interface UsersTableClientProps {
  initialUsers: any[];
  totalCount: number;
  currentPage: number;
  limit: number;
  initialFilters: {
    q: string;
    role: string;
    status: string;
    date: string;
    sort: string;
  };
}

export function UsersTableClient({
  initialUsers,
  totalCount,
  currentPage,
  limit,
  initialFilters,
}: UsersTableClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Local state for filters and selections
  const [searchQuery, setSearchQuery] = useState(initialFilters.q);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [actionLoading, setActionLoading] = useState(false);

  // Modals state
  const [viewUser, setViewUser] = useState<any | null>(null);
  const [editUser, setEditUser] = useState<any | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    role: "STUDENT" as Role,
  });

  // Keep state in sync with initial filters
  useEffect(() => {
    setSearchQuery(initialFilters.q);
  }, [initialFilters.q]);

  // Sync edit form data when editing user changes
  useEffect(() => {
    if (editUser) {
      setEditFormData({
        name: editUser.name || "",
        email: editUser.email || "",
        role: editUser.role || "STUDENT",
      });
    }
  }, [editUser]);

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / limit) || 1;

  // URL updating helper
  const updateUrl = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, val]) => {
      if (val === null || val === "") {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });
    // Reset to page 1 on filter/search changes
    if (!newParams.page) {
      params.set("page", "1");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  // Checkbox handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(initialUsers.map((u) => u.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  // Individual Actions
  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    setActionLoading(true);
    const res = await setUserStatus(id, currentStatus);
    setActionLoading(false);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success(`User successfully ${currentStatus ? "enabled" : "disabled"}!`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to soft delete this user?")) return;
    setActionLoading(true);
    const res = await softDeleteUser(id);
    setActionLoading(false);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("User soft deleted successfully.");
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const handleRestore = async (id: string) => {
    setActionLoading(true);
    const res = await restoreUser(id);
    setActionLoading(false);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("User restored successfully.");
    }
  };

  // Bulk Actions
  const handleBulkStatus = async (isActive: boolean) => {
    setActionLoading(true);
    const res = await bulkSetUserStatus(selectedIds, isActive);
    setActionLoading(false);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success(`Selected users successfully ${isActive ? "enabled" : "disabled"}!`);
      setSelectedIds([]);
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to soft delete ${selectedIds.length} users?`)) return;
    setActionLoading(true);
    const res = await bulkSoftDeleteUsers(selectedIds);
    setActionLoading(false);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Selected users soft deleted successfully.");
      setSelectedIds([]);
    }
  };

  const handleBulkRestore = async () => {
    setActionLoading(true);
    const res = await bulkRestoreUsers(selectedIds);
    setActionLoading(false);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Selected users restored successfully.");
      setSelectedIds([]);
    }
  };

  // Edit Submission
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;
    setActionLoading(true);
    const res = await updateUser(editUser.id, editFormData);
    setActionLoading(false);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("User details updated successfully!");
      setEditUser(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-zinc-900 p-4 rounded-xl border border-zinc-800">
        
        {/* Search */}
        <div className="flex-1 w-full md:w-auto relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Search by name, email or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                updateUrl({ q: searchQuery });
              }
            }}
            onBlur={() => updateUrl({ q: searchQuery })}
            className="pl-9 bg-zinc-950 border-zinc-850 text-zinc-150 focus-visible:ring-zinc-700"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <select
            value={initialFilters.role}
            onChange={(e) => updateUrl({ role: e.target.value })}
            className="bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-md text-sm px-3 py-2 outline-none focus:ring-1 focus:ring-zinc-700 cursor-pointer"
          >
            <option value="">All Roles</option>
            <option value="STUDENT">Student</option>
            <option value="RECRUITER">Recruiter</option>
            <option value="ADMIN">Admin</option>
          </select>

          <select
            value={initialFilters.status}
            onChange={(e) => updateUrl({ status: e.target.value })}
            className="bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-md text-sm px-3 py-2 outline-none focus:ring-1 focus:ring-zinc-700 cursor-pointer"
          >
            <option value="">Active/Disabled (All)</option>
            <option value="ACTIVE">Active Only</option>
            <option value="DISABLED">Disabled Only</option>
            <option value="DELETED">Deleted (Soft)</option>
          </select>

          <select
            value={initialFilters.date}
            onChange={(e) => updateUrl({ date: e.target.value })}
            className="bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-md text-sm px-3 py-2 outline-none focus:ring-1 focus:ring-zinc-700 cursor-pointer"
          >
            <option value="">All Time</option>
            <option value="today">Last 24 Hours</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="year">Last Year</option>
          </select>

          <select
            value={initialFilters.sort}
            onChange={(e) => updateUrl({ sort: e.target.value })}
            className="bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-md text-sm px-3 py-2 outline-none focus:ring-1 focus:ring-zinc-700 cursor-pointer"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions Panel */}
      {selectedIds.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 items-center p-4 bg-blue-950/20 border border-blue-900/35 rounded-xl animate-fade-in">
          <span className="text-sm text-blue-400 font-medium">
            {selectedIds.length} users selected for bulk action
          </span>
          <div className="flex gap-2 w-full sm:w-auto sm:ml-auto justify-end">
            <Button
              size="sm"
              onClick={() => handleBulkStatus(true)}
              disabled={actionLoading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8 px-3"
            >
              Enable
            </Button>
            <Button
              size="sm"
              onClick={() => handleBulkStatus(false)}
              disabled={actionLoading}
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs h-8 px-3"
            >
              Disable
            </Button>
            {initialFilters.status === "DELETED" ? (
              <Button
                size="sm"
                onClick={handleBulkRestore}
                disabled={actionLoading}
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs h-8 px-3"
              >
                Restore
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleBulkDelete}
                disabled={actionLoading}
                className="bg-red-600 hover:bg-red-700 text-white text-xs h-8 px-3"
              >
                Delete
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedIds([])}
              className="bg-transparent border-zinc-700 text-zinc-400 text-xs h-8"
            >
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Responsive Table Container */}
      <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/50">
        <table className="w-full border-collapse text-left text-sm text-zinc-300">
          <thead className="bg-zinc-900 border-b border-zinc-800 text-xs font-semibold uppercase text-zinc-400">
            <tr>
              <th className="p-4 w-12">
                <input
                  type="checkbox"
                  checked={initialUsers.length > 0 && selectedIds.length === initialUsers.length}
                  onChange={handleSelectAll}
                  className="rounded border-zinc-800 bg-zinc-950 text-blue-600 focus:ring-blue-600/30 w-4 h-4 cursor-pointer"
                />
              </th>
              <th className="p-4">Name / Info</th>
              <th className="p-4 hidden md:table-cell">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4 hidden lg:table-cell">Created Date</th>
              <th className="p-4 hidden lg:table-cell">Last Updated</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {initialUsers.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-zinc-550 text-base">
                  No users found matching the filter criteria.
                </td>
              </tr>
            ) : (
              initialUsers.map((user) => {
                const isSelected = selectedIds.includes(user.id);
                let statusLabel = "Active";
                let statusColor = "bg-emerald-950/40 text-emerald-500 border-emerald-900/50";

                if (user.isDeleted) {
                  statusLabel = "Deleted";
                  statusColor = "bg-red-950/40 text-red-500 border-red-900/50";
                } else if (!user.isActive) {
                  statusLabel = "Disabled";
                  statusColor = "bg-amber-950/40 text-amber-500 border-amber-900/50";
                }

                return (
                  <tr key={user.id} className="hover:bg-zinc-850/20 transition-colors">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleSelectOne(user.id, e.target.checked)}
                        className="rounded border-zinc-800 bg-zinc-950 text-blue-600 focus:ring-blue-600/30 w-4 h-4 cursor-pointer"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-zinc-800 text-zinc-300 flex items-center justify-center font-bold text-xs uppercase border border-zinc-700">
                          {user.name ? user.name.slice(0, 2) : "U"}
                        </div>
                        <div>
                          <div className="font-semibold text-zinc-200">{user.name || "Unnamed"}</div>
                          <div className="text-xs text-zinc-500 md:hidden">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell text-zinc-300 font-mono text-xs">{user.email}</td>
                    <td className="p-4">
                      <span className="text-[11px] font-bold tracking-wide uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                        {user.role.replace("_", " ")}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`text-[10px] uppercase font-bold tracking-wide px-2 py-0.5 rounded border ${statusColor}`}>
                        {statusLabel}
                      </span>
                    </td>
                    <td className="p-4 hidden lg:table-cell text-zinc-500 text-xs">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 hidden lg:table-cell text-zinc-500 text-xs">
                      {new Date(user.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 justify-end">
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={() => setViewUser(user)}
                          className="bg-transparent border-zinc-800 text-zinc-400 hover:text-white"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" /> View
                        </Button>
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={() => setEditUser(user)}
                          className="bg-transparent border-zinc-800 text-zinc-400 hover:text-white"
                        >
                          <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit
                        </Button>
                        {!user.isDeleted ? (
                          <>
                            <Button
                              size="xs"
                              variant="outline"
                              onClick={() => handleToggleStatus(user.id, !user.isActive)}
                              className={`bg-transparent border-zinc-800 ${
                                user.isActive 
                                  ? "text-amber-500 hover:bg-amber-950/20" 
                                  : "text-emerald-500 hover:bg-emerald-950/20"
                              }`}
                            >
                              {user.isActive ? "Disable" : "Enable"}
                            </Button>
                            <Button
                              size="xs"
                              variant="outline"
                              onClick={() => handleDelete(user.id)}
                              className="bg-transparent border-zinc-800 text-red-500 hover:bg-red-950/20"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="xs"
                            variant="outline"
                            onClick={() => handleRestore(user.id)}
                            className="bg-transparent border-zinc-800 text-purple-400 hover:bg-purple-950/20"
                          >
                            <RotateCcw className="w-3.5 h-3.5 mr-1" /> Restore
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-900 p-4 rounded-xl border border-zinc-800">
          <span className="text-sm text-zinc-500">
            Showing Page <strong className="text-zinc-300">{currentPage}</strong> of <strong className="text-zinc-300">{totalPages}</strong> ({totalCount} total entries)
          </span>
          <div className="flex gap-1.5">
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage <= 1}
              onClick={() => updateUrl({ page: "1" })}
              className="bg-transparent border-zinc-800 text-zinc-300 disabled:opacity-30"
            >
              <ChevronsLeft className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage <= 1}
              onClick={() => updateUrl({ page: String(currentPage - 1) })}
              className="bg-transparent border-zinc-800 text-zinc-300 disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage >= totalPages}
              onClick={() => updateUrl({ page: String(currentPage + 1) })}
              className="bg-transparent border-zinc-800 text-zinc-300 disabled:opacity-30"
            >
              Next <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage >= totalPages}
              onClick={() => updateUrl({ page: String(totalPages) })}
              className="bg-transparent border-zinc-800 text-zinc-300 disabled:opacity-30"
            >
              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Details View Modal */}
      {viewUser && (
        <Dialog open={!!viewUser} onOpenChange={(open) => !open && setViewUser(null)}>
          <DialogContent className="bg-zinc-950 border-zinc-850 text-zinc-100 max-w-lg p-6">
            <DialogHeader className="relative pr-6">
              <DialogTitle className="text-xl font-bold">User Details</DialogTitle>
              <DialogDescription className="text-zinc-500">Full platform profile data.</DialogDescription>
              <button 
                onClick={() => setViewUser(null)} 
                className="absolute right-0 top-0 text-zinc-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4 border-b border-zinc-800 pb-4">
                <div className="w-12 h-12 rounded-full bg-zinc-800 text-zinc-200 flex items-center justify-center font-bold text-lg uppercase border border-zinc-700">
                  {viewUser.name ? viewUser.name.slice(0, 2) : "U"}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{viewUser.name || "Unnamed"}</h3>
                  <p className="text-sm text-zinc-400">{viewUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="block text-zinc-500 text-xs font-semibold uppercase">User ID</span>
                  <span className="font-mono text-xs text-zinc-300">{viewUser.id}</span>
                </div>
                <div>
                  <span className="block text-zinc-500 text-xs font-semibold uppercase">Role</span>
                  <span className="text-zinc-300">{viewUser.role.replace("_", " ")}</span>
                </div>
                <div>
                  <span className="block text-zinc-500 text-xs font-semibold uppercase">Status</span>
                  <span className="text-zinc-300">
                    {viewUser.isDeleted ? "Deleted" : viewUser.isActive ? "Active" : "Disabled"}
                  </span>
                </div>
                <div>
                  <span className="block text-zinc-500 text-xs font-semibold uppercase">Registered</span>
                  <span className="text-zinc-300">{new Date(viewUser.createdAt).toLocaleString()}</span>
                </div>
              </div>

              {/* Conditional: Student Specific Info */}
              {viewUser.role === "STUDENT" && viewUser.studentProfile && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-2 mt-2">
                  <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wide">Academic Record</h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="block text-zinc-500">College</span>
                      <span className="text-zinc-200">{viewUser.studentProfile.college || "N/A"}</span>
                    </div>
                    <div>
                      <span className="block text-zinc-500">Degree</span>
                      <span className="text-zinc-200">{viewUser.studentProfile.degree || "N/A"}</span>
                    </div>
                    <div>
                      <span className="block text-zinc-500">Branch</span>
                      <span className="text-zinc-200">{viewUser.studentProfile.branch || "N/A"}</span>
                    </div>
                    <div>
                      <span className="block text-zinc-500">Graduation Year</span>
                      <span className="text-zinc-200">{viewUser.studentProfile.graduationYear || "N/A"}</span>
                    </div>
                    <div>
                      <span className="block text-zinc-500">CGPA</span>
                      <span className="text-zinc-200">{viewUser.studentProfile.cgpa || "N/A"}</span>
                    </div>
                    <div>
                      <span className="block text-zinc-500">ATS Score</span>
                      <span className="text-zinc-200">{viewUser.studentProfile.atsScore || "N/A"}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Conditional: Recruiter Specific Info */}
              {viewUser.role === "RECRUITER" && viewUser.company && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-2 mt-2">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wide">Company details</h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="block text-zinc-500">Company Name</span>
                      <span className="text-zinc-200">{viewUser.company.name}</span>
                    </div>
                    <div>
                      <span className="block text-zinc-500">Website</span>
                      <span className="text-zinc-200">{viewUser.company.website || "N/A"}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end pt-2 border-t border-zinc-800">
              <Button onClick={() => setViewUser(null)} className="bg-zinc-800 hover:bg-zinc-700 text-white">
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Modal */}
      {editUser && (
        <Dialog open={!!editUser} onOpenChange={(open) => !open && setEditUser(null)}>
          <DialogContent className="bg-zinc-950 border-zinc-850 text-zinc-100 max-w-md p-6">
            <DialogHeader className="relative pr-6">
              <DialogTitle className="text-xl font-bold">Edit User</DialogTitle>
              <DialogDescription className="text-zinc-500">Modify user profile fields and role settings.</DialogDescription>
              <button 
                onClick={() => setEditUser(null)} 
                className="absolute right-0 top-0 text-zinc-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </DialogHeader>

            <form onSubmit={handleEditSubmit} className="space-y-4 py-4">
              <div className="space-y-1">
                <Label htmlFor="editName" className="text-zinc-350 text-xs">Full Name</Label>
                <Input
                  id="editName"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, name: e.target.value }))}
                  required
                  className="bg-zinc-900 border-zinc-800 text-zinc-100"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="editEmail" className="text-zinc-350 text-xs">Email Address</Label>
                <Input
                  id="editEmail"
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, email: e.target.value }))}
                  required
                  className="bg-zinc-900 border-zinc-800 text-zinc-100"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="editRole" className="text-zinc-350 text-xs">Access Role</Label>
                <select
                  id="editRole"
                  value={editFormData.role}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, role: e.target.value as Role }))}
                  className="bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-md text-sm px-3 py-2 w-full outline-none focus:ring-1 focus:ring-zinc-700 cursor-pointer"
                >
                  <option value="STUDENT">Student</option>
                  <option value="RECRUITER">Recruiter</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-zinc-800">
                <Button 
                  type="button" 
                  onClick={() => setEditUser(null)} 
                  variant="outline"
                  className="bg-transparent border-zinc-800 text-zinc-400 hover:text-white"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={actionLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {actionLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
}
