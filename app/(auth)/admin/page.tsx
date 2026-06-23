"use client";

import React from "react";
import Link from "next/link";
import {
  useAdminRequests,
  useAdminUpgrades,
  useAdminUsers,
} from "@/hooks/use-admin";
import {
  ShieldAlert,
  Users,
  ClipboardList,
  UserCheck,
  TrendingUp,
  Clock,
  Sparkles,
} from "lucide-react";

export default function AdminPage() {
  const { data: requests, isLoading: requestsLoading } = useAdminRequests();
  const { data: upgrades, isLoading: upgradesLoading } = useAdminUpgrades();
  const { data: userList, isLoading: usersLoading } = useAdminUsers();

  const totalRequests = requests?.length || 0;
  const openRequests = requests?.filter((r) => r.status === "open").length || 0;
  const pendingUpgrades = upgrades?.length || 0;
  const totalUsers = userList?.length || 0;

  const isLoading = requestsLoading || upgradesLoading || usersLoading;

  return (
    <div className="space-y-8 max-w-5xl text-[#1E2D8C]">
      {/* Admin Title */}
      <div className="pb-6 border-b border-neutral-200/80">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/5 text-primary flex items-center justify-center border border-primary/10">
            <ShieldAlert className="h-5.5 w-5.5" />
          </div>
          <div>
            <h1 className="text-h2 font-bold text-[#1E2D8C] font-display">
              Admin Portal
            </h1>
            <p className="text-body-sm text-slate-500 mt-0.5">
              Review platform-wide activity, requests, user accounts, and
              pending host approvals.
            </p>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-xl p-6 h-28 animate-pulse"
            />
          ))}
        </div>
      )}

      {!isLoading && (
        <>
          {/* Admin Stats Grid (4 columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Stat 1 */}
            <div className="bg-white border border-neutral-200/60 rounded-2xl p-6 shadow-xs flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-neutral-50 flex items-center justify-center text-[#1E2D8C] shrink-0">
                <ClipboardList className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                  Total Requests
                </p>
                <p className="text-h2 text-[#1E2D8C] mt-0.5 font-bold">
                  {totalRequests}
                </p>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="bg-white border border-neutral-200/60 rounded-2xl p-6 shadow-xs flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-neutral-50 flex items-center justify-center text-[#1E2D8C] shrink-0">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                  Active Requests
                </p>
                <p className="text-h2 text-[#1E2D8C] mt-0.5 font-bold">
                  {openRequests}
                </p>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="bg-white border border-neutral-200/60 rounded-2xl p-6 shadow-xs flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-neutral-50 flex items-center justify-center text-[#1E2D8C] shrink-0">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                  Pending Upgrades
                </p>
                <p className="text-h2 text-[#1E2D8C] mt-0.5 font-bold">
                  {pendingUpgrades}
                </p>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="bg-white border border-neutral-200/60 rounded-2xl p-6 shadow-xs flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-neutral-50 flex items-center justify-center text-[#1E2D8C] shrink-0">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                  Total Users
                </p>
                <p className="text-h2 text-[#1E2D8C] mt-0.5 font-bold">
                  {totalUsers}
                </p>
              </div>
            </div>
          </div>

          {/* Action Panels Grid (3 columns) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {/* Upgrade Requests Panel */}
            <div className="bg-white border border-neutral-200/60 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-9 w-9 rounded-lg bg-primary/5 text-primary flex items-center justify-center border border-primary/10">
                    <UserCheck className="h-4.5 w-4.5" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1E2D8C]">
                    Host Approvals
                  </h3>
                </div>
                <p className="text-body-sm text-slate-500 leading-relaxed mb-6">
                  Review upgrades from renters requesting Host status. Approvals
                  enable users to pitch listings on open renter requests.
                </p>

                {pendingUpgrades > 0 ? (
                  <div className="p-4.5 rounded-lg bg-amber-50 border border-amber-200 text-body-sm text-amber-800 flex items-center gap-2 mb-6 animate-pulse">
                    <Clock className="h-4 w-4 shrink-0" />
                    <span>
                      There are <strong>{pendingUpgrades} pending</strong>{" "}
                      upgrades waiting.
                    </span>
                  </div>
                ) : (
                  <div className="p-4.5 rounded-lg bg-neutral-50 border border-neutral-200 text-body-sm text-slate-500 mb-6">
                    No pending host upgrade requests.
                  </div>
                )}
              </div>

              <Link
                href="/admin/host-approvals"
                className="inline-flex h-10 items-center justify-center px-4 rounded-lg bg-primary text-white text-body-sm font-semibold hover:bg-primary/95 transition-all shadow-xs cursor-pointer w-full"
              >
                Go to Approvals
              </Link>
            </div>

            {/* Requests Management Panel */}
            <div className="bg-white border border-neutral-200/60 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-9 w-9 rounded-lg bg-primary/5 text-primary flex items-center justify-center border border-primary/10">
                    <ClipboardList className="h-4.5 w-4.5" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1E2D8C]">
                    Manage Requests
                  </h3>
                </div>
                <p className="text-body-sm text-slate-500 leading-relaxed mb-6">
                  Monitor platform activity, inspect posted space requirements,
                  view proposal response counts, and archive requests.
                </p>

                <div className="p-4.5 rounded-lg bg-muted/40 border border-border text-body-sm text-slate-500 flex items-center gap-2 mb-6">
                  <Sparkles className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>
                    Tracking{" "}
                    <strong className="text-primary">
                      {totalRequests} requests
                    </strong>{" "}
                    across all categories.
                  </span>
                </div>
              </div>

              <Link
                href="/admin/requests"
                className="inline-flex h-10 items-center justify-center px-4 rounded-lg border border-neutral-200 bg-white text-[#1E2D8C] hover:bg-neutral-50 text-body-sm font-semibold transition-all shadow-xs cursor-pointer w-full"
              >
                View Requests
              </Link>
            </div>

            {/* Users Management Panel */}
            <div className="bg-white border border-neutral-200/60 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-9 w-9 rounded-lg bg-primary/5 text-primary flex items-center justify-center border border-primary/10">
                    <Users className="h-4.5 w-4.5" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1E2D8C]">
                    Manage Users
                  </h3>
                </div>
                <p className="text-body-sm text-slate-500 leading-relaxed mb-6">
                  View and search user profiles. Inspect registration
                  timestamps, system permissions, and host approvals status.
                </p>

                <div className="p-4.5 rounded-lg bg-muted/40 border border-border text-body-sm text-slate-500 flex items-center gap-2 mb-6">
                  <Users className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>
                    Database registers{" "}
                    <strong className="text-primary">
                      {totalUsers} user accounts
                    </strong>{" "}
                    in total.
                  </span>
                </div>
              </div>

              <Link
                href="/admin/users"
                className="inline-flex h-10 items-center justify-center px-4 rounded-lg border border-neutral-200 bg-white text-[#1E2D8C] hover:bg-neutral-50 text-body-sm font-semibold transition-all shadow-xs cursor-pointer w-full"
              >
                View Users Table
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
