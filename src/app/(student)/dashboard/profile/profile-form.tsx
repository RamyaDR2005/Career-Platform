"use client";

import { useState } from "react";
import { updateProfile } from "@/actions/profile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

export function ProfileForm({ initialData }: { initialData: any }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.user?.name || "",
    college: initialData?.college || "",
    degree: initialData?.degree || "",
    branch: initialData?.branch || "",
    graduationYear: initialData?.graduationYear || "",
    cgpa: initialData?.cgpa || "",
    linkedinUrl: initialData?.linkedinUrl || "",
    githubUrl: initialData?.githubUrl || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const result = await updateProfile(formData);
    
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Profile updated successfully!");
    }
    
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-zinc-100">Personal Information</CardTitle>
          <CardDescription className="text-zinc-400">Update your academic and professional details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-white border-b border-zinc-800 pb-2">Basic Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-zinc-300">Full Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} className="bg-zinc-950 border-zinc-800 text-zinc-100" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-zinc-300">Email Address</Label>
                <Input id="email" value={initialData?.user?.email || ""} readOnly className="bg-zinc-900 border-zinc-800 text-zinc-400 focus-visible:ring-0" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-white border-b border-zinc-800 pb-2">Academic Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="college" className="text-zinc-300">College / University</Label>
                <Input id="college" name="college" value={formData.college} onChange={handleChange} placeholder="e.g. Stanford University" className="bg-zinc-950 border-zinc-800 text-zinc-100" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="degree" className="text-zinc-300">Degree</Label>
                <Input id="degree" name="degree" value={formData.degree} onChange={handleChange} placeholder="e.g. B.Tech, B.S." className="bg-zinc-950 border-zinc-800 text-zinc-100" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="branch" className="text-zinc-300">Branch / Major</Label>
                <Input id="branch" name="branch" value={formData.branch} onChange={handleChange} placeholder="e.g. Computer Science" className="bg-zinc-950 border-zinc-800 text-zinc-100" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="graduationYear" className="text-zinc-300">Graduation Year</Label>
                <Input id="graduationYear" name="graduationYear" type="number" value={formData.graduationYear} onChange={handleChange} placeholder="e.g. 2025" className="bg-zinc-950 border-zinc-800 text-zinc-100" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cgpa" className="text-zinc-300">CGPA (Out of 10 or 4)</Label>
                <Input id="cgpa" name="cgpa" type="number" step="0.01" value={formData.cgpa} onChange={handleChange} placeholder="e.g. 8.5" className="bg-zinc-950 border-zinc-800 text-zinc-100" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-white border-b border-zinc-800 pb-2">Social Profiles</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="linkedinUrl" className="text-zinc-300">LinkedIn URL</Label>
                <Input id="linkedinUrl" name="linkedinUrl" type="url" value={formData.linkedinUrl} onChange={handleChange} placeholder="https://linkedin.com/in/username" className="bg-zinc-950 border-zinc-800 text-zinc-100" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="githubUrl" className="text-zinc-300">GitHub URL</Label>
                <Input id="githubUrl" name="githubUrl" type="url" value={formData.githubUrl} onChange={handleChange} placeholder="https://github.com/username" className="bg-zinc-950 border-zinc-800 text-zinc-100" />
              </div>
            </div>
          </div>

        </CardContent>
        <CardFooter className="border-t border-zinc-800 pt-6">
          <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white ml-auto">
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
