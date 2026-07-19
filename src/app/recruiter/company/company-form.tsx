"use client";

import { useState } from "react";
import { upsertCompany } from "@/actions/company";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function CompanyForm({ initialData }: { initialData: any }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Make inputs controlled to avoid Base UI warnings
  const [name, setName] = useState(initialData?.name || "");
  const [website, setWebsite] = useState(initialData?.website || "");
  const [description, setDescription] = useState(initialData?.description || "");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const result = await upsertCompany(formData);
    
    setIsLoading(false);
    
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Company profile updated!");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-zinc-300">Company Name</Label>
        <Input 
          id="name" 
          name="name" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          required 
          className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500" 
          placeholder="e.g. Acme Corp"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="website" className="text-zinc-300">Website URL (Optional)</Label>
        <Input 
          id="website" 
          name="website" 
          type="url" 
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500" 
          placeholder="https://acme.com"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description" className="text-zinc-300">Company Description</Label>
        <textarea 
          id="description" 
          name="description" 
          required 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="flex w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 ring-offset-background placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Describe your organization..."
        />
      </div>
      
      <Button type="submit" disabled={isLoading} className="bg-white text-zinc-950 hover:bg-zinc-200">
        {isLoading ? "Saving..." : "Save Profile"}
      </Button>
    </form>
  );
}
