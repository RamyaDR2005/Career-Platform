"use client";

import { useState } from "react";
import { applyForJob } from "@/actions/apply";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function ApplyButton({ jobId, hasApplied, isDisabled, disabledReason }: { jobId: string, hasApplied: boolean, isDisabled?: boolean, disabledReason?: string }) {
  const [isApplying, setIsApplying] = useState(false);
  const [applied, setApplied] = useState(hasApplied);
  const [open, setOpen] = useState(false);

  const handleApply = async () => {
    setIsApplying(true);
    const result = await applyForJob(jobId);
    setIsApplying(false);
    setOpen(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      setApplied(true);
      toast.success("Application submitted successfully!");
    }
  };

  if (applied) {
    return (
      <Button disabled variant="outline" className="bg-emerald-950/30 text-emerald-500 border-emerald-900/50 w-full md:w-auto">
        <CheckCircle2 className="mr-2 h-4 w-4" /> Applied
      </Button>
    );
  }

  if (isDisabled) {
    return (
      <Button disabled variant="outline" className="bg-zinc-900 text-zinc-500 border-zinc-800 w-full md:w-auto cursor-not-allowed">
        {disabledReason || "Closed"}
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          disabled={isApplying}
          className="bg-blue-600 text-white hover:bg-blue-700 w-full md:w-auto"
        >
          {isApplying ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" /> Apply Now
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-100 max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Application</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Are you sure you want to apply for this job? Your profile and parsed resume will be submitted to the recruiter.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isApplying} className="bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800">
            Cancel
          </Button>
          <Button onClick={handleApply} disabled={isApplying} className="bg-blue-600 text-white hover:bg-blue-700">
            {isApplying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Confirm Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
