"use client";

import { motion } from "framer-motion";
import { Brain, FileCheck, Map, UserCheck, ShieldCheck } from "lucide-react";

const capabilities = [
  {
    icon: <Brain className="w-6 h-6 text-blue-400" />,
    title: "IBM watsonx AI Engine",
    description: "Intelligent resume parsing and career evaluation powered by IBM Granite AI models."
  },
  {
    icon: <FileCheck className="w-6 h-6 text-indigo-400" />,
    title: "ATS Format Evaluation",
    description: "Benchmark structural formatting, keyword density, and bullet impact against industry standards."
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-cyan-400" />,
    title: "Skill Gap Detection",
    description: "Compare student profiles directly against target role requirements to highlight missing technical skills."
  },
  {
    icon: <Map className="w-6 h-6 text-purple-400" />,
    title: "Learning Roadmaps",
    description: "Generate structured, step-by-step learning paths to bridge preparation gaps for dream tech roles."
  },
  {
    icon: <UserCheck className="w-6 h-6 text-emerald-400" />,
    title: "Verified Candidate Profiles",
    description: "Enable placement officers and recruiters to search candidate pipelines backed by AI readiness scores."
  }
];

export default function StatsSection() {
  return (
    <section className="py-20 relative overflow-hidden bg-[#030409]">
      {/* Top and Bottom subtle borders */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[250px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-14">
          <p className="text-xs uppercase tracking-widest text-blue-400 font-semibold mb-3">
            Core Platform Architecture
          </p>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Powered by Enterprise AI Capabilities
          </h2>
        </div>

        {/* Capabilities Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((cap, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className={`bg-zinc-900/60 border border-white/10 rounded-2xl p-6 backdrop-blur-xl hover:border-blue-500/30 transition-all duration-300 group ${
                index === 4 ? "sm:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-zinc-800/80 border border-white/10 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                {cap.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{cap.title}</h3>
              <p className="text-sm text-zinc-400 font-light leading-relaxed">
                {cap.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
