"use client";

import { motion } from "framer-motion";
import { UploadCloud, Bot, Map, Users, Sparkles } from "lucide-react";

const steps = [
  {
    icon: <UploadCloud className="w-6 h-6 text-[#C95A2E]" />,
    title: "1. Upload Resume",
    subTitle: "Understand You",
    description: "Simply upload your current resume in PDF format. We handle the parsing and extraction automatically."
  },
  {
    icon: <Bot className="w-6 h-6 text-[#C95A2E]" />,
    title: "2. AI Analysis",
    subTitle: "Analyze Profile",
    description: "IBM Watsonx scans your profile against global ATS standards, checking formatting, grammar, and keywords."
  },
  {
    icon: <Map className="w-6 h-6 text-[#C95A2E]" />,
    title: "3. Get a Roadmap",
    subTitle: "Build Your Roadmap",
    description: "Receive a personalized, step-by-step learning roadmap to bridge any skill gaps for your dream job."
  },
  {
    icon: <Users className="w-6 h-6 text-[#C95A2E]" />,
    title: "4. Get Hired",
    subTitle: "Achieve Your Goals",
    description: "Top recruiters on our platform use AI matching to find your profile based on verified skills, not just buzzwords."
  }
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden bg-[#F7F1E7]">
      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        
        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F4D2C3]/60 border border-[#C95A2E]/20 text-[#C95A2E] text-xs font-bold uppercase tracking-wider mb-4 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 fill-[#C95A2E]" />
            <span>HOW IT WORKS</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-[#1C211D]"
          >
            From Confusion to <span className="text-[#C95A2E]">Career Clarity</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[#706B63] text-base md:text-lg"
          >
            A seamless pipeline from resume creation to your first day on the job.
          </motion.p>
        </div>

        {/* Original 4-Step Horizontal Pipeline Layout */}
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-10 right-10 h-0.5 border-t-2 border-dashed border-[#C95A2E]/30 -translate-y-1/2 z-0" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="bg-[#FFF9F2] border border-[#DED3C5] rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-[#C95A2E]/40 transition-all duration-300 relative z-10 flex flex-col justify-between group"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#F4D2C3]/70 border border-[#C95A2E]/30 flex items-center justify-center mb-5 shadow-xs group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#C95A2E] bg-[#F4D2C3]/50 px-2.5 py-0.5 rounded-full inline-block mb-2">
                  {step.subTitle}
                </span>
                <h3 className="text-lg font-bold text-[#1C211D] mb-3">{step.title}</h3>
                <p className="text-xs text-[#706B63] leading-relaxed font-normal">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
