import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import ResumeUploadForm from "./resume-upload-form";
import AnalyzeResumeButton from "./analyze-button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, CheckCircle2, AlertCircle, TrendingUp, BookOpen, PenTool, Bot } from "lucide-react";

export default async function ResumePage() {
  const session = await auth();
  const profile = await prisma.studentProfile.findUnique({
    where: { userId: session?.user?.id }
  });

  const analysis = profile?.aiAnalysis as any;

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Resume Center</h1>
        <p className="text-zinc-400 mt-2">Upload and manage your resumes for AI analysis.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {profile?.resumeUrl && (
            <Card className="bg-zinc-900 border-zinc-800 border-green-900/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-400">
                  <CheckCircle2 className="h-5 w-5" /> Current Resume Active
                </CardTitle>
                <CardDescription className="text-zinc-400">Your resume is successfully uploaded.</CardDescription>
              </CardHeader>
              <CardContent>
                <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-400 hover:underline">
                  <FileText className="h-4 w-4" /> View Current Resume (PDF)
                </a>
                <div className="mt-4">
                  <AnalyzeResumeButton />
                </div>
              </CardContent>
            </Card>
          )}
          <ResumeUploadForm />
        </div>

        <div>
          {analysis ? (
            <div className="space-y-6">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-400" /> ATS Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-5xl font-bold text-white mb-2">{analysis.atsScore}<span className="text-2xl text-zinc-500">/100</span></div>
                  <p className="text-sm text-zinc-400">Based on industry standards</p>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <AlertCircle className="h-4 w-4 text-orange-400" /> Missing Keywords
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {analysis.missingKeywords?.map((kw: string, i: number) => (
                      <span key={i} className="px-2 py-1 bg-zinc-800 rounded-md text-xs text-zinc-300 border border-zinc-700">
                        {kw}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <BookOpen className="h-4 w-4 text-purple-400" /> Grammar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-zinc-300">{analysis.grammar}</p>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <PenTool className="h-4 w-4 text-green-400" /> Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-zinc-300">{analysis.suggestions}</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="bg-zinc-900 border-zinc-800 h-full flex items-center justify-center min-h-[300px]">
              <CardContent className="text-center text-zinc-500 flex flex-col items-center">
                <Bot className="h-12 w-12 mb-4 opacity-50" />
                <p>No AI analysis available.</p>
                <p className="text-sm">Upload a resume and click Analyze.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
