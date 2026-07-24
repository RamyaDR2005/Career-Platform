"use client";

import { useState } from "react";
import { applyForJob } from "@/actions/apply";
import { uploadFileToDropbox } from "@/actions/upload-resume";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle2, Loader2, Send, FileText, Upload, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function ApplyButton({
  jobId,
  hasApplied,
  isDisabled,
  disabledReason
}: {
  jobId: string;
  hasApplied: boolean;
  isDisabled?: boolean;
  disabledReason?: string;
}) {
  const [isApplying, setIsApplying] = useState(false);
  const [applied, setApplied] = useState(hasApplied);
  const [open, setOpen] = useState(false);
  const [useCustomResume, setUseCustomResume] = useState(false);
  const [customFile, setCustomFile] = useState<File | null>(null);
  const [isUploadingCustom, setIsUploadingCustom] = useState(false);

  const handleApply = async () => {
    setIsApplying(true);
    let customResumeUrl: string | undefined = undefined;

    try {
      if (useCustomResume && customFile) {
        setIsUploadingCustom(true);
        const formData = new FormData();
        formData.append("file", customFile);

        const uploadRes = await uploadFileToDropbox(formData, false);
        if (uploadRes.error || !uploadRes.url) {
          toast.error(uploadRes.error || "Failed to upload custom resume.");
          setIsApplying(false);
          setIsUploadingCustom(false);
          return;
        }

        customResumeUrl = uploadRes.url;
        setIsUploadingCustom(false);
      }

      const result = await applyForJob(jobId, customResumeUrl);
      setIsApplying(false);
      setOpen(false);

      if (result.error) {
        toast.error(result.error);
      } else {
        setApplied(true);
        toast.success("Application & Tailored Resume submitted successfully!");
      }
    } catch (error) {
      console.error("Application submission error:", error);
      toast.error("An error occurred while submitting.");
      setIsApplying(false);
      setIsUploadingCustom(false);
    }
  };

  if (applied) {
    return (
      <Button disabled variant="outline" className="bg-emerald-950/30 text-emerald-400 border-emerald-900/50 w-full md:w-auto">
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
      <DialogTrigger
        render={
          <Button
            disabled={isApplying}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-5 h-9 rounded-xl shadow-md shadow-blue-600/20 w-full md:w-auto"
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
        }
      />
      <DialogContent className="bg-zinc-950 border-white/10 text-zinc-100 max-w-md rounded-2xl p-6">
        <DialogHeader>
          <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" /> Application Setup
          </div>
          <DialogTitle className="text-xl font-bold text-white mt-1">Submit Application</DialogTitle>
          <DialogDescription className="text-zinc-400 text-xs">
            Choose whether to submit your primary active resume or attach a job-tailored resume.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-4">
          {/* Option 1: Primary Resume */}
          <div
            onClick={() => setUseCustomResume(false)}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              !useCustomResume
                ? "bg-blue-950/30 border-blue-500/50 shadow-md shadow-blue-500/10"
                : "bg-zinc-900/50 border-white/5 hover:border-white/10"
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="resumeOption"
                checked={!useCustomResume}
                onChange={() => setUseCustomResume(false)}
                className="accent-blue-500"
              />
              <FileText className="w-4.5 h-4.5 text-blue-400" />
              <div>
                <p className="text-xs font-bold text-white">Use Primary Active Resume</p>
                <p className="text-[11px] text-zinc-400">Default profile resume from Resume Center</p>
              </div>
            </div>
          </div>

          {/* Option 2: Custom Resume for this job */}
          <div
            onClick={() => setUseCustomResume(true)}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              useCustomResume
                ? "bg-purple-950/30 border-purple-500/50 shadow-md shadow-purple-500/10"
                : "bg-zinc-900/50 border-white/5 hover:border-white/10"
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="resumeOption"
                checked={useCustomResume}
                onChange={() => setUseCustomResume(true)}
                className="accent-purple-500"
              />
              <Upload className="w-4.5 h-4.5 text-purple-400" />
              <div>
                <p className="text-xs font-bold text-white">Attach Tailored PDF Resume</p>
                <p className="text-[11px] text-zinc-400">Upload a custom resume for this specific job</p>
              </div>
            </div>

            {useCustomResume && (
              <div className="mt-3 pt-3 border-t border-white/10">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setCustomFile(e.target.files?.[0] || null)}
                  className="block w-full text-xs text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-500"
                />
                {customFile && (
                  <p className="text-[11px] text-purple-300 mt-1 font-semibold truncate">
                    Selected: {customFile.name}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isApplying}
            className="bg-transparent border-white/10 text-zinc-300 hover:bg-zinc-800 text-xs"
          >
            Cancel
          </Button>
          <Button
            onClick={handleApply}
            disabled={isApplying || (useCustomResume && !customFile)}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-5"
          >
            {isApplying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isUploadingCustom ? "Uploading Resume..." : "Evaluating Fit..."}
              </>
            ) : (
              "Confirm & Submit"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
