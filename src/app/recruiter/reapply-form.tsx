"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";

export function ReapplyForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileBase64, setFileBase64] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const b64 = base64String.split(",")[1] || base64String;
        setFileBase64(b64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileBase64) {
      toast.error("Please select a file to upload.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/reapply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          verificationDocBase64: fileBase64,
          fileName,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Something went wrong.");
        return;
      }

      toast.success("Application submitted successfully!");
      // Refresh the page to reload the layout and show pending state
      router.refresh();
    } catch (error) {
      toast.error("Failed to submit application.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!showForm) {
    return (
      <Button 
        onClick={() => setShowForm(true)}
        className="w-full text-foreground transition-colors mt-2" 
        style={{ backgroundColor: "#1c211d", color: "#f7f1e7", borderRadius: "33554400px" }}
      >
        <Upload className="w-4 h-4 mr-2" />
        Upload New Document to Re-apply
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full mt-4 p-4 border border-[#ded3c5] rounded-xl bg-white text-left space-y-4">
      <div className="space-y-2">
        <Label htmlFor="verificationDoc" style={{ color: "#1c211d" }}>New Verification Document</Label>
        <Input
          id="verificationDoc"
          type="file"
          ref={fileInputRef}
          accept=".pdf"
          required
          onChange={handleFileChange}
          style={{ backgroundColor: "#ffffff", borderColor: "#ded3c5", color: "#1c211d" }}
        />
        <p className="text-[11px] text-[#706b63] leading-relaxed">
          Please upload a single PDF containing your Employee ID card and recruiter proof documentation.
        </p>
      </div>
      <div className="flex space-x-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => setShowForm(false)}
          className="flex-1 rounded-full"
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="flex-1 text-foreground transition-colors" 
          style={{ backgroundColor: "#c95a2e", borderRadius: "33554400px" }}
          disabled={isLoading || !fileBase64}
        >
          {isLoading ? "Uploading..." : "Submit"}
        </Button>
      </div>
    </form>
  );
}
