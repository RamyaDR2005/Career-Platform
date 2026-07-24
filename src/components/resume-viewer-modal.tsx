"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, ExternalLink, Loader2 } from "lucide-react";

export function ResumeViewerModal({
  profileId,
  applicationId,
  resumeUrl,
  buttonText = "View Resume PDF",
}: {
  profileId?: string;
  applicationId?: string;
  resumeUrl?: string;
  buttonText?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const queryParams = new URLSearchParams();
  if (applicationId) queryParams.set("applicationId", applicationId);
  else if (resumeUrl) queryParams.set("resumeUrl", resumeUrl);
  else if (profileId) queryParams.set("profileId", profileId);

  const queryString = queryParams.toString();
  const previewUrl = queryString ? `/api/resume/preview?${queryString}` : `/api/resume/preview`;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            className="bg-blue-950/40 border-blue-500/30 text-blue-300 hover:bg-blue-900/50 hover:text-white font-semibold text-xs h-9 px-4 rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <FileText className="w-4 h-4 text-blue-400" />
            <span>{buttonText}</span>
          </Button>
        }
      />
      <DialogContent className="bg-zinc-950 border-white/10 text-zinc-100 !max-w-5xl sm:!max-w-5xl md:!max-w-6xl w-[92vw] h-[88vh] flex flex-col p-4 sm:p-6 rounded-2xl">
        <DialogHeader className="flex flex-row items-center justify-between pb-2 border-b border-white/10 shrink-0">
          <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            {buttonText}
          </DialogTitle>
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 bg-zinc-900 px-3 py-1.5 rounded-lg border border-white/10 mr-6"
          >
            <span>Open in Full Tab</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </DialogHeader>

        <div className="relative flex-1 w-full h-full mt-4 bg-zinc-900 rounded-xl overflow-hidden border border-white/5">
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/80 z-10 text-zinc-400">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-2" />
              <p className="text-xs font-semibold">Loading Resume PDF Preview...</p>
            </div>
          )}
          <iframe
            src={previewUrl}
            onLoad={() => setIsLoading(false)}
            className="w-full h-full border-0 rounded-xl"
            title="Resume PDF Preview"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
