"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MapPin, DollarSign, Building2 } from "lucide-react";

export function JobDetailsModal({ job }: { job: any }) {
  return (
    <Dialog>
      <DialogTrigger 
        render={<Button variant="outline" className="bg-background border-border text-muted-foreground hover:bg-muted hover:text-foreground">View Job</Button>}
      />
      <DialogContent className="bg-background border-border text-foreground sm:max-w-6xl w-[95vw] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-5 h-5 text-muted-foreground" />
            <span className="text-lg font-medium text-muted-foreground">{job.company.name}</span>
          </div>
          <DialogTitle className="text-2xl">{job.title}</DialogTitle>
          <DialogDescription className="flex items-center gap-4 text-muted-foreground mt-2">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" /> {job.location || "Location not specified"}
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" /> {job.salary || "Salary not specified"}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Job Description</h3>
            <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-sm">
              {job.description}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Requirements</h3>
            <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-sm">
              {job.requirements}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
