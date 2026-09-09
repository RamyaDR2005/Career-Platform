"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, 
  HelpCircle, 
  Sparkles, 
  UserCheck, 
  Briefcase, 
  Cpu, 
  Brain, 
  MessageSquare, 
  ArrowRight,
  Target,
  Award,
  FileCheck,
  TrendingUp,
  Zap
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
    <section className="py-24 relative overflow-hidden bg-[#F7F1E7]">
      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        
        {/* ========================================================================= */}
        {/* 2-COLUMN SPLIT SECTION (AI CAREER AGENT & CAREER INSIGHTS) */}
        {/* ========================================================================= */}
        <div className="grid lg:grid-cols-2 gap-8 mb-24">
          
          {/* LEFT BOX: AI CAREER AGENT */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#FFF9F2] border border-[#DED3C5] rounded-3xl p-8 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F4D2C3]/60 border border-[#C95A2E]/20 text-[#C95A2E] text-xs font-bold uppercase tracking-wider mb-4">
                <Sparkles className="w-3.5 h-3.5 fill-[#C95A2E]" />
                <span>AI CAREER AGENT</span>
              </div>
              
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1C211D] mb-6 tracking-tight">
                Have a Career Question? <br />
                <span className="text-[#C95A2E]">Just Ask.</span>
              </h3>

              {/* Mock Chat Conversation Container */}
              <div className="bg-[#F7F1E7] border border-[#DED3C5] rounded-2xl p-4.5 mb-6 space-y-3.5 shadow-inner">
                {/* User Prompt */}
                <div className="flex justify-end">
                  <div className="bg-[#FFF9F2] border border-[#DED3C5] text-[#1C211D] text-xs font-semibold px-4 py-2 rounded-2xl rounded-tr-none shadow-xs max-w-[85%]">
                    What career is best for me?
                  </div>
                </div>

                {/* AI Response Card */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#C95A2E] text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-sm">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-[#FFF9F2] border border-[#DED3C5] rounded-2xl rounded-tl-none p-3.5 text-xs text-[#1C211D] space-y-2 max-w-[90%] shadow-xs">
                    <p className="text-[11px] text-[#706B63] font-medium">
                      Based on your skills, interests and goals, here are your strongest matches:
                    </p>
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between items-center bg-[#F4D2C3]/40 px-2.5 py-1 rounded-lg">
                        <span className="font-bold text-[#1C211D]">92% Full Stack Developer</span>
                      </div>
                      <div className="flex justify-between items-center bg-[#F4D2C3]/30 px-2.5 py-1 rounded-lg">
                        <span className="font-semibold text-[#1C211D]">80% Backend Developer</span>
                      </div>
                      <div className="flex justify-between items-center bg-[#F4D2C3]/20 px-2.5 py-1 rounded-lg">
                        <span className="font-semibold text-[#706B63]">75% AI Engineer</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Try Asking Prompts */}
              <div className="space-y-2 mb-6">
                <p className="text-xs font-bold text-[#1C211D] uppercase tracking-wider">Try asking:</p>
                <ul className="text-xs text-[#706B63] space-y-1.5">
                  <li className="flex items-center gap-2">
                    <span className="text-[#C95A2E]">✦</span> What skills should I learn next?
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#C95A2E]">✦</span> Which career has the best fit for me?
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#C95A2E]">✦</span> How can I become an AI Engineer?
                  </li>
                </ul>
              </div>
            </div>

            <Button asChild size="lg" className="w-full h-12 rounded-full bg-[#C95A2E] hover:bg-[#A94724] text-white font-bold text-sm shadow-sm transition-all">
              <Link href="/register" className="flex items-center justify-center gap-2">
                <span>Talk to AI Agent</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>


          {/* RIGHT BOX: CAREER INSIGHTS */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-[#FFF9F2] border border-[#DED3C5] rounded-3xl p-8 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F4D2C3]/60 border border-[#C95A2E]/20 text-[#C95A2E] text-xs font-bold uppercase tracking-wider mb-4">
                <Sparkles className="w-3.5 h-3.5 fill-[#C95A2E]" />
                <span>CAREER INSIGHTS</span>
              </div>
              
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1C211D] mb-3 tracking-tight">
                Insights That Drive <br />
                <span className="text-[#C95A2E]">Better Decisions.</span>
              </h3>

              <p className="text-xs text-[#706B63] mb-6 leading-relaxed font-normal">
                Real-time profile evaluation and ATS benchmark analytics powered by enterprise AI intelligence.
              </p>

              {/* Clean Metric Cards List (Replacing broken circles & radar chart) */}
              <div className="space-y-3.5 mb-6">
                {/* Metric 1 */}
                <div className="bg-[#F7F1E7] border border-[#DED3C5] p-4 rounded-2xl">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-bold text-[#1C211D] flex items-center gap-2">
                      <Target className="w-4 h-4 text-[#C95A2E]" />
                      Career Match
                    </span>
                    <span className="text-xs font-extrabold text-[#C95A2E]">92%</span>
                  </div>
                  <div className="h-2 bg-[#F4D2C3]/50 rounded-full overflow-hidden mb-1">
                    <div className="h-full bg-[#C95A2E] rounded-full w-[92%]" />
                  </div>
                  <span className="text-[10px] text-[#706B63] font-medium">Top 5% candidate fit for Full Stack roles</span>
                </div>

                {/* Metric 2 */}
                <div className="bg-[#F7F1E7] border border-[#DED3C5] p-4 rounded-2xl">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-bold text-[#1C211D] flex items-center gap-2">
                      <Award className="w-4 h-4 text-[#E5A84B]" />
                      Skill Readiness
                    </span>
                    <span className="text-xs font-extrabold text-[#E5A84B]">78%</span>
                  </div>
                  <div className="h-2 bg-[#F4D2C3]/50 rounded-full overflow-hidden mb-1">
                    <div className="h-full bg-[#E5A84B] rounded-full w-[78%]" />
                  </div>
                  <span className="text-[10px] text-[#706B63] font-medium">8 of 10 core competencies verified</span>
                </div>

                {/* Metric 3 */}
                <div className="bg-[#F7F1E7] border border-[#DED3C5] p-4 rounded-2xl">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-bold text-[#1C211D] flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-[#173D2A]" />
                      Resume ATS Score
                    </span>
                    <span className="text-xs font-extrabold text-[#173D2A]">85%</span>
                  </div>
                  <div className="h-2 bg-[#F4D2C3]/50 rounded-full overflow-hidden mb-1">
                    <div className="h-full bg-[#173D2A] rounded-full w-[85%]" />
                  </div>
                  <span className="text-[10px] text-[#706B63] font-medium">Format & keyword density optimized</span>
                </div>

                {/* Metric 4 */}
                <div className="bg-[#F7F1E7] border border-[#DED3C5] p-4 rounded-2xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-[#1C211D] flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-[#C95A2E]" />
                      Skills to Improve
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#F4D2C3] text-[#C95A2E]">
                      6 Recommended
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FFF9F2] border border-[#DED3C5] text-[#1C211D]">Next.js</span>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FFF9F2] border border-[#DED3C5] text-[#1C211D]">Docker</span>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FFF9F2] border border-[#DED3C5] text-[#1C211D]">System Design</span>
                  </div>
                </div>
              </div>

            </div>

            <Button asChild size="lg" className="w-full h-12 rounded-full bg-[#173D2A] hover:bg-[#1C211D] text-white font-bold text-sm shadow-sm transition-all">
              <Link href="/register" className="flex items-center justify-center gap-2">
                <span>Explore Career Analytics</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>

        </div>


        {/* ========================================================================= */}
        {/* FAQ ACCORDION SECTION */}
        {/* ========================================================================= */}
        <div id="faq" className="max-w-4xl mx-auto pt-8 scroll-mt-28">
          
          {/* Section Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F4D2C3]/60 border border-[#C95A2E]/20 text-[#C95A2E] text-xs font-bold uppercase tracking-wider mb-4 shadow-sm"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Got Questions?</span>
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1C211D] mb-4"
            >
              Frequently Asked <span className="text-[#C95A2E]">Questions</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-[#706B63] text-base"
            >
              Everything you need to know about ATS scoring, skill roadmaps, and recruiter connections.
            </motion.p>
          </div>

          {/* Category Filters */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap items-center justify-center gap-2.5 mb-10"
          >
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4.5 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? "text-white bg-[#C95A2E] shadow-sm"
                      : "text-[#706B63] bg-[#FFF9F2] border border-[#DED3C5] hover:text-[#1C211D] hover:bg-[#F4D2C3]/30"
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
          <div className="space-y-3.5">
            {filteredFaqs.map((faq, index) => {
              const isOpen = openFaqId === faq.id;

              return (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 }}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? "bg-[#FFF9F2] border-[#C95A2E]/50 shadow-md"
                      : "bg-[#FFF9F2]/70 border-[#DED3C5] hover:border-[#C95A2E]/30"
                  }`}
                >
                  {/* FAQ Question Button */}
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full text-left p-5 flex items-center justify-between gap-4 cursor-pointer focus:outline-none group"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                        isOpen ? "bg-[#C95A2E]" : "bg-[#706B63] group-hover:bg-[#1C211D]"
                      }`} />
                      <h3 className={`text-base font-bold transition-colors duration-200 ${
                        isOpen ? "text-[#C95A2E]" : "text-[#1C211D]"
                      }`}>
                        {faq.question}
                      </h3>
                    </div>

                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 shrink-0 ${
                      isOpen
                        ? "bg-[#F4D2C3] border-[#C95A2E]/30 text-[#C95A2E] rotate-180"
                        : "bg-[#F7F1E7] border-[#DED3C5] text-[#706B63]"
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {/* Collapsible Answer */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                      >
                        <div className="px-5 pb-5 pt-1 text-[#706B63] text-sm leading-relaxed border-t border-[#DED3C5]/50 font-normal">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
