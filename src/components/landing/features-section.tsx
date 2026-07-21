"use client";

import { motion } from "framer-motion";
import { Brain, Shield, Search, Sparkles } from "lucide-react";

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative overflow-hidden bg-[#030409]">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4"
          >
            <Sparkles className="w-3 h-3" /> Built for the Future
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-extrabold tracking-tight mb-5 text-white"
          >
            Everything you need to get hired
          </motion.h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="group relative rounded-3xl bg-zinc-900 border border-white/5 p-8 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 border border-blue-500/20 text-blue-400">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">AI Resume Analyzer</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Get instant feedback on your resume formatting, grammar, and missing industry keywords powered by IBM Watsonx.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -5 }}
            className="group relative rounded-3xl bg-zinc-900 border border-white/5 p-8 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 border border-indigo-500/20 text-indigo-400">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">ATS Scoring System</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Know exactly how your profile ranks against Applicant Tracking Systems before you even hit apply.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -5 }}
            className="group relative rounded-3xl bg-zinc-900 border border-white/5 p-8 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-6 border border-cyan-500/20 text-cyan-400">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Smart Job Matching</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Recruiters can filter through candidates effortlessly based on verified AI scores and skill gap analyses.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
