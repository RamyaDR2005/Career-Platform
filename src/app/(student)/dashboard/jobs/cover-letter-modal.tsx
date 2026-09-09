"use client";

import { useState } from "react";
import { generateCoverLetter } from "@/actions/cover-letter";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { FileSignature, Loader2, Copy, Check } from "lucide-react";
import { toast } from "sonner";

export function CoverLetterModal({ jobId }: { jobId: string }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setContent(""); // Clear previous temporary content before regeneration
    setIsLoading(true);
    const result = await generateCoverLetter(jobId);
    
    if (result.error) {
      toast.error(result.error);
    } else if (result.response) {
      setContent(result.response);
      toast.success("Cover letter generated!");
    }
    
    setIsLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) {
        // Discard temporary cover letter when pop up window is closed
        setContent("");
        setCopied(false);
      }
    }}>
      <DialogTrigger 
        render={
          <Button variant="outline" size="sm" className="bg-background border-border text-muted-foreground hover:bg-muted hover:text-foreground" onClick={(e) => {
            if (!content) handleGenerate();
          }}>
            <FileSignature className="w-4 h-4 mr-2" />
            AI Cover Letter
          </Button>
        }
      />
      <DialogContent className="bg-background border-border text-foreground sm:max-w-6xl w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSignature className="w-5 h-5 text-primary0" />
            AI-Generated Cover Letter
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Tailored to this specific job based on your AI resume analysis.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin text-primary0 mb-4" />
              <p>Watsonx is writing your cover letter...</p>
              <p className="text-xs mt-2 text-zinc-600">Analyzing your skills against job requirements</p>
            </div>
          ) : content ? (
            <div className="space-y-4">
              <Textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[300px] bg-card border-border text-muted-foreground text-sm leading-relaxed p-4"
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground">You can edit the text directly before copying.</p>
                <div className="space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleGenerate()} disabled={isLoading} className="bg-transparent border-border hover:bg-muted text-muted-foreground">
                    Regenerate
                  </Button>
                  <Button size="sm" onClick={handleCopy} className="bg-primary hover:bg-primary text-foreground">
                    {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copied ? "Copied" : "Copy to Clipboard"}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Button onClick={handleGenerate} className="bg-primary hover:bg-primary text-foreground">
                Generate Cover Letter
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
