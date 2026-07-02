"use client";

import { useState } from "react";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { TextArea } from "../../../components/ui/TextArea";
import { api } from "../../../lib/api";
import { UploadCloud } from "lucide-react";

export default function AutoSendPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a CSV file.");
      return;
    }

    setLoading(true);
    setSuccess("");
    setError("");

    const formData = new FormData(e.currentTarget);
    formData.set("attachment", file);

    try {
      // Must use multipart/form-data for file uploads
      const res = await api.post("/send", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccess(res.data.response || "Emails dispatched successfully!");
      setFile(null);
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      setError(err.response?.data?.response?.error || "Failed to process bulk send");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Auto Send (AI)</h1>
        <p className="text-slate-400 mt-1">Upload a CSV of leads and let the Salvo LLM write and send personalized emails instantly.</p>
      </div>

      <div className="glass p-8 rounded-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {success && (
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
              {success}
            </div>
          )}
          {error && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">CSV Leads File</label>
            <div className="mt-2 flex justify-center rounded-xl border border-dashed border-slate-700 px-6 py-10 hover:border-brand-500 hover:bg-brand-500/5 transition-colors">
              <div className="text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-slate-500" />
                <div className="mt-4 flex text-sm leading-6 text-slate-400 justify-center">
                  <label className="relative cursor-pointer rounded-md bg-transparent font-semibold text-brand-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-brand-500 focus-within:ring-offset-2 hover:text-brand-300">
                    <span>Upload a file</span>
                    <input 
                      name="attachment" 
                      type="file" 
                      accept=".csv"
                      className="sr-only" 
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs leading-5 text-slate-500 mt-1">
                  {file ? <span className="text-brand-400">{file.name}</span> : "CSV up to 10MB"}
                </p>
              </div>
            </div>
          </div>

          <Input 
            label="Intent / Goal" 
            name="intent" 
            type="text" 
            placeholder="e.g. Pitching our new SEO product to save them time" 
            required 
          />

          <TextArea 
            label="Custom System Prompt (Optional)" 
            name="systemPrompt" 
            placeholder="Override the default Salvo rules. Be careful, the JSON response format is strictly enforced." 
            className="min-h-[150px]"
          />

          <div className="flex items-center gap-3">
            <div className="relative flex items-start">
              <div className="flex h-6 items-center">
                <input
                  id="autoSend"
                  name="autoSend"
                  type="checkbox"
                  value="true"
                  className="h-5 w-5 rounded border-slate-700 bg-slate-800/50 text-brand-500 focus:ring-brand-500 focus:ring-offset-bg-base"
                />
              </div>
              <div className="ml-3 text-sm leading-6">
                <label htmlFor="autoSend" className="font-medium text-slate-200">
                  Auto Send (Bypass Drafts)
                </label>
                <p className="text-slate-400">If unchecked, emails will be saved as drafts for manual review.</p>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading || !file}>
            {loading ? "Generating & Sending..." : "Launch Campaign"}
          </Button>
        </form>
      </div>
    </div>
  );
}
