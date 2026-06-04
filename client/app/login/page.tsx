"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { api } from "../../lib/api";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    try {
      await api.post("/auth/login", { email, password });
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.response?.error || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center relative overflow-hidden px-4 selection:bg-brand-500 selection:text-bg-base">
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      
      <div className="w-full max-w-md relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white mb-8 transition-colors group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> TERMINATE
        </Link>
        
        <div className="glass-aggressive p-8 sm:p-12 rounded-none w-full">
          <div className="text-left mb-12">
            <div className="inline-flex h-12 w-12 items-center justify-center bg-brand-500 text-bg-base font-display font-bold text-2xl shadow-[0_0_20px_rgba(255,68,0,0.5)] mb-8">
              S
            </div>
            <h1 className="text-4xl font-display font-bold text-white mb-2 uppercase tracking-wide">Access<br/>Restricted</h1>
            <p className="text-white/40 text-sm font-light">Identify yourself to proceed.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-500/10 border-l-2 border-red-500 text-red-500 text-sm font-bold tracking-wide uppercase">
                ERR: {error}
              </div>
            )}
            
            <Input 
              label="Email address" 
              name="email" 
              type="email" 
              placeholder="operator@salvo.com" 
              required 
            />
            
            <Input 
              label="Password" 
              name="password" 
              type="password" 
              placeholder="••••••••" 
              required 
            />
            
            <Button type="submit" className="w-full mt-4" disabled={loading}>
              {loading ? "AUTHENTICATING..." : "BREACH"}
            </Button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-white/5 text-left text-xs font-bold uppercase tracking-widest text-white/40">
            No clearance?{" "}
            <Link href="/register" className="text-brand-500 hover:text-brand-400">
              Request access
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
