import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";
import HeroSection from "@/components/landing/hero-section";
import StatsSection from "@/components/landing/stats-section";
import HowItWorksSection from "@/components/landing/how-it-works-section";
import FeaturesSection from "@/components/landing/features-section";
import TestimonialsSection from "@/components/landing/testimonials-section";
import FaqSection from "@/components/landing/faq-section";
import CtaSection from "@/components/landing/cta-section";
import Footer from "@/components/landing/footer";
import MobileNav from "@/components/landing/mobile-nav";

export default async function RootPage() {
  const session = await auth();

  // If authenticated, redirect to appropriate dashboard
  if (session) {
    switch (session?.user?.role) {
      case "STUDENT":
        redirect("/dashboard");
      case "RECRUITER":
        redirect("/recruiter");
      case "ADMIN":
        redirect("/admin");
      default:
        redirect("/login");
    }
  }

  // If NOT authenticated, show the public Landing Page
  return (
    <div 
      className="min-h-screen bg-[#F7F1E7] text-[#1C211D] flex flex-col selection:bg-[#F4D2C3] relative overflow-hidden font-sans"
    >
      {/* Floating Capsule Glassmorphic Navigation */}
      <div className="fixed top-5 inset-x-0 z-50 flex justify-center px-4">
        <header className="w-full max-w-6xl h-14 bg-[#FFF9F2]/90 border border-[#DED3C5] rounded-full flex items-center justify-between px-6 backdrop-blur-xl shadow-[0_8px_30px_rgba(28,33,29,0.06)]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
            <div className="w-8 h-8 bg-[#C95A2E] rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(201,90,46,0.3)] group-hover:scale-105 transition-transform duration-300">
              <Brain className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-[#1C211D]">
              Career<span className="text-[#C95A2E]">AI</span>
            </span>
          </Link>
          
          {/* Menu */}
          <nav className="hidden md:flex items-center gap-6 text-[13px] font-semibold tracking-wide text-[#706B63]">
            <Link href="#features" className="hover:text-[#C95A2E] transition-colors duration-200">Features</Link>
            <Link href="#how-it-works" className="hover:text-[#C95A2E] transition-colors duration-200">How it Works</Link>
            <Link href="#testimonials" className="hover:text-[#C95A2E] transition-colors duration-200">Testimonials</Link>
            <Link href="#faq" className="hover:text-[#C95A2E] transition-colors duration-200">FAQ</Link>
            <Link href="/login" className="hover:text-[#C95A2E] transition-colors duration-200">For Recruiters</Link>
          </nav>
          
          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="text-xs font-semibold text-[#706B63] hover:text-[#C95A2E] transition-colors duration-200 hidden sm:block"
            >
              Log in
            </Link>
            <Button asChild className="hidden sm:inline-flex bg-[#C95A2E] hover:bg-[#A94724] text-white font-semibold text-xs px-5 h-8 rounded-full shadow-[0_4px_14px_rgba(201,90,46,0.35)] hover:shadow-[0_6px_20px_rgba(201,90,46,0.45)] hover:-translate-y-0.5 transition-all duration-300">
              <Link href="/register">Get Started Free</Link>
            </Button>
            <MobileNav />
          </div>
        </header>
      </div>

      <main className="flex-1 w-full z-10">
        <HeroSection />
        <StatsSection />
        <HowItWorksSection />
        <FeaturesSection />
        <TestimonialsSection />
        <FaqSection />
        <CtaSection />
      </main>

      <Footer />
    </div>
  );
}

