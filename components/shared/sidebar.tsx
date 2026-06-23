"use client";

import {
  ArrowUpRight,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  PlusCircle,
  Search,
  Send,
  Settings,
  ShieldAlert,
  User,
  Users,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { signOut } from "next-auth/react";

interface NavLink {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface NavGroup {
  title: string;
  links: NavLink[];
}

interface SidebarProps {
  user: {
    id: string;
    email: string;
    role: string;
    hostStatus: string | null;
  };
  children: React.ReactNode;
}

export default function Sidebar({ user, children }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isHost = user.hostStatus === "approved";
  const isAdmin = user.role === "admin";

  const navigation: NavGroup[] = [
    {
      title: "Renter Portal",
      links: [
        {
          name: "Dashboard",
          href: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          name: "My Requests",
          href: "/requests/my",
          icon: ClipboardList,
        },
        {
          name: "Post a Request",
          href: "/requests/new",
          icon: PlusCircle,
        },
      ],
    },
    ...(isHost
      ? [
          {
            title: "Host Portal",
            links: [
              {
                name: "Browse Requests",
                href: "/host/dashboard",
                icon: Search,
              },
              {
                name: "My Proposals",
                href: "/host/proposals",
                icon: Send,
              },
            ],
          },
        ]
      : [
          {
            title: "Host Portal",
            links: [
              {
                name: "Upgrade to Host",
                href: "/host/upgrade",
                icon: ArrowUpRight,
                badge: user.hostStatus === "pending" ? "Pending" : undefined,
              },
            ],
          },
        ]),
    ...(isAdmin
      ? [
          {
            title: "Admin Panel",
            links: [
              {
                name: "Platform Admin",
                href: "/admin",
                icon: ShieldAlert,
              },
              {
                name: "Manage Users",
                href: "/admin/users",
                icon: Users,
              },
            ],
          },
        ]
      : []),
  ];


  const isActive = (href: string) => {
    if (href === "/dashboard" || href === "/admin") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background font-sans">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-neutral-200/80 bg-[#fafafc] text-slate-600 shrink-0 select-none">
        {/* Sidebar Header */}
        <div className="h-16 flex items-center gap-2 px-6 border-b border-neutral-200/80">
          <img
            src="/subler-logo-black.png"
            alt="Subler"
            className="h-5.5 w-auto object-contain shrink-0"
          />
          <div className="flex items-baseline gap-1">
            <span className="text-neutral-300 font-light text-xs select-none">|</span>
            <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap leading-none tracking-tight">
              Reverse Marketplace
            </span>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 py-6 px-4 overflow-y-auto space-y-6">
          {navigation.map((group) => (
            <div key={group.title} className="space-y-2.5">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3.5">
                {group.title}
              </h4>
              <ul className="space-y-1">
                {group.links.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className={`group flex items-center justify-between px-3.5 py-2.5 rounded-lg text-body-sm font-medium transition-all duration-150 cursor-pointer ${
                          active
                            ? "bg-[#1e2d8c]/5 text-[#1e2d8c]"
                            : "text-slate-500 hover:bg-neutral-100 hover:text-[#0e1442] border border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <link.icon
                            className={`h-4.5 w-4.5 transition-colors ${
                              active
                                ? "text-[#1e2d8c]"
                                : "text-slate-400 group-hover:text-slate-600"
                            }`}
                          />
                          <span>{link.name}</span>
                        </div>
                        {link.badge && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-400/10 text-amber-400 border border-amber-400/20">
                            {link.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* User profile info at bottom */}
        <div className="p-4 border-t border-neutral-200/80 flex items-center justify-between gap-3 mt-auto bg-[#fafafc]">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-7 w-7 rounded-full bg-[#1e2d8c]/10 text-[#1e2d8c] flex items-center justify-center font-bold text-xs shrink-0 select-none">
              {user.email ? user.email[0].toUpperCase() : 'U'}
            </div>
            <span className="text-xs font-medium text-slate-500 truncate select-none">
              {user.email}
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <Link
              href="/settings"
              className="h-8 w-8 rounded-lg border border-neutral-200/80 bg-white text-slate-600 hover:bg-neutral-50 hover:text-foreground flex items-center justify-center transition-all cursor-pointer shadow-xs"
              title="Settings"
            >
              <Settings className="h-4 w-4 text-slate-400" />
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="h-8 w-8 rounded-lg border border-neutral-200/80 bg-white text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-100 flex items-center justify-center transition-all cursor-pointer shadow-xs"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4 text-slate-400" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 border-b border-border bg-card px-6 flex items-center justify-between sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOpen(true)}
              className="h-10 w-10 rounded-lg border border-border flex items-center justify-center text-foreground hover:bg-neutral-50 transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <img
                src="/subler-logo-black.png"
                alt="Subler"
                className="h-7 w-auto object-contain shrink-0"
              />
              <div className="flex items-baseline gap-1.5">
                <span className="text-neutral-300 font-light text-xs select-none">|</span>
                <span className="text-[10.5px] text-muted-foreground font-medium whitespace-nowrap leading-none">
                  Reverse Marketplace
                </span>
              </div>
            </div>
          </div>

          <Link
            href="/settings"
            className="h-10 w-10 rounded-lg border border-border flex items-center justify-center text-foreground hover:bg-neutral-50 transition-colors"
            title="Settings"
          >
            <Settings className="h-5 w-5 text-muted-foreground" />
          </Link>
        </header>

        {/* Mobile Drawer (Sliding Menu) */}
        {isOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Sidebar content */}
            <aside className="relative flex flex-col w-72 max-w-xs bg-[#fafafc] border-r border-neutral-200/80 h-full animate-slide-in p-6 text-[#0e1442] select-none">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 h-8 w-8 rounded-lg border border-neutral-200/80 bg-white flex items-center justify-center text-slate-500 hover:bg-neutral-50"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Header */}
              <div className="flex items-center gap-2.5 mb-6 pb-6 border-b border-neutral-200/80">
                <img
                  src="/subler-logo-black.png"
                  alt="Subler"
                  className="h-5.5 w-auto object-contain shrink-0"
                />
                <div className="flex items-baseline gap-1.5">
                  <span className="text-white/20 font-light text-sm select-none">|</span>
                  <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap leading-none tracking-tight">
                    Reverse Marketplace
                  </span>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 overflow-y-auto space-y-6">
                {navigation.map((group) => (
                  <div key={group.title} className="space-y-2">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3.5">
                      {group.title}
                    </h4>
                    <ul className="space-y-1">
                      {group.links.map((link) => {
                        const active = isActive(link.href);
                        return (
                          <li key={link.name}>
                            <Link
                              href={link.href}
                              onClick={() => setIsOpen(false)}
                              className={`group flex items-center justify-between px-3.5 py-2.5 rounded-lg text-body-sm font-semibold transition-all ${
                                active
                                  ? "bg-[#1e2d8c]/5 text-[#1e2d8c]"
                                  : "text-slate-500 hover:bg-neutral-100"
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <link.icon
                                  className={`h-4.5 w-4.5 ${active ? "text-[#1e2d8c]" : "text-slate-400"}`}
                                />
                                <span>{link.name}</span>
                              </div>
                              {link.badge && (
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-400/10 text-amber-400 border border-amber-400/20">
                                  {link.badge}
                                </span>
                              )}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </nav>

              {/* User profile info for mobile at bottom */}
              <div className="mt-auto pt-6 border-t border-neutral-200/80 flex items-center justify-between gap-3 bg-[#fafafc] -mx-6 -mb-6 p-6">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-9 w-9 rounded-full bg-[#1e2d8c]/10 text-[#1e2d8c] flex items-center justify-center font-bold text-sm shrink-0 select-none">
                    {user.email ? user.email[0].toUpperCase() : 'U'}
                  </div>
                  <span className="text-sm font-medium text-slate-500 truncate select-none">
                    {user.email}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Link
                    href="/settings"
                    onClick={() => setIsOpen(false)}
                    className="h-9 w-9 rounded-lg border border-neutral-200/80 bg-white text-slate-600 hover:bg-neutral-50 hover:text-foreground flex items-center justify-center transition-all cursor-pointer shadow-xs"
                    title="Settings"
                  >
                    <Settings className="h-4.5 w-4.5 text-slate-400" />
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="h-9 w-9 rounded-lg border border-neutral-200/80 bg-white text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-100 flex items-center justify-center transition-all cursor-pointer shadow-xs"
                    title="Sign Out"
                  >
                    <LogOut className="h-4.5 w-4.5 text-slate-400" />
                  </button>
                </div>
              </div>
            </aside>
          </div>
        )}

        {/* Dashboard Child View */}
        <main className="flex-1 py-8 px-6 lg:px-10 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
