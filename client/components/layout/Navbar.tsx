import Link from "next/link";
import { Button } from "../ui/Button";

export function Navbar() {
  return (
    <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-6 pointer-events-none">
      <div className="flex items-center justify-between glass-aggressive rounded-none px-8 py-4 pointer-events-auto shadow-[0_20px_40px_rgba(0,0,0,0.8)] backdrop-blur-3xl">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="flex h-10 w-10 items-center justify-center bg-brand-500 text-bg-base font-display font-bold text-xl group-hover:scale-95 transition-transform duration-300 shadow-[0_0_20px_rgba(255,68,0,0.5)]">
            S
          </div>
          <span className="text-2xl font-display font-bold text-white tracking-widest uppercase">Salvo</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex border-none">Log In</Button>
          </Link>
          <Link href="/register">
            <Button variant="primary" size="sm">Get Started</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
