"use client";

import { useEffect, useState } from "react";
import { api } from "../../../lib/api";
import { Badge } from "../../../components/ui/Badge";


interface Lead {
  _id: string;
  to: string;
  subject: string;
  content: string;
  status: "sent" | "failed" | "pending";
  createdAt: string;
}

export default function LeadsHistoryPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/leads")
      .then((res) => {
        setLeads(res.data.response || []);
      })
      .catch((err) => console.error("Failed to fetch leads", err))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Leads History</h1>
        <p className="text-slate-400 mt-1">A complete log of all emails dispatched by Salvo.</p>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/50 text-xs uppercase text-slate-400 border-b border-slate-700/50">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium">Recipient</th>
                <th scope="col" className="px-6 py-4 font-medium">Subject</th>
                <th scope="col" className="px-6 py-4 font-medium">Status</th>
                <th scope="col" className="px-6 py-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    Loading records...
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    No leads found. Start sending emails to see them here!
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead._id} className="border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{lead.to}</td>
                    <td className="px-6 py-4 max-w-xs truncate" title={lead.subject}>{lead.subject}</td>
                    <td className="px-6 py-4">
                      <Badge 
                        variant={lead.status === "sent" ? "success" : lead.status === "failed" ? "error" : "warning"}
                      >
                        {lead.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-slate-400 whitespace-nowrap">
                      {formatDate(lead.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
