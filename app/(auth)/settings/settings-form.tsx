"use client";

import React, { useState } from "react";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { Trash2, LogOut, AlertTriangle, X, Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SettingsFormProps {
  email: string;
}

export default function SettingsForm({ email }: SettingsFormProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState("");

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const response = await fetch("/api/users/export");
      if (!response.ok) {
        throw new Error("Failed to export data");
      }
      const data = await response.json();
      
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(data, null, 2)
      )}`;
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", jsonString);
      downloadAnchor.setAttribute("download", `subler_user_data_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      
      toast.success("Data exported successfully!");
    } catch (error: any) {
      console.error("Export data error:", error);
      toast.error(error.message || "Failed to export user data. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirmEmail.toLowerCase().trim() !== email.toLowerCase().trim()) {
      toast.error("Email address does not match.");
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch("/api/users/me", {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete account");
      }

      toast.success("Account deleted successfully");
      await signOut({ callbackUrl: "/login" });
    } catch (error: any) {
      console.error("Account delete error:", error);
      toast.error(error.message || "Failed to delete account. Please try again.");
      setIsDeleting(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: "/login" });
      toast.success("Signed out successfully");
    } catch {
      toast.error("Failed to sign out");
    }
  };

  return (
    <div className="w-full max-w-md bg-white border border-slate-200/60 rounded-2xl p-8 shadow-xs space-y-6">
      {/* Card Header */}
      <div className="space-y-1">
        <h3 className="font-display font-semibold text-base text-[#0e1442]">Account Settings</h3>
        <p className="text-xs text-slate-500">Manage your profile and session preferences.</p>
      </div>

      {/* Identity Input */}
      <div className="space-y-2">
        <label htmlFor="email" className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Email Address
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          readOnly
          className="h-10 bg-slate-50 border-slate-200 text-slate-500 font-medium cursor-default focus-visible:ring-0 focus-visible:border-slate-200 select-all rounded-lg text-xs"
        />
      </div>

      {/* Export Data Section */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <div>
          <h4 className="text-xs font-bold text-[#0e1442] uppercase tracking-wider">
            Export Your Data
          </h4>
          <p className="text-[11px] text-slate-400 mt-1">
            Download a copy of your account profile, requests, and proposals in JSON format.
          </p>
        </div>
        <Button
          type="button"
          onClick={handleExportData}
          disabled={isExporting}
          variant="outline"
          className="w-full h-10 border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-[#0e1442] font-semibold text-xs rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          {isExporting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
              Preparing Export...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 text-slate-400" />
              Download JSON Data
            </>
          )}
        </Button>
      </div>

      <div className="border-t border-slate-100 pt-5 space-y-3">
        {/* Sign Out Button */}
        <Button
          type="button"
          onClick={handleSignOut}
          variant="outline"
          className="w-full h-10 border-slate-200 hover:bg-slate-50 text-[#0e1442] font-semibold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
        >
          <LogOut className="h-4 w-4 text-slate-400" />
          Sign Out
        </Button>

        {/* Delete Account Button */}
        <Button
          type="button"
          onClick={() => setShowConfirm(true)}
          className="w-full h-10 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Delete Account
        </Button>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white border border-slate-200/60 w-full max-w-sm rounded-2xl p-6 shadow-lg relative animate-scale-up space-y-4">
            <button
              onClick={() => {
                setShowConfirm(false);
                setConfirmEmail("");
              }}
              className="absolute top-4 right-4 h-7 w-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#0e1442] hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>

            <div className="flex items-center gap-3 text-red-600">
              <div className="h-10 w-10 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h3 className="font-display text-sm font-bold text-[#0e1442]">
                Confirm Account Deletion
              </h3>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              This action cannot be undone. To proceed, please type your email address 
              <strong className="text-[#0e1442] block mt-1 font-mono break-all">{email}</strong> below:
            </p>

            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Type email to confirm"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                className="h-10 rounded-lg border border-slate-200 focus:border-red-500 focus:ring-red-500/20 text-xs"
                disabled={isDeleting}
              />

              <div className="flex items-center gap-3 justify-end pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowConfirm(false);
                    setConfirmEmail("");
                  }}
                  disabled={isDeleting}
                  className="font-semibold text-xs h-9 px-4 cursor-pointer border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  disabled={isDeleting || confirmEmail.toLowerCase().trim() !== email.toLowerCase().trim()}
                  className="font-semibold text-xs h-9 px-4 bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer rounded-lg"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Confirm Delete"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
