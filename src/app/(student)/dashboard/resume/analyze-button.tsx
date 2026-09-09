"use client";

import { useState } from "react";
import { analyzeCurrentResumeAction } from "@/actions/profile";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Bot, Loader2, Sparkles } from "lucide-react";

export default function AnalyzeResumeButton() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    const toastId = toast.loading("IBM Watsonx AI is parsing and evaluating your resume...");

    try {
      const result = await analyzeCurrentResumeAction();
      toast.dismiss(toastId);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Resume analyzed successfully with Watsonx AI!");
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Failed to run AI analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Button
      onClick={handleAnalyze}
      disabled={isAnalyzing}
      className="w-full bg-primary hover:bg-primary0 text-foreground font-semibold text-xs h-10 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
    >
      {isAnalyzing ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          <span>Watsonx AI Analyzing Resume...</span>
        </>
      ) : (
        <>
          <Sparkles className="w-4 h-4 text-primary" />
          <span>Analyze Resume with Watsonx AI</span>
        </>
      )}
    </Button>
  );
}
