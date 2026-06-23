"use client";

import { useOpenRequests } from "@/hooks/use-requests";
import {
  ArrowRight,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  MapPin,
  Plus,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

const formatBudget = (budget: string | number) => {
  if (!budget) return "Flexible";
  const num = Number(budget);
  if (isNaN(num)) return budget.toString();
  return `$${num}/hr`;
};

const formatTimeline = (startDate: string) => {
  try {
    return new Date(startDate).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "Upcoming Month";
  }
};

const formatTimeAgo = (dateStr: string) => {
  try {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.max(1, Math.floor(diffMs / 60000));
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  } catch {
    return "just now";
  }
};

export default function Home() {
  const { data: requests, isLoading } = useOpenRequests();
  const { data: session } = useSession();

  // Simulated pitches/proposals for Host view
  const mockProposals = [
    {
      id: "p1",
      requestTitle: "Athletic / Gym (Basketball)",
      hostName: "Elite Hoops Gymnasium",
      pitch:
        "Hey there! We have a full-court indoor basketball gymnasium with premium hardwood floors, adjustable hoops, and digital scoreboards. Perfect for your upcoming tournament or practice. View the full details and booking calendar on Subler!",
      sublerLink:
        "https://app.getsubler.com/renter/space-listing-view?spaceId=239",
      timeAgo: "5m ago",
    },
    {
      id: "p2",
      requestTitle: "Athletic / Outdoor (Tennis)",
      hostName: "Grand Slam Tennis Center",
      pitch:
        "Hello! We have well-maintained outdoor tennis courts available, complete with lighting for evening sessions, spectator seating, and pro-grade nets. Perfect for private matches or training. Check out our official listing on Subler to secure your slot.",
      sublerLink:
        "https://app.getsubler.com/renter/space-listing-view?spaceId=348",
      timeAgo: "12m ago",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafc] font-sans selection:bg-[#FDC800]/30 selection:text-[#1E2D8C] text-[#1E2D8C]">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full bg-[#fafafc] border-b border-slate-200/60 transition-all text-[#1E2D8C]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/subler-logo-black.png"
              alt="Subler"
              className="h-5.5 w-auto object-contain shrink-0"
            />
            <div className="flex items-baseline gap-1">
              <span className="text-slate-300 font-light text-xs select-none">
                |
              </span>
              <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap leading-none tracking-tight">
                Reverse Marketplace
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#how-it-works"
              className="text-xs font-semibold text-slate-500 hover:text-[#1E2D8C] transition-colors"
            >
              How it Works
            </a>
            <a
              href="#live-feed"
              className="text-xs font-semibold text-slate-500 hover:text-[#1E2D8C] transition-colors"
            >
              Live Requests
            </a>
            <a
              href="#proposal-showcase"
              className="text-xs font-semibold text-slate-500 hover:text-[#1E2D8C] transition-colors"
            >
              Sample Proposals
            </a>
            <a
              href="#features"
              className="text-xs font-semibold text-slate-500 hover:text-[#1E2D8C] transition-colors"
            >
              Platform Benefits
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-semibold text-slate-500 hover:text-[#1E2D8C] px-4 py-2 rounded-lg transition-colors cursor-pointer"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="inline-flex h-10 items-center justify-center px-4 rounded-lg bg-[#FDC800] text-black text-xs font-bold hover:bg-[#FDC800]/90 transition-all active:scale-[0.98] cursor-pointer shadow-xs"
            >
              Post a Request
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-20 md:pt-36 md:pb-28 bg-[#1E2D8C] text-white">
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-white backdrop-blur-xs text-xs mb-8 animate-fade-in shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-[#FDC800] fill-accent-[#fff]" />
            <span className="font-semibold text-slate-300">
              The Demand-Side Matching Layer for Subler
            </span>
          </div>

          {/* Heading */}
          <h1 className="max-w-4xl mx-auto font-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight mb-6">
            Tell hosts what you need. <br />
            <span className="text-[#FDC800]">
              Let the perfect space find you.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-sm text-slate-300 mb-10 leading-relaxed font-normal">
            Stop scrolling through hundreds of inactive listings. Post your
            rental requirements, budget, and timing. Verified Subler hosts will
            pitch customized proposals directly to you.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-16">
            <Link
              href="/login"
              className="inline-flex h-10 w-full sm:w-auto items-center justify-center px-6 rounded-lg bg-[#FDC800] text-black text-xs font-bold hover:bg-[#FDC800]/90 transition-all active:scale-[0.98] cursor-pointer shadow-xs"
            >
              Post a Request <Plus className="ml-1.5 h-3.5 w-3.5" />
            </Link>
            <a
              href="#live-feed"
              className="inline-flex h-10 w-full sm:w-auto items-center justify-center px-6 rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 text-xs font-semibold transition-all active:scale-[0.98] cursor-pointer"
            >
              Browse Live Feed
            </a>
          </div>

          {/* Trust Metric */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 py-5 border-y border-white/10 max-w-3xl mx-auto text-slate-300 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4.5 w-4.5 text-[#FDC800]" />
              <span className="font-semibold">Free to post</span>
            </div>
            <div className="hidden sm:block h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <Shield className="h-4.5 w-4.5 text-[#FDC800]" />
              <span className="font-semibold">100% verified hosts</span>
            </div>
            <div className="hidden sm:block h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <Clock className="h-4.5 w-4.5 text-[#FDC800]" />
              <span className="font-semibold">
                Avg. proposal in under 2 hrs
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 md:py-32 bg-[#fafafc]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1E2D8C] font-display tracking-tight mb-3">
              How Reverse Matching Works
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              A frictionless flow designed to save time. Post details once, and
              let hosts compete for your booking.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-10">
            {/* Step 1 */}
            <div className="group relative p-8 rounded-2xl bg-white border border-slate-200/60 shadow-xs flex flex-col justify-between hover:shadow-sm hover:-translate-y-0.5 transition-all duration-300 min-h-80">
              <div>
                <div className="font-display text-[#e2e8f0] group-hover:text-[#1E2D8C] text-5xl font-bold transition-colors duration-300 mb-6">
                  01
                </div>
                <h3 className="text-base font-semibold text-[#1E2D8C] mb-3">
                  Post space requirements
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Fill in space size, layout preferences, amenities, budget, and
                  desired date. It takes less than 2 minutes.
                </p>
              </div>
              <div className="mt-8 flex items-center text-xs text-[#1E2D8C] font-bold gap-1 uppercase tracking-wider group-hover:translate-x-0.5 transition-transform">
                Step-by-step Wizard <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="group relative p-8 rounded-2xl bg-white border border-slate-200/60 shadow-xs flex flex-col justify-between hover:shadow-sm hover:-translate-y-0.5 transition-all duration-300 min-h-80">
              <div>
                <div className="font-display text-[#e2e8f0] group-hover:text-[#1E2D8C] text-5xl font-bold transition-colors duration-300 mb-6">
                  02
                </div>
                <h3 className="text-base font-semibold text-[#1E2D8C] mb-3">
                  Receive custom pitches
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Verified hosts browse your request. If their Subler space
                  matches, they send a tailored proposal with their direct
                  Subler listing link.
                </p>
              </div>
              <div className="mt-8 flex items-center text-xs text-[#1E2D8C] font-bold gap-1 uppercase tracking-wider group-hover:translate-x-0.5 transition-transform">
                Zero spam policy <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* Step 3 */}
            <div className="group relative p-8 rounded-2xl bg-white border border-slate-200/60 shadow-xs flex flex-col justify-between hover:shadow-sm hover:-translate-y-0.5 transition-all duration-300 min-h-80">
              <div>
                <div className="font-display text-[#e2e8f0] group-hover:text-[#1E2D8C] text-5xl font-bold transition-colors duration-300 mb-6">
                  03
                </div>
                <h3 className="text-base font-semibold text-[#1E2D8C] mb-3">
                  Click through and book
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Review proposals, click through to the host&apos;s official
                  Subler page, and complete the tour request, contract, and
                  checkout.
                </p>
              </div>
              <div className="mt-8 flex items-center text-xs text-[#1E2D8C] font-bold gap-1 uppercase tracking-wider group-hover:translate-x-0.5 transition-transform">
                Transactions on Subler <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Feed Mock Preview */}
      <section
        id="live-feed"
        className="py-20 md:py-32 bg-[#fafafc] border-y border-slate-200/60"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[10px] font-bold uppercase text-[#1E2D8C] tracking-wider mb-3 block">
              Active Marketplace
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1E2D8C] font-display tracking-tight mb-3">
              Live space requests
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Browse the latest requirements posted by renters looking for
              space. Log in to pitch your venue directly.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {isLoading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white border border-border rounded-2xl p-8 shadow-sm animate-pulse"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                      <div className="space-y-3">
                        <div className="h-6 w-32 bg-neutral-200 rounded-lg" />
                        <div className="h-7 w-64 bg-neutral-200 rounded-lg" />
                      </div>
                      <div className="h-6 w-16 bg-neutral-200 rounded-lg" />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-5 my-3 border-y border-border/80">
                      {[1, 2, 3, 4].map((j) => (
                        <div
                          key={j}
                          className="h-10 bg-neutral-100 rounded-lg"
                        />
                      ))}
                    </div>
                    <div className="flex items-center justify-between mt-5">
                      <div className="h-6 w-40 bg-neutral-200 rounded-lg" />
                      <div className="h-6 w-28 bg-neutral-200 rounded-lg" />
                    </div>
                  </div>
                ))}
              </div>
            ) : !requests || requests.length === 0 ? (
              <div className="text-center bg-white border border-slate-200/60 rounded-2xl p-12 shadow-xs">
                <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-base font-semibold text-[#1E2D8C] mb-1">
                  No active requests
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                  There are currently no open renter requests. Be the first to
                  post a request!
                </p>
                <Link
                  href="/login"
                  className="inline-flex h-10 items-center justify-center px-6 rounded-lg bg-[#FDC800] text-black text-xs font-bold hover:bg-[#FDC800]/90 transition-all active:scale-[0.98] cursor-pointer shadow-xs"
                >
                  Post a Request
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-6">
                  {requests.slice(0, 5).map((req) => (
                    <div
                      key={req.id}
                      className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-xs hover:shadow-sm transition-all duration-300 group"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                        <div>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1E2D8C]/5 text-[#1E2D8C] border border-[#1E2D8C]/10 capitalize mb-3">
                            {req.spaceType} • {req.eventType.replace("_", " ")}
                          </span>
                          <h3 className="text-sm font-semibold text-[#1E2D8C] group-hover:text-[#1E2D8C] transition-colors capitalize">
                            {req.eventType.replace("_", " ")} /{" "}
                            {req.spaceType === "other"
                              ? "Space"
                              : req.spaceType}
                          </h3>
                        </div>
                        <span className="text-[10px] text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                          {formatTimeAgo(req.createdAt)}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 my-2 border-y border-slate-200/60 text-xs">
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 rounded-lg bg-[#1E2D8C]/5 text-[#1E2D8C]">
                            <DollarSign className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                              Budget
                            </p>
                            <p className="font-semibold text-[#1E2D8C]">
                              {formatBudget(req.budget)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 rounded-lg bg-[#1E2D8C]/5 text-[#1E2D8C]">
                            <Users className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                              Headcount
                            </p>
                            <p className="font-semibold text-[#1E2D8C]">
                              {req.headcount} people
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 rounded-lg bg-[#1E2D8C]/5 text-[#1E2D8C]">
                            <MapPin className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                              Location
                            </p>
                            <p className="font-semibold text-[#1E2D8C] truncate max-w-37.5">
                              {req.locationPreference}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 rounded-lg bg-[#1E2D8C]/5 text-[#1E2D8C]">
                            <Calendar className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                              Timeline
                            </p>
                            <p className="font-semibold text-[#1E2D8C]">
                              {formatTimeline(req.startDate)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-5">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                          <span className="text-slate-500 font-medium">
                            {req.status === "fulfilled" ? (
                              <span className="text-emerald-700 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider">
                                Matched & booked
                              </span>
                            ) : (
                              <span>
                                {req.proposals?.length ?? 0} proposals received
                              </span>
                            )}
                          </span>
                        </div>
                        <Link
                          href="/login"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#1E2D8C] hover:text-[#1E2D8C]/85 transition-colors cursor-pointer group/link"
                        >
                          {req.status === "fulfilled"
                            ? "View details"
                            : "Submit Proposal"}{" "}
                          <ArrowRight className="h-3.5 w-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {requests.length > 5 && (
                  <div className="flex justify-center pt-8">
                    <Link
                      href={session ? "/dashboard" : "/login"}
                      className="inline-flex h-10 items-center justify-center px-6 rounded-lg border border-[#1E2D8C] text-[#1E2D8C] hover:bg-[#1E2D8C]/5 text-xs font-bold transition active:scale-[0.98] cursor-pointer shadow-xs"
                    >
                      View More Requests
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Sample Proposals Showcase */}
      <section
        id="proposal-showcase"
        className="py-20 md:py-32 bg-white border-b border-slate-200/60"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[10px] font-bold uppercase text-[#1E2D8C] tracking-wider mb-3 block">
              Direct & Vetted Offers
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1E2D8C] font-display tracking-tight mb-3">
              What proposals look like
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Hosts pitch their space with a customized description and a
              verified Subler listing. Review the details and click directly
              through to complete booking.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {mockProposals.map((prop) => (
              <div
                key={prop.id}
                className="bg-[#fafafc] border border-slate-200/60 rounded-2xl p-6 shadow-xs hover:shadow-sm transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="text-[9px] text-slate-400 mb-0.5 font-bold uppercase tracking-wider">
                        Proposal sent for
                      </p>
                      <h4 className="font-semibold text-sm text-[#1E2D8C]">
                        {prop.requestTitle}
                      </h4>
                    </div>
                    <span className="text-[9px] text-slate-500 bg-slate-200/50 px-2 py-0.5 rounded-full">
                      {prop.timeAgo}
                    </span>
                  </div>

                  <p className="p-4 rounded-xl bg-white border border-slate-200/50 text-xs text-[#1E2D8C]/90 italic mb-6 leading-relaxed">
                    &ldquo;{prop.pitch}&rdquo;
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-200/40">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-[#1E2D8C] text-white flex items-center justify-center font-bold font-display shadow-xs text-xs">
                      {prop.hostName[0]}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#1E2D8C]">
                        {prop.hostName}
                      </p>
                      <span className="inline-block mt-0.5 text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 font-bold uppercase tracking-wider">
                        Verified Host
                      </span>
                    </div>
                  </div>

                  <a
                    href={prop.sublerLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-[#1E2D8C] text-[#1E2D8C] hover:bg-[#1E2D8C]/5 text-xs font-bold transition active:scale-[0.98] cursor-pointer shadow-xs"
                  >
                    View on Subler <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features / Benefits */}
      <section
        id="features"
        className="py-20 md:py-32 bg-[#fafafc] border-t border-slate-200/60"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-3 block">
                Why use Subler Reverse Marketplace?
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-[#1E2D8C] font-display tracking-tight mb-4 leading-tight">
                Simple matching. Direct bookings.
              </h2>
              <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                Renters post their exact space requirements, and verified hosts
                pitch their matching venues directly. Skip the endless browsing,
                message tagging, and long response times.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="mt-1 h-6 w-6 rounded-lg bg-[#1E2D8C]/10 flex items-center justify-center text-[#1E2D8C] shrink-0 shadow-xs">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#1E2D8C]">
                      Verified Venue Listings
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Every proposal connects directly to a verified Subler
                      listing, ensuring secure and trusted bookings.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="mt-1 h-6 w-6 rounded-lg bg-[#1E2D8C]/10 flex items-center justify-center text-[#1E2D8C] shrink-0 shadow-xs">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#1E2D8C]">
                      Fast & Passwordless Login
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Log in instantly with a secure magic link sent directly to
                      your inbox. No passwords to remember.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="mt-1 h-6 w-6 rounded-lg bg-[#1E2D8C]/10 flex items-center justify-center text-[#1E2D8C] shrink-0 shadow-xs">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#1E2D8C]">
                      Vetted Venue Hosts
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      All hosts are vetted and approved by our team before they
                      can send proposals, keeping matches high quality.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Graphic Callout Card */}
            <div className="relative bg-[#1E2D8C] border border-slate-200/20 rounded-2xl p-8 text-white shadow-xs transition duration-300 overflow-hidden flex flex-col justify-between min-h-95">
              <div className="relative z-10">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-4 block">
                  Subler Core On-Ramp
                </span>
                <p className="font-display font-bold text-xl leading-snug mb-4 text-white">
                  “All discovery happens here. All booking details are completed
                  on <span className="text-[#FDC800]">Subler</span>.”
                </p>
              </div>

              <div className="relative z-10 border-t border-white/10 pt-6 mt-8 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-white/50 uppercase tracking-wider font-bold">
                    Ready to start?
                  </p>
                  <p className="text-xs font-semibold text-white mt-1">
                    Create a request in 2 minutes
                  </p>
                </div>
                <Link
                  href="/login"
                  className="h-10 w-10 rounded-lg bg-[#FDC800] text-black flex items-center justify-center hover:bg-[#FDC800]/90 active:scale-[0.98] transition-all shadow-xs cursor-pointer"
                >
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 relative overflow-hidden bg-[#1E2D8C] text-white text-center">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h2 className="text-3xl md:text-4xl font-display font-extrabold mb-4 leading-tight tracking-tight">
            Find the perfect space for your next activity
          </h2>
          <p className="max-w-xl mx-auto text-sm text-slate-300 mb-8 leading-relaxed">
            Post your requirements now. It&apos;s completely free. Get proposals
            directly from verified venue hosts on Subler.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <Link
              href="/login"
              className="inline-flex h-10 w-full sm:w-auto items-center justify-center px-6 rounded-lg bg-[#FDC800] text-black text-xs font-bold hover:bg-[#FDC800]/90 transition-all active:scale-[0.98] cursor-pointer shadow-xs"
            >
              Post a Request Now
            </Link>
            <Link
              href="/login"
              className="inline-flex h-10 w-full sm:w-auto items-center justify-center px-6 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-semibold transition-all active:scale-[0.98] cursor-pointer"
            >
              Sign In as Host
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#fafafc] text-slate-500 py-16 border-t border-slate-200/60 font-sans">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <img
              src="/subler-logo-black.png"
              alt="Subler"
              className="h-5.5 w-auto object-contain shrink-0"
            />
            <div className="flex items-baseline gap-1">
              <span className="text-slate-300 font-light text-xs select-none">
                |
              </span>
              <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap leading-none tracking-tight">
                Reverse Marketplace
              </span>
            </div>
          </div>

          <p className="text-xs text-center md:text-left leading-relaxed max-w-md">
            &copy; {new Date().getFullYear()} Subler. All transactions,
            payments, and rental contracts are finalized on the main Subler
            platform.
          </p>

          <div className="flex items-center gap-6 text-xs font-semibold">
            <Link
              href="/terms"
              className="hover:text-[#1E2D8C] text-slate-500 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className="hover:text-[#1E2D8C] text-slate-500 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="https://getsubler.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#1E2D8C] text-slate-500 transition-colors"
            >
              Go to Subler
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
