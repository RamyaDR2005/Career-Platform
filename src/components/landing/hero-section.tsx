"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, FileText, CheckCircle2 } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden min-h-[90vh] flex items-center">
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[150px]"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Text Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-left"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6"
            >
              <Brain className="w-4 h-4" /> Powered by IBM Watsonx
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1] text-white">
              Your career, <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">accelerated by AI.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-zinc-400 mb-10 leading-relaxed font-light max-w-lg">
              Upload your resume and let AI instantly score your profile against ATS standards, generate a learning roadmap, and match you with top recruiters.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="h-14 px-8 rounded-full bg-white text-zinc-950 hover:bg-zinc-100 font-semibold text-base shadow-[0_4px_20px_rgba(255,255,255,0.1)] transition-all group">
                <Link href="/register" className="flex items-center">
                  Start for Free <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-14 px-8 rounded-full bg-zinc-950/50 border-white/10 hover:border-white/20 text-white font-medium text-base backdrop-blur-md">
                <Link href="/login">Recruiter Login</Link>
              </Button>
            </div>
            
            <div className="mt-10 flex items-center gap-4 text-sm text-zinc-500">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-[#030409] flex items-center justify-center text-xs text-white overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <p>Join 10,000+ students already hired.</p>
            </div>
          </motion.div>

          {/* Right: Floating UI Mockup */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="relative lg:h-[600px] flex items-center justify-center"
          >
            {/* Main Glass Dashboard Card */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-full max-w-md bg-zinc-900/80 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-2xl z-20"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center">
                    <FileText className="text-white w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Resume Analysis</h3>
                    <p className="text-xs text-zinc-400">Processing via Watsonx...</p>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full border-[3px] border-emerald-500 flex items-center justify-center text-emerald-400 font-bold">
                  92
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "92%" }}
                    transition={{ duration: 2, delay: 1 }}
                    className="h-full bg-emerald-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 mb-2" />
                    <p className="text-sm font-medium text-white">ATS Format</p>
                    <p className="text-xs text-zinc-400">Perfect match</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <Brain className="w-5 h-5 text-blue-400 mb-2" />
                    <p className="text-sm font-medium text-white">Keywords</p>
                    <p className="text-xs text-zinc-400">React, Node, SQL</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Background Floating Elements */}
            <motion.div 
              animate={{ y: [0, 20, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -right-8 -bottom-12 w-48 bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-xl z-30"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                  <img src="https://i.pravatar.cc/100?img=33" className="rounded-full" />
                </div>
                <div>
                  <p className="text-xs text-zinc-300 font-medium">Google Recruiter</p>
                  <p className="text-[10px] text-emerald-400">Viewed your profile</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
