"use client";

import { useUserProfile } from "@/hooks/use-host";
import { useMyRequests } from "@/hooks/use-requests";
import {
  Activity,
  ArrowUpRight,
  Calendar,
  CheckCircle,
  ClipboardList,
  DollarSign,
  MapPin,
  MessageSquare,
  Plus,
  Search,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session } = useSession();
  const { data: profile } = useUserProfile();
  const { data: requests, isLoading, error } = useMyRequests();

  const isHost = profile?.hostStatus === "approved";

  // Helper to count active and matching stats
  const activeRequests = requests?.filter((r) => r.status === "open") || [];
  const totalProposals =
    requests?.reduce((acc, r) => acc + (r.proposals?.length || 0), 0) || 0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return (
          <span className="inline-flex items-center gap-1.5 text-caption font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Open
          </span>
        );
      case "fulfilled":
        return (
          <span className="inline-flex items-center gap-1.5 text-caption font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCircle className="h-3 w-3" />
            Fulfilled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-caption font-semibold px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600 border border-neutral-200">
            Closed
          </span>
        );
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
    <div className="space-y-8 max-w-6xl text-[#0e1442]">
      {/* Branded Dashboard Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-[#1e2d8c] p-8 md:p-10 text-white shadow-xs border border-neutral-200/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-white/10 text-white/90 border border-white/5 text-caption font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {isHost ? "Verified Host Profile" : "Active Renter Account"}
            </div>
            <div>
              <p className="text-caption text-blue-200 font-medium">
                Welcome back,{" "}
                {(profile?.email || session?.user?.email)?.split("@")[0] ||
                  "Renter"}{" "}
                👋
              </p>
              <h1 className="font-display text-3xl font-bold tracking-tight text-white mt-1">
                {isHost ? "Host Matching Panel" : "Renter Dashboard"}
              </h1>
            </div>
            <p className="text-body-sm text-white/80 max-w-xl leading-relaxed">
              {isHost
                ? "Browse open renter requests, send custom proposals with listing links, and get booked."
                : "Manage your space requirements and track incoming proposals from verified Subler hosts."}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
            {isHost ? (
              <Link
                href="/host/dashboard"
                className="inline-flex h-10 items-center justify-center px-4 rounded-lg bg-accent-peach-500 text-[#0e1442] text-body-sm font-bold hover:bg-accent-peach-500/90 transition-all active:scale-[0.98] cursor-pointer"
              >
                Browse Open Requests
              </Link>
            ) : (
              <Link
                href="/requests/new"
                className="inline-flex h-10 items-center justify-center px-4 rounded-lg bg-accent-peach-500 text-[#0e1442] text-body-sm font-bold hover:bg-accent-peach-500/90 transition-all active:scale-[0.98] cursor-pointer"
              >
                <Plus className="mr-1.5 h-4 w-4" /> Post a Request
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white border border-neutral-200/60 rounded-2xl p-6 h-28 animate-pulse"
              />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-white border border-neutral-200/60 rounded-2xl p-6 h-56 animate-pulse"
                />
              ))}
            </div>
            <div className="bg-white border border-neutral-200/60 rounded-2xl p-6 h-80 animate-pulse" />
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="p-8 rounded-2xl bg-red-500/5 border border-red-500/10 text-center max-w-xl mx-auto shadow-xs">
          <p className="text-body text-red-600 font-semibold">
            Failed to load requests
          </p>
          <p className="text-body-sm text-muted-foreground mt-1.5">
            Please try reloading the page.
          </p>
        </div>
      )}

      {!isLoading && !error && (
        <>
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Metric 1 */}
            <div className="bg-white border border-neutral-200/60 rounded-2xl p-6 shadow-xs relative overflow-hidden group">
              <div className="flex items-start justify-between">
                <div className="h-10 w-10 rounded-lg bg-neutral-50 flex items-center justify-center text-slate-600">
                  <ClipboardList className="h-5 w-5" />
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <TrendingUp className="h-3 w-3" /> +12%
                </span>
              </div>
              <div className="mt-4">
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                  Total Requests
                </p>
                <p className="font-display text-3xl font-bold text-[#0e1442] mt-1">
                  {requests?.length || 0}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Event requirements submitted
                </p>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="bg-white border border-neutral-200/60 rounded-2xl p-6 shadow-xs relative overflow-hidden group">
              <div className="flex items-start justify-between">
                <div className="h-10 w-10 rounded-lg bg-neutral-50 flex items-center justify-center text-slate-600">
                  <span className="relative flex h-2 w-2">
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Live matching
                </span>
              </div>
              <div className="mt-4">
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                  Active Requests
                </p>
                <p className="font-display text-3xl font-bold text-[#0e1442] mt-1">
                  {activeRequests.length}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Open space matching posts
                </p>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="bg-white border border-neutral-200/60 rounded-2xl p-6 shadow-xs relative overflow-hidden group">
              <div className="flex items-start justify-between">
                <div className="h-10 w-10 rounded-lg bg-neutral-50 flex items-center justify-center text-slate-600">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <TrendingUp className="h-3 w-3" /> +24%
                </span>
              </div>
              <div className="mt-4">
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                  Proposals Received
                </p>
                <p className="font-display text-3xl font-bold text-[#0e1442] mt-1">
                  {totalProposals}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Verified host pitches received
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions Row */}
          <div className="space-y-4">
            <h3 className="text-caption font-bold text-slate-500 uppercase tracking-wider">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                href="/requests/new"
                className="group p-5 bg-white border border-neutral-200/60 rounded-2xl shadow-xs hover:border-neutral-300 transition-all duration-150"
              >
                <div className="h-9 w-9 rounded-lg bg-neutral-50 text-slate-600 flex items-center justify-center mb-4 group-hover:bg-neutral-100 transition-all">
                  <Plus className="h-4.5 w-4.5" />
                </div>
                <h4 className="text-body-sm font-bold text-[#0e1442] flex items-center gap-1">
                  Create Request{" "}
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  Post a new space requirement and invite proposals.
                </p>
              </Link>

              <Link
                href="/requests/my"
                className="group p-5 bg-white border border-neutral-200/60 rounded-2xl shadow-xs hover:border-neutral-300 transition-all duration-150"
              >
                <div className="h-9 w-9 rounded-lg bg-neutral-50 text-slate-600 flex items-center justify-center mb-4 group-hover:bg-neutral-100 transition-all">
                  <ClipboardList className="h-4.5 w-4.5" />
                </div>
                <h4 className="text-body-sm font-bold text-[#0e1442] flex items-center gap-1">
                  View Proposals{" "}
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  Check matching pitches and review details.
                </p>
              </Link>

              {isHost ? (
                <Link
                  href="/host/dashboard"
                  className="group p-5 bg-white border border-neutral-200/60 rounded-2xl shadow-xs hover:border-neutral-300 transition-all duration-150"
                >
                  <div className="h-9 w-9 rounded-lg bg-neutral-50 text-slate-600 flex items-center justify-center mb-4 group-hover:bg-neutral-100 transition-all">
                    <Search className="h-4.5 w-4.5" />
                  </div>
                  <h4 className="text-body-sm font-bold text-[#0e1442] flex items-center gap-1">
                    Browse Requests{" "}
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Search active renter requirements and submit offers.
                  </p>
                </Link>
              ) : (
                <Link
                  href="/host/upgrade"
                  className="group p-5 bg-white border border-neutral-200/60 rounded-2xl shadow-xs hover:border-neutral-300 transition-all duration-150"
                >
                  <div className="h-9 w-9 rounded-lg bg-neutral-50 text-slate-600 flex items-center justify-center mb-4 group-hover:bg-neutral-100 transition-all">
                    <Zap className="h-4.5 w-4.5" />
                  </div>
                  <h4 className="text-body-sm font-bold text-[#0e1442] flex items-center gap-1">
                    Upgrade to Host{" "}
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Register your space to pitch pitches to active renters.
                  </p>
                </Link>
              )}

              <a
                href="#how-it-works"
                className="group p-5 bg-white border border-neutral-200/60 rounded-2xl shadow-xs hover:border-neutral-300 transition-all duration-150"
                onClick={(e) => {
                  e.preventDefault();
                  const section = document.getElementById("how-it-works");
                  if (section) {
                    section.scrollIntoView({ behavior: "smooth" });
                  } else {
                    window.location.href = "/#how-it-works";
                  }
                }}
              >
                <div className="h-9 w-9 rounded-lg bg-neutral-50 text-slate-600 flex items-center justify-center mb-4 group-hover:bg-neutral-100 transition-all">
                  <Activity className="h-4.5 w-4.5" />
                </div>
                <h4 className="text-body-sm font-bold text-[#0e1442] flex items-center gap-1">
                  How It Works{" "}
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  View the layout guides and platform workflows.
                </p>
              </a>
            </div>
          </div>

          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Content Area (2/3 width) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-200/60 pb-3">
                <h2 className="text-caption font-bold text-slate-500 uppercase tracking-wider">
                  Active Space Requests
                </h2>
                {requests && requests.length > 0 && (
                  <span className="text-[11px] text-slate-400 font-semibold">
                    Showing {requests.length} posts
                  </span>
                )}
              </div>

              {/* Empty State */}
              {(!requests || requests.length === 0) && (
                <div className="bg-white border border-neutral-200/60 rounded-2xl p-10 md:p-14 text-center shadow-xs">
                  <div className="h-12 w-12 rounded-full bg-neutral-50 flex items-center justify-center text-slate-400 mx-auto mb-6">
                    <ClipboardList className="h-6 w-6" />
                  </div>

                  <h3 className="font-display text-lg font-bold text-[#0e1442] mb-2">
                    No active requests
                  </h3>
                  <p className="text-body-sm text-slate-500 max-w-sm mx-auto mb-6 leading-relaxed">
                    Create your first request and let verified hosts compete for
                    your business. Bids will appear here.
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <Link
                      href="/requests/new"
                      className="inline-flex h-10 items-center justify-center px-4 rounded-lg bg-accent-peach-500 text-[#0e1442] text-body-sm font-bold hover:bg-accent-peach-500/90 transition-all active:scale-[0.98] cursor-pointer"
                    >
                      Create Request
                    </Link>
                  </div>
                </div>
              )}

              {/* List of Requests */}
              {requests && requests.length > 0 && (
                <div className="space-y-6">
                  {requests.map((request) => (
                    <div
                      key={request.id}
                      className="bg-white border border-neutral-200/60 rounded-2xl p-6 shadow-xs flex flex-col gap-6"
                    >
                      {/* Request Header */}
                      <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-neutral-100">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="inline-flex items-center text-[10px] font-bold tracking-wide px-2 py-0.5 rounded-md bg-neutral-50 text-slate-700 border border-neutral-200 capitalize">
                              {request.spaceType}
                            </span>
                            <span className="inline-flex items-center text-[10px] font-bold tracking-wide px-2 py-0.5 rounded-md bg-neutral-50 text-slate-700 border border-neutral-200 capitalize">
                              {request.eventType.replace("_", " ")}
                            </span>
                            {getStatusBadge(request.status)}
                          </div>
                          <h3 className="font-display text-lg font-bold text-[#0e1442] capitalize tracking-tight">
                            {request.eventType.replace("_", " ")} /{" "}
                            {request.spaceType === "other"
                              ? "Space"
                              : request.spaceType}
                          </h3>
                        </div>
                        <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap pt-1">
                          Posted {getFormatDate(request.createdAt)}
                        </span>
                      </div>

                      {/* Request Details Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-body-sm pb-4 border-b border-neutral-100">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-lg bg-neutral-50 flex items-center justify-center text-slate-600">
                            <DollarSign className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                              Budget
                            </p>
                            <p className="font-bold text-[#0e1442]">
                              ${request.budget}/hr
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-lg bg-neutral-50 flex items-center justify-center text-slate-600">
                            <Users className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                              Headcount
                            </p>
                            <p className="font-bold text-[#0e1442]">
                              {request.headcount} people
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-lg bg-neutral-50 flex items-center justify-center text-slate-600">
                            <MapPin className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                              Location
                            </p>
                            <p
                              className="font-bold text-[#0e1442] truncate max-w-[120px]"
                              title={request.locationPreference}
                            >
                              {request.locationPreference}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-lg bg-neutral-50 flex items-center justify-center text-slate-600">
                            <Calendar className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                              Dates
                            </p>
                            <p className="font-bold text-[#0e1442] truncate max-w-30">
                              {getFormatDate(request.startDate)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Notes */}
                      {request.notes && (
                        <div className="text-body-sm text-slate-500 bg-neutral-50 p-4 rounded-xl border border-neutral-100 leading-relaxed italic">
                          &ldquo;{request.notes}&rdquo;
                        </div>
                      )}

                      {/* Proposals Received */}
                      <div className="space-y-4 pt-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-body-sm font-bold text-[#0e1442] flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-slate-600" />{" "}
                            Proposals Received ({request.proposals?.length || 0}
                            )
                          </h4>
                          {request.status === "open" && (
                            <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                              Awaiting pitches
                            </span>
                          )}
                        </div>

                        {(!request.proposals ||
                          request.proposals.length === 0) && (
                          <div className="p-6 rounded-xl border border-dashed border-neutral-200/80 bg-neutral-50/50 text-center">
                            <p className="text-body-sm text-slate-500">
                              No proposals received yet. Active hosts are
                              reviewing your request.
                            </p>
                          </div>
                        )}

                        {request.proposals && request.proposals.length > 0 && (
                          <div className="space-y-3">
                            {request.proposals.map((proposal) => (
                              <div
                                key={proposal.id}
                                className="bg-white border border-neutral-200/60 rounded-xl p-4.5 hover:border-neutral-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                              >
                                <div className="space-y-2 max-w-xl">
                                  <div className="flex items-center gap-2">
                                    <div className="h-5 w-5 rounded-full bg-primary text-white flex items-center justify-center text-[9px] font-bold">
                                      {proposal.host?.email?.[0]?.toUpperCase() ||
                                        "H"}
                                    </div>
                                    <span className="text-body-sm font-bold text-[#0e1442]">
                                      {proposal.host?.email || "Verified Host"}
                                    </span>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                                      Verified Listing
                                    </span>
                                  </div>
                                  <p className="text-body-sm text-slate-500 leading-relaxed italic">
                                    &ldquo;{proposal.pitch}&rdquo;
                                  </p>
                                </div>

                                <a
                                  href={proposal.sublerLink}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-accent-peach-500 text-[#0e1442] hover:bg-accent-peach-500/90 text-body-sm font-semibold transition-all cursor-pointer self-start md:self-auto shrink-0 shadow-xs active:scale-[0.98]"
                                >
                                  View on Subler{" "}
                                  <ArrowUpRight className="h-3.5 w-3.5" />
                                </a>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Activity Panel (1/3 width) */}
            <div className="space-y-6">
              <div className="border-b border-neutral-200/60 pb-3">
                <h3 className="text-caption font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <Activity className="h-4 w-4 text-slate-600" /> Recent
                  Activity
                </h3>
              </div>
              <div className="bg-white border border-neutral-200/60 rounded-2xl p-5 shadow-xs space-y-6">
                {/* Timeline */}
                <div className="relative border-l border-neutral-200 pl-5 ml-2.5 space-y-6">
                  {/* Timeline Node 1 */}
                  <div className="relative">
                    <span className="absolute left-[-27.5px] top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 border border-emerald-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </span>
                    <div>
                      <p className="text-[11.5px] font-semibold text-[#0e1442]">
                        Matching live hosts
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                        Verified facility owners are reviewing active
                        submissions.
                      </p>
                      <span className="text-[10px] text-slate-400 font-semibold block mt-1.5">
                        Just now
                      </span>
                    </div>
                  </div>

                  {/* Dynamic Timeline items based on requests */}
                  {requests &&
                    requests.slice(0, 3).map((req) => {
                      const hasProposals =
                        req.proposals && req.proposals.length > 0;
                      return (
                        <div key={req.id} className="relative">
                          <span className="absolute left-[-27.5px] top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-blue-50 text-blue-600 border border-blue-200">
                            <Plus className="h-2.5 w-2.5" />
                          </span>
                          <div>
                            <p className="text-[11.5px] font-semibold text-[#0e1442] capitalize">
                              Request created: {req.eventType.replace("_", " ")}
                            </p>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Seeking {req.spaceType} space for {req.headcount}{" "}
                              people in {req.locationPreference}.
                            </p>
                            {hasProposals && (
                              <div className="mt-2 flex items-center gap-1.5 text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 self-start w-fit">
                                <MessageSquare className="h-3 w-3" /> Proposal
                                received
                              </div>
                            )}
                            <span className="text-[10px] text-slate-400 font-semibold block mt-1.5">
                              {getFormatDate(req.createdAt)}
                            </span>
                          </div>
                        </div>
                      );
                    })}

                  {/* Base Onboarding timeline when no requests or few requests */}
                  {(!requests || requests.length < 2) && (
                    <>
                      <div className="relative">
                        <span className="absolute left-[-27.5px] top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-amber-50 text-amber-600 border border-amber-200">
                          <Zap className="h-2.5 w-2.5" />
                        </span>
                        <div>
                          <p className="text-[11.5px] font-semibold text-[#0e1442]">
                            Complete reverse-matching setup
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Create your request parameters to get bids.
                          </p>
                          <span className="text-[10px] text-slate-400 font-semibold block mt-1.5">
                            Step 2 of 3
                          </span>
                        </div>
                      </div>

                      <div className="relative">
                        <span className="absolute left-[-27.5px] top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                          <CheckCircle className="h-2.5 w-2.5" />
                        </span>
                        <div>
                          <p className="text-[11.5px] font-semibold text-[#0e1442]">
                            Welcome to Reverse Marketplace
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Verified renter profile activated successfully.
                          </p>
                          <span className="text-[10px] text-slate-400 font-semibold block mt-1.5">
                            Step 1 of 3
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
