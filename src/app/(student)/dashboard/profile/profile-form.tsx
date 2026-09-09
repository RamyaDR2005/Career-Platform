"use client";

import { useState } from "react";
import { updateProfile } from "@/actions/profile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

const DEGREES = ["B.Tech", "B.E.", "B.S.", "BCA", "M.Tech", "M.S.", "MCA", "MBA", "Ph.D."];
const BRANCHES = [
  "Computer Science",
  "Information Technology",
  "Software Engineering",
  "Data Science",
  "Artificial Intelligence & Machine Learning",
  "Electronics & Communication",
  "Electrical & Electronics",
  "Mechanical Engineering",
  "Civil Engineering",
  "Chemical Engineering",
  "Biotechnology",
  "Business Administration"
];

export function ProfileForm({ initialData }: { initialData: any }) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: initialData?.user?.name || "",
    college: initialData?.college || "",
    graduationYear: initialData?.graduationYear || "",
    cgpa: initialData?.cgpa || "",
    linkedinUrl: initialData?.linkedinUrl || "",
    githubUrl: initialData?.githubUrl || "",
    portfolioUrl: initialData?.portfolioUrl || "",
  });

  // Degree states
  const isDegreePredefined = DEGREES.includes(initialData?.degree);
  const [degreeSelect, setDegreeSelect] = useState(
    initialData?.degree ? (isDegreePredefined ? initialData.degree : "Other") : ""
  );
  const [customDegree, setCustomDegree] = useState(
    isDegreePredefined ? "" : (initialData?.degree || "")
  );

  // Branch states
  const isBranchPredefined = BRANCHES.includes(initialData?.branch);
  const [branchSelect, setBranchSelect] = useState(
    initialData?.branch ? (isBranchPredefined ? initialData.branch : "Other") : ""
  );
  const [customBranch, setCustomBranch] = useState(
    isBranchPredefined ? "" : (initialData?.branch || "")
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Name Validation
    const nameVal = formData.name.trim();
    if (!nameVal) {
      newErrors.name = "Full name is required";
    } else if (nameVal.length < 2) {
      newErrors.name = "Name must be at least 2 characters long";
    } else if (nameVal.length > 50) {
      newErrors.name = "Name must be under 50 characters";
    } else if (!/^[a-zA-Z\s.-]+$/.test(nameVal)) {
      newErrors.name = "Name can only contain letters, spaces, dots, and hyphens";
    }

    // College Validation
    const collegeVal = formData.college.trim();
    if (!collegeVal) {
      newErrors.college = "College/University name is required";
    } else if (collegeVal.length < 2) {
      newErrors.college = "College name must be at least 2 characters long";
    } else if (collegeVal.length > 100) {
      newErrors.college = "College name must be under 100 characters";
    }

    // Degree Validation
    const degreeValue = degreeSelect === "Other" ? customDegree.trim() : degreeSelect;
    if (!degreeValue) {
      newErrors.degree = "Degree selection is required";
    } else if (degreeValue.length < 2) {
      newErrors.degree = "Degree must be at least 2 characters long";
    } else if (degreeValue.length > 50) {
      newErrors.degree = "Degree must be under 50 characters";
    }

    // Branch Validation
    const branchValue = branchSelect === "Other" ? customBranch.trim() : branchSelect;
    if (!branchValue) {
      newErrors.branch = "Branch/Major selection is required";
    } else if (branchValue.length < 2) {
      newErrors.branch = "Branch name must be at least 2 characters long";
    } else if (branchValue.length > 50) {
      newErrors.branch = "Branch name must be under 50 characters";
    }

    // Graduation Year Validation
    const gradYearStr = String(formData.graduationYear).trim();
    if (!gradYearStr) {
      newErrors.graduationYear = "Graduation year is required";
    } else {
      const gradYear = parseInt(gradYearStr, 10);
      if (isNaN(gradYear)) {
        newErrors.graduationYear = "Graduation year must be a valid number";
      } else if (gradYear < 1980 || gradYear > 2040) {
        newErrors.graduationYear = "Graduation year must be between 1980 and 2040";
      }
    }

    // CGPA Validation
    const cgpaStr = String(formData.cgpa).trim();
    if (!cgpaStr) {
      newErrors.cgpa = "CGPA is required";
    } else {
      const cgpa = parseFloat(cgpaStr);
      if (isNaN(cgpa)) {
        newErrors.cgpa = "CGPA must be a valid decimal number";
      } else if (cgpa < 0 || cgpa > 10) {
        newErrors.cgpa = "CGPA must be between 0.0 and 10.0";
      }
    }

    // LinkedIn URL Validation
    const linkedinVal = formData.linkedinUrl.trim();
    if (linkedinVal) {
      const linkedinPattern = /^https:\/\/(www\.)?([a-z]{2,3}\.)?linkedin\.com\/.*$/i;
      if (!linkedinPattern.test(linkedinVal)) {
        newErrors.linkedinUrl = "Please enter a valid LinkedIn URL (e.g. https://linkedin.com/in/username)";
      }
    }

    // GitHub URL Validation
    const githubVal = formData.githubUrl.trim();
    if (githubVal) {
      const githubPattern = /^https:\/\/(www\.)?github\.com\/.*$/i;
      if (!githubPattern.test(githubVal)) {
        newErrors.githubUrl = "Please enter a valid GitHub URL (e.g. https://github.com/username)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please resolve validation errors before saving");
      return;
    }
    
    setIsLoading(true);

    const payload = {
      ...formData,
      degree: degreeSelect === "Other" ? customDegree.trim() : degreeSelect,
      branch: branchSelect === "Other" ? customBranch.trim() : branchSelect,
    };
    
    const result = await updateProfile(payload);
    
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Profile updated successfully!");
    }
    
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Personal Information</CardTitle>
          <CardDescription className="text-muted-foreground">Update your academic and professional details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground border-b border-border pb-2">Basic Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-muted-foreground">Full Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  className={`bg-background border-border text-foreground ${errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}`} 
                />
                {errors.name && <p className="text-xs text-red-500 font-medium mt-1">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-muted-foreground">Email Address</Label>
                <Input id="email" value={initialData?.user?.email || ""} readOnly className="bg-card border-border text-muted-foreground focus-visible:ring-0" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground border-b border-border pb-2">Academic Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="college" className="text-muted-foreground">College / University</Label>
                <Input 
                  id="college" 
                  name="college" 
                  value={formData.college} 
                  onChange={handleChange} 
                  placeholder="e.g. Stanford University" 
                  className={`bg-background border-border text-foreground ${errors.college ? 'border-red-500 focus-visible:ring-red-500' : ''}`} 
                />
                {errors.college && <p className="text-xs text-red-500 font-medium mt-1">{errors.college}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="degreeSelect" className="text-muted-foreground">Degree</Label>
                <select
                  id="degreeSelect"
                  name="degreeSelect"
                  value={degreeSelect}
                  onChange={(e) => {
                    setDegreeSelect(e.target.value);
                    if (errors.degree) {
                      setErrors(prev => {
                        const next = { ...prev };
                        delete next.degree;
                        return next;
                      });
                    }
                  }}
                  className={`bg-background border-border text-foreground flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-zinc-700 ${errors.degree ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                >
                  <option value="" disabled>Select your degree</option>
                  {DEGREES.map((deg) => (
                    <option key={deg} value={deg} className="bg-background text-foreground">{deg}</option>
                  ))}
                  <option value="Other" className="bg-background text-foreground">Other (Specify manually)</option>
                </select>
                {degreeSelect === "Other" && (
                  <div className="mt-2 space-y-1">
                    <Label htmlFor="customDegree" className="text-muted-foreground text-xs">Specify Custom Degree</Label>
                    <Input 
                      id="customDegree" 
                      name="customDegree" 
                      value={customDegree} 
                      onChange={(e) => {
                        setCustomDegree(e.target.value);
                        if (errors.degree) {
                          setErrors(prev => {
                            const next = { ...prev };
                            delete next.degree;
                            return next;
                          });
                        }
                      }} 
                      placeholder="e.g. B.S. in Design" 
                      className={`bg-background border-border text-foreground ${errors.degree ? 'border-red-500 focus-visible:ring-red-500' : ''}`} 
                    />
                  </div>
                )}
                {errors.degree && <p className="text-xs text-red-500 font-medium mt-1">{errors.degree}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="branchSelect" className="text-muted-foreground">Branch / Major</Label>
                <select
                  id="branchSelect"
                  name="branchSelect"
                  value={branchSelect}
                  onChange={(e) => {
                    setBranchSelect(e.target.value);
                    if (errors.branch) {
                      setErrors(prev => {
                        const next = { ...prev };
                        delete next.branch;
                        return next;
                      });
                    }
                  }}
                  className={`bg-background border-border text-foreground flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-zinc-700 ${errors.branch ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                >
                  <option value="" disabled>Select your branch/major</option>
                  {BRANCHES.map((br) => (
                    <option key={br} value={br} className="bg-background text-foreground">{br}</option>
                  ))}
                  <option value="Other" className="bg-background text-foreground">Other (Specify manually)</option>
                </select>
                {branchSelect === "Other" && (
                  <div className="mt-2 space-y-1">
                    <Label htmlFor="customBranch" className="text-muted-foreground text-xs">Specify Custom Branch / Major</Label>
                    <Input 
                      id="customBranch" 
                      name="customBranch" 
                      value={customBranch} 
                      onChange={(e) => {
                        setCustomBranch(e.target.value);
                        if (errors.branch) {
                          setErrors(prev => {
                            const next = { ...prev };
                            delete next.branch;
                            return next;
                          });
                        }
                      }} 
                      placeholder="e.g. Cognitive Science" 
                      className={`bg-background border-border text-foreground ${errors.branch ? 'border-red-500 focus-visible:ring-red-500' : ''}`} 
                    />
                  </div>
                )}
                {errors.branch && <p className="text-xs text-red-500 font-medium mt-1">{errors.branch}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="graduationYear" className="text-muted-foreground">Graduation Year</Label>
                <Input 
                  id="graduationYear" 
                  name="graduationYear" 
                  type="number" 
                  value={formData.graduationYear} 
                  onChange={handleChange} 
                  placeholder="e.g. 2025" 
                  className={`bg-background border-border text-foreground ${errors.graduationYear ? 'border-red-500 focus-visible:ring-red-500' : ''}`} 
                />
                {errors.graduationYear && <p className="text-xs text-red-500 font-medium mt-1">{errors.graduationYear}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cgpa" className="text-muted-foreground">CGPA (Out of 10 or 4)</Label>
                <Input 
                  id="cgpa" 
                  name="cgpa" 
                  type="number" 
                  step="0.01" 
                  value={formData.cgpa} 
                  onChange={handleChange} 
                  placeholder="e.g. 8.5" 
                  className={`bg-background border-border text-foreground ${errors.cgpa ? 'border-red-500 focus-visible:ring-red-500' : ''}`} 
                />
                {errors.cgpa && <p className="text-xs text-red-500 font-medium mt-1">{errors.cgpa}</p>}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground border-b border-border pb-2">Social Profiles</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="linkedinUrl" className="text-muted-foreground">LinkedIn URL</Label>
                <Input 
                  id="linkedinUrl" 
                  name="linkedinUrl" 
                  type="url" 
                  value={formData.linkedinUrl} 
                  onChange={handleChange} 
                  placeholder="https://linkedin.com/in/username" 
                  className={`bg-background border-border text-foreground ${errors.linkedinUrl ? 'border-red-500 focus-visible:ring-red-500' : ''}`} 
                />
                {errors.linkedinUrl && <p className="text-xs text-red-500 font-medium mt-1">{errors.linkedinUrl}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="githubUrl" className="text-muted-foreground">GitHub URL</Label>
                <Input 
                  id="githubUrl" 
                  name="githubUrl" 
                  type="url" 
                  value={formData.githubUrl} 
                  onChange={handleChange} 
                  placeholder="https://github.com/username" 
                  className={`bg-background border-border text-foreground ${errors.githubUrl ? 'border-red-500 focus-visible:ring-red-500' : ''}`} 
                />
                {errors.githubUrl && <p className="text-xs text-red-500 font-medium mt-1">{errors.githubUrl}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="portfolioUrl" className="text-muted-foreground">Portfolio Website URL</Label>
                <Input 
                  id="portfolioUrl" 
                  name="portfolioUrl" 
                  type="url" 
                  value={formData.portfolioUrl} 
                  onChange={handleChange} 
                  placeholder="https://myportfolio.dev" 
                  className={`bg-background border-border text-foreground ${errors.portfolioUrl ? 'border-red-500 focus-visible:ring-red-500' : ''}`} 
                />
                <p className="text-[11px] text-muted-foreground">Watsonx AI will analyze your live portfolio website & project demos as an engineer.</p>
                {errors.portfolioUrl && <p className="text-xs text-red-500 font-medium mt-1">{errors.portfolioUrl}</p>}
              </div>
            </div>
          </div>

        </CardContent>
        <CardFooter className="border-t border-border pt-6">
          <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary text-foreground ml-auto">
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
