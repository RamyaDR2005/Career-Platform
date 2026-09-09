"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import { rejectRecruiter } from "@/actions/admin";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export function RejectButton({ profileId }: { profileId: string }) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);

  const handleReject = async () => {
    setIsRejecting(true);
    try {
      const res = await rejectRecruiter(profileId, note);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Recruiter application rejected.");
        setOpen(false);
      }
    } catch (error) {
      toast.error("Failed to reject recruiter.");
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger 
        render={
          <Button size="sm" variant="destructive" className="bg-red-900 hover:bg-red-800 text-foreground" />
        }
      >
        <XCircle className="w-4 h-4 mr-1" /> Reject
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card text-foreground border-border">
        <DialogHeader>
          <DialogTitle>Reject Recruiter Application</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Provide an optional note explaining why the application was rejected. The user will see this in their portal.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder="E.g., The provided ID card is not legible. Please re-upload a clearer image."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="bg-background text-foreground border-border min-h-[100px]"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isRejecting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleReject} disabled={isRejecting}>
            {isRejecting ? "Rejecting..." : "Confirm Rejection"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
