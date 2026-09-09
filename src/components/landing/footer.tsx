"use client";

import Link from "next/link";
import { Brain, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="bg-[#173D2A] border-t border-[#78957F]/30 pt-16 pb-10 text-[#78957F] relative z-10">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 mb-16">
          
          {/* Logo & About Column */}
          <div className="col-span-2 md:col-span-4">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group cursor-pointer">
              <div className="w-9 h-9 bg-[#C95A2E] rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(201,90,46,0.3)]">
                <Brain className="w-5 h-5 text-foreground" />
              </div>
              <span className="font-bold text-xl tracking-tight text-[#F7F1E7]">
                Career<span className="text-[#C95A2E]">AI</span>
              </span>
            </Link>
            <p className="text-xs text-[#F7F1E7]/70 max-w-xs leading-relaxed font-normal mb-6">
              Your intelligent companion for smarter career decisions. Build your resume, map your learning journey, and get hired.
            </p>
          </div>
          
          {/* Product Links */}
          <div className="col-span-1 md:col-span-2">
            <h4 className="text-[#F7F1E7] text-xs font-bold uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="#features" className="hover:text-[#F4D2C3] transition-colors">Career Discovery</Link></li>
              <li><Link href="#features" className="hover:text-[#F4D2C3] transition-colors">Skill Analysis</Link></li>
              <li><Link href="#features" className="hover:text-[#F4D2C3] transition-colors">Personalized Roadmap</Link></li>
              <li><Link href="#how-it-works" className="hover:text-[#F4D2C3] transition-colors">How it Works</Link></li>
            </ul>
          </div>

          {/* Resources Links */}
          <div className="col-span-1 md:col-span-2">
            <h4 className="text-[#F7F1E7] text-xs font-bold uppercase tracking-wider mb-4">Resources</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="#testimonials" className="hover:text-[#F4D2C3] transition-colors">Success Stories</Link></li>
              <li><Link href="#faq" className="hover:text-[#F4D2C3] transition-colors">FAQs</Link></li>
              <li><Link href="/login" className="hover:text-[#F4D2C3] transition-colors">Recruiter Access</Link></li>
            </ul>
          </div>

          {/* Stay Updated Newsletter Subscribe Column (Matching Reference Image) */}
          <div className="col-span-2 md:col-span-4">
            <h4 className="text-[#F7F1E7] text-xs font-bold uppercase tracking-wider mb-2">Stay Updated</h4>
            <p className="text-xs text-[#F7F1E7]/70 mb-4">
              Get career insights and tips in your inbox.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-[#1C211D]/60 border border-[#78957F]/40 rounded-full px-4 py-2 text-xs text-[#F7F1E7] placeholder-[#78957F] focus:outline-none focus:border-[#C95A2E]"
              />
              <Button type="submit" className="bg-[#C95A2E] hover:bg-[#A94724] text-foreground text-xs font-bold px-4 py-2 rounded-full shrink-0 shadow-sm">
                Subscribe
              </Button>
            </form>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-[#78957F]/30 text-xs text-[#78957F]">
          <p>© {new Date().getFullYear()} CareerAI Platform. All rights reserved. Powered by IBM Watsonx.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-[#F7F1E7] transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-[#F7F1E7] transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-[#F7F1E7] transition-colors">Contact Us</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
