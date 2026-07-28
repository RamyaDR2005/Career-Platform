"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight, Star, Sparkles, CheckCircle2, Pause, Play } from "lucide-react";

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
    name: "Sarah Jenkins",
    role: "Software Engineer",
    company: "Google",
    content: "The ATS scoring was a complete eye-opener. I uploaded my old resume and scored a 45. After following the AI's step-by-step roadmap and fixing target keywords, my score jumped to 92. I received 3 interview calls in my very first week!",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250",
    rating: 5,
    metric: "ATS 45 → 92 Score",
    highlight: "Landed Google Interview"
  },
  {
    id: 2,
    name: "David Chen",
    role: "Data Analyst",
    company: "Spotify",
    content: "As a new grad, I struggled knowing which tech stack gaps were holding me back. The AI learning roadmap mapped out my exact path with verified skill badges. A recruiter noticed my profile here and reached out directly!",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250",
    rating: 5,
    metric: "Direct Recruiter Hire",
    highlight: "Job offer within 14 days"
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    role: "Technical Lead Recruiter",
    company: "Stripe",
    content: "This platform saves our talent acquisition team over 15 hours every week. We no longer guess candidate proficiency—the AI has verified ATS alignment and skill evidence upfront. It's transformed our hiring pipeline.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250",
    rating: 5,
    metric: "15hrs saved/week",
    highlight: "Top Recruiter Choice"
  },
  {
    id: 4,
    name: "Marcus Vance",
    role: "Full Stack Developer",
    company: "Meta",
    content: "The real-time feedback on resume bullet points gave me actionable metrics I never thought to include. The 3D skill analytics showed recruiters exactly what I could build before the initial phone screen.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250",
    rating: 5,
    metric: "3.5x Interview Rate",
    highlight: "Offer accepted at Meta"
  },
  {
    id: 5,
    name: "Aisha Patel",
    role: "AI Product Designer",
    company: "Airbnb",
    content: "CareerAI bridge the gap between design portfolios and automated ATS filters. I went from radio silence to having 4 tier-1 offers on the table. The interactive dashboard is second to none.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
    rating: 5,
    metric: "4 Tier-1 Offers",
    highlight: "100% Salary Increase"
  }
];

// Spring animation configuration for smooth 3D transitions
const springPhysics = {
  type: "spring" as const,
  stiffness: 260,
  damping: 24,
  mass: 0.9
};

// 3D Card Animation Variants
const cardVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 320 : -320,
    opacity: 0,
    rotateY: direction > 0 ? 35 : -35,
    scale: 0.82,
    filter: "blur(4px)"
  }),
  center: {
    zIndex: 20,
    x: 0,
    opacity: 1,
    rotateY: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: springPhysics
  },
  exit: (direction: number) => ({
    zIndex: 10,
    x: direction < 0 ? 320 : -320,
    opacity: 0,
    rotateY: direction < 0 ? 35 : -35,
    scale: 0.82,
    filter: "blur(4px)",
    transition: springPhysics
  })
};

