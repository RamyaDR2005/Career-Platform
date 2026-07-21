"use client";

import { useState } from "react";
import { getDropboxUploadLink, saveResumeUrl } from "@/actions/upload-resume";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { FileUp, FileText } from "lucide-react";

export default function ResumeUploadForm() {
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a PDF file");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      toast.error("File size must be under 3MB");
      return;
    }

    setIsUploading(true);
    
    try {
      // 1. Get temporary upload link from the server
      const linkResult = await getDropboxUploadLink(file.name);
      
      if (linkResult.error || !linkResult.link || !linkResult.path) {
        toast.error(linkResult.error || "Failed to initialize upload");
        setIsUploading(false);
        return;
      }

      // 2. Upload file directly to Dropbox from the browser
      const uploadRes = await fetch(linkResult.link, {
        method: "POST",
        headers: {
          "Content-Type": "application/octet-stream",
        },
        body: file,
      });

      if (!uploadRes.ok) {
        toast.error("Failed to upload file to Dropbox");
        setIsUploading(false);
        return;
      }

      // 3. Save the uploaded file path to the database
      const saveResult = await saveResumeUrl(linkResult.path);
      
      if (saveResult.error) {
        toast.error(saveResult.error);
      } else {
        toast.success("Resume uploaded successfully!");
        setFile(null);
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(`Error: ${error?.message || "An unexpected error occurred during upload."}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-zinc-100">Upload New Resume</CardTitle>
        <CardDescription className="text-zinc-400">
          PDF format only, Max 3MB. Uploading a new resume will replace the current one.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <Label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-48 border-2 border-zinc-700 border-dashed rounded-lg cursor-pointer bg-zinc-950 hover:bg-zinc-800/50 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FileUp className="w-10 h-10 mb-3 text-zinc-500" />
                <p className="mb-2 text-sm text-zinc-400">
                  <span className="font-semibold text-white">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-zinc-500 mt-2">PDF (MAX. 3MB)</p>
                {file && <p className="mt-4 text-sm font-medium text-blue-400 flex items-center gap-2"><FileText className="w-4 h-4"/> {file.name}</p>}
              </div>
              <Input 
                id="dropzone-file" 
                type="file" 
                accept="application/pdf"
                className="hidden" 
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </Label>
          </div>
          <Button 
            type="submit" 
            disabled={isUploading || !file} 
            className="w-full bg-white text-zinc-950 hover:bg-zinc-200"
          >
            {isUploading ? "Uploading..." : "Upload Resume"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
