import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Brain, Search, Shield, Zap, ArrowRight } from "lucide-react";

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
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col selection:bg-blue-500/30">
      {/* Navigation */}
      <header className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">CareerAI</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-white transition-colors">How it Works</Link>
            <Link href="/login" className="hover:text-white transition-colors">For Recruiters</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-zinc-300 hover:text-white">
              Log in
            </Link>
            <Button asChild className="bg-white text-zinc-950 hover:bg-zinc-200">
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-zinc-950 to-zinc-950"></div>
          <div className="container mx-auto px-6 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium mb-8 border border-blue-500/20">
              <Zap className="w-4 h-4" /> Powered by IBM Watsonx
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 max-w-4xl mx-auto leading-tight">
              Supercharge your career with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">AI Intelligence</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Upload your resume, get instantly scored against ATS standards by AI, and connect with top recruiters looking for your exact skill set.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white text-base">
                <Link href="/register">
                  Start for Free <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-8 bg-transparent border-zinc-700 hover:bg-zinc-900 text-zinc-300 hover:text-white text-base">
                <Link href="/register">I'm a Recruiter</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-zinc-900/50 border-t border-zinc-800/50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to get hired</h2>
              <p className="text-zinc-400 max-w-2xl mx-auto">Our platform bridges the gap between students and recruiters using state-of-the-art Generative AI.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 rounded-2xl bg-zinc-950 border border-zinc-800">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 border border-blue-500/20">
                  <Brain className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">AI Resume Analyzer</h3>
                <p className="text-zinc-400 leading-relaxed">Get instant feedback on your resume formatting, grammar, and missing industry keywords powered by IBM Watsonx.</p>
              </div>
              
              <div className="p-8 rounded-2xl bg-zinc-950 border border-zinc-800">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 border border-emerald-500/20">
                  <Shield className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">ATS Scoring System</h3>
                <p className="text-zinc-400 leading-relaxed">Know exactly how your profile ranks against Applicant Tracking Systems before you even hit apply.</p>
              </div>

              <div className="p-8 rounded-2xl bg-zinc-950 border border-zinc-800">
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 border border-purple-500/20">
                  <Search className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Smart Job Matching</h3>
                <p className="text-zinc-400 leading-relaxed">Recruiters can filter through candidates effortlessly based on verified AI scores and skill gap analyses.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-zinc-800 bg-zinc-950 text-center text-zinc-500 text-sm">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} CareerAI. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
