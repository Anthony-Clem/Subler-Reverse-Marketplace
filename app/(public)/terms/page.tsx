import Link from "next/link";
import React from "react";
import { ArrowLeft, BookOpen, Mail } from "lucide-react";

export const metadata = {
  title: "Terms of Service | Subler Reverse Marketplace",
  description:
    "Terms of Service for Subler Reverse Marketplace, operated by Subler, Inc.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#fafafc] text-[#0e1442] font-sans py-16 px-6 sm:px-8 lg:px-12 flex flex-col items-center">
      <div className="w-full max-w-3xl space-y-12 animate-fade-in">
        {/* Header */}
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-[#0e1442] transition-colors gap-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-[#1e2d8c]/5 border border-[#1e2d8c]/10 text-[#1e2d8c] flex items-center justify-center rounded-lg font-bold">
              <BookOpen className="h-5 w-5" />
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-[#0e1442]">
              Terms of Service
            </h1>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Last Updated: June 22, 2026
          </p>
        </div>

        {/* Introduction Panel */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/60 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-[#1e2d8c]">About This App</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Welcome to the Subler Reverse Marketplace (the &ldquo;Service&rdquo;
            or &ldquo;App&rdquo;), a subdivision web application operated by{" "}
            <strong>Subler, Inc.</strong> (&ldquo;Subler&rdquo;,
            &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;). This
            Service acts as a demand-side matching layer built on top of
            Subler&apos;s main platform. All transactions, payments, tours,
            rental agreements, and space contracts are finalized on the main
            Subler platform and are governed by the main Subler Terms of Service
            available at{" "}
            <Link
              href="https://app.getsubler.com/legal/terms"
              target="_blank"
              rel="noreferrer"
              className="text-[#1e2d8c] hover:underline font-semibold"
            >
              app.getsubler.com/legal/terms
            </Link>
            .
          </p>
        </div>

        {/* Table of Contents */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Table of Contents
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs text-slate-500 font-semibold list-decimal pl-4">
            <li>
              <a
                href="#eligibility"
                className="hover:text-[#1e2d8c] transition-colors"
              >
                User Eligibility
              </a>
            </li>
            <li>
              <a
                href="#matching-layer"
                className="hover:text-[#1e2d8c] transition-colors"
              >
                Matching Layer &amp; Booking Finalization
              </a>
            </li>
            <li>
              <a
                href="#acceptable-use"
                className="hover:text-[#1e2d8c] transition-colors"
              >
                Acceptable Use Guidelines
              </a>
            </li>
            <li>
              <a
                href="#host-upgrade"
                className="hover:text-[#1e2d8c] transition-colors"
              >
                Host Roles &amp; Approvals
              </a>
            </li>
            <li>
              <a
                href="#accounts"
                className="hover:text-[#1e2d8c] transition-colors"
              >
                Account Management &amp; Deletion
              </a>
            </li>
            <li>
              <a
                href="#termination"
                className="hover:text-[#1e2d8c] transition-colors"
              >
                Suspension &amp; Termination
              </a>
            </li>
            <li>
              <a
                href="#warranties"
                className="hover:text-[#1e2d8c] transition-colors"
              >
                Disclaimer of Warranties
              </a>
            </li>
            <li>
              <a
                href="#governing-law"
                className="hover:text-[#1e2d8c] transition-colors"
              >
                Governing Law
              </a>
            </li>
          </ul>
        </div>

        {/* Content Sections */}
        <div className="space-y-10 text-xs text-slate-600 leading-relaxed">
          {/* Section 1 */}
          <section
            id="eligibility"
            className="space-y-3 pt-6 border-t border-slate-100"
          >
            <h2 className="font-display text-base font-bold text-[#1e2d8c]">
              1. User Eligibility
            </h2>
            <p>
              By accessing or using the Service, you represent and warrant that
              you are at least eighteen (18) years of age and have the legal
              capacity to enter into binding agreements. If you are under 18,
              you may not create an account or use this Service.
            </p>
          </section>

          {/* Section 2 */}
          <section
            id="matching-layer"
            className="space-y-3 pt-6 border-t border-slate-100"
          >
            <h2 className="font-display text-base font-bold text-[#1e2d8c]">
              2. Matching Layer &amp; Booking Finalization
            </h2>
            <p>
              This App is an on-ramp service only. It allows renters to post
              their space requirements and approved hosts to propose listing
              links.
            </p>
            <p className="bg-slate-100/50 p-4 rounded-xl border border-slate-200/50">
              <strong>CRITICAL NOTICE:</strong> Subler Reverse Marketplace does
              not process payments, manage bookings, handle renter/host
              communications beyond the initial proposal, or execute space
              rental agreements. All bookings, security deposits, rental
              contracts, and transactions must occur through Subler&apos;s main
              platform. All transactions and platform interactions are governed
              by Subler&apos;s main Terms of Service (
              <a
                href="https://app.getsubler.com/legal/terms"
                target="_blank"
                rel="noreferrer"
                className="text-[#1e2d8c] hover:underline font-semibold"
              >
                app.getsubler.com/legal/terms
              </a>
              ).
            </p>
          </section>

          {/* Section 3 */}
          <section
            id="acceptable-use"
            className="space-y-3 pt-6 border-t border-slate-100"
          >
            <h2 className="font-display text-base font-bold text-[#1e2d8c]">
              3. Acceptable Use Guidelines
            </h2>
            <p>
              When posting space requirements or sending host proposals, you
              agree to:
            </p>
            <ul className="list-disc pl-4 space-y-1.5">
              <li>
                Submit accurate, truthful, and up-to-date space requirements.
              </li>
              <li>
                Ensure all host proposal links are valid listing URLs hosted on
                the main Subler domain (
                <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">
                  getsubler.com
                </code>
                ).
              </li>
              <li>
                Refrain from sending spam proposals, duplicate responses, or
                promotional messages unrelated to the renter&apos;s posted
                requirements.
              </li>
              <li>
                Not impersonate any individual, brand, or entity, or falsely
                claim affiliation with any host listing.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section
            id="host-upgrade"
            className="space-y-3 pt-6 border-t border-slate-100"
          >
            <h2 className="font-display text-base font-bold text-[#1e2d8c]">
              4. Host Roles &amp; Approvals
            </h2>
            <p>
              Users may apply to upgrade their account to &ldquo;Host&rdquo;
              status to respond to renter requests. Upgrading requires platform
              administrative review and approval. We reserve the absolute right
              to reject, suspend, or revoke host status at our sole discretion,
              without prior notice or liability.
            </p>
          </section>

          {/* Section 5 */}
          <section
            id="accounts"
            className="space-y-3 pt-6 border-t border-slate-100"
          >
            <h2 className="font-display text-base font-bold text-[#1e2d8c]">
              5. Account Management &amp; Deletion
            </h2>
            <p>
              You access your account via magic link authentication sent to your
              registered email address. You are responsible for maintaining the
              security of your email inbox. You may delete your account and
              remove all your data (including requests and proposals) at any
              time from your settings page.
            </p>
          </section>

          {/* Section 6 */}
          <section
            id="termination"
            className="space-y-3 pt-6 border-t border-slate-100"
          >
            <h2 className="font-display text-base font-bold text-[#1e2d8c]">
              6. Suspension &amp; Termination
            </h2>
            <p>
              We reserve the right, without obligation, to monitor, suspend, or
              permanently delete accounts that violate these Terms, engage in
              behavior harmful to the marketplace community, or breach our
              security controls.
            </p>
          </section>

          {/* Section 7 */}
          <section
            id="warranties"
            className="space-y-3 pt-6 border-t border-slate-100"
          >
            <h2 className="font-display text-base font-bold text-[#1e2d8c]">
              7. Disclaimer of Warranties
            </h2>
            <p>
              THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS
              AVAILABLE&rdquo; WITHOUT WARRANTY OF ANY KIND. SUBLER, INC. MAKES
              NO REPRESENTATIONS, WARRANTIES, OR GUARANTEES CONCERNING THE
              QUALITY, SUITABILITY, SAFETY, OR LEGALITY OF HOUSING PROPOSALS,
              RENTAL SPACE DESCRIPTIONS, HOST INTENTIONS, OR RENTER BUDGET
              VALIDITY. YOU USE THIS SERVICE VOLUNTARILY AT YOUR OWN RISK.
            </p>
          </section>

          {/* Section 8 */}
          <section
            id="governing-law"
            className="space-y-3 pt-6 border-t border-slate-100"
          >
            <h2 className="font-display text-base font-bold text-[#1e2d8c]">
              8. Governing Law
            </h2>
            <p>
              These Terms of Service and your use of the App will be governed
              by, interpreted, and construed in accordance with the laws of the{" "}
              <strong>State of Delaware</strong>, without regard to conflict of
              law principles.
            </p>
          </section>
        </div>

        {/* Contact Info Footer Block */}
        <div className="p-6 rounded-2xl bg-slate-100/50 border border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-semibold text-xs text-[#0e1442]">
              Questions about our terms?
            </h4>
            <p className="text-[11px] text-slate-500">
              Contact the Subler support team for clarification.
            </p>
          </div>
          <a
            href="mailto:info@getsubler.com"
            className="inline-flex h-9 items-center justify-center px-4 rounded-lg bg-[#1e2d8c] hover:bg-[#1e2d8c]/90 text-white font-semibold text-xs gap-1.5 transition-colors cursor-pointer self-start sm:self-auto shadow-xs"
          >
            <Mail className="h-3.5 w-3.5" /> info@getsubler.com
          </a>
        </div>

        {/* Footer Navigation */}
        <div className="border-t border-slate-200/60 pt-8 flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>&copy; {new Date().getFullYear()} Subler, Inc.</span>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-[#1e2d8c] transition-colors">
              Home
            </Link>
            <span>•</span>
            <Link
              href="/privacy"
              className="hover:text-[#1e2d8c] transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
