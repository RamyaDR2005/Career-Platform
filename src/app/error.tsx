"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Database, RefreshCw, AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Application Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center bg-background text-foreground">
      <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-400 border border-amber-500/20 shadow-lg shadow-amber-500/10 mb-4">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Database Connection Interrupted</h2>
      <p className="text-muted-foreground text-sm max-w-md mt-2">
        The database connection pool timed out or is reconnecting. Click below to refresh the session.
      </p>
      <Button
        onClick={() => reset()}
        className="bg-primary hover:bg-primary0 text-foreground font-semibold text-xs px-6 h-10 rounded-xl shadow-lg shadow-primary/20 mt-6 transition-all"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Retry Connection
      </Button>
    </div>
  );
}
