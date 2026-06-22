"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useUserProfile, useRequestHostUpgrade } from "@/hooks/use-host";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Building,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  Search,
  MessageSquare,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

export default function HostUpgradePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user, isLoading, error } = useUserProfile();
  const requestUpgrade = useRequestHostUpgrade();

  const handleUpgradeSubmit = async () => {
    try {
      await requestUpgrade.mutateAsync();
      toast.success("Host access request submitted successfully!");
      // Invalidate query to refetch status and refresh Next.js router to update Sidebar server-side state
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to submit host request";
      toast.error(message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-border">
        <h1 className="text-h1 text-foreground">Host Portal</h1>
        <p className="text-body-sm text-muted-foreground mt-1">
          Apply to become a verified host, browse renter requirements, and pitch your space listings.
        </p>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="bg-card border border-border rounded-xl p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <p className="text-body-sm text-muted-foreground mt-3">Loading host status details...</p>
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <div className="p-6 rounded-xl bg-red-500/5 border border-red-500/10 text-center">
          <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
          <p className="text-body text-red-600 font-semibold">Failed to fetch host status</p>
          <p className="text-body-sm text-muted-foreground mt-1">Please try reloading the page.</p>
        </div>
      )}

      {/* Page Content */}
      {!isLoading && !error && user && (
        <>
          {/* STATE 1: Not applied or Rejected */}
          {(user.hostStatus === null || user.hostStatus === "rejected") && (
            <div className="space-y-6">
              {user.hostStatus === "rejected" && (
                <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/10 text-body-sm text-red-700 flex items-start gap-2.5">
                  <ShieldAlert className="h-4.5 w-4.5 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold">Request Not Approved</p>
                    <p className="text-caption text-red-600/90 mt-0.5">
                      Your previous request for Host Portal access was not approved by the admin. You can review your details and re-apply below.
                    </p>
                  </div>
                </div>
              )}

              {/* Landing Core Benefits Card */}
              <div className="bg-card border border-border rounded-xl p-8 shadow-sm space-y-8">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/5 border border-primary/5 flex items-center justify-center text-primary">
                    <Building className="h-5.5 w-5.5" />
                  </div>
                  <h2 className="text-h2 text-foreground font-semibold">Why become a Host?</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Benefit 1 */}
                  <div className="space-y-2">
                    <div className="h-8 w-8 rounded-lg bg-green-500/10 text-green-600 flex items-center justify-center border border-green-500/10">
                      <Search className="h-4 w-4" />
                    </div>
                    <h4 className="font-semibold text-body-sm text-foreground">Browse Live Demand</h4>
                    <p className="text-caption text-muted-foreground leading-relaxed">
                      See exactly what spaces renters need, including headcount, budget, amenities, and location.
                    </p>
                  </div>

                  {/* Benefit 2 */}
                  <div className="space-y-2">
                    <div className="h-8 w-8 rounded-lg bg-green-500/10 text-green-600 flex items-center justify-center border border-green-500/10">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <h4 className="font-semibold text-body-sm text-foreground">Tailored Proposals</h4>
                    <p className="text-caption text-muted-foreground leading-relaxed">
                      Pitch your matching spaces directly to high-intent renters using your active Subler listing links.
                    </p>
                  </div>

                  {/* Benefit 3 */}
                  <div className="space-y-2">
                    <div className="h-8 w-8 rounded-lg bg-green-500/10 text-green-600 flex items-center justify-center border border-green-500/10">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <h4 className="font-semibold text-body-sm text-foreground">Finalize on Subler</h4>
                    <p className="text-caption text-muted-foreground leading-relaxed">
                      All tours, contracts, checkouts, and payments are completed securely on the main Subler platform.
                    </p>
                  </div>
                </div>

                <div className="border-t border-border/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-caption text-muted-foreground max-w-sm text-center sm:text-left">
                    Your request will be submitted to the administrator panel for verification. Reviews are completed within 2 hours.
                  </p>

                  <button
                    onClick={handleUpgradeSubmit}
                    disabled={requestUpgrade.isPending}
                    className="inline-flex h-11 w-full sm:w-auto items-center justify-center px-6 rounded-lg bg-primary text-white text-body-sm font-semibold hover:bg-primary/95 transition-all active:scale-95 shadow-md shadow-primary/10 cursor-pointer flex items-center gap-1.5"
                  >
                    {requestUpgrade.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                      </>
                    ) : (
                      <>
                        Submit Request <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STATE 2: Pending Approval */}
          {user.hostStatus === "pending" && (
            <div className="bg-card border border-border rounded-xl p-8 md:p-12 text-center shadow-sm space-y-6">
              <div className="h-16 w-16 rounded-lg bg-amber-500/5 border border-amber-500/5 flex items-center justify-center text-amber-600 mx-auto">
                <Clock className="h-8 w-8 shrink-0 animate-pulse" />
              </div>

              <div className="max-w-md mx-auto space-y-3">
                <span className="inline-flex items-center text-[10px] font-semibold px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-700 border border-amber-500/10 uppercase">
                  Pending Review
                </span>
                <h3 className="text-h2 text-foreground font-semibold">Host Request Received!</h3>
                <p className="text-body-sm text-muted-foreground leading-relaxed">
                  Thank you for applying to become a Host! An administrator is currently reviewing your account details. Upgrades are usually processed within under 2 hours. We will notify you once approved.
                </p>
              </div>

              <div className="border-t border-border/80 pt-6 max-w-xs mx-auto">
                <Link
                  href="/dashboard"
                  className="inline-flex h-10 w-full items-center justify-center px-5 rounded-lg bg-neutral-100 text-foreground text-body-sm font-semibold hover:bg-neutral-200 transition-all active:scale-95"
                >
                  Return to Dashboard
                </Link>
              </div>
            </div>
          )}

          {/* STATE 3: Already Approved */}
          {user.hostStatus === "approved" && (
            <div className="bg-card border border-border rounded-xl p-8 md:p-12 text-center shadow-sm space-y-6">
              <div className="h-16 w-16 rounded-lg bg-green-500/5 border border-green-500/5 flex items-center justify-center text-green-600 mx-auto">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <div className="max-w-md mx-auto space-y-3">
                <h3 className="text-h2 text-foreground font-semibold">You are a Host!</h3>
                <p className="text-body-sm text-muted-foreground leading-relaxed">
                  Your upgrade request was approved. You can now access host features including browsing renter requests and submitting listing pitches.
                </p>
              </div>

              <div className="pt-6 max-w-xs mx-auto">
                <Link
                  href="/host/dashboard"
                  className="inline-flex h-11 w-full items-center justify-center px-6 rounded-lg bg-primary text-white text-body-sm font-semibold hover:bg-primary/95 transition-all active:scale-95 shadow-md shadow-primary/10"
                >
                  Go to Host Dashboard <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
