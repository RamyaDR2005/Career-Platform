"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Quote, Star, Sparkles, ArrowRight, Pause, Play, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
  rating: number;
  metric: string;
  highlight: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Riya Sharma",
    role: "B.Tech CSE, 3rd Year",
    company: "Google Intern",
    content: "CareerAI gave me clarity like never before. Instead of randomly learning, I finally knew what I should focus on.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250",
    rating: 5,
    metric: "ATS 45 → 92 Score",
    highlight: "Landed Google Interview"
  },
  {
    id: 2,
    name: "Arjun Mehta",
    role: "BCA, Final Year",
    company: "Frontend Developer",
    content: "The roadmap is so well-structured. I got placed as a Frontend Developer intern in just 3 months!",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250",
    rating: 5,
    metric: "Direct Recruiter Hire",
    highlight: "Job offer within 14 days"
  },
  {
    id: 3,
    name: "Neha Verma",
    role: "B.Tech IT, 2nd Year",
    company: "AI Learning Track",
    content: "The AI coach is amazing! It feels like having a mentor who understands me and guides me at every step.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250",
    rating: 5,
    metric: "15hrs saved/week",
    highlight: "Top Recruiter Choice"
  },
  {
    id: 4,
    name: "Sarah Jenkins",
    role: "Software Engineer",
    company: "Meta",
    content: "The real-time feedback on resume bullet points gave me actionable metrics I never thought to include.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250",
    rating: 5,
    metric: "3.5x Interview Rate",
    highlight: "Offer accepted at Meta"
  },
  {
    id: 5,
    name: "Vikram Malhotra",
    role: "M.Tech AI, Final Year",
    company: "Amazon ML Engineer",
    content: "The skill gap analysis accurately spotted my weak points in System Design. Highly recommended!",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
    rating: 5,
    metric: "Targeted Gap Closure",
    highlight: "SDE II at Amazon"
  }
];

// Duplicate array for seamless infinite auto-scrolling horizontal marquee
const extendedTestimonials = [...testimonials, ...testimonials, ...testimonials];

export default function TestimonialsSection() {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden bg-[#F7F1E7]">
      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        
        {/* Section Badge & Title */}
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F4D2C3]/60 border border-[#C95A2E]/20 text-[#C95A2E] text-xs font-bold uppercase tracking-wider mb-4 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 fill-[#C95A2E]" />
            <span>WHAT STUDENTS SAY</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#1C211D] mb-4"
          >
            Loved by candidates. <br />
            <span className="text-[#C95A2E]">Trusted by top recruiters.</span>
          </motion.h2>
        </div>

        {/* Auto-scrolling Horizontal Testimonials Carousel with Side-by-Side Cards */}
        <div 
          className="relative w-full overflow-hidden py-4"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Subtle Side Fade Overlays */}
          <div className="absolute top-0 left-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-[#F7F1E7] to-transparent z-20 pointer-events-none" />
          <div className="absolute top-0 right-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-[#F7F1E7] to-transparent z-20 pointer-events-none" />

          {/* Marquee Track */}
          <motion.div
            className="flex gap-6 w-max"
            animate={{ x: isPaused ? undefined : ["0%", "-33.333%"] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 30,
                ease: "linear"
              }
            }}
          >
            {extendedTestimonials.map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                className="w-[300px] sm:w-[360px] shrink-0 bg-[#FFF9F2] border border-[#DED3C5] rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-[#C95A2E]/40 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Quote className="w-8 h-8 text-[#C95A2E]/30" />
                    <div className="flex items-center gap-1">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#E5A84B] text-[#E5A84B]" />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[#1C211D] leading-relaxed font-normal italic mb-6">
                    "{item.content}"
                  </p>
                </div>

                <div>
                  <div className="mb-4 inline-block px-3 py-1 rounded-full text-[10px] font-bold bg-[#F4D2C3]/60 text-[#C95A2E] border border-[#C95A2E]/20">
                    {item.metric}
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-[#DED3C5]/60">
                    <img 
                      src={item.avatar} 
                      alt={item.name} 
                      className="w-10 h-10 rounded-full object-cover border border-[#DED3C5]"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-[#1C211D]">{item.name}</h4>
                      <p className="text-[10px] font-medium text-[#706B63]">{item.role} • <span className="text-[#C95A2E]">{item.company}</span></p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Section Below Testimonials: Standalone "Your Future Doesn't Need Guesswork" Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-16 bg-gradient-to-br from-[#C95A2E] via-[#BA4F26] to-[#A94724] text-foreground rounded-3xl p-8 sm:p-12 shadow-[0_15px_35px_rgba(201,90,46,0.3)] flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden max-w-7xl mx-auto"
        >
          {/* Subtle Light Ring Graphics */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl text-center md:text-left">
            <h3 className="text-2xl sm:text-4xl font-extrabold mb-3 leading-tight">
              Your Future Doesn't Need Guesswork.
            </h3>
            <p className="text-foreground/90 text-sm sm:text-base font-normal leading-relaxed">
              Discover your direction. Build your roadmap. Start moving forward.
            </p>
          </div>

          <Button asChild size="lg" className="relative z-10 h-14 px-8 rounded-full bg-[#173D2A] hover:bg-[#1C211D] text-foreground font-bold text-sm sm:text-base shadow-lg transition-all group shrink-0 w-full sm:w-auto">
            <Link href="/register" className="flex items-center justify-center gap-2">
              <span>Start Your Career Journey</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>

      </div>
    </section>
  );
}
