import Link from "next/link";
import React from "react";
import { ArrowLeft, Shield, Mail } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Subler Reverse Marketplace",
  description: "Privacy Policy for Subler Reverse Marketplace, operated by Subler, Inc.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#fafafc] text-[#0e1442] font-sans py-16 px-6 sm:px-8 lg:px-12 flex flex-col items-center">
      <div className="w-full max-w-3xl space-y-12 animate-fade-in">
        
        {/* Header */}
        <div className="space-y-4">
          <Link href="/" className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-[#0e1442] transition-colors gap-1">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-[#1e2d8c]/5 border border-[#1e2d8c]/10 text-[#1e2d8c] flex items-center justify-center rounded-lg font-bold">
              <Shield className="h-5 w-5" />
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-[#0e1442]">Privacy Policy</h1>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Last Updated: [DATE]
          </p>
        </div>

        {/* Intro */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/60 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-[#1e2d8c]">Our Commitment to Privacy</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Subler, Inc. (&ldquo;Subler&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) operates the Subler Reverse Marketplace subdivision web application. We respect your privacy and are committed to protecting it. This Privacy Policy details our minimal data practices, explaining exactly what information we collect, what we do not collect, how it is processed, and your rights concerning your personal data.
          </p>
        </div>

        {/* Table of Contents */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Table of Contents</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs text-slate-500 font-semibold list-decimal pl-4">
            <li><a href="#data-we-collect" className="hover:text-[#1e2d8c] transition-colors">Information We Collect</a></li>
            <li><a href="#data-we-do-not-collect" className="hover:text-[#1e2d8c] transition-colors">What We Do Not Collect</a></li>
            <li><a href="#data-sources" className="hover:text-[#1e2d8c] transition-colors">Sources &amp; Why We Collect It</a></li>
            <li><a href="#processors" className="hover:text-[#1e2d8c] transition-colors">Third-Party Data Processors</a></li>
            <li><a href="#no-sales" className="hover:text-[#1e2d8c] transition-colors">No Sales or Advertising</a></li>
            <li><a href="#export-deletion" className="hover:text-[#1e2d8c] transition-colors">Data Export &amp; Deletion</a></li>
            <li><a href="#retention" className="hover:text-[#1e2d8c] transition-colors">Data Retention</a></li>
            <li><a href="#state-rights" className="hover:text-[#1e2d8c] transition-colors">State Privacy Rights (CCPA/VCDPA)</a></li>
            <li><a href="#children" className="hover:text-[#1e2d8c] transition-colors">Children&apos;s Privacy</a></li>
          </ul>
        </div>

        {/* Policy Body */}
        <div className="space-y-10 text-xs text-slate-600 leading-relaxed">
          
          {/* Section 1 */}
          <section id="data-we-collect" className="space-y-3 pt-6 border-t border-slate-100">
            <h2 className="font-display text-base font-bold text-[#1e2d8c]">1. Information We Collect</h2>
            <p>We limit our collection of data to only what is strictly necessary to run the Service. This includes:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li><strong>Email Address:</strong> Used for secure, passwordless authentication via magic login links.</li>
              <li><strong>Space Rental Requests:</strong> Renter inputs specifying space needs, including event type, space type, dates, budget, headcount, location preferences, amenities, and optional notes.</li>
              <li><strong>Proposals:</strong> Host pitches including Subler listing URLs and pitch text.</li>
              <li><strong>Session Tokens:</strong> Cryptographic tokens stored in databases to maintain secure login sessions.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section id="data-we-do-not-collect" className="space-y-3 pt-6 border-t border-slate-100">
            <h2 className="font-display text-base font-bold text-[#1e2d8c]">2. What We Do Not Collect</h2>
            <p>Unlike many platforms, this subdivision app is purposefully minimal. We explicitly do <strong>not</strong> collect or store the following:</p>
            <ul className="list-disc pl-4 space-y-1 text-slate-500">
              <li>User names (the app contains no name field, using email address exclusively as your identifier).</li>
              <li>Payment details or billing addresses.</li>
              <li>Phone numbers or mailing addresses.</li>
              <li>GPS location coordinates or device photos.</li>
              <li>Google Account connections or other social profile integrations.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section id="data-sources" className="space-y-3 pt-6 border-t border-slate-100">
            <h2 className="font-display text-base font-bold text-[#1e2d8c]">3. Sources &amp; Why We Collect It</h2>
            <p>
              We collect information directly from you when you submit a renter request, submit a proposal, or log into the application. We process this information to:
            </p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Authenticate your identity and secure access to your account.</li>
              <li>Deliver the space matching service by letting renters search listings and hosts submit proposals.</li>
              <li>Protect the app from abuse, bot traffic, spam, and rate limit violations.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section id="processors" className="space-y-3 pt-6 border-t border-slate-100">
            <h2 className="font-display text-base font-bold text-[#1e2d8c]">4. Third-Party Data Processors</h2>
            <p>
              To host the App and handle secure processes, we engage selected third-party service providers. They only process your data to the extent required to execute their task:
            </p>
            <ul className="list-disc pl-4 space-y-3">
              <li>
                <strong>Resend:</strong> Used to dispatch magic link authentication emails to your inbox.
              </li>
              <li>
                <strong>Neon:</strong> Provides our secure serverless PostgreSQL database hosting where profiles, requests, and proposals are stored.
              </li>
              <li>
                <strong>Arcjet:</strong> Inspects traffic requests to prevent malicious bot activity, detect intrusion attempts, and enforce application-level rate limits.
              </li>
              <li>
                <strong>Vercel:</strong> Hosts our application servers, APIs, and cloud environment.
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section id="no-sales" className="space-y-3 pt-6 border-t border-slate-100">
            <h2 className="font-display text-base font-bold text-[#1e2d8c]">5. No Sales or Advertising</h2>
            <p>
              We do not sell, rent, trade, or share your personal data with third parties for commercial or advertising purposes. We do not run ads or employ tracking pixels for behavioral remarketing within the Service.
            </p>
          </section>

          {/* Section 6 */}
          <section id="export-deletion" className="space-y-3 pt-6 border-t border-slate-100">
            <h2 className="font-display text-base font-bold text-[#1e2d8c]">6. Data Export &amp; Deletion</h2>
            <p>
              We believe in total user data agency. You can perform the following actions at any time directly in your account:
            </p>
            <ul className="list-disc pl-4 space-y-1.5">
              <li>
                <strong>Export Your Data:</strong> Generate and download a formatted JSON file copy containing your profile parameters, rental requests, and proposals via the settings page.
              </li>
              <li>
                <strong>Delete Your Account:</strong> Submit a deletion request in the settings panel. Doing so deletes your user record and all associated request and proposal entries permanently.
              </li>
            </ul>
          </section>

          {/* Section 7 */}
          <section id="retention" className="space-y-3 pt-6 border-t border-slate-100">
            <h2 className="font-display text-base font-bold text-[#1e2d8c]">7. Data Retention</h2>
            <p>
              Your data is retained only for as long as your account remains active. Upon requesting account deletion through your settings page, all associated user data, requests, and proposals are permanently expunged from our production databases within thirty (30) days.
            </p>
          </section>

          {/* Section 8 */}
          <section id="state-rights" className="space-y-3 pt-6 border-t border-slate-100">
            <h2 className="font-display text-base font-bold text-[#1e2d8c]">8. State Privacy Rights (CCPA / VCDPA)</h2>
            <p>
              If you reside in California (under the CCPA) or Virginia (under the VCDPA), you have specific statutory rights, including:
            </p>
            <ul className="list-disc pl-4 space-y-1">
              <li>The right to know what personal data we collect (detailed in Section 1).</li>
              <li>The right to request deletion of that personal data (detailed in Section 6).</li>
              <li>The right to export/obtain a copy of your personal data (detailed in Section 6).</li>
              <li>The right to non-discrimination for exercising your privacy rights.</li>
            </ul>
            <p>
              Because we do not collect names, payment data, or sell your details, our processing is inherently minimal. To exercise these rights manually or if you have questions, contact us at <a href="mailto:info@getsubler.com" className="text-[#1e2d8c] hover:underline font-semibold">info@getsubler.com</a>.
            </p>
          </section>

          {/* Section 9 */}
          <section id="children" className="space-y-3 pt-6 border-t border-slate-100">
            <h2 className="font-display text-base font-bold text-[#1e2d8c]">9. Children&apos;s Privacy</h2>
            <p>
              This App is not directed to individuals under the age of eighteen (18). We do not knowingly collect personal data from children under 18. If we learn we have collected info from a child under 18, we will take immediate steps to delete it.
            </p>
          </section>

        </div>

        {/* Contact Info Footer Block */}
        <div className="p-6 rounded-2xl bg-slate-100/50 border border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-semibold text-xs text-[#0e1442]">Have privacy questions?</h4>
            <p className="text-[11px] text-slate-500">Contact the Subler privacy operations desk.</p>
          </div>
          <a href="mailto:info@getsubler.com" className="inline-flex h-9 items-center justify-center px-4 rounded-lg bg-[#1e2d8c] hover:bg-[#1e2d8c]/90 text-white font-semibold text-xs gap-1.5 transition-colors cursor-pointer self-start sm:self-auto shadow-xs">
            <Mail className="h-3.5 w-3.5" /> info@getsubler.com
          </a>
        </div>

        {/* Footer Navigation */}
        <div className="border-t border-slate-200/60 pt-8 flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>&copy; {new Date().getFullYear()} Subler, Inc.</span>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-[#1e2d8c] transition-colors">Home</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-[#1e2d8c] transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </div>
  );
}
