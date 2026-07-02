"use client";

import { useEffect, useState } from "react";
import { api } from "../../../lib/api";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { TextArea } from "../../../components/ui/TextArea";
import { ArrowLeft, Send, Save, FileEdit } from "lucide-react";

interface Draft {
  _id: string;
  to: string;
  subject: string;
  content: string;
  status: "draft";
  createdAt: string;
}

export default function DraftsPage() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDraft, setSelectedDraft] = useState<Draft | null>(null);
  
  // Editor state
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const fetchDrafts = () => {
    setLoading(true);
    api.get("/drafts")
      .then((res) => {
        setDrafts(res.data.response || []);
      })
      .catch((err) => console.error("Failed to fetch drafts", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDrafts();
  }, []);

  const handleEdit = (draft: Draft) => {
    setSelectedDraft(draft);
    setSubject(draft.subject);
    setContent(draft.content);
    setMessage({ text: "", type: "" });
  };

  const handleBack = () => {
    setSelectedDraft(null);
    setMessage({ text: "", type: "" });
  };

  const handleSave = async () => {
    if (!selectedDraft) return;
    setSaving(true);
    setMessage({ text: "", type: "" });
    try {
      await api.put(`/drafts/${selectedDraft._id}`, { subject, content });
      setMessage({ text: "Draft saved successfully", type: "success" });
      // Update local state
      setDrafts(drafts.map(d => d._id === selectedDraft._id ? { ...d, subject, content } : d));
    } catch (err: any) {
      setMessage({ text: err.response?.data?.response?.error || "Failed to save draft", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleSend = async () => {
    if (!selectedDraft) return;
    setSending(true);
    setMessage({ text: "", type: "" });
    try {
      // First save if any changes made
      await api.put(`/drafts/${selectedDraft._id}`, { subject, content });
      // Then send
      await api.post(`/drafts/${selectedDraft._id}/send`);
      setMessage({ text: "Email sent successfully", type: "success" });
      // Remove from drafts
      setDrafts(drafts.filter(d => d._id !== selectedDraft._id));
      setTimeout(() => {
        setSelectedDraft(null);
      }, 1500);
    } catch (err: any) {
      setMessage({ text: err.response?.data?.response?.error || "Failed to send email", type: "error" });
    } finally {
      setSending(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (selectedDraft) {
    return (
      <div className="max-w-3xl">
        <div className="mb-6 flex items-center gap-4">
          <button 
            onClick={handleBack}
            className="p-2 rounded-lg bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Edit Draft</h1>
            <p className="text-slate-400 text-sm mt-1">Recipient: <span className="text-brand-400">{selectedDraft.to}</span></p>
          </div>
        </div>

        <div className="glass p-8 rounded-2xl space-y-6">
          {message.text && (
            <div className={`p-4 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
              {message.text}
            </div>
          )}

          <Input 
            label="Subject" 
            name="subject" 
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />

          <TextArea 
            label="Email Body (HTML)" 
            name="content" 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[300px] font-mono text-sm"
          />

          <div className="flex gap-4 pt-4 border-t border-slate-700/50">
            <Button 
              variant="secondary" 
              onClick={handleSave} 
              disabled={saving || sending}
              className="flex-1 flex items-center justify-center gap-2"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save Draft"}
            </Button>
            <Button 
              onClick={handleSend} 
              disabled={saving || sending}
              className="flex-1 flex items-center justify-center gap-2"
            >
              <Send className="h-4 w-4" />
              {sending ? "Sending..." : "Send Email"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Drafts</h1>
        <p className="text-slate-400 mt-1">Review, edit, and send emails generated by Salvo AI.</p>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/50 text-xs uppercase text-slate-400 border-b border-slate-700/50">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium">Recipient</th>
                <th scope="col" className="px-6 py-4 font-medium">Subject</th>
                <th scope="col" className="px-6 py-4 font-medium">Date Created</th>
                <th scope="col" className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    Loading drafts...
                  </td>
                </tr>
              ) : drafts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    No drafted emails found. AI will place unsent emails here if Auto Send is disabled.
                  </td>
                </tr>
              ) : (
                drafts.map((draft) => (
                  <tr key={draft._id} className="border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{draft.to}</td>
                    <td className="px-6 py-4 max-w-[200px] truncate" title={draft.subject}>{draft.subject}</td>
                    <td className="px-6 py-4 text-slate-400 whitespace-nowrap">
                      {formatDate(draft.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => handleEdit(draft)}
                        className="flex items-center gap-2 ml-auto"
                      >
                        <FileEdit className="h-4 w-4" />
                        Review
                      </Button>
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
