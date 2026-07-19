"use client";

import { useState } from "react";
import { createJob } from "@/actions/jobs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CreateJobPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const result = await createJob(formData);
    
    setIsLoading(false);
    
    // Server action redirects on success, so we only handle error here
    if (result?.error) {
      toast.error(result.error);
    } else {
        toast.success("Job posted successfully!");
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Post a New Job</h1>
        <p className="text-zinc-400 mt-2">Fill in the details to publish a new open position.</p>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-zinc-100">Job Details</CardTitle>
          <CardDescription className="text-zinc-400">
            Be as descriptive as possible to attract the right candidates.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-zinc-300">Job Title</Label>
              <Input 
                id="title" 
                name="title" 
                required 
                className="bg-zinc-800 border-zinc-700 text-zinc-100" 
                placeholder="e.g. Senior Frontend Engineer"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                <Label htmlFor="location" className="text-zinc-300">Location</Label>
                <Input 
                    id="location" 
                    name="location" 
                    className="bg-zinc-800 border-zinc-700 text-zinc-100" 
                    placeholder="e.g. Remote, New York, NY"
                />
                </div>
                <div className="space-y-2">
                <Label htmlFor="salary" className="text-zinc-300">Salary Range</Label>
                <Input 
                    id="salary" 
                    name="salary" 
                    className="bg-zinc-800 border-zinc-700 text-zinc-100" 
                    placeholder="e.g. $100k - $120k"
                />
                </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="deadline" className="text-zinc-300">Application Deadline (Optional)</Label>
              <Input 
                  type="date"
                  id="deadline" 
                  name="deadline" 
                  className="bg-zinc-800 border-zinc-700 text-zinc-100 w-full sm:w-[50%]" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-zinc-300">Job Description</Label>
              <textarea 
                id="description" 
                name="description" 
                required 
                rows={5}
                className="flex w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 ring-offset-background placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="What will the candidate be doing?"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements" className="text-zinc-300">Requirements & Skills</Label>
              <textarea 
                id="requirements" 
                name="requirements" 
                required 
                rows={4}
                className="flex w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 ring-offset-background placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="E.g. React, TypeScript, 3+ years experience..."
              />
            </div>
            
            <div className="pt-4 flex gap-4">
              <Button type="button" variant="outline" onClick={() => router.back()} className="bg-zinc-950 border-zinc-700 text-white hover:bg-zinc-800">
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-white text-zinc-950 hover:bg-zinc-200 flex-1">
                {isLoading ? "Posting Job..." : "Publish Job"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
