import { InterviewChat } from "./interview-chat";

export default function MockInterviewsPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Mock Interviews</h1>
        <p className="text-zinc-400 mt-2">Practice your technical and behavioral interviewing skills with Watsonx AI.</p>
      </div>

      <InterviewChat />
    </div>
  );
}
