"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, UserCheck, Briefcase } from "lucide-react";

export default function CtaSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-[#F7F1E7]">
      <div className="container mx-auto px-6 relative z-10 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl bg-[#FFF9F2] border border-[#DED3C5] p-10 sm:p-16 text-center shadow-[0_15px_40px_rgba(28,33,29,0.06)] overflow-hidden"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F4D2C3]/60 border border-[#C95A2E]/20 text-[#C95A2E] text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 fill-[#C95A2E]" />
            <span>Accelerate Your Career Today</span>
          </div>

          {/* Title */}
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1C211D] mb-6 leading-tight">
            Ready to unlock your <br className="hidden sm:inline" />
            <span className="text-[#C95A2E]">
              AI-driven career potential?
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-[#706B63] text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Join thousands of engineering students optimizing their resumes, closing skill gaps, and connecting with top recruiters through IBM watsonx AI intelligence.
          </p>

          {/* Dual Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="h-14 px-8 rounded-full bg-[#C95A2E] hover:bg-[#A94724] text-white font-bold text-base shadow-[0_6px_20px_rgba(201,90,46,0.35)] hover:-translate-y-0.5 transition-all duration-300 group w-full sm:w-auto"
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
              className="h-14 px-8 rounded-full bg-[#F7F1E7] border-[#DED3C5] hover:border-[#C95A2E]/40 text-[#1C211D] font-semibold text-base hover:bg-[#FFF9F2] transition-all duration-300 w-full sm:w-auto"
            >
              <Link href="/login" className="flex items-center gap-2 justify-center">
                <Briefcase className="w-5 h-5 text-[#C95A2E]" />
                <span>Recruiter Access</span>
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
