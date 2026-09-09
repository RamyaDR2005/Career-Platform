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
        className="w-9 h-9 rounded-full bg-[#FFF9F2] border border-[#DED3C5] flex items-center justify-center text-[#1C211D] hover:text-[#C95A2E] focus:outline-none transition-colors shadow-sm"
      >
        {isOpen ? <X className="w-5 h-5 text-[#1C211D]" /> : <Menu className="w-5 h-5 text-[#1C211D]" />}
      </button>

      {/* Overlay Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-16 left-4 right-4 bg-[#FFF9F2] border border-[#DED3C5] rounded-2xl p-6 backdrop-blur-2xl shadow-[0_20px_50px_rgba(28,33,29,0.15)] z-50 flex flex-col gap-5"
          >
            <div className="flex items-center gap-2 pb-4 border-b border-[#DED3C5]">
              <div className="w-7 h-7 bg-[#C95A2E] rounded-full flex items-center justify-center shadow-[0_4px_10px_rgba(201,90,46,0.3)]">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-base tracking-tight text-[#1C211D]">Career<span className="text-[#C95A2E]">AI</span> Menu</span>
            </div>

            <nav className="flex flex-col gap-3 text-sm font-semibold text-[#706B63]">
              <Link
                href="#features"
                onClick={closeMenu}
                className="py-2 px-3 rounded-lg hover:bg-[#F4D2C3]/30 hover:text-[#C95A2E] transition-colors"
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                onClick={closeMenu}
                className="py-2 px-3 rounded-lg hover:bg-[#F4D2C3]/30 hover:text-[#C95A2E] transition-colors"
              >
                How it Works
              </Link>
              <Link
                href="#testimonials"
                onClick={closeMenu}
                className="py-2 px-3 rounded-lg hover:bg-[#F4D2C3]/30 hover:text-[#C95A2E] transition-colors"
              >
                Testimonials
              </Link>
              <Link
                href="#faq"
                onClick={closeMenu}
                className="py-2 px-3 rounded-lg hover:bg-[#F4D2C3]/30 hover:text-[#C95A2E] transition-colors"
              >
                FAQ
              </Link>
              <Link
                href="/login"
                onClick={closeMenu}
                className="py-2 px-3 rounded-lg hover:bg-[#F4D2C3]/30 text-[#C95A2E] transition-colors"
              >
                For Recruiters
              </Link>
            </nav>

            <div className="pt-3 border-t border-[#DED3C5] flex flex-col gap-3">
              <Button
                asChild
                variant="outline"
                className="w-full justify-center bg-[#F7F1E7] border-[#DED3C5] text-[#1C211D] hover:bg-[#FFF9F2]"
              >
                <Link href="/login" onClick={closeMenu}>
                  Log in
                </Link>
              </Button>
              <Button
                asChild
                className="w-full justify-center bg-[#C95A2E] hover:bg-[#A94724] text-white font-semibold shadow-[0_4px_15px_rgba(201,90,46,0.3)]"
              >
                <Link href="/register" onClick={closeMenu} className="flex items-center gap-2">
                  <span>Get Started Free</span>
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
