"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Send, Mail, List, LogOut } from "lucide-react";
import { cn } from "../../lib/utils";
import { api } from "../../lib/api";

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Manual Send", href: "/dashboard/manual-send", icon: Send },
  { name: "Auto Send", href: "/dashboard/auto-send", icon: Mail },
  { name: "Leads History", href: "/dashboard/leads", icon: List },
];

export function Sidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="flex h-screen w-64 flex-col border-r border-white/5 bg-transparent relative z-20">
      <div className="flex h-24 items-center px-8 border-b border-white/5">
        <Link href="/dashboard" className="flex items-center gap-4 group">
          <div className="flex h-8 w-8 items-center justify-center bg-brand-500 text-bg-base font-display font-bold text-lg group-hover:scale-95 transition-transform duration-300 shadow-[0_0_15px_rgba(255,68,0,0.4)]">
            S
          </div>
          <span className="text-xl font-display font-bold text-white tracking-widest uppercase">Salvo</span>
        </Link>
      </div>
      
      <div className="flex flex-1 flex-col justify-between p-6">
        <nav className="flex flex-col gap-4 mt-8">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 text-sm font-display font-bold uppercase tracking-wider transition-all duration-300 relative group",
                  isActive
                    ? "text-brand-500 bg-brand-500/5"
                    : "text-white/40 hover:text-white hover:bg-white/5"
                )}
              >
                <span className={cn(
                  "absolute left-0 top-0 h-full w-[2px] transition-all duration-300",
                  isActive ? "bg-brand-500" : "bg-transparent group-hover:bg-white/20"
                )} />
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-3 text-sm font-display font-bold uppercase tracking-wider text-white/40 hover:text-white hover:bg-white/5 transition-all duration-300 relative group w-full text-left"
        >
          <span className="absolute left-0 top-0 h-full w-[2px] bg-transparent group-hover:bg-red-500 transition-all duration-300" />
          <LogOut className="h-4 w-4 group-hover:text-red-500 transition-colors" />
          <span className="group-hover:text-red-500 transition-colors">Logout</span>
        </button>
      </div>
    </div>
  );
}
