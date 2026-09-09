"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Shield, 
  Search, 
  Sparkles, 
  ArrowRight, 
  Code, 
  Database, 
  Layers, 
  Briefcase, 
  Trophy,
  Flag
} from "lucide-react";

const roadmapNodes = [
  {
    step: "START",
    icon: <Flag className="w-4 h-4 text-white" />,
    title: "Learn Java",
    time: "2-3 weeks",
    isStart: true
  },
  {
    step: "01",
    icon: <Code className="w-4 h-4 text-[#C95A2E]" />,
    title: "Build REST APIs",
    time: "3-4 weeks"
  },
  {
    step: "02",
    icon: <Database className="w-4 h-4 text-[#C95A2E]" />,
    title: "Learn Spring Boot",
    time: "3-4 weeks"
  },
  {
    step: "03",
    icon: <Layers className="w-4 h-4 text-[#C95A2E]" />,
    title: "Build 2 Projects",
    time: "4-6 weeks"
  },
  {
    step: "04",
    icon: <Briefcase className="w-4 h-4 text-[#C95A2E]" />,
    title: "Internship",
    time: "8-12 weeks"
  },
  {
    step: "GOAL",
    icon: <Trophy className="w-5 h-5 text-[#E5A84B]" />,
    title: "Full Stack Developer",
    isGoal: true
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative overflow-hidden bg-[#F7F1E7]">
      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        
        {/* Core Feature Highlights Cards */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F4D2C3]/60 border border-[#C95A2E]/20 text-[#C95A2E] text-xs font-bold uppercase tracking-wider mb-4 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 fill-[#C95A2E]" />
            <span>Built for the Future</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-[#1C211D]"
          >
            Everything you need to get hired
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {/* Feature 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            className="group relative rounded-3xl bg-[#FFF9F2] border border-[#DED3C5] p-8 shadow-sm hover:shadow-md hover:border-[#C95A2E]/40 transition-all duration-300"
          >
            <div className="w-13 h-13 bg-[#F4D2C3]/70 border border-[#C95A2E]/30 rounded-2xl flex items-center justify-center mb-6 text-[#C95A2E] group-hover:scale-105 transition-transform shadow-xs">
              <Brain className="w-6 h-6 text-[#C95A2E]" />
            </div>
            <h3 className="text-xl font-bold text-[#1C211D] mb-3">AI Resume Analyzer</h3>
            <p className="text-[#706B63] text-sm leading-relaxed font-normal">
              Get instant feedback on your resume formatting, grammar, and missing industry keywords powered by IBM Watsonx.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -4 }}
            className="group relative rounded-3xl bg-[#FFF9F2] border border-[#DED3C5] p-8 shadow-sm hover:shadow-md hover:border-[#C95A2E]/40 transition-all duration-300"
          >
            <div className="w-13 h-13 bg-[#F4D2C3]/70 border border-[#C95A2E]/30 rounded-2xl flex items-center justify-center mb-6 text-[#C95A2E] group-hover:scale-105 transition-transform shadow-xs">
              <Shield className="w-6 h-6 text-[#C95A2E]" />
            </div>
            <h3 className="text-xl font-bold text-[#1C211D] mb-3">ATS Scoring System</h3>
            <p className="text-[#706B63] text-sm leading-relaxed font-normal">
              Know exactly how your profile ranks against Applicant Tracking Systems before you even hit apply.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -4 }}
            className="group relative rounded-3xl bg-[#FFF9F2] border border-[#DED3C5] p-8 shadow-sm hover:shadow-md hover:border-[#C95A2E]/40 transition-all duration-300"
          >
            <div className="w-13 h-13 bg-[#F4D2C3]/70 border border-[#C95A2E]/30 rounded-2xl flex items-center justify-center mb-6 text-[#C95A2E] group-hover:scale-105 transition-transform shadow-xs">
              <Search className="w-6 h-6 text-[#C95A2E]" />
            </div>
            <h3 className="text-xl font-bold text-[#1C211D] mb-3">Smart Job Matching</h3>
            <p className="text-[#706B63] text-sm leading-relaxed font-normal">
              Recruiters can filter through candidates effortlessly based on verified AI scores and skill gap analyses.
            </p>
          </motion.div>
        </div>


        {/* Signature Forest Green Roadmap Section (Matching Reference Image) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl bg-[#173D2A] p-8 sm:p-14 shadow-[0_20px_50px_rgba(23,61,42,0.3)] border border-[#78957F]/30 overflow-hidden text-white"
        >
          {/* Subtle Ambient Background Lighting inside Forest Green Container */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#78957F]/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#C95A2E]/15 rounded-full blur-[120px] pointer-events-none" />

          {/* Section Header inside Green Container */}
          <div className="grid lg:grid-cols-12 gap-8 items-end mb-16 relative z-10">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#78957F]/25 border border-[#78957F]/40 text-[#F4D2C3] text-xs font-bold uppercase tracking-wider mb-4">
                <Sparkles className="w-3.5 h-3.5 fill-[#F4D2C3]" />
                <span>YOUR PERSONALIZED ROADMAP</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
                See Where Your Skills Can <br className="hidden sm:inline" />
                <span className="text-[#E5A84B]">Take You.</span>
              </h2>
              <p className="text-[#F7F1E7]/80 text-base sm:text-lg max-w-xl font-normal">
                A clear path with the right skills, projects and milestones to reach your dream career.
              </p>
            </div>

            <div className="lg:col-span-4 flex lg:justify-end">
              <Button asChild size="lg" className="h-13 px-7 rounded-full bg-[#C95A2E] hover:bg-[#A94724] text-white font-bold text-sm shadow-[0_6px_20px_rgba(201,90,46,0.4)] transition-all duration-300 group">
                <Link href="/register" className="flex items-center gap-2">
                  <span>Explore Roadmap</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Interactive Dotted Timeline Visual Map */}
          <div className="relative z-10 pt-6">
            
            {/* Connecting Dashed Dotted Line (Desktop) */}
            <div className="hidden xl:block absolute top-[52px] left-10 right-10 h-0.5 border-t-2 border-dashed border-[#78957F]/60 -z-0" />

            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4 relative z-10">
              {roadmapNodes.map((node, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className={`flex flex-col items-center text-center ${
                    node.isGoal ? "col-span-2 sm:col-span-1 xl:col-span-1" : ""
                  }`}
                >
                  {/* Node Circle Badge */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 shadow-md transition-transform hover:scale-110 ${
                    node.isStart 
                      ? "bg-[#C95A2E] text-white ring-4 ring-[#C95A2E]/30" 
                      : node.isGoal 
                      ? "bg-[#FFF9F2] text-[#1C211D] ring-4 ring-[#E5A84B]/50" 
                      : "bg-[#FFF9F2] text-[#1C211D] border-2 border-[#78957F]/40"
                  }`}>
                    {node.icon}
                  </div>

                  {/* Node Card - Fixed Height & Unified Alignment */}
                  <div className={`w-full h-24 p-3 rounded-2xl border text-center flex flex-col items-center justify-center transition-all ${
                    node.isGoal
                      ? "bg-[#FFF9F2] border-[#E5A84B] shadow-lg text-[#1C211D]"
                      : node.isStart
                      ? "bg-[#FFF9F2] border-[#C95A2E] text-[#1C211D]"
                      : "bg-[#FFF9F2]/95 border-[#DED3C5] text-[#1C211D]"
                  }`}>
                    {/* Top Badge Slot (Uniform h-5 across all cards) */}
                    <div className="h-5 mb-1 flex items-center justify-center shrink-0">
                      {node.isStart ? (
                        <span className="text-[9px] font-extrabold uppercase bg-[#C95A2E] text-white px-2 py-0.5 rounded-full">
                          START
                        </span>
                      ) : node.isGoal ? (
                        <span className="text-[9px] font-extrabold uppercase bg-[#E5A84B] text-[#1C211D] px-2 py-0.5 rounded-full">
                          GOAL
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold uppercase text-[#706B63]/70 bg-[#F4D2C3]/40 px-2 py-0.5 rounded-full">
                          STEP {node.step}
                        </span>
                      )}
                    </div>

                    {/* Node Title */}
                    <h4 className="text-xs font-bold text-[#1C211D] truncate max-w-full px-1">{node.title}</h4>

                    {/* Node Time / Subtitle */}
                    <p className="text-[10px] font-medium text-[#706B63] mt-0.5">
                      {node.time || "Milestone"}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>

        </motion.div>

      </div>
    </section>
  );
}
