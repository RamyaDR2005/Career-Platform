"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Brain, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="md:hidden">
      {/* Hamburger Toggle Button */}
      <button
        onClick={toggleMenu}
        aria-label="Toggle Navigation Menu"
        className="w-9 h-9 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white focus:outline-none transition-colors"
      >
        {isOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
      </button>

      {/* Overlay Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-16 left-4 right-4 bg-zinc-950/95 border border-white/10 rounded-2xl p-6 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-50 flex flex-col gap-5"
          >
            <div className="flex items-center gap-2 pb-4 border-b border-white/10">
              <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(37,99,235,0.4)]">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-base tracking-tight text-white">CareerAI Menu</span>
            </div>

            <nav className="flex flex-col gap-3 text-sm font-medium text-zinc-300">
              <Link
                href="#features"
                onClick={closeMenu}
                className="py-2 px-3 rounded-lg hover:bg-white/5 hover:text-white transition-colors"
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                onClick={closeMenu}
                className="py-2 px-3 rounded-lg hover:bg-white/5 hover:text-white transition-colors"
              >
                How it Works
              </Link>
              <Link
                href="#testimonials"
                onClick={closeMenu}
                className="py-2 px-3 rounded-lg hover:bg-white/5 hover:text-white transition-colors"
              >
                Testimonials
              </Link>
              <Link
                href="#faq"
                onClick={closeMenu}
                className="py-2 px-3 rounded-lg hover:bg-white/5 hover:text-white transition-colors"
              >
                FAQ
              </Link>
              <Link
                href="/login"
                onClick={closeMenu}
                className="py-2 px-3 rounded-lg hover:bg-white/5 text-blue-400 transition-colors"
              >
                For Recruiters
              </Link>
            </nav>

            <div className="pt-3 border-t border-white/10 flex flex-col gap-3">
              <Button
                asChild
                variant="outline"
                className="w-full justify-center bg-zinc-900 border-white/10 text-white hover:bg-zinc-800"
              >
                <Link href="/login" onClick={closeMenu}>
                  Log in
                </Link>
              </Button>
              <Button
                asChild
                className="w-full justify-center bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-[0_4px_15px_rgba(37,99,235,0.3)]"
              >
                <Link href="/register" onClick={closeMenu} className="flex items-center gap-2">
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
