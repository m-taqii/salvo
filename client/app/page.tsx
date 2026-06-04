"use client";

import { Navbar } from "../components/layout/Navbar";
import { Button } from "../components/ui/Button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, Variants } from "framer-motion";

export default function Home() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="min-h-screen bg-bg-base overflow-hidden relative selection:bg-brand-500 selection:text-bg-base">
      <Navbar />
      
      {/* Aggressive atmospheric meshes */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-brand-500/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
      <div className="absolute top-[40%] right-[-20%] w-[50%] h-[80%] bg-brand-900/20 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />

      <main className="relative z-10 w-full">
        {/* HERO SECTION */}
        <section className="min-h-screen flex flex-col justify-center px-6 md:px-12 pt-32 pb-24 relative">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="max-w-[90rem] mx-auto w-full relative"
          >
            <motion.div variants={itemVariants} className="mb-8">
              <div className="inline-flex items-center gap-4 border-l-2 border-brand-500 pl-4 py-1 text-brand-400 text-xs font-bold tracking-[0.2em] uppercase">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                </span>
                Salvo Engine // v1.0
              </div>
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-[12vw] sm:text-[8rem] md:text-[10rem] font-display font-extrabold text-white leading-[0.85] tracking-tighter mix-blend-plus-lighter z-20 relative">
              WEAPONIZE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-brand-300 via-brand-500 to-brand-800 text-glow">
                OUTREACH.
              </span>
            </motion.h1>
            
            <motion.div variants={itemVariants} className="mt-12 md:mt-20 flex flex-col md:flex-row gap-8 md:gap-24 md:items-start max-w-5xl ml-auto">
              <p className="text-xl md:text-2xl text-white/50 font-sans leading-relaxed max-w-xl font-light">
                Stop sending robotic templates. Feed Salvo a CSV. 
                Our LLM drafts and dispatches highly-lethal, human-sounding emails 
                that actually extract replies.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-6 shrink-0">
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    Initiate Sequence
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </Link>
                <Link href="/login" className="text-sm font-bold tracking-widest uppercase text-white/50 hover:text-white transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-white hover:after:w-full after:transition-all after:duration-300">
                  Access Dashboard
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* FEATURES (Asymmetric Scrollytelling) */}
        <section className="py-32 px-6 md:px-12">
          <div className="max-w-[90rem] mx-auto w-full">
            <motion.div 
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col md:flex-row justify-between gap-12 md:gap-24 items-center"
            >
              <div className="w-full md:w-1/2 relative">
                <div className="absolute inset-0 bg-brand-500 blur-[100px] opacity-10" />
                <h2 className="text-[6vw] sm:text-[5rem] font-display font-extrabold leading-[0.9] text-white/90 relative z-10 mix-blend-plus-lighter uppercase">
                  Not just another <br/>
                  <span className="text-white/20">wrapper.</span>
                </h2>
              </div>
              <div className="w-full md:w-1/2 flex flex-col gap-16">
                {[
                  {
                    num: "01",
                    title: "Intent Injection",
                    desc: "Provide your business context once. Salvo seamlessly weaves your core intent into every interaction without sounding like a corporate brochure."
                  },
                  {
                    num: "02",
                    title: "Mass Deployment",
                    desc: "Drop a CSV. Walk away. Salvo parses, researches, drafts, and fires hundreds of personalized emails asynchronously."
                  }
                ].map((feature, i) => (
                  <div key={i} className="relative group pl-8 md:pl-12 border-l border-white/10 hover:border-brand-500 transition-colors duration-500">
                    <span className="absolute -left-[1px] top-0 h-0 w-[2px] bg-brand-500 group-hover:h-full transition-all duration-700 ease-out" />
                    <div className="text-brand-500 font-display font-bold text-xl mb-4 tracking-widest">{feature.num}</div>
                    <h3 className="text-3xl font-display font-bold text-white mb-4 uppercase tracking-wide">{feature.title}</h3>
                    <p className="text-lg text-white/40 leading-relaxed font-light">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

      </main>
    </div>
  );
}
