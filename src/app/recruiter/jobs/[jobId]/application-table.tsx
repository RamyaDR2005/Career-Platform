"use client";

import { useState, useEffect } from "react";
import { updateApplicationStatus, evaluateCandidateFit } from "@/actions/jobs";
import { scheduleInterview, getInterviews } from "@/actions/scheduler";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2, BrainCircuit, Code, Globe, FileText, CheckCircle2, Calendar } from "lucide-react";

export function ApplicationTable({ initialApplications }: { initialApplications: any[] }) {
  const [applications, setApplications] = useState(initialApplications);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<{score: number, summary: string} | null>(null);

  const handleStatusChange = async (appId: string, newStatus: string) => {
    // Optimistic update
    setApplications(apps => apps.map(app => 
      app.id === appId ? { ...app, status: newStatus } : app
    ));

    const result = await updateApplicationStatus(appId, newStatus);
    
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Status updated!");
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'HIRED': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'SHORTLISTED': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'REJECTED': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
    }
  };

  const handleEvaluate = async (appId: string) => {
    setIsEvaluating(true);
    setEvaluationResult(null); // clear old result
    toast.info("Watsonx is analyzing candidate fit...");
    
    const result = await evaluateCandidateFit(appId);
    
    if (result.error) {
      toast.error(result.error);
    } else if (result.response) {
      setEvaluationResult(result.response);
      toast.success("AI Evaluation Complete!");
      // Update local state to reflect the new AI score if it changed
      setApplications(apps => apps.map(app => 
        app.id === appId ? { ...app, aiScore: result.response.score } : app
      ));
    }
    
    setIsEvaluating(false);
  };

  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduledAt, setScheduledAt] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [interviews, setInterviews] = useState<any[]>([]);

  const loadInterviews = async (appId: string) => {
    const res = await getInterviews(appId);
    if (res.interviews) {
      setInterviews(res.interviews);
    }
  };

  const handleSchedule = async (appId: string) => {
    if (!scheduledAt) {
      toast.error("Please provide a date and time.");
      return;
    }
    setIsScheduling(true);
    const res = await scheduleInterview(appId, scheduledAt, meetingLink, "");
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Interview scheduled successfully!");
      setScheduledAt("");
      setMeetingLink("");
      loadInterviews(appId);
    }
    setIsScheduling(false);
  };

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortByScore, setSortByScore] = useState(false);

  const openModal = (app: any) => {
    setSelectedApp(app);
    setEvaluationResult(null);
    setInterviews([]);
    loadInterviews(app.id);
  };

  if (applications.length === 0) {
    return <div className="p-12 text-center text-zinc-500 font-medium text-sm">No applications received yet.</div>;
  }

  let filteredApps = applications.filter(app => {
    const matchesSearch = app.studentProfile.user.name?.toLowerCase().includes(search.toLowerCase()) || 
                          app.studentProfile.user.email?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (sortByScore) {
    filteredApps.sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0));
  } else {
    // default sort by date (newest first), assuming they are already sorted or keeping original order
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <input 
          type="text" 
          placeholder="Search by name or email..." 
          className="bg-zinc-950 border border-zinc-800 rounded-md text-sm py-2 px-3 text-white focus:outline-none focus:border-zinc-700 w-full sm:w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="bg-zinc-950 border border-zinc-800 rounded-md text-sm py-2 px-3 text-white focus:outline-none focus:border-zinc-700 w-full sm:w-auto"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="SHORTLISTED">Shortlisted</option>
          <option value="REJECTED">Rejected</option>
          <option value="HIRED">Hired</option>
        </select>
        <Button 
          variant={sortByScore ? "default" : "outline"}
          onClick={() => setSortByScore(!sortByScore)}
          className={`w-full sm:w-auto ${sortByScore ? 'bg-purple-600 hover:bg-purple-700 text-white border-transparent' : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:bg-zinc-900'}`}
        >
          Sort by AI Score
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-zinc-300">
        <thead className="text-xs uppercase bg-zinc-950 text-zinc-400 border-b border-zinc-800">
          <tr>
            <th className="px-6 py-4 font-medium">Candidate</th>
            <th className="px-6 py-4 font-medium">General ATS Match</th>
            <th className="px-6 py-4 font-medium">Job Fit Score</th>
            <th className="px-6 py-4 font-medium">Status</th>
            <th className="px-6 py-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800">
          {filteredApps.map((app) => (
            <tr key={app.id} className="hover:bg-zinc-800/50 transition-colors">
              <td className="px-6 py-4">
                <div className="font-medium text-white">{app.studentProfile.user.name}</div>
                <div className="text-zinc-500 text-xs">{app.studentProfile.user.email}</div>
              </td>
              <td className="px-6 py-4">
                <span className="text-white font-bold">{app.studentProfile.atsScore || '--'}</span>
                <span className="text-zinc-500 text-xs ml-1">/100</span>
              </td>
              <td className="px-6 py-4">
                {app.aiScore ? (
                  <div className="flex items-center gap-2">
                    <span className="text-blue-400 font-bold">{app.aiScore}</span>
                    <span className="text-zinc-500 text-xs">/100</span>
                    <CheckCircle2 className="w-3 h-3 text-blue-500" />
                  </div>
                ) : (
                  <span className="text-zinc-500 text-xs italic">Not evaluated</span>
                )}
              </td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-md text-xs border ${getStatusColor(app.status)}`}>
                  {app.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right space-x-2">
                <Button variant="outline" size="sm" onClick={() => openModal(app)} className="border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800">
                  Review
                </Button>
                <select 
                  className="bg-zinc-950 border border-zinc-700 rounded-md text-xs py-1.5 px-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={app.status}
                  onChange={(e) => handleStatusChange(app.id, e.target.value)}
                >
                  <option value="PENDING">Pending</option>
                  <option value="SHORTLISTED">Shortlist</option>
                  <option value="REJECTED">Reject</option>
                  <option value="HIRED">Hire</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Evaluation Modal */}
      <Dialog open={!!selectedApp} onOpenChange={(open) => !open && setSelectedApp(null)}>
        <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-100 sm:max-w-6xl w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedApp?.studentProfile?.user?.name}</DialogTitle>
            <DialogDescription className="text-zinc-400">
              {selectedApp?.studentProfile?.degree} in {selectedApp?.studentProfile?.branch} from {selectedApp?.studentProfile?.college}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-6">
            <div className="flex gap-4 border-b border-zinc-800 pb-4">
              {selectedApp?.studentProfile?.resumeUrl && (
                <a href={selectedApp.studentProfile.resumeUrl.replace("dl.dropboxusercontent.com", "www.dropbox.com")} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 bg-blue-950/30 px-3 py-1.5 rounded-md border border-blue-900/50">
                  <FileText className="w-4 h-4" /> Resume PDF
                </a>
              )}
              {selectedApp?.studentProfile?.linkedinUrl && (
                <a href={selectedApp.studentProfile.linkedinUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300">
                  <Globe className="w-4 h-4" /> LinkedIn
                </a>
              )}
              {selectedApp?.studentProfile?.githubUrl && (
                <a href={selectedApp.studentProfile.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300">
                  <Code className="w-4 h-4" /> GitHub
                </a>
              )}
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5 text-purple-400" />
                  AI Job Fit Analysis
                </h3>
                {!evaluationResult && !selectedApp?.aiScore && (
                  <Button size="sm" onClick={() => handleEvaluate(selectedApp.id)} disabled={isEvaluating} className="bg-purple-600 hover:bg-purple-700 text-white">
                    {isEvaluating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Run AI Analysis"}
                  </Button>
                )}
                {!evaluationResult && selectedApp?.aiScore && (
                  <Button size="sm" variant="outline" onClick={() => handleEvaluate(selectedApp.id)} disabled={isEvaluating} className="bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                    {isEvaluating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Re-evaluate"}
                  </Button>
                )}
              </div>
              
              {isEvaluating ? (
                <div className="text-center py-8 text-zinc-500">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-purple-500" />
                  <p>Watsonx is comparing the candidate's parsed resume against the job description...</p>
                </div>
              ) : evaluationResult ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-white">{evaluationResult.score}</span>
                    <span className="text-sm text-zinc-400">/ 100 Match Score</span>
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed border-l-2 border-purple-500 pl-4">{evaluationResult.summary}</p>
                </div>
              ) : selectedApp?.aiScore ? (
                <div className="space-y-4">
                   <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-white">{selectedApp.aiScore}</span>
                    <span className="text-sm text-zinc-400">/ 100 Match Score (Saved)</span>
                  </div>
                  <p className="text-sm text-zinc-400 italic">This candidate has been evaluated. Re-run analysis to view the detailed summary.</p>
                </div>
              ) : (
                <p className="text-sm text-zinc-500">Run the AI analysis to see how well this candidate fits the role requirements.</p>
              )}
            </div>

            {/* Interview Scheduling Section */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
              <h3 className="font-semibold flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-blue-400" />
                Interviews
              </h3>
              
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    className="bg-zinc-950 border-zinc-800 text-white w-full sm:w-auto"
                    disabled={isScheduling}
                  />
                  <Input
                    type="url"
                    placeholder="Meeting Link (optional)"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    className="bg-zinc-950 border-zinc-800 text-white flex-1"
                    disabled={isScheduling}
                  />
                  <Button 
                    onClick={() => handleSchedule(selectedApp.id)}
                    disabled={isScheduling || !scheduledAt}
                    className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                  >
                    {isScheduling ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Schedule"}
                  </Button>
                </div>

                {interviews.length > 0 && (
                  <div className="mt-6 border-t border-zinc-800/50 pt-4">
                    <h4 className="text-sm font-medium text-zinc-400 mb-3">Scheduled Interviews</h4>
                    <ul className="space-y-2">
                      {interviews.map(inv => (
                        <li key={inv.id} className="flex justify-between items-center bg-zinc-950 p-3 rounded-md border border-zinc-800">
                          <div>
                            <div className="text-white text-sm font-medium">
                              {new Date(inv.scheduledAt).toLocaleString()}
                            </div>
                            {inv.link && (
                              <a href={inv.link} target="_blank" rel="noreferrer" className="text-blue-400 text-xs hover:underline mt-1 block">
                                Join Meeting
                              </a>
                            )}
                          </div>
                          <span className="text-xs bg-zinc-800 text-zinc-300 px-2 py-1 rounded-md">
                            {inv.status}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>


          </div>
        </DialogContent>
      </Dialog>
    </div>
    </div>
  );
}
