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
      className="min-h-screen bg-[#030409] text-zinc-100 flex flex-col selection:bg-blue-500/40 relative overflow-hidden font-sans"
    >
      {/* Floating Capsule Glassmorphic Navigation */}
      <div className="fixed top-5 inset-x-0 z-50 flex justify-center px-4">
        <header className="w-full max-w-5xl h-14 bg-zinc-950/70 border border-white/10 rounded-full flex items-center justify-between px-6 backdrop-blur-xl shadow-[0_12px_45px_rgba(0,0,0,0.6)]">
          {/* Logo */}
          <div className="flex items-center gap-2.5 group cursor-pointer">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.3)] group-hover:scale-105 transition-transform duration-300">
              <Brain className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">
              CareerAI
            </span>
          </div>
          
          {/* Menu */}
          <nav className="hidden md:flex items-center gap-6 text-[13px] font-medium tracking-wide text-zinc-400">
            <Link href="#features" className="hover:text-white transition-colors duration-200">Features</Link>
            <Link href="#how-it-works" className="hover:text-white transition-colors duration-200">How it Works</Link>
            <Link href="#testimonials" className="hover:text-white transition-colors duration-200">Testimonials</Link>
            <Link href="#faq" className="hover:text-white transition-colors duration-200">FAQ</Link>
            <Link href="/login" className="hover:text-white transition-colors duration-200">For Recruiters</Link>
          </nav>
          
          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors duration-200 hidden sm:block"
            >
              Log in
            </Link>
            <Button asChild className="hidden sm:inline-flex bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-4 h-8 rounded-full shadow-[0_4px_15px_rgba(37,99,235,0.3)] hover:shadow-[0_4px_25px_rgba(37,99,235,0.45)] hover:-translate-y-0.5 transition-all duration-300">
              <Link href="/register">Get Started</Link>
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

