"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  useMyRequests,
  useUpdateRequest,
  useDeleteRequest,
  RentalRequest,
} from "@/hooks/use-requests";
import { useUpdateProposalStatus } from "@/hooks/use-proposals";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { toast } from "sonner";
import {
  Plus,
  ClipboardList,
  CheckCircle,
  MapPin,
  Users,
  DollarSign,
  ArrowUpRight,
  Loader2,
  Calendar,
  Trash2,
  AlertCircle,
  Pencil,
} from "lucide-react";

const AMENITY_OPTIONS = [
  "WiFi",
  "Sound System",
  "Mirrors",
  "Air Conditioning",
  "Heating",
  "Parking",
  "Restrooms",
  "Natural Light",
  "Projector / Screen",
  "Tables & Chairs",
  "Kitchen / Prep Area",
  "Wheelchair Accessible",
] as const;

export default function MyRequestsPage() {
  const { data: requests, isLoading, error } = useMyRequests();
  const updateRequest = useUpdateRequest();
  const deleteRequest = useDeleteRequest();
  const updateProposalStatus = useUpdateProposalStatus();

  const handleProposalAction = async (
    proposalId: string,
    action: "accepted" | "rejected",
  ) => {
    try {
      await updateProposalStatus.mutateAsync({
        id: proposalId,
        status: action,
      });
      toast.success(
        `Proposal ${action === "accepted" ? "accepted" : "declined"} successfully`,
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to update proposal";
      toast.error(message);
    }
  };

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [editingRequest, setEditingRequest] = useState<RentalRequest | null>(
    null,
  );
  const [editFormData, setEditFormData] = useState<{
    eventType: string;
    spaceType: string;
    startDate: string;
    endDate: string;
    budget: string;
    headcount: string;
    locationPreference: string;
    amenities: string;
    notes: string;
  } | null>(null);

  const handleEditClick = (request: RentalRequest) => {
    setEditingRequest(request);

    const formatToDatetimeLocal = (isoString: string) => {
      try {
        const d = new Date(isoString);
        const pad = (n: number) => String(n).padStart(2, "0");
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
      } catch {
        return "";
      }
    };

    setEditFormData({
      eventType: request.eventType,
      spaceType: request.spaceType,
      startDate: formatToDatetimeLocal(request.startDate),
      endDate: formatToDatetimeLocal(request.endDate),
      budget: String(request.budget),
      headcount: String(request.headcount),
      locationPreference: request.locationPreference,
      amenities: request.amenities || "",
      notes: request.notes || "",
    });
  };

  const handleStatusChange = async (
    requestId: string,
    newStatus: "open" | "closed" | "fulfilled",
  ) => {
    try {
      await updateRequest.mutateAsync({
        id: requestId,
        data: { status: newStatus },
      });
      toast.success(`Request status updated to ${newStatus}`);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to update status";
      toast.error(message);
    }
  };

  const handleDeleteSubmit = async () => {
    if (!deleteConfirmId) return;

    try {
      await deleteRequest.mutateAsync(deleteConfirmId);
      toast.success("Rental request deleted successfully");
      setDeleteConfirmId(null);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to delete request";
      toast.error(message);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRequest || !editFormData) return;

    if (!editFormData.eventType || !editFormData.spaceType) {
      toast.error("Please select event and space types");
      return;
    }
    if (!editFormData.startDate || !editFormData.endDate) {
      toast.error("Please select start and end dates");
      return;
    }
    if (
      new Date(editFormData.endDate).getTime() <=
      new Date(editFormData.startDate).getTime()
    ) {
      toast.error("End date must occur after the start date");
      return;
    }
    if (!editFormData.budget || parseFloat(editFormData.budget) <= 0) {
      toast.error("Please enter a valid budget");
      return;
    }
    if (!editFormData.headcount || parseInt(editFormData.headcount) <= 0) {
      toast.error("Please enter a valid headcount");
      return;
    }
    if (!editFormData.locationPreference) {
      toast.error("Please enter a location preference");
      return;
    }

    try {
      await updateRequest.mutateAsync({
        id: editingRequest.id,
        data: {
          eventType: editFormData.eventType,
          spaceType: editFormData.spaceType,
          startDate: new Date(editFormData.startDate).toISOString(),
          endDate: new Date(editFormData.endDate).toISOString(),
          budget: parseFloat(editFormData.budget),
          headcount: parseInt(editFormData.headcount),
          locationPreference: editFormData.locationPreference,
          amenities: editFormData.amenities,
          notes: editFormData.notes.trim() || undefined,
        },
      });
      toast.success("Rental request updated successfully");
      setEditingRequest(null);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to update request";
      toast.error(message);
    }
  };

  const handleToggleAmenity = (item: string) => {
    if (!editFormData) return;
    const currentAmenities = editFormData.amenities
      ? editFormData.amenities.split(", ").map((a) => a.trim())
      : [];
    let updated: string[];
    if (currentAmenities.includes(item)) {
      updated = currentAmenities.filter((a) => a !== item);
    } else {
      updated = [...currentAmenities, item];
    }
    setEditFormData({ ...editFormData, amenities: updated.join(", ") });
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return (
          <span className="inline-flex items-center gap-1.5 text-caption font-semibold px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Open
          </span>
        );
      case "fulfilled":
        return (
          <span className="inline-flex items-center gap-1.5 text-caption font-semibold px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCircle className="h-3 w-3" />
            Fulfilled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-caption font-semibold px-2.5 py-0.5 rounded-md bg-neutral-100 text-neutral-600 border border-neutral-200">
            Closed
          </span>
        );
    }
  };

  // Filter requests
  const filteredRequests =
    requests?.filter((r) => {
      if (statusFilter === "all") return true;
      return r.status === statusFilter;
    }) || [];

  const targetDeleteRequest = requests?.find((r) => r.id === deleteConfirmId);

  return (
    <div className="space-y-8 max-w-5xl relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-neutral-200/80">
        <div>
          <h1 className="text-h1 text-[#1E2D8C] font-bold">My Requests</h1>
          <p className="text-body-sm text-slate-500 mt-1">
            Track and manage your facility requirements and close status.
          </p>
        </div>
        <Link
          href="/requests/new"
          className="inline-flex h-10 items-center justify-center px-4 rounded-lg bg-[#FDC800] text-[#1E2D8C] text-body-sm font-bold hover:bg-[#FDC800]/90 transition-all active:scale-[0.98] cursor-pointer self-start sm:self-auto"
        >
          <Plus className="mr-1.5 h-4 w-4" /> Post a Request
        </Link>
      </div>

      {/* Filter Tabs & Count */}
      {!isLoading && !error && requests && requests.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="inline-flex p-1 bg-neutral-100 rounded-lg border border-border/80 self-start">
            {["all", "open", "closed", "fulfilled"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-1.5 rounded-md text-caption font-semibold transition-all capitalize cursor-pointer ${
                  statusFilter === status
                    ? "bg-white text-foreground shadow-xs border border-border/40"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <span className="text-body-sm font-semibold text-muted-foreground">
            Showing {filteredRequests.length} requests
          </span>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
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
      {error && !isLoading && (
        <div className="p-6 rounded-xl bg-red-500/5 border border-red-500/10 text-center">
          <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
          <p className="text-body text-red-600 font-semibold">
            Failed to load your requests
          </p>
          <p className="text-body-sm text-muted-foreground mt-1">
            Check your database connection and try again.
          </p>
        </div>
      )}

      {/* Empty State (No requests posted yet at all) */}
      {!isLoading && !error && (!requests || requests.length === 0) && (
        <div className="bg-white border border-neutral-200/60 rounded-2xl p-8 md:p-12 text-center shadow-xs">
          <div className="h-12 w-12 rounded-full bg-neutral-50 flex items-center justify-center text-slate-400 mx-auto mb-6">
            <ClipboardList className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-[#1E2D8C] mb-2">
            No requests created yet
          </h3>
          <p className="text-body-sm text-slate-500 max-w-sm mx-auto mb-6 leading-relaxed">
            Submit your space requirements so verified hosts can pitch their
            spaces to you.
          </p>
          <Link
            href="/requests/new"
            className="inline-flex h-10 items-center justify-center px-6 rounded-lg bg-[#FDC800] text-[#1E2D8C] text-body-sm font-bold hover:bg-[#FDC800]/90 transition-all active:scale-[0.98] cursor-pointer"
          >
            Post a Request
          </Link>
        </div>
      )}

      {/* Empty Filter State */}
      {!isLoading &&
        !error &&
        requests &&
        requests.length > 0 &&
        filteredRequests.length === 0 && (
          <div className="bg-card border border-border rounded-xl p-12 text-center shadow-sm">
            <p className="text-body-sm text-muted-foreground">
              No requests match the selected status filter.
            </p>
          </div>
        )}

      {/* Requests list */}
      {!isLoading && !error && filteredRequests.length > 0 && (
        <div className="space-y-6">
          {filteredRequests.map((request) => (
            <div
              key={request.id}
              className="bg-white border border-neutral-200/60 rounded-2xl p-6 shadow-xs flex flex-col gap-6"
            >
              {/* Request Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-border/50">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2.5">
                    <span className="inline-flex items-center text-caption font-semibold px-2 py-0.5 rounded-md bg-primary/5 text-primary border border-primary/5 capitalize">
                      {request.spaceType}
                    </span>
                    <span className="inline-flex items-center text-caption font-semibold px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200 capitalize">
                      {request.eventType.replace("_", " ")}
                    </span>
                    {getStatusBadge(request.status)}
                  </div>
                  <h3 className="text-h3 text-foreground font-semibold capitalize">
                    {request.eventType.replace("_", " ")} /{" "}
                    {request.spaceType === "other"
                      ? "Space"
                      : request.spaceType}
                  </h3>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-caption text-muted-foreground whitespace-nowrap hidden sm:inline">
                    Posted {getFormatDate(request.createdAt)}
                  </span>

                  {/* Status Dropdown */}
                  <select
                    value={request.status}
                    onChange={(e) =>
                      handleStatusChange(
                        request.id,
                        e.target.value as "open" | "closed" | "fulfilled",
                      )
                    }
                    disabled={updateRequest.isPending}
                    className="h-8.5 rounded-lg border border-border text-caption font-semibold px-2 focus:ring-1 focus:ring-primary focus:border-primary transition-all cursor-pointer bg-white text-foreground"
                  >
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                    <option value="fulfilled">Fulfilled</option>
                  </select>

                  {/* Edit Button */}
                  <button
                    onClick={() => handleEditClick(request)}
                    disabled={updateRequest.isPending}
                    className="h-8.5 w-8.5 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-neutral-50 hover:text-foreground transition-colors cursor-pointer"
                    title="Edit Request"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => setDeleteConfirmId(request.id)}
                    disabled={deleteRequest.isPending}
                    className="h-8.5 w-8.5 flex items-center justify-center rounded-lg border border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200 transition-colors cursor-pointer"
                    title="Delete Request"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Request Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-body-sm pb-4 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4.5 w-4.5 text-primary/75" />
                  <div>
                    <p className="text-[10px] text-muted-foreground font-semibold">
                      Budget
                    </p>
                    <p className="font-semibold text-foreground">
                      ${request.budget}/hr
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4.5 w-4.5 text-primary/75" />
                  <div>
                    <p className="text-[10px] text-muted-foreground font-semibold">
                      Headcount
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
                      Location
                    </p>
                    <p className="font-semibold text-foreground truncate max-w-35">
                      {request.locationPreference}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4.5 w-4.5 text-primary/75" />
                  <div>
                    <p className="text-[10px] text-muted-foreground font-semibold">
                      Dates
                    </p>
                    <p className="font-semibold text-foreground truncate max-w-35">
                      {getFormatDate(request.startDate)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {request.notes && (
                <div className="text-body-sm text-muted-foreground bg-neutral-50 p-4 rounded-lg border border-neutral-100 italic">
                  &ldquo;{request.notes}&rdquo;
                </div>
              )}

              {/* Proposals List Section */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-body-sm font-bold text-foreground">
                    Proposals Received ({request.proposals?.length || 0})
                  </h4>
                </div>

                {/* Empty State proposals */}
                {(!request.proposals || request.proposals.length === 0) && (
                  <div className="p-6 rounded-lg border border-dashed border-border bg-neutral-50/50 text-center">
                    <p className="text-body-sm text-muted-foreground">
                      No proposals received yet for this request.
                    </p>
                  </div>
                )}

                {/* List proposals */}
                {request.proposals && request.proposals.length > 0 && (
                  <div className="space-y-3">
                    {request.proposals.map((proposal) => (
                      <div
                        key={proposal.id}
                        className="bg-card border border-border/80 rounded-lg p-4.5 shadow-xs hover:border-primary/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="space-y-2 max-w-2xl">
                          <div className="flex items-center gap-2">
                            <div className="h-5 w-5 rounded-full bg-primary text-white flex items-center justify-center text-[9px] font-bold">
                              {proposal.host?.email?.[0]?.toUpperCase() || "H"}
                            </div>
                            <span className="text-body-sm font-semibold text-[#1E2D8C]">
                              {proposal.host?.email || "Verified Host"}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Verified Listing
                            </span>
                            {proposal.status === "pending" && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 border border-amber-500/20 animate-pulse capitalize">
                                Pending
                              </span>
                            )}
                            {proposal.status === "accepted" && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 capitalize">
                                Accepted
                              </span>
                            )}
                            {proposal.status === "rejected" && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 capitalize">
                                Declined
                              </span>
                            )}
                          </div>
                          <p className="text-body-sm text-slate-500 leading-relaxed italic">
                            &ldquo;{proposal.pitch}&rdquo;
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto shrink-0">
                          {proposal.status === "pending" && (
                            <>
                              <button
                                onClick={() =>
                                  handleProposalAction(proposal.id, "rejected")
                                }
                                disabled={updateProposalStatus.isPending}
                                className="inline-flex h-9 items-center justify-center px-3.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 text-body-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
                              >
                                Decline
                              </button>
                              <button
                                onClick={() =>
                                  handleProposalAction(proposal.id, "accepted")
                                }
                                disabled={updateProposalStatus.isPending}
                                className="inline-flex h-9 items-center justify-center px-4 rounded-lg bg-primary text-white hover:bg-primary/95 text-body-sm font-semibold transition-all cursor-pointer shadow-xs disabled:opacity-50 active:scale-[0.98]"
                              >
                                Accept Pitch
                              </button>
                            </>
                          )}

                          <a
                            href={proposal.sublerLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex h-9 items-center justify-center gap-1.5 px-4 rounded-lg bg-[#FDC800] text-[#1E2D8C] hover:bg-[#FDC800]/90 text-body-sm font-semibold transition-all cursor-pointer shadow-xs active:scale-[0.98]"
                          >
                            View on Subler{" "}
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal Overlay */}
      {deleteConfirmId && targetDeleteRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
          {/* Modal Container */}
          <div className="bg-card border border-border rounded-xl p-6 max-w-sm w-full shadow-xl animate-scale-up space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-red-500/10 text-red-600 flex items-center justify-center border border-red-500/10 shrink-0">
                <AlertCircle className="h-5 w-5" />
              </div>
              <h3 className="font-display font-bold text-body text-foreground">
                Delete Space Request?
              </h3>
            </div>

            <div className="text-body-sm text-muted-foreground leading-relaxed">
              <p>
                Are you sure you want to delete your request for{" "}
                <strong className="capitalize">
                  {targetDeleteRequest.eventType.replace("_", " ")} /{" "}
                  {targetDeleteRequest.spaceType}
                </strong>
                ? This action is permanent and will remove all incoming
                proposals for this request.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                disabled={deleteRequest.isPending}
                className="inline-flex h-9 items-center justify-center px-4 rounded-lg border border-border bg-white text-foreground hover:bg-neutral-50 text-body-sm font-semibold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSubmit}
                disabled={deleteRequest.isPending}
                className="inline-flex h-9 items-center justify-center px-4.5 rounded-lg bg-red-600 text-white hover:bg-red-700 text-body-sm font-semibold transition-all cursor-pointer shadow-sm gap-1.5"
              >
                {deleteRequest.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5" />
                )}
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Request Modal Overlay */}
      {editingRequest && editFormData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          {/* Modal Container */}
          <div className="bg-card border border-border rounded-xl p-6 max-w-lg w-full shadow-xl my-8 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-display font-bold text-h3 text-foreground">
                Edit Space Request
              </h3>
              <button
                onClick={() => setEditingRequest(null)}
                className="text-muted-foreground hover:text-foreground text-caption font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Event Type */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Activity Type
                  </label>
                  <select
                    value={editFormData.eventType}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        eventType: e.target.value,
                      })
                    }
                    className="w-full h-10 rounded-lg border border-border px-3 bg-white text-foreground text-body-sm focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                  >
                    <option value="athletic">Athletic / Fitness</option>
                    <option value="conference">Conference / Seminar</option>
                    <option value="film_production">Film / Production</option>
                    <option value="event">Event / Celebration</option>
                    <option value="rehearsal">Rehearsal / Performing</option>
                    <option value="meeting">Meeting / Workshop</option>
                    <option value="other">Other Activity</option>
                  </select>
                </div>

                {/* Space Type */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Space Needed
                  </label>
                  <select
                    value={editFormData.spaceType}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        spaceType: e.target.value,
                      })
                    }
                    className="w-full h-10 rounded-lg border border-border px-3 bg-white text-foreground text-body-sm focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                  >
                    <option value="studio">Creative Studio</option>
                    <option value="warehouse">Warehouse</option>
                    <option value="event_hall">Event Hall</option>
                    <option value="outdoor">Outdoor Space</option>
                    <option value="gym">Gym / Court</option>
                    <option value="classroom">Classroom / Lab</option>
                    <option value="office">Office / Coworking</option>
                    <option value="other">Other Space Type</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Start Date */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Start Date & Time
                  </label>
                  <DateTimePicker
                    value={editFormData.startDate}
                    onChange={(val) => {
                      const newStart = new Date(val);
                      const newEnd = editFormData.endDate
                        ? new Date(editFormData.endDate)
                        : null;
                      if (!newEnd || newEnd.getTime() <= newStart.getTime()) {
                        const adjustedEnd = new Date(
                          newStart.getTime() + 2 * 60 * 60 * 1000,
                        );
                        setEditFormData({
                          ...editFormData,
                          startDate: val,
                          endDate: adjustedEnd.toISOString(),
                        });
                      } else {
                        setEditFormData({ ...editFormData, startDate: val });
                      }
                    }}
                    placeholder="Select start date and time"
                  />
                </div>

                {/* End Date */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    End Date & Time
                  </label>
                  <DateTimePicker
                    value={editFormData.endDate}
                    onChange={(val) => {
                      const newEnd = new Date(val);
                      const start = editFormData.startDate
                        ? new Date(editFormData.startDate)
                        : null;
                      if (start && newEnd.getTime() <= start.getTime()) {
                        toast.error("End date must occur after the start date");
                        return;
                      }
                      setEditFormData({ ...editFormData, endDate: val });
                    }}
                    minDate={
                      editFormData.startDate
                        ? new Date(editFormData.startDate)
                        : undefined
                    }
                    placeholder="Select end date and time"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Budget */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Budget ($/hr)
                  </label>
                  <input
                    type="number"
                    value={editFormData.budget}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        budget: e.target.value,
                      })
                    }
                    className="w-full h-10 rounded-lg border border-border px-3 bg-white text-foreground text-body-sm focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                  />
                </div>

                {/* Capacity */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    People count
                  </label>
                  <input
                    type="number"
                    value={editFormData.headcount}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        headcount: e.target.value,
                      })
                    }
                    className="w-full h-10 rounded-lg border border-border px-3 bg-white text-foreground text-body-sm focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                  />
                </div>

                {/* Location */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Location Pref.
                  </label>
                  <input
                    type="text"
                    value={editFormData.locationPreference}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        locationPreference: e.target.value,
                      })
                    }
                    className="w-full h-10 rounded-lg border border-border px-3 bg-white text-foreground text-body-sm focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                  />
                </div>
              </div>

              {/* Amenities */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                  Required Amenities
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-1.5 border border-border rounded-lg bg-neutral-50/50">
                  {AMENITY_OPTIONS.map((item) => {
                    const isSelected = editFormData.amenities
                      ? editFormData.amenities
                          .split(", ")
                          .map((a) => a.trim())
                          .includes(item)
                      : false;
                    return (
                      <button
                        type="button"
                        key={item}
                        onClick={() => handleToggleAmenity(item)}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-primary text-white border-primary"
                            : "bg-white border-border text-muted-foreground hover:border-neutral-300"
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Host Notes / Specifications
                </label>
                <textarea
                  rows={3}
                  value={editFormData.notes}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, notes: e.target.value })
                  }
                  className="w-full rounded-lg border border-border p-3 bg-white text-foreground text-body-sm focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border mt-5">
                <button
                  type="button"
                  onClick={() => setEditingRequest(null)}
                  disabled={updateRequest.isPending}
                  className="inline-flex h-9 items-center justify-center px-4 rounded-lg border border-border bg-white text-foreground hover:bg-neutral-50 text-body-sm font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateRequest.isPending}
                  className="inline-flex h-9 items-center justify-center px-5 rounded-lg bg-primary text-white hover:bg-primary/95 text-body-sm font-semibold transition-all cursor-pointer shadow-sm gap-1.5"
                >
                  {updateRequest.isPending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Pencil className="h-3.5 w-3.5" />
                  )}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
