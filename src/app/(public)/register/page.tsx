"use client";

import { useState, useRef } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "STUDENT",
    companyName: "",
    employeeId: "",
  });
  const [fileBase64, setFileBase64] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Strip the data:image/jpeg;base64, part if present
        const b64 = base64String.split(",")[1] || base64String;
        setFileBase64(b64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.role === "RECRUITER" && !fileBase64) {
      toast.error("Please upload a verification document.");
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        verificationDocBase64: fileBase64,
        fileName,
      };

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Something went wrong.");
        return;
      }

      toast.success(
        formData.role === "RECRUITER" 
          ? "Account created! Pending verification." 
          : "Account created successfully!"
      );
      router.push("/login");
    } catch (error) {
      toast.error("Failed to create account.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4" style={{ backgroundColor: "#f7f1e7", color: "#1c211d", fontFamily: "'Canela', serif" }}>
      <Card className="w-full max-w-md border-0 shadow-[rgba(201,90,46,0.35)_0px_8px_25px_0px]" style={{ backgroundColor: "#fff9f2", color: "#1c211d" }}>
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold tracking-tight text-center">
            Create an account
          </CardTitle>
          <CardDescription className="text-center" style={{ color: "#706b63" }}>
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" style={{ color: "#1c211d" }}>Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                required
                value={formData.name}
                onChange={handleChange}
                style={{ backgroundColor: "#ffffff", borderColor: "#ded3c5", color: "#1c211d" }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" style={{ color: "#1c211d" }}>Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                value={formData.email}
                onChange={handleChange}
                style={{ backgroundColor: "#ffffff", borderColor: "#ded3c5", color: "#1c211d" }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" style={{ color: "#1c211d" }}>Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                style={{ backgroundColor: "#ffffff", borderColor: "#ded3c5", color: "#1c211d" }}
              />
            </div>
            <div className="space-y-2 flex flex-col">
              <Label htmlFor="role" style={{ color: "#1c211d" }}>I am a</Label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                style={{ backgroundColor: "#ffffff", borderColor: "#ded3c5", color: "#1c211d" }}
              >
                <option value="STUDENT">Student</option>
                <option value="RECRUITER">Recruiter</option>
              </select>
            </div>

            {formData.role === "RECRUITER" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="space-y-2">
                  <Label htmlFor="companyName" style={{ color: "#1c211d" }}>Company Name</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    required
                    value={formData.companyName}
                    onChange={handleChange}
                    style={{ backgroundColor: "#ffffff", borderColor: "#ded3c5", color: "#1c211d" }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employeeId" style={{ color: "#1c211d" }}>Employee ID</Label>
                  <Input
                    id="employeeId"
                    name="employeeId"
                    required
                    value={formData.employeeId}
                    onChange={handleChange}
                    style={{ backgroundColor: "#ffffff", borderColor: "#ded3c5", color: "#1c211d" }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="verificationDoc" style={{ color: "#1c211d" }}>Verification Document (Employee ID & Proof Doc)</Label>
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
              </div>
            )}

            <Button 
              className="w-full text-foreground transition-colors" 
              style={{ backgroundColor: "#c95a2e", borderRadius: "33554400px" }}
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" style={{ borderColor: "#ded3c5" }} />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-2" style={{ backgroundColor: "#fff9f2", color: "#706b63" }}>
                Or continue with
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            type="button"
            className="w-full transition-colors"
            style={{ backgroundColor: "#ffffff", borderColor: "#ded3c5", color: "#1c211d", borderRadius: "33554400px" }}
            onClick={() => signIn("google", { callbackUrl: "/" })}
            disabled={isLoading}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
            Google
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm" style={{ color: "#706b63" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "#c95a2e", textDecoration: "none" }} className="hover:underline font-bold">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
