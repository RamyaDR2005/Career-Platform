"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, UserCheck, Briefcase } from "lucide-react";

export default function CtaSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-[#030409]">
      {/* Background Accent Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-blue-600/15 via-indigo-600/20 to-purple-600/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl bg-gradient-to-b from-zinc-900/90 via-zinc-900/80 to-zinc-950/90 border border-white/10 p-10 sm:p-16 text-center backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden"
        >
          {/* Top Decorative Glow Line */}
          <div className="absolute top-0 inset-x-12 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Accelerate Your Career Today</span>
          </div>

          {/* Title */}
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Ready to unlock your <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              AI-driven career potential?
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Join thousands of engineering students optimizing their resumes, closing skill gaps, and connecting with top recruiters through IBM watsonx AI intelligence.
          </p>

          {/* Dual Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="h-14 px-8 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base shadow-[0_4px_25px_rgba(37,99,235,0.4)] hover:shadow-[0_4px_30px_rgba(37,99,235,0.6)] hover:-translate-y-0.5 transition-all duration-300 group w-full sm:w-auto"
            >
              <Link href="/register" className="flex items-center gap-2 justify-center">
                <UserCheck className="w-5 h-5" />
                <span>Get Started as Student</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-14 px-8 rounded-full bg-zinc-950/60 border-white/10 hover:border-white/20 text-white font-medium text-base backdrop-blur-md hover:bg-zinc-900 transition-all duration-300 w-full sm:w-auto"
            >
              <Link href="/login" className="flex items-center gap-2 justify-center">
                <Briefcase className="w-5 h-5 text-indigo-400" />
                <span>Recruiter Access</span>
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
