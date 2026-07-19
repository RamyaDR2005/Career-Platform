"use client";

import { useState } from "react";
import { analyzeResume } from "@/actions/analyze-resume";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Bot, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AnalyzeResumeButton() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [analysisType, setAnalysisType] = useState<"general" | "job">("general");
  const [jobDescription, setJobDescription] = useState("");

  const handleAnalyze = async () => {
    if (analysisType === "job" && !jobDescription.trim()) {
      toast.error("Please enter a job description.");
      return;
    }

    setIsAnalyzing(true);
    setIsOpen(false); // Close dialog immediately
    
    // Toast to show it's analyzing in background
    toast.info("Analyzing resume with AI...");
    
    const result = await analyzeResume(analysisType, jobDescription);
    setIsAnalyzing(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Resume analyzed successfully!");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger 
        render={
          <Button 
            disabled={isAnalyzing}
            className="bg-blue-600 text-white hover:bg-blue-700 w-full md:w-auto mt-4"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Bot className="mr-2 h-4 w-4" />
                Analyze with AI
              </>
            )}
          </Button>
        }
      />
      
      <DialogContent className="sm:max-w-[500px] bg-zinc-950 text-zinc-100 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-zinc-100">Resume Analysis Options</DialogTitle>
          <DialogDescription className="text-zinc-400">
            How would you like Watsonx AI to evaluate your resume?
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <RadioGroup defaultValue="general" value={analysisType} onValueChange={(val) => setAnalysisType(val as "general" | "job")}>
            <div className="flex items-start space-x-3">
              <RadioGroupItem value="general" id="r1" className="mt-1 border-zinc-500 text-zinc-100" />
              <Label htmlFor="r1" className="cursor-pointer">
                <span className="font-semibold block text-base text-zinc-100">General Analysis</span>
                <span className="text-zinc-400 text-sm font-normal">Based on your degree, branch, and industry standards.</span>
              </Label>
            </div>
            <div className="flex items-start space-x-3 mt-4">
              <RadioGroupItem value="job" id="r2" className="mt-1 border-zinc-500 text-zinc-100" />
              <Label htmlFor="r2" className="cursor-pointer">
                <span className="font-semibold block text-base text-zinc-100">Targeted Job Description</span>
                <span className="text-zinc-400 text-sm font-normal">Compare against a specific role you are applying for.</span>
              </Label>
            </div>
          </RadioGroup>

          {analysisType === "job" && (
            <div className="space-y-2 mt-2">
              <Label htmlFor="jobDesc" className="text-zinc-300">Job Description</Label>
              <Textarea 
                id="jobDesc" 
                placeholder="Paste the job description here..." 
                className="h-32 resize-none bg-zinc-900 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="ghost" className="text-zinc-300 hover:text-white hover:bg-zinc-800" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleAnalyze} className="bg-blue-600 text-white hover:bg-blue-700">
            Start Analysis
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
