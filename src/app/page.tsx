import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Brain, Search, Shield, ArrowRight } from "lucide-react";

export default async function RootPage() {
  const session = await auth();

  // If authenticated, redirect to appropriate dashboard
  if (session) {
    switch (session?.user?.role) {
      case "STUDENT":
        redirect("/dashboard");
      case "RECRUITER":
        redirect("/recruiter");
      case "PLACEMENT_OFFICER":
        redirect("/placement");
      case "ADMIN":
        redirect("/admin");
      default:
        redirect("/login");
    }
  }

  // If NOT authenticated, show the public Landing Page
  return (
    <div 
      className="min-h-screen bg-[#030409] text-zinc-100 flex flex-col selection:bg-blue-500/40 relative overflow-hidden"
      style={{ fontFamily: "'Canela', 'Lora', serif" }}
    >
      {/* Background Tech Canvas Layer */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Subtle sliding grid */}
        <div 
          className="absolute inset-0 bg-[#030409] opacity-35 mix-blend-normal animate-grid-shift"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.01) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.01) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            transformOrigin: 'center top'
          }}
        />

        {/* Giant Radial Glow above the globe */}
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-r from-blue-500/10 via-indigo-600/15 to-purple-500/10 rounded-full blur-[140px] animate-spotlight-pulse pointer-events-none transform -translate-y-1/2" />
        
        {/* Floating gradient blobs */}
        <div className="absolute top-[40%] left-[5%] w-[450px] h-[450px] bg-blue-600/5 rounded-full blur-[160px] animate-float-slow pointer-events-none" />
        <div className="absolute top-[70%] right-[5%] w-[450px] h-[450px] bg-purple-600/5 rounded-full blur-[160px] animate-float-slow pointer-events-none [animation-delay:5s]" />

        {/* Ambient point stars */}
        <div className="absolute top-[25%] left-[20%] w-1 h-1 rounded-full bg-blue-300 opacity-60 animate-pulse pointer-events-none" />
        <div className="absolute top-[35%] right-[25%] w-1.5 h-1.5 rounded-full bg-cyan-300 opacity-50 animate-pulse pointer-events-none [animation-delay:2s]" />
      </div>

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
          <nav className="hidden md:flex items-center gap-7 text-[13px] font-medium tracking-wide text-zinc-400">
            <Link href="#features" className="hover:text-white transition-colors duration-200">Features</Link>
            <Link href="#how-it-works" className="hover:text-white transition-colors duration-200">How it Works</Link>
            <Link href="/login" className="hover:text-white transition-colors duration-200">For Recruiters</Link>
          </nav>
          
          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors duration-200"
            >
              Log in
            </Link>
            <Button asChild className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-4 h-8 rounded-full shadow-[0_4px_15px_rgba(37,99,235,0.3)] hover:shadow-[0_4px_25px_rgba(37,99,235,0.45)] hover:-translate-y-0.5 transition-all duration-300">
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </header>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 pt-20">
        
        {/* World-Class Hero Section */}
        <section className="relative pt-24 pb-20 overflow-hidden">
          <div className="container mx-auto px-6 text-center relative">
            
            {/* Title wrapped in clean sans-serif */}
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 max-w-4xl mx-auto leading-[1.15] text-white">
              Supercharge your career with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 drop-shadow-[0_0_35px_rgba(59,130,246,0.15)]">AI Intelligence</span>
            </h1>

            {/* Subtext description with custom spacing */}
            <p className="text-base md:text-lg text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed font-light tracking-wide">
              Upload your resume, get instantly scored against ATS standards by AI, and connect with top recruiters looking for your exact skill set.
            </p>

            {/* Premium Button Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24 relative z-10">
              <Button asChild size="lg" className="h-12 px-6 rounded-full bg-white text-zinc-950 hover:bg-zinc-100 font-semibold text-sm shadow-[0_4px_20px_rgba(255,255,255,0.1)] hover:shadow-[0_4px_30px_rgba(255,255,255,0.2)] hover:-translate-y-0.5 transition-all duration-300 group">
                <Link href="/register" className="flex items-center">
                  Start for Free <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-6 rounded-full bg-[#05060f]/60 border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white font-medium text-sm hover:-translate-y-0.5 transition-all duration-300 backdrop-blur-md">
                <Link href="/register">I'm a Recruiter</Link>
              </Button>
            </div>

            {/* Giant Glowing Globe Sphere (BlueOrbit Aesthetic Backdrop with animated scrolling globe dots) */}
            <div className="absolute top-[48%] left-1/2 -translate-x-1/2 w-[700px] md:w-[1000px] h-[700px] md:h-[1000px] rounded-full border border-blue-500/20 bg-[#040612]/40 shadow-[0_0_90px_rgba(37,99,235,0.18),inset_0_0_70px_rgba(37,99,235,0.12)] overflow-hidden pointer-events-none z-0">
              {/* Nested scrolling dot mesh layers representing rolling globe contour */}
              <div 
                className="absolute inset-0 opacity-[0.14] bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.65)_1px,transparent_0)] bg-[size:28px_20px] animate-globe-roll"
                style={{ transform: 'rotate(-5deg)' }}
              />
              <div 
                className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.65)_1.5px,transparent_0)] bg-[size:40px_28px] animate-globe-roll"
                style={{ transform: 'rotate(8deg)', animationDuration: '38s' }}
              />
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.20)_0%,transparent_60%)] animate-pulse" />
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
              
              {/* Particle orbit rings over the globe */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-[98%] h-[250px] border-t border-dashed border-blue-400/25 rounded-full opacity-60" />
              <div className="absolute top-[45px] left-1/2 -translate-x-1/2 w-[95%] h-[200px] border-t border-dashed border-cyan-400/15 rounded-full opacity-40" />
            </div>

            {/* Visual Glassmorphic App Window Mockup */}
            <div className="relative max-w-5xl mx-auto rounded-2xl border border-white/[0.06] bg-[#080a14]/65 backdrop-blur-3xl p-5 md:p-7 shadow-[0_45px_100px_rgba(0,0,0,0.8),0_0_80px_rgba(59,130,246,0.03)] overflow-hidden group mt-28">
              {/* Subtle top border shine */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              
              {/* Window Controls */}
              <div className="flex items-center justify-between border-b border-white/[0.04] pb-5 mb-7">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-white/10 group-hover:bg-red-500/40 transition-colors duration-500" />
                  <div className="w-3 h-3 rounded-full bg-white/10 group-hover:bg-yellow-500/40 transition-colors duration-500" />
                  <div className="w-3 h-3 rounded-full bg-white/10 group-hover:bg-green-500/40 transition-colors duration-500" />
                </div>
                <div className="px-4 py-1.5 rounded-full bg-white/[0.01] border border-white/[0.04] text-[10px] tracking-widest text-zinc-500 uppercase">
                  careerai.platform/dashboard
                </div>
                <div className="w-12 h-2" />
              </div>
              
              {/* Bento Metric Boxes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left font-medium">
                {/* Metric Card 1 */}
                <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/[0.04] hover:border-blue-500/20 hover:bg-white/[0.02] flex flex-col justify-between h-36 relative overflow-hidden transition-all duration-500">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl" />
                  <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">ATS Readiness</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-white">88%</span>
                    <span className="text-xs text-emerald-400 font-medium">+12% vs last scan</span>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 h-full rounded-full w-[88%]" />
                  </div>
                </div>

                {/* Metric Card 2 */}
                <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/[0.04] hover:border-indigo-500/20 hover:bg-white/[0.02] flex flex-col justify-between h-36 relative overflow-hidden transition-all duration-500">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl" />
                  <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">IBM Watsonx Analysis</span>
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-[pulse_1.5s_infinite]" />
                    <span className="text-sm font-medium text-zinc-300">Format & Keywords Optimized</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/[0.03] text-zinc-400 border border-white/[0.05]">TypeScript</span>
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/[0.03] text-zinc-400 border border-white/[0.05]">Generative AI</span>
                  </div>
                </div>

                {/* Metric Card 3 */}
                <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/[0.04] hover:border-cyan-500/20 hover:bg-white/[0.02] flex flex-col justify-between h-36 relative overflow-hidden transition-all duration-500">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl" />
                  <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Recruiter Match</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-white">14</span>
                    <span className="text-xs text-zinc-500">active pipeline matches</span>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-full w-[65%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Bento Grid Segment */}
        <section id="features" className="py-28 relative overflow-hidden">
          {/* Subtle separator */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
          
          <div className="container mx-auto px-6 relative z-10">
            {/* Header info */}
            <div className="text-center mb-24">
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-5 bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
                Everything you need to get hired
              </h2>
              <p className="text-zinc-400 text-lg max-w-2xl mx-auto font-light leading-relaxed">
                Our platform bridges the gap between students and recruiters using state-of-the-art Generative AI.
              </p>
            </div>
            
            {/* Cards layout */}
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              
              {/* Feature Box 1 */}
              <div className="relative group rounded-3xl bg-white/[0.01] border border-white/[0.04] hover:border-blue-500/20 hover:bg-white/[0.02] p-8 md:p-10 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(59,130,246,0.04)] hover:-translate-y-1 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/[0.02] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-8 border border-blue-500/20 group-hover:bg-blue-600 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] group-hover:border-blue-600 transition-all duration-500 text-blue-400 group-hover:text-white">
                  <Brain className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white tracking-tight">
                  AI Resume Analyzer
                </h3>
                <p className="text-zinc-400 leading-relaxed font-light text-[15px]">
                  Get instant feedback on your resume formatting, grammar, and missing industry keywords powered by IBM Watsonx.
                </p>
              </div>
              
              {/* Feature Box 2 */}
              <div className="relative group rounded-3xl bg-white/[0.01] border border-white/[0.04] hover:border-indigo-500/20 hover:bg-white/[0.02] p-8 md:p-10 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(99,102,241,0.04)] hover:-translate-y-1 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/[0.02] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-8 border border-indigo-500/20 group-hover:bg-indigo-600 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] group-hover:border-indigo-600 transition-all duration-500 text-indigo-400 group-hover:text-white">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white tracking-tight">
                  ATS Scoring System
                </h3>
                <p className="text-zinc-400 leading-relaxed font-light text-[15px]">
                  Know exactly how your profile ranks against Applicant Tracking Systems before you even hit apply.
                </p>
              </div>

              {/* Feature Box 3 */}
              <div className="relative group rounded-3xl bg-white/[0.01] border border-white/[0.04] hover:border-cyan-500/20 hover:bg-white/[0.02] p-8 md:p-10 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(6,182,212,0.04)] hover:-translate-y-1 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/[0.02] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <div className="w-14 h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-8 border border-cyan-500/20 group-hover:bg-cyan-600 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] group-hover:border-cyan-600 transition-all duration-500 text-cyan-400 group-hover:text-white">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white tracking-tight">
                  Smart Job Matching
                </h3>
                <p className="text-zinc-400 leading-relaxed font-light text-[15px]">
                  Recruiters can filter through candidates effortlessly based on verified AI scores and skill gap analyses.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Minimal Footer */}
      <footer className="py-12 border-t border-white/[0.04] bg-[#030409] text-center text-zinc-500 text-[13px] relative z-10">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="tracking-wide">© {new Date().getFullYear()} CareerAI. All rights reserved.</p>
          <div className="flex items-center gap-7 font-medium">
            <Link href="#" className="hover:text-white transition-colors duration-200">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors duration-200">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
