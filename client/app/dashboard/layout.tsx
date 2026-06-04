"use client";

import { Sidebar } from "../../components/layout/Sidebar";
import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simple auth check
    api.get("/auth/me")
      .then(() => setLoading(false))
      .catch(() => {
        router.push("/login");
      });
  }, [router]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-bg-base">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-bg-base text-white overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-[#0a0f1a] shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]">
        <div className="max-w-6xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
