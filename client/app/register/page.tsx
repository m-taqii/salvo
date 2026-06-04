"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { TextArea } from "../../components/ui/TextArea";
import { api } from "../../lib/api";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    try {
      await api.post("/auth/register", data);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.response?.error || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center relative overflow-hidden px-4 py-12 selection:bg-brand-500 selection:text-bg-base">
      <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      
      <div className="w-full max-w-xl relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white mb-8 transition-colors group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> TERMINATE
        </Link>
        
        <div className="glass-aggressive p-8 sm:p-12 rounded-none w-full">
          <div className="text-left mb-12">
            <h1 className="text-4xl font-display font-bold text-white mb-2 uppercase tracking-wide">Initialize<br/>Operator</h1>
            <p className="text-white/40 text-sm font-light">Join Salvo and weaponize your outreach.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-500/10 border-l-2 border-red-500 text-red-500 text-sm font-bold tracking-wide uppercase">
                ERR: {error}
              </div>
            )}
            
            <div className="grid sm:grid-cols-2 gap-6">
              <Input label="Designation (Name)" name="name" type="text" placeholder="Jane Doe" required />
              <Input label="Comms Channel (Email)" name="email" type="email" placeholder="you@company.com" required />
            </div>
            
            <Input label="Access Key (Password)" name="password" type="password" placeholder="••••••••" required />
            
            <div className="my-8">
              <div className="h-[1px] w-full bg-gradient-to-r from-brand-500/50 to-transparent" />
            </div>
            
            <div className="space-y-2 mb-6 border-l-2 border-brand-500 pl-4 py-1">
              <h3 className="text-xs uppercase tracking-widest font-bold text-brand-400">Context Injection (Optional)</h3>
              <p className="text-sm font-light text-white/40">Provide operational context for the LLM to leverage.</p>
            </div>
            
            <Input label="Target Domain (Website)" name="website" type="url" placeholder="https://yourcompany.com" />
            
            <TextArea 
              label="Mission Parameters (Business Description)" 
              name="description" 
              placeholder="What does your company do? What value do you provide?" 
            />
            
            <Button type="submit" className="w-full mt-8" disabled={loading}>
              {loading ? "INITIALIZING..." : "COMMENCE"}
            </Button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-white/5 text-left text-xs font-bold uppercase tracking-widest text-white/40">
            Existing operator?{" "}
            <Link href="/login" className="text-brand-500 hover:text-brand-400">
              Access Terminal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
