"use client";

import { useState, useRef, useEffect } from "react";
import { submitInterviewMessage, endInterview } from "@/actions/interview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Bot, User, Send, Loader2, Mic, Briefcase } from "lucide-react";
import { toast } from "sonner";

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export function InterviewChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  
  // Configuration state
  const [type, setType] = useState<"general" | "job">("general");
  const [jobDescription, setJobDescription] = useState("");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleListening = () => {
    if (isListening) return; // Allow natural stop
    
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join("");
      setInput(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast.error("Microphone error. Please try again.");
    };

    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const startInterview = async () => {
    if (type === "job" && !jobDescription.trim()) {
      toast.error("Please provide a job description.");
      return;
    }

    setIsLoading(true);
    const context = { type, jobDescription };
    const result = await submitInterviewMessage([], context); // Send empty array to trigger first question
    
    if (result.error) {
      toast.error(result.error);
    } else if (result.response) {
      setMessages([{ role: 'assistant', content: result.response }]);
    }
    setIsLoading(false);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    
    const newMessages: Message[] = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMessages);
    setIsLoading(true);

    const context = { type, jobDescription };
    const result = await submitInterviewMessage(newMessages, context);

    if (result.error) {
      toast.error(result.error);
      // Remove the user message if it failed
      setMessages(messages);
    } else if (result.response) {
      setMessages([...newMessages, { role: 'assistant', content: result.response }]);
    }
    
    setIsLoading(false);
  };

  const handleEndInterview = async () => {
    setIsLoading(true);
    setIsEnded(true); // Disable input immediately
    
    // Add a placeholder message for feedback
    const placeholderMsg: Message = { role: 'assistant', content: 'Evaluating your interview performance...' };
    setMessages(prev => [...prev, placeholderMsg]);

    const result = await endInterview(messages);

    if (result.error) {
      toast.error(result.error);
      setMessages(messages); // Revert the placeholder if error
      setIsEnded(false);
    } else if (result.response) {
      setMessages([...messages, { role: 'assistant', content: `**Interview Concluded**\n\n${result.response}` }]);
    }
    
    setIsLoading(false);
  };

  if (messages.length === 0) {
    return (
      <Card className="bg-zinc-900 border-zinc-800 py-8">
        <CardContent className="space-y-6 max-w-xl mx-auto">
          <div className="text-center space-y-2">
            <Bot className="w-12 h-12 mx-auto text-blue-500 opacity-80" />
            <h2 className="text-2xl font-bold text-white">Mock Interview Setup</h2>
            <p className="text-zinc-400">
              Configure how you want Watsonx to interview you.
            </p>
          </div>

          <div className="space-y-4 pt-4">
            <RadioGroup defaultValue="general" onValueChange={(v) => setType(v as "general" | "job")}>
              <div className={`flex items-center space-x-3 border border-zinc-800 p-4 rounded-lg cursor-pointer transition-colors ${type === 'general' ? 'bg-zinc-800/50 border-blue-500/50' : 'hover:bg-zinc-800/30'}`} onClick={() => setType("general")}>
                <RadioGroupItem value="general" id="general" />
                <Label htmlFor="general" className="flex-1 cursor-pointer">
                  <div className="font-semibold text-zinc-200">General Interview</div>
                  <div className="text-sm text-zinc-400 mt-1">Based entirely on your uploaded resume and profile.</div>
                </Label>
              </div>
              <div className={`flex items-center space-x-3 border border-zinc-800 p-4 rounded-lg cursor-pointer transition-colors ${type === 'job' ? 'bg-zinc-800/50 border-blue-500/50' : 'hover:bg-zinc-800/30'}`} onClick={() => setType("job")}>
                <RadioGroupItem value="job" id="job" />
                <Label htmlFor="job" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2 font-semibold text-zinc-200">
                    <Briefcase className="w-4 h-4 text-blue-400" /> Targeted Job Description
                  </div>
                  <div className="text-sm text-zinc-400 mt-1">Paste a specific JD for tailored questions.</div>
                </Label>
              </div>
            </RadioGroup>

            {type === "job" && (
              <div className="pt-2 animate-in fade-in slide-in-from-top-2">
                <Label htmlFor="jd" className="text-zinc-300">Job Description</Label>
                <Textarea 
                  id="jd"
                  placeholder="Paste the job description here..."
                  className="mt-2 bg-zinc-950 border-zinc-800 min-h-[150px] text-zinc-100 placeholder:text-zinc-500"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>
            )}

            <Button onClick={startInterview} disabled={isLoading} className="bg-blue-600 text-white hover:bg-blue-700 w-full mt-4">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isLoading ? "Starting..." : "Start Interview"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800 flex flex-col h-[70vh]">
      <CardHeader className="border-b border-zinc-800 pb-4 flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-zinc-100 flex items-center gap-2">
            <Bot className="w-5 h-5 text-blue-500" />
            Technical Interview with Watsonx
          </CardTitle>
          <CardDescription className="text-zinc-400 mt-1">
            Answer the questions below to receive real-time feedback.
          </CardDescription>
        </div>
        {!isEnded && (
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleEndInterview} 
            disabled={isLoading}
            className="bg-red-900/50 text-red-400 hover:bg-red-900/70 hover:text-red-300 border border-red-900/50"
          >
            End & Get Feedback
          </Button>
        )}
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'assistant' ? 'bg-blue-900/50 text-blue-400' : 'bg-emerald-900/50 text-emerald-400'}`}>
              {msg.role === 'assistant' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>
            <div className={`rounded-lg px-4 py-2 max-w-[80%] ${msg.role === 'assistant' ? 'bg-zinc-800 text-zinc-200 rounded-tl-none' : 'bg-blue-600 text-white rounded-tr-none'}`}>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-900/50 text-blue-400 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-zinc-800 text-zinc-400 rounded-lg rounded-tl-none px-4 py-2">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </CardContent>

      <div className="p-4 border-t border-zinc-800">
        <form onSubmit={handleSend} className="flex gap-2">
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isEnded ? "Interview has ended." : "Type your answer here..."}
            className="bg-zinc-950 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
            disabled={isLoading || isEnded}
          />
          <Button 
            type="button" 
            variant="outline"
            onClick={toggleListening}
            disabled={isLoading || isEnded}
            className={`border-zinc-700 hover:bg-zinc-800 ${isListening ? 'bg-red-900/30 text-red-500 border-red-900/50 hover:bg-red-900/40 hover:text-red-400' : 'bg-zinc-950 text-zinc-400'}`}
          >
            <Mic className={`w-4 h-4 ${isListening ? 'animate-pulse' : ''}`} />
          </Button>
          <Button type="submit" disabled={!input.trim() || isLoading || isEnded} className="bg-blue-600 text-white hover:bg-blue-700">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
}
