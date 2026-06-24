"use client";

import React from "react";
import Link from "next/link";
import { useAdminUpgrades, useProcessUpgrade } from "@/hooks/use-admin";
import { toast } from "sonner";
import {
  ArrowLeft,
  UserCheck,
  Check,
  X,
  Clock,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function HostApprovalsPage() {
  const { data: upgrades, isLoading, error } = useAdminUpgrades();
  const processUpgrade = useProcessUpgrade();

  const handleAction = async (
    targetUserId: string,
    action: "approve" | "reject",
  ) => {
    try {
      await processUpgrade.mutateAsync({ targetUserId, action });
      toast.success(`Host upgrade request has been ${action}d successfully`);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : `Failed to ${action} upgrade`;
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

  return (
    <div className="space-y-8 max-w-6xl">
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
          Host Approvals
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Review and moderate upgrade requests from renters seeking to access
          the Host feed.
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
            Failed to fetch upgrade requests
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Please try reloading the page.
          </p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && (!upgrades || upgrades.length === 0) && (
        <div className="bg-white border border-slate-200/60 rounded-2xl p-8 md:p-12 text-center shadow-xs">
          <div className="h-12 w-12 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
            <UserCheck className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-semibold text-[#1E2D8C] mb-1">
            Up to date!
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            There are no pending host upgrade requests right now. All requests
            have been processed.
          </p>
        </div>
      )}

      {/* List of Upgrade Requests */}
      {!isLoading && !error && upgrades && upgrades.length > 0 && (
        <div className="space-y-4">
          {upgrades.map((req) => (
            <div
              key={req.id}
              className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-sm transition-all"
            >
              {/* User details */}
              <div className="flex items-start gap-4">
                <div className="h-11 w-11 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700 flex items-center justify-center font-display font-bold shrink-0 text-sm">
                  {req.email[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-[#1E2D8C]">
                    {req.email}
                  </h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />{" "}
                      Registered {getFormatDate(req.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => handleAction(req.id, "reject")}
                  disabled={processUpgrade.isPending}
                  className="inline-flex h-9 items-center justify-center px-4 rounded-lg border border-red-100 text-red-600 text-xs font-semibold hover:bg-red-50 transition-all cursor-pointer"
                >
                  <X className="mr-1.5 h-3.5 w-3.5" /> Reject Upgrade
                </button>
                <button
                  onClick={() => handleAction(req.id, "approve")}
                  disabled={processUpgrade.isPending}
                  className="inline-flex h-9 items-center justify-center px-4.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-all shadow-xs cursor-pointer"
                >
                  <Check className="mr-1.5 h-3.5 w-3.5" /> Approve Host
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
