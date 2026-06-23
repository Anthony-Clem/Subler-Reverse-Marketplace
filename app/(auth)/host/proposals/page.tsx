"use client";

import React from "react";
import Link from "next/link";
import { useUserProfile } from "@/hooks/use-host";
import { useHostProposals } from "@/hooks/use-proposals";
import {
  Send,
  Loader2,
  AlertCircle,
  Clock,
  ArrowUpRight,
  MapPin,
  Users,
  DollarSign,
  Calendar,
  ExternalLink,
} from "lucide-react";

export default function HostProposalsPage() {
  const { data: user, isLoading: userLoading } = useUserProfile();
  const {
    data: proposals,
    isLoading: proposalsLoading,
    error: proposalsError,
  } = useHostProposals();

  const isApprovedHost = user?.hostStatus === "approved";

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "accepted":
        return (
          <span className="inline-flex items-center gap-1.5 text-caption font-semibold px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
            Accepted
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1.5 text-caption font-semibold px-2.5 py-0.5 rounded-md bg-red-50 text-red-700 border border-red-200">
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-caption font-semibold px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
            Pending Review
          </span>
        );
    }
  };

  // Loading state for user profile
  if (userLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <p className="text-body-sm text-muted-foreground mt-3">
          Verifying credentials...
        </p>
      </div>
    );
  }

  // Restrict renters that are not hosts
  if (!isApprovedHost) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white border border-neutral-200/60 rounded-2xl p-8 text-center shadow-xs">
        <div className="h-12 w-12 rounded-full bg-neutral-50 flex items-center justify-center text-slate-400 mx-auto mb-6">
          <Clock className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-bold text-[#1E2D8C] mb-2">
          Host Access Restricted
        </h2>
        <p className="text-body-sm text-slate-500 leading-relaxed mb-6">
          You must apply and be approved as a host by an administrator to view
          sent proposals.
        </p>
        <Link
          href="/host/upgrade"
          className="inline-flex h-10 items-center justify-center px-6 rounded-lg bg-[#FDC800] text-[#1E2D8C] text-body-sm font-bold hover:bg-[#FDC800]/90 transition-all active:scale-[0.98] cursor-pointer shadow-xs"
        >
          Apply as Host <ArrowUpRight className="ml-1.5 h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-neutral-200/80">
        <div>
          <h1 className="text-h1 text-[#1E2D8C] font-bold">My Proposals</h1>
          <p className="text-body-sm text-slate-500 mt-1">
            Track pitches and Subler listings you have sent to renters.
          </p>
        </div>
        <Link
          href="/host/dashboard"
          className="inline-flex h-10 items-center justify-center px-4 rounded-lg bg-[#FDC800] text-[#1E2D8C] text-body-sm font-bold hover:bg-[#FDC800]/90 transition-all active:scale-[0.98] cursor-pointer shadow-xs"
        >
          <Send className="mr-1.5 h-4 w-4" /> Browse Live Requests
        </Link>
      </div>

      {/* Loading state for proposals list */}
      {proposalsLoading && (
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-xl p-6 h-40 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Error state */}
      {proposalsError && !proposalsLoading && (
        <div className="p-6 rounded-xl bg-red-500/5 border border-red-500/10 text-center">
          <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
          <p className="text-body text-red-600 font-semibold">
            Failed to load proposals
          </p>
          <p className="text-body-sm text-muted-foreground mt-1">
            Please try reloading the page.
          </p>
        </div>
      )}

      {/* Empty State */}
      {!proposalsLoading &&
        !proposalsError &&
        (!proposals || proposals.length === 0) && (
          <div className="bg-white border border-neutral-200/60 rounded-2xl p-8 md:p-12 text-center shadow-xs">
            <div className="h-12 w-12 rounded-full bg-neutral-50 flex items-center justify-center text-slate-400 mx-auto mb-6">
              <Send className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-[#1E2D8C] mb-2">
              No proposals submitted yet
            </h3>
            <p className="text-body-sm text-slate-500 max-w-sm mx-auto mb-6 leading-relaxed">
              {
                "You haven't submitted any pitches. Browse open renter requirements to pitch your facilities."
              }
            </p>
            <Link
              href="/host/dashboard"
              className="inline-flex h-10 items-center justify-center px-6 rounded-lg bg-[#FDC800] text-[#1E2D8C] text-body-sm font-bold hover:bg-[#FDC800]/90 transition-all active:scale-[0.98] cursor-pointer shadow-xs"
            >
              Browse Requests
            </Link>
          </div>
        )}

      {/* Proposals List */}
      {!proposalsLoading &&
        !proposalsError &&
        proposals &&
        proposals.length > 0 && (
          <div className="space-y-6">
            {proposals.map((proposal) => {
              const request = proposal.request;
              const renterEmail = request?.user?.email || "Verified Renter";

              return (
                <div
                  key={proposal.id}
                  className="bg-white border border-neutral-200/60 rounded-2xl p-6 shadow-xs flex flex-col gap-5"
                >
                  {/* Proposal Header */}
                  <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-neutral-100">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {request && (
                          <>
                            <span className="inline-flex items-center text-caption font-semibold px-2 py-0.5 rounded-md bg-neutral-50 text-slate-700 border border-neutral-200 capitalize">
                              {request.spaceType}
                            </span>
                            <span className="inline-flex items-center text-caption font-semibold px-2 py-0.5 rounded-md bg-neutral-50 text-slate-700 border border-neutral-200 capitalize">
                              {request.eventType.replace("_", " ")}
                            </span>
                          </>
                        )}
                        {getStatusBadge(proposal.status)}
                      </div>

                      {request ? (
                        <h3 className="font-display text-lg font-bold text-[#1E2D8C] capitalize tracking-tight">
                          {request.eventType.replace("_", " ")} /{" "}
                          {request.spaceType === "other"
                            ? "Space"
                            : request.spaceType}
                        </h3>
                      ) : (
                        <h3 className="font-display text-lg font-bold text-[#1E2D8C] tracking-tight">
                          Matched Request
                        </h3>
                      )}

                      <p className="text-caption text-slate-400 mt-1">
                        Submitted to {renterEmail} • Sent on{" "}
                        {getFormatDate(proposal.createdAt)}
                      </p>
                    </div>

                    <a
                      href={proposal.sublerLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-9 items-center justify-center gap-1.5 px-4 rounded-lg bg-[#FDC800] text-[#1E2D8C] hover:bg-[#FDC800]/90 text-body-sm font-bold transition-all cursor-pointer self-start sm:self-auto shadow-xs active:scale-[0.98]"
                    >
                      View Subler Link <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>

                  {/* matched request details if exists */}
                  {request && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-body-sm pb-4 border-b border-border/50 bg-neutral-50/50 p-4 rounded-lg">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-primary/75" />
                        <div>
                          <p className="text-[10px] text-muted-foreground font-semibold">
                            Renter Budget
                          </p>
                          <p className="font-semibold text-foreground text-caption">
                            ${request.budget}/hr max
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary/75" />
                        <div>
                          <p className="text-[10px] text-muted-foreground font-semibold">
                            Capacity
                          </p>
                          <p className="font-semibold text-foreground text-caption">
                            {request.headcount} people
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary/75" />
                        <div>
                          <p className="text-[10px] text-muted-foreground font-semibold">
                            Location
                          </p>
                          <p className="font-semibold text-foreground text-caption truncate max-w-[130px]">
                            {request.locationPreference}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary/75" />
                        <div>
                          <p className="text-[10px] text-muted-foreground font-semibold">
                            Event Date
                          </p>
                          <p className="font-semibold text-foreground text-caption truncate max-w-[130px]">
                            {getFormatDate(request.startDate)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* pitch sent */}
                  <div className="space-y-1.5">
                    <h4 className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                      Your Pitch Message
                    </h4>
                    <div className="text-body-sm text-foreground bg-neutral-50 p-4 rounded-lg border border-neutral-100 italic">
                      &ldquo;{proposal.pitch}&rdquo;
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
    </div>
  );
}
