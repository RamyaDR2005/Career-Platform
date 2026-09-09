"use client";

import { useState } from "react";
import { uploadFileToDropbox } from "@/actions/upload-resume";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Upload, FileCheck } from "lucide-react";

export default function ResumeUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a PDF resume file first.");
      return;
    }

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Only PDF files are supported.");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await uploadFileToDropbox(formData, true);

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Resume uploaded successfully!");
        setFile(null);
      }
    } catch (error) {
      console.error("Resume upload error:", error);
      toast.error("An error occurred during resume upload.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleUpload} className="space-y-4">
      <div className="border-2 border-dashed border-border hover:border-primary0/50 transition-all rounded-xl p-6 text-center bg-background/50">
        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
        <input
          type="file"
          accept=".pdf"
          id="resumeFile"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="hidden"
        />
        <label
          htmlFor="resumeFile"
          className="cursor-pointer text-xs font-semibold text-primary hover:text-primary block"
        >
          {file ? file.name : "Click to select a PDF file"}
        </label>
        <p className="text-[11px] text-muted-foreground mt-1">Maximum file size: 10MB</p>
      </div>

      <Button
        type="submit"
        disabled={!file || isUploading}
        className="w-full bg-primary hover:bg-primary0 text-foreground font-semibold text-xs h-10 rounded-xl"
      >
        {isUploading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading to Storage...
          </>
        ) : (
          <>
            <FileCheck className="w-4 h-4 mr-2" /> Save Resume
          </>
        )}
      </Button>
    </form>
  );
}
