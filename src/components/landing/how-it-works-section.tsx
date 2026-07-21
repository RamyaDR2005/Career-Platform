"use client";

import { motion } from "framer-motion";
import { UploadCloud, Bot, Map, Users } from "lucide-react";

const steps = [
  {
    icon: <UploadCloud className="w-6 h-6 text-blue-400" />,
    title: "1. Upload Resume",
    description: "Simply upload your current resume in PDF format. We handle the parsing and extraction automatically."
  },
  {
    icon: <Bot className="w-6 h-6 text-purple-400" />,
    title: "2. AI Analysis",
    description: "IBM Watsonx scans your profile against global ATS standards, checking formatting, grammar, and keywords."
  },
  {
    icon: <Map className="w-6 h-6 text-emerald-400" />,
    title: "3. Get a Roadmap",
    description: "Receive a personalized, step-by-step learning roadmap to bridge any skill gaps for your dream job."
  },
  {
    icon: <Users className="w-6 h-6 text-orange-400" />,
    title: "4. Get Hired",
    description: "Top recruiters on our platform use AI matching to find your profile based on verified skills, not just buzzwords."
  }
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden bg-[#030409]">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-white"
          >
            How it works
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 text-lg max-w-2xl mx-auto"
          >
            A seamless pipeline from resume creation to your first day on the job.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-purple-500/0 -translate-y-1/2 z-0" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="relative z-10 flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 group-hover:border-blue-500/30 transition-all duration-300">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
