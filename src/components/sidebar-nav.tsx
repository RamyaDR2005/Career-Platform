"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LogOut,
  Menu,
  X,
  Brain,
  Home,
  User,
  FileText,
  BrainCircuit,
  Briefcase,
  MessageSquare,
  LayoutDashboard,
  Building2,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";

export type IconName =
  | "home"
  | "user"
  | "file-text"
  | "roadmap"
  | "jobs"
  | "interviews"
  | "dashboard"
  | "company"
  | "users";

export interface NavItem {
  title: string;
  href: string;
  iconName: IconName;
  badge?: string;
  badgeClass?: string;
}

interface SidebarNavProps {
  portalName: string;
  items: NavItem[];
  user?: {
    name?: string | null;
    email?: string | null;
  };
}

const ICON_MAP: Record<IconName, React.ComponentType<{ className?: string }>> = {
  home: Home,
  user: User,
  "file-text": FileText,
  roadmap: BrainCircuit,
  jobs: Briefcase,
  interviews: MessageSquare,
  dashboard: LayoutDashboard,
  company: Building2,
  users: Users,
};

export function SidebarNav({ portalName, items, user }: SidebarNavProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navContent = (
    <div className="flex flex-col h-full bg-zinc-950/90 border-r border-white/10 backdrop-blur-xl">
      {/* Brand Header */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-all">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight leading-none">CareerAI</h2>
            <p className="text-[11px] text-zinc-400 font-medium mt-1">{portalName}</p>
          </div>
        </Link>
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden text-zinc-400 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {items.map((item) => {
          const Icon = ICON_MAP[item.iconName] || Home;
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" &&
              item.href !== "/recruiter" &&
              item.href !== "/admin" &&
              pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm shadow-blue-500/10"
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5 border border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? "text-blue-400" : "text-zinc-400 group-hover:text-zinc-200"
                  }`}
                />
                <span>{item.title}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    item.badgeClass || "bg-blue-500/20 text-blue-300"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User & Logout Footer */}
      <div className="p-4 border-t border-white/5 bg-zinc-900/40">
        {user?.name && (
          <div className="mb-3 px-2">
            <p className="text-xs font-semibold text-zinc-200 truncate">{user.name}</p>
            <p className="text-[11px] text-zinc-500 truncate">{user.email}</p>
          </div>
        )}
        <Button
          variant="ghost"
          className="w-full justify-start text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl text-xs font-semibold transition-all"
          asChild
        >
          <Link href="/api/auth/signout">
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Link>
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-64 hidden md:flex flex-col shrink-0 h-screen sticky top-0">
        {navContent}
      </aside>

      {/* Mobile Top Header */}
      <div className="md:hidden fixed top-0 inset-x-0 z-40 h-14 bg-zinc-950/80 border-b border-white/10 backdrop-blur-lg flex items-center justify-between px-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm text-white">
            CareerAI ({portalName.split(" ")[0]})
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 text-zinc-300 hover:text-white rounded-lg bg-zinc-900 border border-white/10"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Overlay & Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] h-full z-10">{navContent}</div>
        </div>
      )}
    </>
  );
}
