"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid or missing reset token.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to reset password.");
        setIsLoading(false);
        return;
      }

      toast.success("Password reset successfully! You can now log in.");
      router.push("/login");
    } catch (error) {
      toast.error("An unexpected error occurred.");
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <Card className="w-full max-w-md border-0 shadow-[rgba(201,90,46,0.35)_0px_8px_25px_0px]" style={{ backgroundColor: "#fff9f2", color: "#1c211d" }}>
        <CardHeader className="space-y-1 mt-6 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Invalid Link</CardTitle>
          <CardDescription style={{ color: "#706b63" }}>
            The reset link is invalid or has expired. Please request a new one.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button asChild className="w-full" style={{ backgroundColor: "#c95a2e", borderRadius: "33554400px", color: "white" }}>
            <Link href="/login">Return to Login</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md border-0 shadow-[rgba(201,90,46,0.35)_0px_8px_25px_0px] relative" style={{ backgroundColor: "#fff9f2", color: "#1c211d" }}>
      <Button 
        variant="ghost" 
        className="absolute top-2 left-2" 
        style={{ color: "#706b63" }}
        asChild
      >
        <Link href="/login">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Link>
      </Button>
      
      <CardHeader className="space-y-1 mt-6 text-center">
        <CardTitle className="text-3xl font-bold tracking-tight">Set new password</CardTitle>
        <CardDescription style={{ color: "#706b63" }}>
          Enter a new password for your account.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleReset} className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="space-y-2">
            <Label htmlFor="password" style={{ color: "#1c211d" }}>New Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ backgroundColor: "#ffffff", borderColor: "#ded3c5", color: "#1c211d" }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" style={{ color: "#1c211d" }}>Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{ backgroundColor: "#ffffff", borderColor: "#ded3c5", color: "#1c211d" }}
            />
          </div>
          <Button 
            className="w-full transition-colors" 
            style={{ backgroundColor: "#c95a2e", borderRadius: "33554400px", color: "white" }}
            type="submit" 
            disabled={isLoading}
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4" style={{ backgroundColor: "#f7f1e7", color: "#1c211d", fontFamily: "'Canela', serif" }}>
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
