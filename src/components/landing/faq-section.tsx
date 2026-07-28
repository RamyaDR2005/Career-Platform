"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, Sparkles, MessageSquare, ArrowRight, UserCheck, Briefcase, Cpu } from "lucide-react";
import Link from "next/link";

interface FaqItem {
  id: string;
  category: "Students" | "Recruiters" | "AI & Tech";
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    id: "faq-1",
    category: "AI & Tech",
    question: "How does the AI ATS Resume Analyzer evaluate my resume?",
    answer: "Our AI engine parses your resume using natural language processing (NLP) to benchmark it against thousands of real tech job descriptions. It analyzes target keyword density, bullet point impact metrics, skill alignment, and structural formatting to produce a comprehensive ATS score (0–100%) alongside actionable improvement suggestions."
  },
  {
    id: "faq-2",
    category: "Students",
    question: "Is CareerAI completely free for students and job seekers?",
    answer: "Yes! Students and job seekers get 100% free access to core platform capabilities, including unlimited resume parsing, ATS scoring, AI-generated skill gap analysis, and personalized learning roadmaps to jumpstart their tech careers."
  },
  {
    id: "faq-3",
    category: "Students",
    question: "How does the personalized learning roadmap work?",
    answer: "Once the AI identifies missing skills between your current profile and your desired role (e.g., React, Next.js, System Design), it automatically generates a step-by-step learning path complete with recommended courses, project ideas, and skill verification milestones."
  },
  {
    id: "faq-4",
    category: "Recruiters",
    question: "How do recruiters search and verify candidate talent?",
    answer: "Recruiters access a centralized candidate intelligence engine where they can filter profiles by verified ATS match score, proven skill badges, target roles, and location. Candidates' qualifications are AI-verified before appearing in recruiter pipelines."
  },
  {
    id: "faq-5",
    category: "AI & Tech",
    question: "Can I connect my GitHub and LinkedIn profiles?",
    answer: "Absolutely. Connecting your GitHub repository and LinkedIn profile allows our AI engine to evaluate actual codebase contributions, project complexity, and professional endorsements—giving recruiters a complete 360° view of your capabilities."
  },
  {
    id: "faq-6",
    category: "AI & Tech",
    question: "How secure is my resume data and personal information?",
    answer: "We treat data privacy with extreme seriousness. All uploaded resumes and personal details are encrypted at rest and in transit using enterprise-grade SSL/TLS protocols. We never sell your data to third parties, and your profile is only visible to verified recruiters on our platform."
  }
];

const categories = ["All", "Students", "Recruiters", "AI & Tech"] as const;

export default function FaqSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [openFaqId, setOpenFaqId] = useState<string | null>("faq-1");

  const filteredFaqs = selectedCategory === "All"
    ? faqs
    : faqs.filter(faq => faq.category === selectedCategory);

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <section id="faq" className="py-28 relative overflow-hidden bg-[#030409]">
      {/* Ambient background lighting */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[300px] bg-blue-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[450px] h-[280px] bg-indigo-600/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 max-w-5xl">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4"
          >
            Frequently Asked <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">Questions</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 text-base sm:text-lg"
          >
            Everything you need to know about ATS scoring, skill roadmaps, and recruiter connections.
          </motion.p>
        </div>

        {/* Category Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-3 mb-12"
        >
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`relative px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 flex items-center gap-2 ${
                  isActive
                    ? "text-white bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                    : "text-zinc-400 bg-zinc-900/60 border border-white/5 hover:text-white hover:bg-zinc-800/80"
                }`}
              >
                {cat === "Students" && <UserCheck className="w-3.5 h-3.5" />}
                {cat === "Recruiters" && <Briefcase className="w-3.5 h-3.5" />}
                {cat === "AI & Tech" && <Cpu className="w-3.5 h-3.5" />}
                <span>{cat}</span>
              </button>
            );
          })}
        </motion.div>

        {/* FAQ Accordion List */}
        <div className="space-y-4 max-w-3xl mx-auto">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openFaqId === faq.id;

            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 border-blue-500/30 shadow-[0_10px_30px_rgba(0,0,0,0.5),0_0_20px_rgba(59,130,246,0.1)]"
                    : "bg-zinc-900/40 border-white/5 hover:border-white/10 hover:bg-zinc-900/60"
                }`}
              >
                {/* FAQ Header / Question */}
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full text-left p-6 flex items-center justify-between gap-4 cursor-pointer focus:outline-none group"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      isOpen ? "bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" : "bg-zinc-600 group-hover:bg-zinc-400"
                    }`} />
                    <h3 className={`text-base sm:text-lg font-semibold transition-colors duration-200 ${
                      isOpen ? "text-white" : "text-zinc-200 group-hover:text-white"
                    }`}>
                      {faq.question}
                    </h3>
                  </div>

                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 shrink-0 ${
                    isOpen
                      ? "bg-blue-600/20 border-blue-500/40 text-blue-400 rotate-180"
                      : "bg-zinc-800/50 border-white/5 text-zinc-400 group-hover:text-white group-hover:bg-zinc-800"
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {/* Animated Collapsible Answer */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="px-6 pb-6 pt-1 text-zinc-400 text-sm sm:text-base leading-relaxed border-t border-white/5 font-light">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Bottom Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16 bg-gradient-to-r from-blue-900/30 via-indigo-900/30 to-purple-900/30 border border-blue-500/20 rounded-3xl p-8 sm:p-10 text-center relative overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.6)]"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
              <MessageSquare className="w-6 h-6" />
            </div>
            
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Still have questions?
            </h3>
            <p className="text-zinc-400 text-sm sm:text-base mb-6">
              Our AI Career Assistant is available 24/7 to analyze your resume and answer any career queries.
            </p>

            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-[0_4px_20px_rgba(37,99,235,0.4)] hover:shadow-[0_4px_25px_rgba(37,99,235,0.6)] hover:-translate-y-0.5 transition-all duration-300 group"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
