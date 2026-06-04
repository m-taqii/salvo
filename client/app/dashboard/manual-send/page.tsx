"use client";

import { useState } from "react";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { TextArea } from "../../../components/ui/TextArea";
import { api } from "../../../lib/api";

export default function ManualSendPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      await api.post("/send-manual", data);
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      setError(err.response?.data?.response?.error || "Failed to send email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Manual Send</h1>
        <p className="text-slate-400 mt-1">Send a single, one-off email directly from your account.</p>
      </div>

      <div className="glass p-8 rounded-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          {success && (
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
              Email sent successfully and logged to your leads history!
            </div>
          )}
          {error && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <Input 
            label="Recipient Email" 
            name="to" 
            type="email" 
            placeholder="lead@company.com" 
            required 
          />
          
          <Input 
            label="Subject Line" 
            name="subject" 
            type="text" 
            placeholder="quick question" 
            required 
          />
          
          <TextArea 
            label="Email Content" 
            name="content" 
            placeholder="Type your email here..." 
            className="min-h-[200px]"
            required 
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending..." : "Send Email"}
          </Button>
        </form>
      </div>
    </div>
  );
}
