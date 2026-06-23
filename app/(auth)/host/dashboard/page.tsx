"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useUserProfile } from "@/hooks/use-host";
import { useOpenRequests, RentalRequest } from "@/hooks/use-requests";
import { useCreateProposal } from "@/hooks/use-proposals";
import { toast } from "sonner";
import {
  Search,
  MapPin,
  Users,
  DollarSign,
  Calendar,
  Send,
  Loader2,
  AlertCircle,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle,
  Filter,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function HostDashboardPage() {
  const { data: user, isLoading: userLoading } = useUserProfile();
  const {
    data: requests,
    isLoading: requestsLoading,
    error: requestsError,
  } = useOpenRequests();
  const createProposal = useCreateProposal();

  const [activeProposalRequest, setActiveProposalRequest] =
    useState<RentalRequest | null>(null);
  const [sublerLink, setSublerLink] = useState("");
  const [pitch, setPitch] = useState("");
  const [linkError, setLinkError] = useState("");
  const [pitchError, setPitchError] = useState("");

  // Filter states
  const [selectedEventType, setSelectedEventType] = useState<string>("all");
  const [selectedSpaceType, setSelectedSpaceType] = useState<string>("all");

  const isApprovedHost = user?.hostStatus === "approved";

  const handleOpenProposalModal = (request: RentalRequest) => {
    setActiveProposalRequest(request);
    setSublerLink("");
    setPitch("");
    setLinkError("");
    setPitchError("");
  };

  const handleSublerLinkChange = (val: string) => {
    setSublerLink(val);
    setLinkError("");
  };

  const handlePitchChange = (val: string) => {
    setPitch(val);
    setPitchError("");
  };

  const validateForm = (): boolean => {
    let isValid = true;

    // Subler URL check
    if (!sublerLink) {
      setLinkError("Subler listing URL is required");
      isValid = false;
    } else {
      try {
        const url = new URL(sublerLink);
        const hostname = url.hostname;
        const isValidHost =
          hostname === "app.getsubler.com" ||
          hostname === "subler.com" ||
          hostname.endsWith(".subler.com");

        if (!isValidHost) {
          setLinkError(
            "URL must be a valid Subler listing (app.getsubler.com or subler.com)",
          );
          isValid = false;
        }
      } catch {
        setLinkError(
          "Please enter a valid absolute URL (starting with https://)",
        );
        isValid = false;
      }
    }

    // Pitch check
    if (pitch.length < 10) {
      setPitchError("Pitch must be at least 10 characters long");
      isValid = false;
    } else if (pitch.length > 500) {
      setPitchError("Pitch must be 500 characters or less");
      isValid = false;
    }

    return isValid;
  };

  const handleProposalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProposalRequest) return;

    if (!validateForm()) return;

    try {
      await createProposal.mutateAsync({
        requestId: activeProposalRequest.id,
        sublerLink,
        pitch,
      });

      toast.success("Proposal sent successfully!");
      setActiveProposalRequest(null);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to submit proposal";
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

  // Loading indicator for authentication/profile loading
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

  // Handle users trying to access host dashboard without approved host status
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
          open renter requests and submit proposals.
        </p>
        <Link
          href="/host/upgrade"
          className="inline-flex h-10 items-center justify-center px-6 rounded-lg bg-[#FDC800] text-black text-body-sm font-bold hover:bg-[#FDC800]/90 transition-all active:scale-[0.98] cursor-pointer shadow-xs"
        >
          Request Host Role <ArrowUpRight className="ml-1.5 h-4 w-4" />
        </Link>
      </div>
    );
  }

  // Filter requests:
  // 1. Must not belong to current user
  // 2. Event type check
  // 3. Space type check
  const filteredRequests =
    requests?.filter((r) => {
      if (r.userId === user.id) return false; // Exclude own requests
      if (selectedEventType !== "all" && r.eventType !== selectedEventType)
        return false;
      if (selectedSpaceType !== "all" && r.spaceType !== selectedSpaceType)
        return false;
      return true;
    }) || [];

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-neutral-200/80">
        <div>
          <h1 className="text-h1 text-[#1E2D8C] font-bold">Browse Requests</h1>
          <p className="text-body-sm text-slate-500 mt-1">
            Browse open facility requirements and pitch your Subler listing
            links.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-caption font-bold text-emerald-700 px-2.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 self-start md:self-auto">
          <ShieldCheck className="h-3.5 w-3.5" />
          Verified Host Account
        </div>
      </div>

      {/* Filter Panel */}
      {!requestsLoading &&
        !requestsError &&
        requests &&
        requests.length > 0 && (
          <div className="bg-white border border-neutral-200/60 rounded-2xl p-4 shadow-xs flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-caption font-bold uppercase tracking-wider text-slate-400 mr-2">
              <Filter className="h-4 w-4 text-primary" /> Filter Feed
            </div>

            {/* Event Type Filter */}
            <div className="flex items-center gap-2">
              <span className="text-caption font-semibold text-muted-foreground">
                Activity:
              </span>
              <select
                value={selectedEventType}
                onChange={(e) => setSelectedEventType(e.target.value)}
                className="h-8.5 rounded-lg border border-border text-caption font-semibold px-2 focus:ring-1 focus:ring-primary focus:border-primary bg-white text-foreground"
              >
                <option value="all">All Activities</option>
                <option value="athletic">Athletic / Fitness</option>
                <option value="conference">Conference / Seminar</option>
                <option value="film_production">Film / Production</option>
                <option value="event">Event / Celebration</option>
                <option value="rehearsal">Rehearsal / Performing</option>
                <option value="meeting">Meeting / Workshop</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Space Type Filter */}
            <div className="flex items-center gap-2">
              <span className="text-caption font-semibold text-muted-foreground">
                Space Layout:
              </span>
              <select
                value={selectedSpaceType}
                onChange={(e) => setSelectedSpaceType(e.target.value)}
                className="h-8.5 rounded-lg border border-border text-caption font-semibold px-2 focus:ring-1 focus:ring-primary focus:border-primary bg-white text-foreground"
              >
                <option value="all">All Space Layouts</option>
                <option value="studio">Creative Studio</option>
                <option value="warehouse">Warehouse</option>
                <option value="event_hall">Event Hall</option>
                <option value="outdoor">Outdoor Space</option>
                <option value="gym">Gym / Court</option>
                <option value="classroom">Classroom / Lab</option>
                <option value="office">Office / Coworking</option>
                <option value="other">Other</option>
              </select>
            </div>

            <span className="text-caption text-muted-foreground ml-auto font-semibold">
              {filteredRequests.length} requests available
            </span>
          </div>
        )}

      {/* Loading state for requests */}
      {requestsLoading && (
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-xl p-6 h-52 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Error state */}
      {requestsError && !requestsLoading && (
        <div className="p-6 rounded-xl bg-red-500/5 border border-red-500/10 text-center">
          <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
          <p className="text-body text-red-600 font-semibold">
            Failed to load rental requests
          </p>
          <p className="text-body-sm text-muted-foreground mt-1">
            Please try reloading the browser page.
          </p>
        </div>
      )}

      {/* Empty Feed State */}
      {!requestsLoading &&
        !requestsError &&
        (!requests || requests.length === 0) && (
          <div className="bg-card border border-border rounded-xl p-12 text-center shadow-sm">
            <div className="h-16 w-16 rounded-lg bg-primary/5 border border-primary/5 flex items-center justify-center text-primary mx-auto mb-6">
              <Search className="h-8 w-8" />
            </div>
            <h3 className="text-h3 text-foreground mb-2">No open requests</h3>
            <p className="text-body-sm text-muted-foreground max-w-sm mx-auto">
              Renters have not posted any space requirements yet. Check back
              later for open requests.
            </p>
          </div>
        )}

      {/* Empty Filtered Feed State */}
      {!requestsLoading &&
        !requestsError &&
        requests &&
        requests.length > 0 &&
        filteredRequests.length === 0 && (
          <div className="bg-card border border-border rounded-xl p-12 text-center shadow-sm">
            <p className="text-body-sm text-muted-foreground">
              No open renter requirements match your filters.
            </p>
          </div>
        )}

      {/* Requests Feed List */}
      {!requestsLoading && !requestsError && filteredRequests.length > 0 && (
        <div className="space-y-6">
          {filteredRequests.map((request) => {
            const hasSentProposal = request.proposals?.some(
              (p) => p.hostId === user?.id,
            );

            return (
              <div
                key={request.id}
                className="bg-white border border-neutral-200/60 rounded-2xl p-6 shadow-xs flex flex-col gap-5"
              >
                {/* Request Header */}
                <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-neutral-100">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="inline-flex items-center text-caption font-semibold px-2 py-0.5 rounded-md bg-neutral-50 text-slate-700 border border-neutral-200 capitalize">
                        {request.spaceType}
                      </span>
                      <span className="inline-flex items-center text-caption font-semibold px-2 py-0.5 rounded-md bg-neutral-50 text-slate-700 border border-neutral-200 capitalize">
                        {request.eventType.replace("_", " ")}
                      </span>
                      {hasSentProposal && (
                        <span className="inline-flex items-center gap-1.5 text-caption font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle className="h-3 w-3" />
                          Proposal Sent
                        </span>
                      )}
                    </div>
                    <h3 className="font-display text-lg font-bold text-[#1E2D8C] capitalize tracking-tight">
                      {request.eventType.replace("_", " ")} /{" "}
                      {request.spaceType === "other"
                        ? "Space"
                        : request.spaceType}
                    </h3>
                    <p className="text-caption text-slate-400 mt-1">
                      Posted by {request.user?.email || "Verified Renter"} •{" "}
                      {getFormatDate(request.createdAt)}
                    </p>
                  </div>

                  {!hasSentProposal && (
                    <button
                      onClick={() => handleOpenProposalModal(request)}
                      className="inline-flex h-10 items-center justify-center px-4 rounded-lg bg-[#FDC800] text-black text-body-sm font-bold hover:bg-[#FDC800]/90 transition-all active:scale-[0.98] cursor-pointer flex gap-1.5 shadow-xs"
                    >
                      <Send className="h-3.5 w-3.5" /> Pitch Space
                    </button>
                  )}
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-body-sm pb-4 border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4.5 w-4.5 text-primary/75" />
                    <div>
                      <p className="text-[10px] text-muted-foreground font-semibold">
                        Budget
                      </p>
                      <p className="font-semibold text-foreground">
                        ${request.budget}/hr max
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4.5 w-4.5 text-primary/75" />
                    <div>
                      <p className="text-[10px] text-muted-foreground font-semibold">
                        Capacity
                      </p>
                      <p className="font-semibold text-foreground">
                        {request.headcount} people
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4.5 w-4.5 text-primary/75" />
                    <div>
                      <p className="text-[10px] text-muted-foreground font-semibold">
                        Location Pref.
                      </p>
                      <p className="font-semibold text-foreground truncate max-w-[140px]">
                        {request.locationPreference}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4.5 w-4.5 text-primary/75" />
                    <div>
                      <p className="text-[10px] text-muted-foreground font-semibold">
                        Start Date
                      </p>
                      <p className="font-semibold text-foreground truncate max-w-[140px]">
                        {getFormatDate(request.startDate)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                {request.amenities && (
                  <div className="space-y-1.5">
                    <h4 className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                      Required Amenities
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {request.amenities.split(", ").map((item: string) => (
                        <span
                          key={item}
                          className="px-2.5 py-0.5 rounded-md bg-neutral-50 border border-border text-caption font-semibold text-foreground/80"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Renter Notes */}
                {request.notes && (
                  <div className="text-body-sm text-muted-foreground bg-neutral-50 p-4 rounded-lg border border-neutral-100 italic">
                    &ldquo;{request.notes}&rdquo;
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Send Proposal Dialog Modal Overlay */}
      {activeProposalRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          {/* Modal Container */}
          <div className="bg-white border border-neutral-200/60 rounded-2xl p-6 max-w-md w-full shadow-sm space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div>
                <h3 className="font-display font-bold text-body text-[#1E2D8C]">
                  Send Proposal Pitch
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5 capitalize">
                  To: {activeProposalRequest.eventType.replace("_", " ")} /{" "}
                  {activeProposalRequest.spaceType}
                </p>
              </div>
              <button
                onClick={() => setActiveProposalRequest(null)}
                className="text-slate-400 hover:text-[#1E2D8C] text-caption font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleProposalSubmit} className="space-y-4">
              {/* Subler Link Input */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                  <span>Subler Listing URL</span>
                  <span className="text-[10px] text-primary lowercase">
                    Must be app.getsubler.com
                  </span>
                </label>
                <Input
                  type="text"
                  placeholder="https://app.getsubler.com/listings/your-facility-slug"
                  value={sublerLink}
                  onChange={(e) => handleSublerLinkChange(e.target.value)}
                  disabled={createProposal.isPending}
                  className="h-10 rounded-lg bg-white text-foreground"
                />
                {linkError && (
                  <p className="text-[11px] text-red-600 flex items-center gap-1 font-semibold">
                    <AlertCircle className="h-3 w-3 shrink-0" /> {linkError}
                  </p>
                )}
              </div>

              {/* Pitch Textarea */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                  <span>Your Pitch Message</span>
                  <span
                    className={`text-[10px] font-semibold ${pitch.length > 500 ? "text-red-500" : "text-muted-foreground"}`}
                  >
                    {pitch.length} / 500 chars
                  </span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe your space facilities, verify that you match their budget, calendar schedules, and headcount needs..."
                  value={pitch}
                  onChange={(e) => handlePitchChange(e.target.value)}
                  disabled={createProposal.isPending}
                  className="w-full rounded-lg border border-border p-3 bg-white text-foreground text-body-sm focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                />
                {pitchError && (
                  <p className="text-[11px] text-red-600 flex items-center gap-1 font-semibold">
                    <AlertCircle className="h-3 w-3 shrink-0" /> {pitchError}
                  </p>
                )}
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Provide a brief, compelling pitch. Minimum 10 characters,
                  maximum 500 characters.
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-200 mt-5">
                <button
                  type="button"
                  onClick={() => setActiveProposalRequest(null)}
                  disabled={createProposal.isPending}
                  className="inline-flex h-9 items-center justify-center px-4 rounded-lg border border-neutral-200 bg-white text-slate-600 hover:bg-neutral-50 text-body-sm font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  disabled={createProposal.isPending}
                  className="inline-flex h-9 items-center justify-center px-5 rounded-lg bg-[#FDC800] text-black hover:bg-[#FDC800]/90 text-body-sm font-bold transition-all cursor-pointer shadow-xs flex items-center gap-1.5 border-transparent active:scale-[0.98]"
                >
                  {createProposal.isPending ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />{" "}
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" /> Send Proposal
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
