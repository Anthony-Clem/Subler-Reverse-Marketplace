"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useQueryState } from "nuqs";
import { useAdminRequests, useUpdateReqStatus } from "@/hooks/use-admin";
import { toast } from "sonner";
import {
  ArrowLeft,
  DollarSign,
  Users,
  MapPin,
  MessageSquare,
  AlertCircle,
  Loader2,
} from "lucide-react";

function RequestsTableContent() {
  const { data: requests, isLoading, error } = useAdminRequests();
  const updateReqStatus = useUpdateReqStatus();

  const [statusFilter, setStatusFilter] = useQueryState("status", {
    defaultValue: "all",
  });

  const handleStatusChange = async (
    requestId: string,
    newStatus: "open" | "closed" | "fulfilled",
  ) => {
    try {
      await updateReqStatus.mutateAsync({ requestId, status: newStatus });
      toast.success(`Request status updated to ${newStatus}`);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to update status";
      toast.error(message);
    }
  };

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

  const filteredRequests =
    requests?.filter((r) => {
      if (statusFilter === "all") return true;
      return r.status === statusFilter;
    }) || [];

  return (
    <div className="space-y-6">
      {/* Filters & Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Tab Buttons */}
        <div className="inline-flex p-0.5 bg-slate-100/80 rounded-full border border-slate-200/50 self-start gap-0.5">
          {["all", "open", "closed", "fulfilled"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4.5 py-1 text-xs font-semibold rounded-full transition-all capitalize cursor-pointer ${
                statusFilter === status
                  ? "bg-[#1E2D8C]/5 text-[#1E2D8C]"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <span className="text-xs font-semibold text-slate-500">
          Showing {filteredRequests.length} requests
        </span>
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
            Failed to fetch platform requests
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Check database connection and try again.
          </p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredRequests.length === 0 && (
        <div className="bg-white border border-slate-200/60 rounded-2xl p-12 text-center shadow-xs">
          <p className="text-sm text-slate-500">
            No requests match the selected status filter.
          </p>
        </div>
      )}

      {/* Table grid */}
      {!isLoading && !error && filteredRequests.length > 0 && (
        <div className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200/60 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Renter Info</th>
                  <th className="px-6 py-4">Request / Details</th>
                  <th className="px-6 py-4 text-center">Proposals</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredRequests.map((req) => (
                  <tr
                    key={req.id}
                    className="hover:bg-slate-50/30 transition-colors"
                  >
                    {/* Column 1: Renter Details */}
                    <td className="px-6 py-4.5 max-w-[200px]">
                      <div className="font-semibold text-[#1E2D8C] truncate">
                        {req.user?.email || req.userId}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        Posted {getFormatDate(req.createdAt)}
                      </div>
                    </td>

                    {/* Column 2: Event Details */}
                    <td className="px-6 py-4.5">
                      <div className="font-semibold text-[#1E2D8C] capitalize mb-1.5">
                        {req.eventType.replace(/_/g, " ")}
                      </div>
                      <div className="flex gap-1.5 flex-wrap">
                        <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1E2D8C]/5 text-[#1E2D8C] border border-[#1E2D8C]/10 capitalize">
                          {req.spaceType.replace(/_/g, " ")}
                        </span>
                        <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 capitalize">
                          {req.eventType.replace(/_/g, " ")}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1.5 truncate">
                          <DollarSign className="h-3.5 w-3.5 text-slate-400" />{" "}
                          ${req.budget}/hr
                        </span>
                        <span className="flex items-center gap-1.5 truncate">
                          <Users className="h-3.5 w-3.5 text-slate-400" />{" "}
                          {req.headcount} capacity
                        </span>
                        <span className="flex items-center gap-1.5 truncate col-span-2 mt-0.5 text-slate-400">
                          <MapPin className="h-3.5 w-3.5" />{" "}
                          {req.locationPreference}
                        </span>
                      </div>
                    </td>

                    {/* Column 3: Proposals Count */}
                    <td className="px-6 py-4.5 text-center">
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200/60 text-xs font-semibold text-[#1E2D8C]">
                        <MessageSquare className="h-3.5 w-3.5 text-slate-400" />
                        <span>{req.proposals?.length || 0}</span>
                      </div>
                    </td>

                    {/* Column 4: Status Indicator */}
                    <td className="px-6 py-4.5">
                      {req.status === "open" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 text-[11px] font-semibold capitalize border border-emerald-500/20">
                          Open
                        </span>
                      )}
                      {req.status === "fulfilled" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-700 text-[11px] font-semibold capitalize border border-blue-500/20">
                          Fulfilled
                        </span>
                      )}
                      {req.status === "closed" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold capitalize border border-slate-200">
                          Closed
                        </span>
                      )}
                    </td>

                    {/* Column 5: Actions Selection Dropdown */}
                    <td className="px-6 py-4.5 text-right">
                      <select
                        value={req.status}
                        onChange={(e) =>
                          handleStatusChange(
                            req.id,
                            e.target.value as "open" | "closed" | "fulfilled",
                          )
                        }
                        disabled={updateReqStatus.isPending}
                        className="h-8.5 rounded-lg border border-slate-200 text-xs font-semibold px-2 bg-white text-[#1E2D8C] focus:ring-1 focus:ring-[#1E2D8C] focus:border-[#1E2D8C] transition-all cursor-pointer outline-none"
                      >
                        <option value="open">Mark Open</option>
                        <option value="closed">Mark Closed</option>
                        <option value="fulfilled">Mark Fulfilled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RequestsPage() {
  return (
    <div className="space-y-8 max-w-6xl">
      {/* Breadcrumb Header */}
      <div className="flex flex-col gap-2 pb-6 border-b border-slate-200/60">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#1E2D8C] transition-colors cursor-pointer group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Overview
        </Link>
        <h1 className="text-h1 text-[#1E2D8C] font-semibold font-display">
          Manage Requests
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Inspect space requirements posted by users and update their platform
          matching status.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20 bg-card border border-border rounded-xl">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        }
      >
        <RequestsTableContent />
      </Suspense>
    </div>
  );
}
