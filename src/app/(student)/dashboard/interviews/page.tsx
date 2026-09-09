import { InterviewChat } from "./interview-chat";

export default function MockInterviewsPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Mock Interviews</h1>
        <p className="text-muted-foreground mt-2">Practice with Watsonx or switch to ARVI for a voice-based adaptive interview with live feedback.</p>
      </div>

      <InterviewChat />
    </div>
  );
}
