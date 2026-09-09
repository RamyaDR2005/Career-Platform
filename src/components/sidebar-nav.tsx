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
    <div className="flex flex-col h-full bg-[#1c211d] text-[#f7f1e7] border-r border-white/10">
      {/* Brand Header */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 bg-[#c95a2e] rounded-xl flex items-center justify-center shadow-lg shadow-[#c95a2e]/20 group-hover:scale-105 transition-all">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight leading-none">CareerAI</h2>
            <p className="text-[11px] text-white/70 font-medium mt-1">{portalName}</p>
          </div>
        </Link>
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden text-white/70 hover:text-white p-1"
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
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-none text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-white text-black shadow-sm"
                  : "text-white/80 hover:text-white hover:bg-white/10 border border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? "text-black" : "text-white/80 group-hover:text-white"
                  }`}
                />
                <span>{item.title}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    isActive 
                      ? "bg-black/10 text-black" 
                      : "bg-white/20 text-white"
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
      <div className="p-4 border-t border-white/10 bg-[#1c211d]">
        {user?.name && (
          <div className="mb-3 px-2">
            <p className="text-xs font-semibold text-white truncate">{user.name}</p>
            <p className="text-[11px] text-white/70 truncate">{user.email}</p>
          </div>
        )}
        <Button
          variant="ghost"
          className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10 rounded-xl text-xs font-semibold transition-all"
          onClick={() => {
            import("next-auth/react").then(({ signOut }) => {
              signOut({ callbackUrl: "/" });
            });
          }}
        >
          <LogOut className="mr-2 h-4 w-4" /> Sign Out
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
      <div className="md:hidden fixed top-0 inset-x-0 z-40 h-14 bg-[#1c211d] border-b border-[#78957f]/30 flex items-center justify-between px-4 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-[#c95a2e] rounded-lg flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm text-white">
            CareerAI ({portalName.split(" ")[0]})
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 text-[#78957f] hover:text-white rounded-lg bg-[#1c211d] border border-[#78957f]/30"
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