export default function TestimonialsSection() {
  const [[page, direction], setPage] = useState<[number, number]>([0, 0]);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const activeIndex = Math.abs(page % testimonials.length);

  const paginate = useCallback((newDirection: number) => {
    setPage(([prevPage]) => [prevPage + newDirection, newDirection]);
  }, []);

  // Auto-play logic with hover pause
  useEffect(() => {
    if (!isAutoplay || isHovered) return;
    const interval = setInterval(() => {
      paginate(1);
    }, 5500);
    return () => clearInterval(interval);
  }, [isAutoplay, isHovered, paginate]);

  const current = testimonials[activeIndex];
  const prevIndex = (activeIndex - 1 + testimonials.length) % testimonials.length;
  const nextIndex = (activeIndex + 1) % testimonials.length;

  return (
    <section id="testimonials" className="py-28 relative overflow-hidden bg-[#030409]">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-gradient-to-r from-blue-600/10 via-indigo-600/15 to-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Success Stories</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4"
          >
            Loved by candidates. <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Trusted by top recruiters.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 text-base sm:text-lg"
          >
            Discover how AI-powered intelligence is transforming job matching, resume optimization, and tech hiring workflows.
          </motion.p>
        </div>

        {/* 3D Carousel Stage */}
        <div 
          className="relative max-w-3xl mx-auto min-h-[420px] flex items-center justify-center"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{ perspective: "1200px" }}
        >
          {/* Background Card Depth Preview - Left */}
          <div className="hidden lg:block absolute left-[-60px] top-1/2 -translate-y-1/2 w-[340px] opacity-25 scale-90 blur-[2px] pointer-events-none select-none transition-all duration-500 rounded-3xl bg-zinc-900/60 border border-white/10 p-6 -rotate-y-12">
            <div className="flex items-center gap-3 mb-3">
              <img src={testimonials[prevIndex].avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
              <div>
                <p className="text-white text-xs font-semibold">{testimonials[prevIndex].name}</p>
                <p className="text-zinc-400 text-[10px]">{testimonials[prevIndex].role}</p>
              </div>
            </div>
            <p className="text-zinc-400 text-xs line-clamp-3 italic">"{testimonials[prevIndex].content}"</p>
          </div>

          {/* Background Card Depth Preview - Right */}
          <div className="hidden lg:block absolute right-[-60px] top-1/2 -translate-y-1/2 w-[340px] opacity-25 scale-90 blur-[2px] pointer-events-none select-none transition-all duration-500 rounded-3xl bg-zinc-900/60 border border-white/10 p-6 rotate-y-12">
            <div className="flex items-center gap-3 mb-3">
              <img src={testimonials[nextIndex].avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
              <div>
                <p className="text-white text-xs font-semibold">{testimonials[nextIndex].name}</p>
                <p className="text-zinc-400 text-[10px]">{testimonials[nextIndex].role}</p>
              </div>
            </div>
            <p className="text-zinc-400 text-xs line-clamp-3 italic">"{testimonials[nextIndex].content}"</p>
          </div>

          {/* Main Active 3D Card with AnimatePresence */}
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={page}
              custom={direction}
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, { offset }) => {
                if (offset.x < -60) {
                  paginate(1);
                } else if (offset.x > 60) {
                  paginate(-1);
                }
              }}
              className="w-full max-w-2xl bg-gradient-to-b from-zinc-900/90 via-zinc-900/70 to-zinc-950/90 border border-white/10 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.7),0_0_30px_rgba(59,130,246,0.1)] relative cursor-grab active:cursor-grabbing transform-gpu group"
            >
              {/* Card Top Glow Border Line */}
              <div className="absolute top-0 inset-x-10 h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
              
              <Quote className="w-12 h-12 text-blue-500/15 absolute top-6 right-6 sm:top-8 sm:right-8" />

              {/* Card Header: User Info & Badges */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img 
                      src={current.avatar} 
                      alt={current.name} 
                      className="w-14 h-14 rounded-full object-cover border-2 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-1 border border-zinc-900">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                      {current.name}
                    </h3>
                    <p className="text-blue-400 text-xs font-medium">
                      {current.role} <span className="text-zinc-500">•</span> <span className="text-zinc-300 font-semibold">{current.company}</span>
                    </p>
                  </div>
                </div>

                {/* Rating & Highlight Pill */}
                <div className="flex flex-col items-end gap-1.5">
                  <div className="flex gap-1">
                    {Array.from({ length: current.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {current.metric}
                  </span>
                </div>
              </div>

              {/* Testimonial Quote Content */}
              <p className="text-zinc-200 text-base sm:text-lg leading-relaxed font-light italic mb-8 relative z-10">
                "{current.content}"
              </p>

              {/* Card Footer: Metric Badge & Verified Tag */}
              <div className="pt-5 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="font-medium text-zinc-300">{current.highlight}</span>
                </div>
                <span className="text-zinc-500 font-mono text-[11px]">Verified Profile</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Controls & Pagination Bar */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-6 max-w-xl mx-auto px-4">
          {/* Autoplay Play/Pause Toggle */}
          <button
            onClick={() => setIsAutoplay(!isAutoplay)}
            className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors duration-200 bg-zinc-900/60 border border-white/10 px-3 py-1.5 rounded-full"
            title={isAutoplay ? "Pause Slideshow" : "Start Slideshow"}
          >
            {isAutoplay ? (
              <>
                <Pause className="w-3.5 h-3.5 text-blue-400" />
                <span>Auto-playing</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-zinc-400" />
                <span>Paused</span>
              </>
            )}
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-2.5">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  const dir = idx > activeIndex ? 1 : -1;
                  setPage([idx, dir]);
                }}
                className={`transition-all duration-300 rounded-full ${
                  idx === activeIndex
                    ? "w-8 h-2.5 bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.6)]"
                    : "w-2.5 h-2.5 bg-zinc-700 hover:bg-zinc-500"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Prev/Next Buttons with Spring Physics Feedback */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => paginate(-1)}
              className="w-11 h-11 rounded-full bg-zinc-900/80 border border-white/10 hover:border-blue-500/40 flex items-center justify-center text-zinc-300 hover:text-white hover:bg-blue-600/20 transition-all duration-200 shadow-lg"
              aria-label="Previous Testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => paginate(1)}
              className="w-11 h-11 rounded-full bg-zinc-900/80 border border-white/10 hover:border-blue-500/40 flex items-center justify-center text-zinc-300 hover:text-white hover:bg-blue-600/20 transition-all duration-200 shadow-lg"
              aria-label="Next Testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}
