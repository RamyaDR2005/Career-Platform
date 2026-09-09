"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Brain, 
  Sparkles, 
  Target, 
  Heart, 
  Briefcase, 
  TrendingUp, 
  Users, 
  Award,
  ChevronRight,
  Star,
  Play
} from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-24 overflow-hidden min-h-[92vh] flex items-center bg-[#F7F1E7]">
      {/* Background Soft Glows */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] right-[25%] w-[550px] h-[550px] bg-[#F4D2C3]/50 rounded-full blur-[130px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[10%] left-[10%] w-[600px] h-[600px] bg-[#E5A84B]/20 rounded-full blur-[150px]"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Text & CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-6 text-left"
          >
            {/* Pill Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F4D2C3]/60 border border-[#C95A2E]/30 text-[#C95A2E] text-xs font-bold tracking-wide uppercase mb-6 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 fill-[#C95A2E]" />
              <span>AI CAREER INTELLIGENCE AGENT</span>
            </motion.div>
            
            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1] text-[#1C211D]">
              Your Career. <br />
              Your Future. <br />
              <span className="text-[#C95A2E]">
                Intelligently Guided.
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#706B63] mb-10 leading-relaxed font-normal max-w-xl">
              Discover the right career path, bridge your skill gaps, and get a personalized roadmap with the power of AI. Upload your resume to benchmark against ATS standards and connect with top recruiters.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Button asChild size="lg" className="h-14 px-8 rounded-full bg-[#C95A2E] hover:bg-[#A94724] text-foreground font-bold text-base shadow-[0_8px_25px_rgba(201,90,46,0.35)] hover:shadow-[0_10px_30px_rgba(201,90,46,0.5)] hover:-translate-y-0.5 transition-all duration-300 group">
                <Link href="/register" className="flex items-center gap-2">
                  <span>Start Your Career Journey</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>

              <Button asChild size="lg" variant="outline" className="h-14 px-8 rounded-full bg-[#FFF9F2] border-[#DED3C5] hover:border-[#C95A2E]/40 text-[#1C211D] font-semibold text-base shadow-sm hover:bg-[#F4D2C3]/30 transition-all duration-300">
                <Link href="#how-it-works" className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#F4D2C3] flex items-center justify-center text-[#C95A2E]">
                    <Play className="w-3 h-3 fill-[#C95A2E] ml-0.5" />
                  </div>
                  <span>See How It Works</span>
                </Link>
              </Button>
            </div>
            
            {/* User Trust & Social Proof */}
            <div className="flex items-center gap-4 text-xs text-[#706B63]">
              <div className="flex -space-x-2.5">
                {[
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120",
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120",
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120",
                  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120"
                ].map((src, i) => (
                  <div key={i} className="w-9 h-9 rounded-full bg-[#FFF9F2] border-2 border-[#F7F1E7] overflow-hidden shadow-sm">
                    <img src={src} alt="user" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 mb-0.5">
                  {[1,2,3,4,5].map(star => (
                    <Star key={star} className="w-3.5 h-3.5 fill-[#E5A84B] text-[#E5A84B]" />
                  ))}
                </div>
                <p className="font-medium text-[#1C211D]">
                  Trusted by <span className="font-bold text-[#C95A2E]">25,000+</span> students and professionals worldwide
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Reference Visual Artwork Node Map & Top Matches Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-6 flex flex-col xl:flex-row items-center justify-center gap-6 relative min-h-[500px]"
          >
            {/* Outer Subtle Radiant Glow */}
            <div className="absolute w-[440px] h-[440px] rounded-full bg-gradient-to-tr from-[#F4D2C3] via-[#FFF9F2] to-[#E5A84B]/20 blur-3xl pointer-events-none -z-10" />

            {/* Orbital Node Diagram Container */}
            <div className="relative w-full max-w-[380px] sm:max-w-[420px] h-[420px] flex items-center justify-center shrink-0">
              
              {/* Connecting Dashed Dotted Orbital Rings */}
              <div className="absolute w-[280px] h-[280px] sm:w-[310px] sm:h-[310px] rounded-full border-2 border-dashed border-[#C95A2E]/20 animate-[spin_60s_linear_infinite]" />
              <div className="absolute w-[360px] h-[360px] sm:w-[390px] sm:h-[390px] rounded-full border border-dashed border-[#78957F]/30" />

              {/* Central AI Mascot Agent Card */}
              <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-20 w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#FFF9F2] border-4 border-[#F4D2C3] shadow-[0_15px_45px_rgba(201,90,46,0.2)] flex flex-col items-center justify-center p-2 text-center group cursor-pointer"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#C95A2E] flex items-center justify-center mb-1 shadow-md group-hover:scale-110 transition-transform">
                  <Brain className="w-6 h-6 sm:w-7 sm:h-7 text-foreground" />
                </div>
                <span className="text-[11px] font-bold text-[#1C211D] leading-tight">CareerAI Bot</span>
              </motion.div>

              {/* Node 1: Top (Your Skills) */}
              <motion.div 
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                className="absolute top-1 flex flex-col items-center gap-1 z-20"
              >
                <div className="w-10 h-10 rounded-full bg-[#173D2A] text-foreground flex items-center justify-center shadow-lg border-2 border-[#FFF9F2]">
                  <Award className="w-5 h-5 text-[#E5A84B]" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#FFF9F2] border border-[#DED3C5] text-[#1C211D] text-[11px] font-bold shadow-sm">
                  Your Skills
                </span>
              </motion.div>

              {/* Node 2: Top Left (Interests) */}
              <motion.div 
                animate={{ x: [0, -5, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, delay: 1 }}
                className="absolute top-[22%] left-1 flex flex-col items-center gap-1 z-20"
              >
                <div className="w-9 h-9 rounded-full bg-[#C95A2E] text-foreground flex items-center justify-center shadow-md border-2 border-[#FFF9F2]">
                  <Heart className="w-4.5 h-4.5 fill-white" />
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#FFF9F2] border border-[#DED3C5] text-[#1C211D] text-[10px] font-semibold shadow-sm">
                  Interests
                </span>
              </motion.div>

              {/* Node 3: Top Right (Career Goals) */}
              <motion.div 
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 4.2, repeat: Infinity, delay: 1.2 }}
                className="absolute top-[22%] right-1 flex flex-col items-center gap-1 z-20"
              >
                <div className="w-9 h-9 rounded-full bg-[#C95A2E] text-foreground flex items-center justify-center shadow-md border-2 border-[#FFF9F2]">
                  <Target className="w-4.5 h-4.5 text-foreground" />
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#FFF9F2] border border-[#DED3C5] text-[#1C211D] text-[10px] font-semibold shadow-sm">
                  Career Goals
                </span>
              </motion.div>

              {/* Node 4: Bottom Left (Experience) */}
              <motion.div 
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 5.2, repeat: Infinity, delay: 0.8 }}
                className="absolute bottom-[22%] left-1 flex flex-col items-center gap-1 z-20"
              >
                <div className="w-9 h-9 rounded-full bg-[#173D2A] text-foreground flex items-center justify-center shadow-md border-2 border-[#FFF9F2]">
                  <Briefcase className="w-4.5 h-4.5 text-[#F4D2C3]" />
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#FFF9F2] border border-[#DED3C5] text-[#1C211D] text-[10px] font-semibold shadow-sm">
                  Experience
                </span>
              </motion.div>

              {/* Node 5: Bottom Center (Market Demand) */}
              <motion.div 
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 4.8, repeat: Infinity, delay: 1.5 }}
                className="absolute bottom-1 flex flex-col items-center gap-1 z-20"
              >
                <div className="w-9 h-9 rounded-full bg-[#E5A84B] text-foreground flex items-center justify-center shadow-md border-2 border-[#FFF9F2]">
                  <TrendingUp className="w-4.5 h-4.5 text-[#1C211D]" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#FFF9F2] border border-[#DED3C5] text-[#1C211D] text-[10px] font-semibold shadow-sm">
                  Market Demand
                </span>
              </motion.div>

              {/* Node 6: Bottom Right (Opportunities) */}
              <motion.div 
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, delay: 0.3 }}
                className="absolute bottom-[22%] right-1 flex flex-col items-center gap-1 z-20"
              >
                <div className="w-9 h-9 rounded-full bg-[#173D2A] text-foreground flex items-center justify-center shadow-md border-2 border-[#FFF9F2]">
                  <Users className="w-4.5 h-4.5 text-[#78957F]" />
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#FFF9F2] border border-[#DED3C5] text-[#1C211D] text-[10px] font-semibold shadow-sm">
                  Opportunities
                </span>
              </motion.div>
            </div>

            {/* Side Card: "Top Career Matches" (Positioned Aside Without Overlapping) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="w-64 sm:w-72 bg-[#FFF9F2]/95 border border-[#DED3C5] rounded-2xl p-4.5 shadow-[0_15px_35px_rgba(28,33,29,0.08)] backdrop-blur-md z-30 shrink-0"
            >
              <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-[#DED3C5]/60">
                <span className="text-xs font-bold text-[#1C211D] tracking-tight">Top Career Matches</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#F4D2C3] text-[#C95A2E]">
                  AI Verified
                </span>
              </div>
              
              <div className="space-y-3">
                {/* Match 1 */}
                <div>
                  <div className="flex justify-between items-center text-[11px] font-bold mb-1 text-[#1C211D]">
                    <span>Full Stack Developer</span>
                    <span className="text-[#C95A2E]">92% Match</span>
                  </div>
                  <div className="h-2 bg-[#F4D2C3]/50 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "92%" }}
                      transition={{ duration: 1.5, delay: 0.8 }}
                      className="h-full bg-[#C95A2E] rounded-full"
                    />
                  </div>
                </div>

                {/* Match 2 */}
                <div>
                  <div className="flex justify-between items-center text-[11px] font-bold mb-1 text-[#1C211D]">
                    <span>AI/ML Engineer</span>
                    <span className="text-[#E5A84B]">85% Match</span>
                  </div>
                  <div className="h-2 bg-[#F4D2C3]/50 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "85%" }}
                      transition={{ duration: 1.5, delay: 1 }}
                      className="h-full bg-[#E5A84B] rounded-full"
                    />
                  </div>
                </div>

                {/* Match 3 */}
                <div>
                  <div className="flex justify-between items-center text-[11px] font-bold mb-1 text-[#1C211D]">
                    <span>Product Designer</span>
                    <span className="text-[#78957F]">78% Match</span>
                  </div>
                  <div className="h-2 bg-[#F4D2C3]/50 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "78%" }}
                      transition={{ duration: 1.5, delay: 1.2 }}
                      className="h-full bg-[#78957F] rounded-full"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-3.5 pt-2 border-t border-[#DED3C5]/60 flex items-center justify-between">
                <Link href="/register" className="text-[11px] font-bold text-[#C95A2E] hover:text-[#A94724] flex items-center gap-1 transition-colors">
                  <span>View All Careers</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
