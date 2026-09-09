"use client";

import { motion } from "framer-motion";
import { Brain, FileCheck, Map, UserCheck, ShieldCheck, Sparkles } from "lucide-react";

const capabilities = [
  {
    icon: <Brain className="w-6 h-6 text-[#C95A2E]" />,
    title: "AI Career Discovery",
    subTitle: "IBM watsonx AI Engine",
    description: "Intelligent resume parsing and career evaluation powered by IBM Granite AI models."
  },
  {
    icon: <FileCheck className="w-6 h-6 text-[#C95A2E]" />,
    title: "Skill Gap Analysis",
    subTitle: "ATS Format Evaluation",
    description: "Benchmark structural formatting, keyword density, and bullet impact against industry standards."
  },
  {
    icon: <Map className="w-6 h-6 text-[#C95A2E]" />,
    title: "Personalized Roadmap",
    subTitle: "Learning Roadmaps",
    description: "Generate structured, step-by-step learning paths to bridge preparation gaps for dream tech roles."
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-[#C95A2E]" />,
    title: "Job & Internship Match",
    subTitle: "Skill Gap Detection",
    description: "Compare student profiles directly against target role requirements to highlight missing technical skills."
  },
  {
    icon: <UserCheck className="w-6 h-6 text-[#C95A2E]" />,
    title: "AI Career Coach",
    subTitle: "Verified Candidate Profiles",
    description: "Enable placement officers and recruiters to search candidate pipelines backed by AI readiness scores."
  }
];

export default function StatsSection() {
  return (
    <section className="py-20 relative overflow-hidden bg-[#F7F1E7]">
      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        
        {/* Section Badge & Header */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F4D2C3]/60 border border-[#C95A2E]/20 text-[#C95A2E] text-xs font-bold uppercase tracking-wider mb-3 shadow-sm"
          >
            <Sparkles className="w-3 h-3 fill-[#C95A2E]" />
            <span>POWERFUL AI FEATURES</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold text-[#1C211D] tracking-tight"
          >
            Powered by Enterprise AI Capabilities
          </motion.h2>
        </div>

        {/* 5 Cards Grid Matching Image */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {capabilities.map((cap, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="bg-[#FFF9F2] border border-[#DED3C5] rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#C95A2E]/40 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                {/* Soft Peach Icon Container */}
                <div className="w-12 h-12 rounded-xl bg-[#F4D2C3]/70 border border-[#C95A2E]/20 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shadow-xs">
                  {cap.icon}
                </div>

                <h3 className="text-base font-bold text-[#1C211D] mb-1 leading-snug">
                  {cap.title}
                </h3>
                <p className="text-xs font-semibold text-[#C95A2E] mb-3">
                  {cap.subTitle}
                </p>

                <p className="text-xs text-[#706B63] font-normal leading-relaxed">
                  {cap.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
