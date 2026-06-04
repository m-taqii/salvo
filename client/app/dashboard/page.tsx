"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { Send, Users, MailCheck, AlertCircle } from "lucide-react";

interface Lead {
  _id: string;
  to: string;
  status: "sent" | "failed" | "pending";
}

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    total: 0,
    sent: 0,
    failed: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/leads")
      .then((res) => {
        const leads: Lead[] = res.data.response;
        setStats({
          total: leads.length,
          sent: leads.filter((l) => l.status === "sent").length,
          failed: leads.filter((l) => l.status === "failed").length,
        });
      })
      .catch((err) => console.error("Failed to fetch leads", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse flex space-x-4">Loading stats...</div>;

  const statCards = [
    { name: "Total Leads Contacted", value: stats.total, icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
    { name: "Successfully Sent", value: stats.sent, icon: MailCheck, color: "text-green-400", bg: "bg-green-400/10" },
    { name: "Failed Deliveries", value: stats.failed, icon: AlertCircle, color: "text-red-400", bg: "bg-red-400/10" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Overview</h1>
        <p className="text-slate-400 mt-1">Here's what's happening with your outreach campaigns.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <div key={stat.name} className="glass p-6 rounded-2xl flex items-center gap-5 hover:-translate-y-1 transition-transform">
            <div className={`h-14 w-14 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon className="h-7 w-7" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">{stat.name}</p>
              <h3 className="text-3xl font-bold text-white mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 glass p-8 rounded-2xl border border-brand-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-[80px]" />
        <h2 className="text-xl font-bold text-white mb-2">Ready to send your next campaign?</h2>
        <p className="text-slate-400 max-w-2xl mb-6">
          Head over to the Auto Send tab, drop a CSV of your newest leads, set your intent, and let the Salvo LLM do the heavy lifting for you.
        </p>
      </div>
    </div>
  );
}
