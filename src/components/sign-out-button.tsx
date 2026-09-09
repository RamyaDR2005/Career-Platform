"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function SignOutButton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <Button
      className={className}
      style={style}
      onClick={() => {
        import("next-auth/react").then(({ signOut }) => {
          signOut({ callbackUrl: "/" });
        });
      }}
    >
      <LogOut className="mr-2 h-4 w-4" /> Sign Out & Return to Home
    </Button>
  );
}
