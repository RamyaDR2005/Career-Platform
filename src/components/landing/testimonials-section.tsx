"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "Software Engineer at Google",
    content: "The ATS scoring was an eye-opener. I uploaded my old resume and scored a 45. After following the AI's roadmap and fixing my keywords, my score jumped to 92. I got 3 interviews the next week.",
    avatar: "https://i.pravatar.cc/150?img=47"
  },
  {
    name: "David Chen",
    role: "Data Analyst at Spotify",
    content: "As a new grad, I had no idea what skills I was missing. The generated learning roadmap told me exactly which tools to learn next. A recruiter found my updated profile on here and reached out directly!",
    avatar: "https://i.pravatar.cc/150?img=11"
  },
  {
    name: "Elena Rodriguez",
    role: "Technical Recruiter",
    content: "This platform saves me hours every week. I don't have to guess if a candidate is qualified; the AI has already verified their ATS score and skill alignment. It's my go-to hiring pipeline now.",
    avatar: "https://i.pravatar.cc/150?img=5"
  }
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-[#030409]">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-white"
          >
            Don't just take our word for it
          </motion.h2>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            See how AI-powered career intelligence is changing the game for students and recruiters alike.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-zinc-900/50 border border-white/5 p-8 rounded-3xl relative"
            >
              <Quote className="w-8 h-8 text-blue-500/20 absolute top-6 right-6" />
              <div className="flex items-center gap-4 mb-6">
                <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover border border-white/10" />
                <div>
                  <h4 className="text-white font-semibold text-sm">{testimonial.name}</h4>
                  <p className="text-blue-400 text-xs">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-zinc-300 text-sm leading-relaxed font-light italic">
                "{testimonial.content}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
