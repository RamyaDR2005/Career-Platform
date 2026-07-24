import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import ResumeUploadForm from "./resume-upload-form";
import AnalyzeResumeButton from "./analyze-button";
import { ResumeViewerModal } from "@/components/resume-viewer-modal";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, CheckCircle2, AlertCircle, TrendingUp, BookOpen, PenTool, Bot } from "lucide-react";

export default async function ResumePage() {
  const session = await auth();
  let profile: any = null;

  try {
    profile = await prisma.studentProfile.findUnique({
      where: { userId: session?.user?.id }
    });
  } catch (error) {
    console.error("Student resume page query error:", error);
  }

  const analysis = profile?.aiAnalysis as any;

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Resume Center</h1>
        <p className="text-zinc-400 mt-2">Upload and manage your resume for AI ATS scoring & analysis.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload & Preview Card */}
        <div className="space-y-6">
          {profile?.resumeUrl && (
            <Card className="bg-zinc-900 border-zinc-800 border-green-900/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-400 font-bold">
                  <CheckCircle2 className="h-5 w-5" /> Current Resume Active
                </CardTitle>
                <CardDescription className="text-zinc-400">Your resume is uploaded and ready for AI evaluation.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ResumeViewerModal buttonText="View Current Resume (PDF)" />
                <AnalyzeResumeButton />
              </CardContent>
            </Card>
          )}

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-zinc-100 flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-400" />
                {profile?.resumeUrl ? "Replace Resume (PDF)" : "Upload Resume (PDF)"}
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Upload your latest PDF resume. IBM Watsonx AI will parse text to compute your ATS score.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResumeUploadForm />
            </CardContent>
          </Card>
        </div>

        {/* AI Analysis Feedback Section */}
        <div>
          {analysis ? (
            <div className="space-y-6">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white font-bold text-base">
                    <TrendingUp className="h-5 w-5 text-blue-400" /> ATS Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-5xl font-bold text-white mb-2">{analysis.atsScore}<span className="text-2xl text-zinc-500">/100</span></div>
                  <p className="text-sm text-zinc-400">Based on industry standards & ATS parsing</p>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white font-bold text-base">
                    <AlertCircle className="h-5 w-5 text-orange-400" /> Missing Keywords
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {analysis.missingKeywords?.map((kw: string, i: number) => (
                      <span key={i} className="px-2.5 py-1 bg-zinc-800 rounded-md text-xs font-semibold text-zinc-200 border border-zinc-700">
                        {kw}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white font-bold text-base">
                    <BookOpen className="h-5 w-5 text-purple-400" /> Grammar & Readability
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-zinc-300 leading-relaxed">{analysis.grammar}</p>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white font-bold text-base">
                    <PenTool className="h-5 w-5 text-emerald-400" /> AI Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-zinc-300 leading-relaxed">{analysis.suggestions}</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="bg-zinc-900 border-zinc-800 h-full flex items-center justify-center min-h-[320px]">
              <CardContent className="text-center py-10 space-y-3">
                <Bot className="h-12 w-12 text-zinc-600 mx-auto animate-pulse" />
                <h3 className="text-lg font-medium text-zinc-300">No AI Analysis Yet</h3>
                <p className="text-sm text-zinc-500 max-w-xs mx-auto">
                  {profile?.resumeUrl 
                    ? "Click 'Analyze Resume with AI' above to generate feedback." 
                    : "Upload a PDF resume to get your ATS score and feedback."}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
