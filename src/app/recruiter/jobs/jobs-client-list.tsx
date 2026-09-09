"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Users, Calendar, XCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { closeJobProcess, updateJobDeadline } from "@/actions/jobs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export function JobsClientList({ initialJobs }: { initialJobs: any[] }) {
  const [search, setSearch] = useState("");
  const [jobs, setJobs] = useState(initialJobs);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [newDeadline, setNewDeadline] = useState("");
  const [isDeadlineModalOpen, setIsDeadlineModalOpen] = useState(false);

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    job.location?.toLowerCase().includes(search.toLowerCase())
  );

  const handleCloseJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to end the hiring process for this job? Candidates will no longer be able to apply.")) return;
    
    setIsSubmitting(true);
    const res = await closeJobProcess(jobId);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Job process ended.");
      setJobs(jobs.map(j => j.id === jobId ? { ...j, status: "CLOSED" } : j));
    }
    setIsSubmitting(false);
  };

  const handleUpdateDeadline = async () => {
    if (!selectedJobId) return;
    setIsSubmitting(true);
    const res = await updateJobDeadline(selectedJobId, newDeadline);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Deadline updated!");
      setJobs(jobs.map(j => j.id === selectedJobId ? { ...j, deadline: newDeadline ? new Date(newDeadline) : null } : j));
      setIsDeadlineModalOpen(false);
    }
    setIsSubmitting(false);
  };

  const openDeadlineModal = (job: any) => {
    setSelectedJobId(job.id);
    setNewDeadline(job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : "");
    setIsDeadlineModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground max-w-md"
          placeholder="Search jobs by title or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-4">
        {filteredJobs.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="flex flex-col items-center justify-center p-12 text-muted-foreground">
              <p>No jobs found.</p>
            </CardContent>
          </Card>
        ) : (
          filteredJobs.map(job => (
            <Card key={job.id} className={`bg-card border-border flex flex-col md:flex-row items-start md:items-center justify-between ${job.status === "CLOSED" ? 'opacity-75' : ''}`}>
              <CardHeader className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-foreground truncate">{job.title}</CardTitle>
                  {job.status === "CLOSED" && (
                    <span className="bg-red-950 text-red-400 text-xs px-2 py-0.5 rounded-full border border-red-900 flex items-center gap-1">
                      <XCircle className="w-3 h-3" /> Closed
                    </span>
                  )}
                  {job.status === "OPEN" && (
                    <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full border border-primary flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Open
                    </span>
                  )}
                </div>
                <CardDescription className="text-muted-foreground truncate mt-1">
                  {job.location || "Remote"} • {job.salary || "Unspecified Salary"}
                  {job.deadline && ` • Deadline: ${new Date(job.deadline).toLocaleDateString()}`}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pb-6 md:pb-0 pt-0 md:pt-6 flex flex-wrap gap-3 w-full md:w-auto items-center shrink-0">
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted px-3 py-1.5 rounded-full border border-border">
                  <Users className="w-4 h-4" />
                  {job._count?.applications || 0} Applicants
                </div>
                
                {job.status === "OPEN" && (
                  <>
                    <Button variant="outline" size="sm" onClick={() => openDeadlineModal(job)} className="bg-transparent border-border text-muted-foreground hover:bg-muted">
                      <Calendar className="w-4 h-4 mr-2" /> Edit Deadline
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleCloseJob(job.id)} disabled={isSubmitting} className="bg-transparent border-destructive/20 text-red-400 hover:bg-red-950 hover:text-red-300">
                      End Hiring
                    </Button>
                  </>
                )}

                <Button asChild variant="outline" size="sm" className="bg-background border-border text-foreground hover:bg-muted ml-auto">
                  <Link href={`/recruiter/jobs/${job.id}`}>View Candidates</Link>
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={isDeadlineModalOpen} onOpenChange={setIsDeadlineModalOpen}>
        <DialogContent className="bg-background border-border text-foreground">
          <DialogHeader>
            <DialogTitle>Update Deadline</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input 
              type="date"
              value={newDeadline}
              onChange={(e) => setNewDeadline(e.target.value)}
              className="bg-card border-border text-foreground"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeadlineModalOpen(false)} className="bg-transparent border-border text-muted-foreground hover:bg-muted">Cancel</Button>
            <Button onClick={handleUpdateDeadline} disabled={isSubmitting} className="bg-primary text-primary-foreground hover:opacity-90 rounded-full px-6">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
