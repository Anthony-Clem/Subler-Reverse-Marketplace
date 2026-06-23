"use client";

import {
  AdminUser,
  useAdminUsers,
  useDeleteUser,
  useUpdateUserRole,
} from "@/hooks/use-admin";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Clock,
  Loader2,
  Shield,
  ShieldAlert,
  Trash2,
  XCircle,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

interface ConfirmModalState {
  type: "role" | "delete";
  user: AdminUser;
  targetRole?: "renter" | "admin";
}

export default function AdminUsersPage() {
  const { data: userList, isLoading, error } = useAdminUsers();
  const { data: session } = useSession();
  const currentAdminId = session?.user?.id;

  const updateUserRole = useUpdateUserRole();
  const deleteUser = useDeleteUser();

  const [confirmModal, setConfirmModal] = useState<ConfirmModalState | null>(
    null,
  );

  const getFormatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const handleRoleChangeSubmit = async (
    user: AdminUser,
    newRole: "renter" | "admin",
  ) => {
    try {
      await updateUserRole.mutateAsync({
        targetUserId: user.id,
        role: newRole,
      });
      toast.success(`Updated ${user.email}'s role to ${newRole}`);
      setConfirmModal(null);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to update user role";
      toast.error(message);
    }
  };

  const handleDeleteSubmit = async (user: AdminUser) => {
    try {
      await deleteUser.mutateAsync(user.id);
      toast.success(`Successfully deleted user ${user.email}`);
      setConfirmModal(null);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to delete user";
      toast.error(message);
    }
  };

  const getRoleBadge = (role: string) => {
    if (role === "admin") {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-700 border border-red-500/20">
          <Shield className="h-3 w-3" />
          Admin
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1E2D8C]/5 text-[#1E2D8C] border border-[#1E2D8C]/10">
        Renter
      </span>
    );
  };

  const getHostStatusBadge = (status: string | null) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
            <CheckCircle className="h-3 w-3" />
            Approved Host
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 border border-amber-500/20 animate-pulse">
            <Clock className="h-3 w-3" />
            Pending
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            <XCircle className="h-3 w-3" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-50 text-slate-400 border border-slate-200/60">
            Not Host
          </span>
        );
    }
  };

  const isMutating = updateUserRole.isPending || deleteUser.isPending;

  return (
    <div className="space-y-8 max-w-5xl relative">
      {/* Header Navigation */}
      <div className="flex flex-col gap-2 pb-6 border-b border-slate-200/60">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#1E2D8C] transition-colors cursor-pointer group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Overview
        </Link>
        <h1 className="text-h1 text-[#1E2D8C] font-semibold font-display">
          Registered Users
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          View all renters, hosts, and administrators registered on the Subler
          Reverse platform.
        </p>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-20 bg-white border border-slate-200/60 rounded-2xl shadow-xs">
          <Loader2 className="h-8 w-8 text-[#1E2D8C] animate-spin" />
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/10 text-center">
          <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
          <p className="text-sm text-red-600 font-semibold">
            Failed to fetch platform users
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Please try reloading the page.
          </p>
        </div>
      )}

      {/* Users table */}
      {!isLoading && !error && userList && (
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
            <span>Total registered accounts</span>
            <span>{userList.length} users</span>
          </div>

          <div className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-200/60 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">User ID</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Host Status</th>
                    <th className="px-6 py-4 text-center">Registered Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {userList.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-50/30 transition-colors"
                    >
                      {/* Name / Initials Avatar */}
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-[#1E2D8C]/5 text-[#1E2D8C] flex items-center justify-center font-bold text-xs border border-[#1E2D8C]/10 shrink-0">
                          {user.email[0].toUpperCase()}
                        </div>
                        <div
                          className="font-semibold text-[#1E2D8C] truncate max-w-50"
                          title={user.email}
                        >
                          {user.email}
                        </div>
                      </td>

                      {/* Email / Clerk ID */}
                      <td className="px-6 py-4">
                        <div
                          className="text-[10px] text-slate-400 font-mono truncate max-w-37.5"
                          title={user.id}
                        >
                          {user.id}
                        </div>
                      </td>

                      {/* System Role */}
                      <td className="px-6 py-4">{getRoleBadge(user.role)}</td>

                      {/* Host Registration Status */}
                      <td className="px-6 py-4">
                        {getHostStatusBadge(user.hostStatus)}
                      </td>

                      {/* Registered Time */}
                      <td className="px-6 py-4 text-slate-500 text-xs text-center">
                        {getFormatDate(user.createdAt)}
                      </td>

                      {/* Actions Column */}
                      <td className="px-6 py-4 text-right">
                        {user.id === currentAdminId ? (
                          <span className="text-[11px] text-slate-400 italic px-2">
                            You (Current Admin)
                          </span>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            {/* Toggle Role Button */}
                            {user.role === "admin" ? (
                              <button
                                onClick={() =>
                                  setConfirmModal({
                                    type: "role",
                                    user,
                                    targetRole: "renter",
                                  })
                                }
                                disabled={isMutating}
                                className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-md border border-slate-200 bg-slate-50 text-slate-500 text-[11px] font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
                                title="Demote to Renter"
                              >
                                Make Renter
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  setConfirmModal({
                                    type: "role",
                                    user,
                                    targetRole: "admin",
                                  })
                                }
                                disabled={isMutating}
                                className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-md border border-primary bg-primary/5 text-primary text-[11px] font-semibold hover:bg-primary/10 transition-colors cursor-pointer"
                                title="Promote to Admin"
                              >
                                Make Admin
                              </button>
                            )}

                            {/* Delete User Button */}
                            <button
                              onClick={() =>
                                setConfirmModal({
                                  type: "delete",
                                  user,
                                })
                              }
                              disabled={isMutating}
                              className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-red-100 text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Delete User"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal Backdrop Overlay */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
          {/* Modal Container */}
          <div className="bg-white border border-slate-200/60 rounded-2xl p-6 max-w-sm w-full shadow-lg animate-scale-up space-y-4">
            <div className="flex items-center gap-3">
              {confirmModal.type === "delete" ? (
                <div className="h-10 w-10 rounded-lg bg-red-500/10 text-red-600 flex items-center justify-center border border-red-500/10 shrink-0">
                  <ShieldAlert className="h-5 w-5" />
                </div>
              ) : (
                <div className="h-10 w-10 rounded-lg bg-[#1E2D8C]/10 text-[#1E2D8C] flex items-center justify-center border border-[#1E2D8C]/5 shrink-0">
                  <Shield className="h-5 w-5" />
                </div>
              )}
              <h3 className="font-display font-bold text-sm text-[#1E2D8C]">
                {confirmModal.type === "delete"
                  ? "Delete User Account?"
                  : "Modify User Permissions?"}
              </h3>
            </div>

            <div className="text-xs text-slate-500 leading-relaxed">
              {confirmModal.type === "delete" ? (
                <p>
                  Are you sure you want to delete the account for{" "}
                  <strong>{confirmModal.user.email}</strong>? This action is
                  permanent and will remove all their requests and proposals
                  from the platform.
                </p>
              ) : (
                <p>
                  Are you sure you want to change the role of{" "}
                  <strong>{confirmModal.user.email}</strong> to{" "}
                  <strong className="capitalize">
                    {confirmModal.targetRole}
                  </strong>
                  ? This will modify their administrative permissions
                  immediately.
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmModal(null)}
                disabled={isMutating}
                className="inline-flex h-9 items-center justify-center px-4 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-all cursor-pointer"
              >
                Cancel
              </button>

              {confirmModal.type === "delete" ? (
                <button
                  onClick={() => handleDeleteSubmit(confirmModal.user)}
                  disabled={isMutating}
                  className="inline-flex h-9 items-center justify-center px-4.5 rounded-lg bg-red-600 text-white hover:bg-red-700 text-xs font-semibold transition-all cursor-pointer shadow-xs gap-1.5"
                >
                  {isMutating ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" />
                  )}
                  Delete User
                </button>
              ) : (
                <button
                  onClick={() =>
                    handleRoleChangeSubmit(
                      confirmModal.user,
                      confirmModal.targetRole!,
                    )
                  }
                  disabled={isMutating}
                  className="inline-flex h-9 items-center justify-center px-4.5 rounded-lg bg-[#1E2D8C] text-white hover:bg-[#1E2D8C]/95 text-xs font-semibold transition-all cursor-pointer shadow-xs gap-1.5"
                >
                  {isMutating ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <CheckCircle className="h-3.5 w-3.5" />
                  )}
                  Confirm Change
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
