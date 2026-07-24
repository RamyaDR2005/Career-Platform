"use client";

import { useState } from "react";
import { createRoadmap, deleteRoadmap } from "@/actions/roadmap";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, BrainCircuit, Target, Code, BookOpen, AlertCircle, Calendar, Trash2, Compass, ExternalLink } from "lucide-react";
import Link from "next/link";

export function RoadmapClient({ hasResume, roadmaps }: { hasResume: boolean, roadmaps: any[] }) {
  const [targetRole, setTargetRole] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (roadmapId: string) => {
    if (!confirm("Are you sure you want to delete this roadmap?")) return;
    setDeletingId(roadmapId);
    try {
      const res = await deleteRoadmap(roadmapId);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Roadmap deleted successfully");
      }
    } catch (e) {
      toast.error("An error occurred");
    } finally {
      setDeletingId(null);
    }
  };

  const handleGenerate = async () => {
    if (!targetRole.trim()) {
      toast.error("Please enter a target role.");
      return;
    }
    if (!hasResume) {
      toast.error("Please upload a resume first.");
      return;
    }

    setIsGenerating(true);
    toast.info("Watsonx is analyzing your skill gaps...");

    const result = await createRoadmap(targetRole);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Career Roadmap generated!");
      setTargetRole("");
    }
    setIsGenerating(false);
  };

  return (
    <div className="space-y-8">
      {/* External Learning Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Resource 1: roadmap.sh */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-zinc-900/60 border border-purple-500/20 backdrop-blur-xl hover:border-purple-500/40 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Visual Developer Roadmaps</h4>
              <p className="text-[11px] text-zinc-400">Explore role guides & skill paths at roadmap.sh</p>
            </div>
          </div>
          <Button asChild size="sm" variant="outline" className="bg-purple-950/40 border-purple-700/50 text-purple-300 hover:text-white hover:bg-purple-900/40 text-xs shrink-0">
            <a href="https://roadmap.sh" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
              <span>roadmap.sh</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </Button>
        </div>

        {/* Resource 2: takeuforward.org */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-zinc-900/60 border border-emerald-500/20 backdrop-blur-xl hover:border-emerald-500/40 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">DSA & Coding Practice</h4>
              <p className="text-[11px] text-zinc-400">Master Striver SDE sheet & DSA topic-wise</p>
            </div>
          </div>
          <Button asChild size="sm" variant="outline" className="bg-emerald-950/40 border-emerald-700/50 text-emerald-300 hover:text-white hover:bg-emerald-900/40 text-xs shrink-0">
            <a href="https://takeuforward.org/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
              <span>takeuforward.org</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </Button>
        </div>
      </div>

      {/* Generation Form */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-zinc-100 flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-purple-400" />
            Generate New Roadmap
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Enter your dream job role, and AI will compare it with your resume to find skill gaps.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!hasResume ? (
            <div className="flex flex-col items-center justify-center py-6 border-2 border-dashed border-zinc-800 rounded-lg">
              <AlertCircle className="w-8 h-8 text-orange-500 mb-2" />
              <p className="text-zinc-300 font-medium">Resume Required</p>
              <p className="text-zinc-500 text-sm mb-4 text-center">You need to upload your resume before AI can analyze your skills.</p>
              <Button asChild variant="outline" className="border-zinc-700 bg-transparent text-white hover:bg-zinc-800">
                <Link href="/dashboard/resume">Upload Resume</Link>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="e.g. Senior Frontend Developer"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="bg-zinc-950 border-zinc-800 text-white flex-1"
                disabled={isGenerating}
              />
              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating || !targetRole.trim()}
                className="bg-purple-600 hover:bg-purple-700 text-white w-full sm:w-auto min-w-[150px]"
              >
                {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Generate Plan"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Display Existing Roadmaps */}
      {roadmaps.map((roadmap) => {
        const data = roadmap.data as any;
        return (
          <div key={roadmap.id} className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-3 pb-2 border-b border-zinc-800">
              <Target className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-bold text-white capitalize">{roadmap.targetRole} Roadmap</h2>
              <div className="ml-auto flex items-center gap-4">
                <span className="text-xs text-zinc-500 hidden sm:inline-block">
                  Generated {new Date(roadmap.createdAt).toLocaleDateString()}
                </span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10"
                  onClick={() => handleDelete(roadmap.id)}
                  disabled={deletingId === roadmap.id}
                >
                  {deletingId === roadmap.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 flex items-start gap-4">
              <div className="p-3 bg-blue-500/20 text-blue-400 rounded-lg">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Estimated Timeline</h3>
                <p className="text-zinc-400 text-sm">{data?.timeline || "N/A"}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Skill Gap Analysis */}
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-lg text-zinc-100 flex items-center gap-2">
                    <Target className="w-5 h-5 text-red-400" /> Missing Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {data?.missingSkills?.map((skill: any, idx: number) => (
                      <li key={idx} className="flex justify-between items-start border-b border-zinc-800/50 pb-3 last:border-0 last:pb-0">
                        <div>
                          <div className="font-medium text-white">{skill.name}</div>
                          <div className="text-xs text-zinc-500 mt-1">Difficulty: {skill.difficulty}</div>
                        </div>
                        <div className="text-right">
                          <span className={`text-[10px] uppercase px-2 py-1 rounded-full font-bold ${skill.priority === 'HIGH' ? 'bg-red-500/20 text-red-400' : skill.priority === 'MEDIUM' ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400'}`}>
                            {skill.priority} Priority
                          </span>
                          <div className="text-xs text-zinc-500 mt-2">{skill.timeToLearn}</div>
                        </div>
                      </li>
                    ))}
                    {!data?.missingSkills?.length && <p className="text-sm text-zinc-500">No missing skills found! You are well prepared.</p>}
                  </ul>
                </CardContent>
              </Card>

              {/* Project Recommendations */}
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-lg text-zinc-100 flex items-center gap-2">
                    <Code className="w-5 h-5 text-emerald-400" /> Project Ideas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {data?.projectRecommendations?.map((proj: any, idx: number) => (
                      <li key={idx} className="bg-zinc-950 p-4 rounded-md border border-zinc-800/50">
                        <div className="font-medium text-white mb-1">{proj.title}</div>
                        <div className="text-sm text-zinc-400 leading-relaxed">{proj.description}</div>
                      </li>
                    ))}
                    {!data?.projectRecommendations?.length && <p className="text-sm text-zinc-500">No projects recommended at this time.</p>}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Step-by-Step Learning Plan */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-lg text-zinc-100 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-400" /> Step-by-Step Learning Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {data?.learningPlan?.map((step: any, idx: number) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-900/50 border border-blue-500/50 flex items-center justify-center text-blue-400 font-bold text-sm z-10">
                          {step.step || idx + 1}
                        </div>
                        {idx !== data.learningPlan.length - 1 && (
                          <div className="w-px h-full bg-zinc-800 my-2"></div>
                        )}
                      </div>
                      <div className="pb-6">
                        <h4 className="font-semibold text-white text-lg">{step.title}</h4>
                        <p className="text-zinc-400 text-sm mt-2 leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  ))}
                  {!data?.learningPlan?.length && <p className="text-sm text-zinc-500">No learning plan available.</p>}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
