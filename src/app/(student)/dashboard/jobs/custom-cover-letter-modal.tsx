"use client";

import { useState } from "react";
import { generateCustomCoverLetter } from "@/actions/cover-letter";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileSignature, Loader2, Copy, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";

export function CustomCoverLetterModal() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");
  const [copied, setCopied] = useState(false);

  // Form State
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const handleGenerate = async () => {
    if (!jobTitle || !companyName || !jobDescription) {
      toast.error("Please fill in all fields.");
      return;
    }

    setContent(""); // Clear previous temporary content before regeneration
    setIsLoading(true);
    const result = await generateCustomCoverLetter({
      title: jobTitle,
      company: companyName,
      description: jobDescription
    });
    
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

  const handleReset = () => {
    setContent("");
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) {
        // Discard temporary cover letter when pop up window is closed
        setContent("");
        setCopied(false);
        setJobTitle("");
        setCompanyName("");
        setJobDescription("");
      }
    }}>
      <DialogTrigger 
        render={
          <Button className="bg-primary hover:bg-primary text-foreground">
            <Sparkles className="w-4 h-4 mr-2" />
            Create Custom Cover Letter
          </Button>
        }
      />
      <DialogContent className="bg-background border-border text-foreground sm:max-w-6xl w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary0" />
            Custom AI Cover Letter
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Generate a tailored cover letter for any job outside of this platform.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin text-primary0 mb-4" />
              <p>Watsonx is writing your cover letter...</p>
              <p className="text-xs mt-2 text-zinc-600">Analyzing your skills against the job description</p>
            </div>
          ) : content ? (
            <div className="space-y-4">
              <Textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[400px] bg-card border-border text-muted-foreground text-sm leading-relaxed p-4"
              />
              <div className="flex justify-between items-center">
                <Button variant="ghost" size="sm" onClick={handleReset} className="text-muted-foreground hover:text-foreground">
                  &larr; Back to Editor
                </Button>
                <div className="space-x-2">
                  <Button variant="outline" size="sm" onClick={handleGenerate} disabled={isLoading} className="bg-transparent border-border hover:bg-muted text-muted-foreground">
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
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-muted-foreground">Job Title</Label>
                  <Input 
                    id="title" 
                    placeholder="e.g. Software Engineer" 
                    value={jobTitle} 
                    onChange={e => setJobTitle(e.target.value)} 
                    className="bg-card border-border text-foreground" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-muted-foreground">Company Name</Label>
                  <Input 
                    id="company" 
                    placeholder="e.g. Google" 
                    value={companyName} 
                    onChange={e => setCompanyName(e.target.value)} 
                    className="bg-card border-border text-foreground" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <Label htmlFor="jd" className="text-muted-foreground">Job Description</Label>
                  <span className={`text-xs ${jobDescription.length >= 4000 ? 'text-red-400' : 'text-muted-foreground'}`}>
                    {jobDescription.length} / 4000 characters
                  </span>
                </div>
                <Textarea 
                  id="jd" 
                  placeholder="Paste the job description here..." 
                  value={jobDescription} 
                  maxLength={4000}
                  onChange={e => setJobDescription(e.target.value)} 
                  className="min-h-[300px] bg-card border-border text-muted-foreground resize-y" 
                />
              </div>
              
              <div className="pt-4 flex justify-end">
                <Button onClick={handleGenerate} className="bg-primary hover:bg-primary text-foreground w-full sm:w-auto">
                  Generate Cover Letter
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
