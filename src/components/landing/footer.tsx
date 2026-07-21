import Link from "next/link";
import { Brain } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#030409] border-t border-white/5 pt-16 pb-8 text-zinc-400 relative z-10">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                <Brain className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight text-white">
                CareerAI
              </span>
            </div>
            <p className="text-sm text-zinc-500 max-w-xs leading-relaxed">
              Supercharge your career with AI intelligence. Build your resume, map your learning journey, and connect with top recruiters.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#features" className="hover:text-blue-400 transition-colors">AI Analysis</Link></li>
              <li><Link href="#how-it-works" className="hover:text-blue-400 transition-colors">Learning Roadmap</Link></li>
              <li><Link href="/login" className="hover:text-blue-400 transition-colors">For Recruiters</Link></li>
              <li><Link href="/login" className="hover:text-blue-400 transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5 text-xs text-zinc-600">
          <p>© {new Date().getFullYear()} CareerAI Platform. Powered by IBM Watsonx.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="#" className="hover:text-white transition-colors">Twitter</Link>
            <Link href="#" className="hover:text-white transition-colors">LinkedIn</Link>
            <Link href="#" className="hover:text-white transition-colors">GitHub</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
