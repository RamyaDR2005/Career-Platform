"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, DollarSign, Building2, Briefcase, Search, CalendarX, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ApplyButton } from "./apply-button";
import { CoverLetterModal } from "./cover-letter-modal";
import { JobDetailsModal } from "./job-details-modal";

export function StudentJobsClientList({ initialJobs, appliedJobIds }: { initialJobs: any[], appliedJobIds: string[] }) {
  const [search, setSearch] = useState("");
  const appliedSet = new Set(appliedJobIds);

  const filteredJobs = initialJobs.filter(job => 
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    job.company.name.toLowerCase().includes(search.toLowerCase()) ||
    job.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground max-w-xl"
          placeholder="Search jobs by title, company, or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-6">
        {filteredJobs.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="flex flex-col items-center justify-center p-12 text-muted-foreground">
              <Briefcase className="w-12 h-12 mb-4 opacity-20" />
              <p>No jobs found matching your search.</p>
            </CardContent>
          </Card>
        ) : (
          filteredJobs.map(job => {
            let isDisabled = false;
            let disabledReason = "";

            if (job.status === "CLOSED") {
              isDisabled = true;
              disabledReason = "Hiring Closed";
            } else if (job.deadline && new Date(job.deadline) < new Date()) {
              isDisabled = true;
              disabledReason = "Deadline Passed";
            }

            return (
              <Card key={job.id} className={`bg-card border-border flex flex-col md:flex-row items-start ${isDisabled ? 'opacity-80' : ''}`}>
                <div className="flex-1">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">{job.company.name}</span>
                      {job.status === "CLOSED" && (
                        <span className="ml-2 bg-red-950 text-red-400 text-xs px-2 py-0.5 rounded-full border border-red-900 flex items-center gap-1">
                          <XCircle className="w-3 h-3" /> Closed
                        </span>
                      )}
                      {job.status === "OPEN" && job.deadline && new Date(job.deadline) < new Date() && (
                        <span className="ml-2 bg-orange-950 text-orange-400 text-xs px-2 py-0.5 rounded-full border border-orange-900 flex items-center gap-1">
                          <CalendarX className="w-3 h-3" /> Deadline Passed
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-xl text-foreground">{job.title}</CardTitle>
                    <CardDescription className="flex items-center gap-4 text-muted-foreground mt-2 flex-wrap">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> {job.location || "Location not specified"}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" /> {job.salary || "Salary not specified"}
                      </span>
                      {job.deadline && (
                        <span className="flex items-center gap-1 text-muted-foreground">
                           • Deadline: {new Date(job.deadline).toLocaleDateString()}
                        </span>
                      )}
                    </CardDescription>
                  </CardHeader>
                </div>
                <div className="p-6 md:pl-0 flex flex-col md:flex-row items-center justify-end gap-3 w-full md:w-auto h-full border-t border-border md:border-t-0 md:border-l md:border-border/50 min-h-[150px]">
                  <JobDetailsModal job={job} />
                  {!isDisabled && <CoverLetterModal jobId={job.id} />}
                  <ApplyButton 
                    jobId={job.id} 
                    hasApplied={appliedSet.has(job.id)} 
                    isDisabled={isDisabled}
                    disabledReason={disabledReason}
                  />
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
