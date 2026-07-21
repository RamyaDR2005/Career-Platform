interface IBMTokenResponse {
  access_token: string;
}

export async function getWatsonxToken(): Promise<string> {
  const apiKey = process.env.WATSONX_API_KEY;
  if (!apiKey) throw new Error("WATSONX_API_KEY is not configured.");

  const response = await fetch("https://iam.cloud.ibm.com/identity/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "application/json"
    },
    body: `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${apiKey}`
  });

  if (!response.ok) {
    throw new Error("Failed to authenticate with IBM Cloud.");
  }

  const data: IBMTokenResponse = await response.json();
  return data.access_token;
}

// Helper to remove PII before sending context outside the project
function scrubPII(text: string): string {
  if (!text) return text;
  let scrubbed = text;
  // Redact Emails
  scrubbed = scrubbed.replace(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi, "[REDACTED_EMAIL]");
  // Redact Phone Numbers (simplified regex for US/International formats commonly seen on resumes)
  scrubbed = scrubbed.replace(/(\+?\d{1,3}[\s-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/gi, "[REDACTED_PHONE]");
  return scrubbed;
}

export async function analyzeResumeText(resumeText: string, context?: { type: "general" | "job", jobDescription?: string, profile?: any }) {
  const projectId = process.env.WATSONX_PROJECT_ID;
  if (!projectId) throw new Error("WATSONX_PROJECT_ID is not configured.");

  const token = await getWatsonxToken();

  let analysisContext = "Provide a general analysis of this resume.";
  if (context?.type === "job" && context.jobDescription) {
    analysisContext = `Compare this resume against the following Job Description and base your ATS score, missing keywords, and suggestions strictly on how well the candidate fits this specific job.\n\nJob Description:\n${context.jobDescription}`;
  } else if (context?.profile) {
    const { degree, branch, college } = context.profile;
    const academicContext = [degree, branch, college].filter(Boolean).join(" in ");
    if (academicContext) {
      analysisContext = `Tailor your analysis for a student with the following academic background: ${academicContext}. Provide a general ATS evaluation based on industry standards for this field.`;
    }
  }

  const prompt = `
You are an expert AI Resume Analyzer and ATS (Applicant Tracking System) simulator.
Analyze the following resume text and provide strict JSON output based on the actual content of the resume. Do not include any other text outside the JSON.

CONTEXT:
${analysisContext}

CRITICAL INSTRUCTION: The JSON schema below contains PLACEHOLDER values. You MUST replace these placeholder values with your own genuine analysis of the provided resume text.
Be highly specific and critical. Do not use generic phrases like "Good grammar with minor errors". If there are grammar errors, quote them exactly from the text. For suggestions, avoid generic buzzwords; instead, point out exact bullet points or sentences in their resume that need improvement and explain how to fix them.

Expected JSON schema:
{
  "atsScore": <number between 1-100 representing resume strength>,
  "missingKeywords": [<array of strings of important industry skills missing from the resume>],
  "grammar": "<string pointing out specific grammar or spelling mistakes with exact quotes from the text, or 'No errors found' if perfect>",
  "formatting": "<string evaluating formatting, readability, and structure with specific examples>",
  "suggestions": "<string with specific, actionable advice to improve concrete sentences in their text, avoiding generic buzzwords>"
}

Resume Text:
${resumeText.substring(0, 15000)}
`;

  // Fallback to meta-llama/llama-3-8b-instruct if the provided maverick model is restricted.
  // Using the requested one first.
  const payload = {
    model_id: process.env.WATSONX_MODEL_ID || "meta-llama/llama-3-8b-instruct",
    input: scrubPII(prompt),
    project_id: projectId,
    parameters: {
      decoding_method: "greedy",
      max_new_tokens: 1500,
      repetition_penalty: 1,
    }
  };

  const response = await fetch("https://eu-de.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Watsonx API Error: ${errorText}`);
  }

  const data = await response.json();
  const generatedText = data.results[0].generated_text.trim();

  // Parse JSON from text
  try {
    let jsonString = generatedText;
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonString = jsonMatch[0];
    }
    // Remove trailing commas which are common AI JSON generation errors
    jsonString = jsonString.replace(/,\s*([}\]])/g, '$1');
    // Also clean up common escaping issues
    jsonString = jsonString.replace(/[\u0000-\u001F]+/g, " "); 
    
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Failed to parse Watsonx output as JSON:", generatedText);
    throw new Error("Invalid response format from AI.");
  }
}

export async function generateInterviewResponse(chatHistory: { role: 'user' | 'assistant', content: string }[], profile: any, context?: { type: "general" | "job", jobDescription?: string }) {
  const projectId = process.env.WATSONX_PROJECT_ID;
  if (!projectId) throw new Error("WATSONX_PROJECT_ID is not configured.");

  const token = await getWatsonxToken();

  const academicContext = profile ? `${profile.degree} in ${profile.branch} from ${profile.college}` : "a student";
  const resumeContext = profile?.aiAnalysis ? `Here is the candidate's parsed resume summary for context: ${JSON.stringify(profile.aiAnalysis)}` : "The candidate has not provided a detailed resume.";
  
  let formattedHistory = `System: You are an expert technical interviewer conducting a mock interview for ${academicContext}. ${resumeContext}\n`;
  if (context?.type === "job" && context.jobDescription) {
    formattedHistory += `You are hiring for a specific role. Based your questions heavily on this Job Description:\n"${context.jobDescription}"\n`;
  }
  
  formattedHistory += `Your goal is to ask relevant technical or behavioral questions one by one. Keep your questions concise (under 3 sentences). When the candidate answers, briefly evaluate their answer (give constructive feedback) before asking the next question. Do NOT generate the candidate's response. Stop generating after your question.\n\n`;

  for (const msg of chatHistory) {
    if (msg.role === 'assistant') {
      formattedHistory += `Interviewer: ${msg.content}\n`;
    } else {
      formattedHistory += `Candidate: ${msg.content}\n`;
    }
  }
  
  formattedHistory += `Interviewer:`;

  const payload = {
    model_id: process.env.WATSONX_MODEL_ID || "meta-llama/llama-3-8b-instruct",
    input: scrubPII(formattedHistory),
    project_id: projectId,
    parameters: {
      decoding_method: "greedy",
      max_new_tokens: 300,
      repetition_penalty: 1.1,
      stop_sequences: ["Candidate:", "\n\n"]
    }
  };

  const response = await fetch("https://eu-de.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Watsonx API Error: ${errorText}`);
  }

  const data = await response.json();
  const generatedText = data.results[0].generated_text.trim();

  return generatedText;
}

export async function generateInterviewFeedback(chatHistory: { role: 'user' | 'assistant', content: string }[], profile: any) {
  const userMessages = chatHistory.filter(msg => msg.role === 'user');
  if (userMessages.length === 0) {
    return "It looks like we didn't get a chance to start the interview! Please provide answers to the questions to receive personalized feedback on your performance.";
  }

  const projectId = process.env.WATSONX_PROJECT_ID;
  if (!projectId) throw new Error("WATSONX_PROJECT_ID is not configured.");

  const token = await getWatsonxToken();

  const resumeContext = profile?.aiAnalysis ? `Candidate Resume: ${JSON.stringify(profile.aiAnalysis)}` : "";

  let formattedHistory = `System: You are an expert technical interviewer. ${resumeContext}\nThe following is a transcript of a mock interview. Please evaluate the candidate's performance across the entire interview based on their actual answers. Do NOT invent or hallucinate answers that the candidate did not provide. If the candidate provided very short or poor answers, state that clearly. Provide constructive feedback, highlighting their strengths and areas for improvement. Format your response clearly. Do not ask any more questions.\n\n`;

  for (const msg of chatHistory) {
    if (msg.role === 'assistant') {
      formattedHistory += `Interviewer: ${msg.content}\n`;
    } else {
      formattedHistory += `Candidate: ${msg.content}\n`;
    }
  }
  
  formattedHistory += `System: Please provide your final evaluation and feedback now.\nInterviewer Feedback:`;

  const payload = {
    model_id: process.env.WATSONX_MODEL_ID || "meta-llama/llama-3-8b-instruct",
    input: scrubPII(formattedHistory),
    project_id: projectId,
    parameters: {
      decoding_method: "greedy",
      max_new_tokens: 500,
      repetition_penalty: 1.1,
    }
  };

  const response = await fetch("https://eu-de.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Watsonx API Error: ${errorText}`);
  }

  const data = await response.json();
  const generatedText = data.results[0].generated_text.trim();

  return generatedText;
}

export async function generateCoverLetterContent(profile: any, job: any) {
  const projectId = process.env.WATSONX_PROJECT_ID;
  if (!projectId) throw new Error("WATSONX_PROJECT_ID is not configured.");

  const token = await getWatsonxToken();

  const resumeContext = profile?.aiAnalysis ? JSON.stringify(profile.aiAnalysis) : `Degree: ${profile?.degree}, Branch: ${profile?.branch}`;

  const prompt = `System: You are an expert career coach helping a candidate write a professional cover letter. Write ONE compelling, concise cover letter (max 3-4 paragraphs) for the candidate. Do not include placeholder text like [Your Name] or [Company Address] unless necessary. Use the candidate's name if available, otherwise leave it generic.
CRITICAL INSTRUCTION: You MUST output ONLY the cover letter itself. Do NOT output any conversational text, introductory sentences, feedback, or concluding remarks. You MUST write exactly ONE cover letter and then STOP. Do not repeat the letter.

Candidate Details:
Name: ${profile?.user?.name || 'The Candidate'}
Resume Summary: ${resumeContext}

Job Details:
Title: ${job.title}
Company: ${job.company.name}
Description: ${job.description}
Requirements: ${job.requirements}

Instruction: Write exactly ONE cover letter now. Start directly with the salutation (e.g., "Dear Hiring Manager,"), and end with "Sincerely, [Candidate Name]". Do not write anything after the signature.
Cover Letter:`;

  const payload = {
    model_id: process.env.WATSONX_MODEL_ID || "meta-llama/llama-3-8b-instruct",
    input: scrubPII(prompt),
    project_id: projectId,
    parameters: {
      decoding_method: "greedy",
      max_new_tokens: 450,
      repetition_penalty: 1.1,
      stop_sequences: ["<|eot_id|>", "\n\n\n\n"]
    }
  };

  const response = await fetch("https://eu-de.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Watsonx API Error: ${errorText}`);
  }

  const data = await response.json();
  return data.results[0].generated_text.trim();
}

export async function evaluateCandidate(profile: any, job: any) {
  const projectId = process.env.WATSONX_PROJECT_ID;
  if (!projectId) throw new Error("WATSONX_PROJECT_ID is not configured.");

  const token = await getWatsonxToken();

  let extractedText = "";
  if (profile?.resumeUrl) {
    try {
      const pdfParseModule = await import("pdf-parse");
      const pdfParse = pdfParseModule.default || pdfParseModule;
      const pdfResponse = await fetch(profile.resumeUrl);
      if (pdfResponse.ok) {
        const arrayBuffer = await pdfResponse.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const pdfData = await pdfParse(buffer);
        extractedText = pdfData.text.trim();
      }
    } catch (e) {
      console.error("Could not extract PDF text for evaluateCandidate:", e);
    }
  }

  const aiAnalysisContext = profile?.aiAnalysis ? `(General ATS Summary Context: ${JSON.stringify(profile.aiAnalysis)})` : "";
  const resumeContext = extractedText 
    ? `Candidate's Resume Text:\n${extractedText.substring(0, 10000)}\n\n${aiAnalysisContext}`
    : `Candidate's Profile Data:\nDegree: ${profile?.degree}, Branch: ${profile?.branch}\n${aiAnalysisContext}`;

  const prompt = `<|begin_of_text|><|start_header_id|>system<|end_header_id|>
You are an expert technical recruiter and AI ATS system. Your job is to evaluate a candidate's resume against a specific job description.
CRITICAL INSTRUCTION: You MUST output valid JSON only. Do not output any conversational text or markdown formatting (no backticks). The JSON must have exactly two fields: "score" (a number between 0 and 100) and "summary" (a 3-4 sentence paragraph explaining the fit).<|eot_id|><|start_header_id|>user<|end_header_id|>
Candidate Resume:
${resumeContext}

Job Title: ${job.title}
Job Description: ${job.description}
Job Requirements: ${job.requirements}

Analyze the candidate's fit for this specific role and output the raw JSON object:<|eot_id|><|start_header_id|>assistant<|end_header_id|>
{
  "score": `;

  const payload = {
    model_id: process.env.WATSONX_MODEL_ID || "meta-llama/llama-3-8b-instruct",
    input: scrubPII(prompt),
    project_id: projectId,
    parameters: {
      decoding_method: "greedy",
      max_new_tokens: 400,
      repetition_penalty: 1.05,
      stop_sequences: ["<|eot_id|>"]
    }
  };

  const response = await fetch("https://eu-de.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Watsonx API Error: ${await response.text()}`);
  }

  const data = await response.json();
  const rawText = data.results[0].generated_text.trim();
  
  try {
    // We pre-filled `{ "score": ` in the prompt, so we must prepend it to the rawText
    const completeJsonText = `{ \n  "score": ${rawText}`;
    
    const jsonMatch = completeJsonText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(completeJsonText);
  } catch (error) {
    console.error("Failed to parse AI evaluation JSON:", rawText);
    return { score: 50, summary: "AI evaluation completed, but could not parse the detailed response." };
  }
}

export async function generateRoadmapPlan(resumeText: string, targetRole: string) {
  const projectId = process.env.WATSONX_PROJECT_ID;
  if (!projectId) throw new Error("WATSONX_PROJECT_ID is not configured.");

  const token = await getWatsonxToken();

  const prompt = `<|begin_of_text|><|start_header_id|>system<|end_header_id|>
You are an expert AI Career Coach. 
Analyze the candidate's resume and generate a customized skill gap analysis and learning roadmap for their target role: "${targetRole}".
CRITICAL INSTRUCTION: Provide strictly JSON output. Do not include any text outside the JSON.

Expected JSON schema:
{
  "missingSkills": [
    {
      "name": "<string, the skill missing>",
      "priority": "<string, HIGH, MEDIUM, or LOW>",
      "difficulty": "<string, e.g. BEGINNER, INTERMEDIATE, ADVANCED>",
      "timeToLearn": "<string, e.g. 2 weeks, 1 month>"
    }
  ],
  "learningPlan": [
    {
      "step": "<number>",
      "title": "<string, action item title>",
      "description": "<string, detailed action item>"
    }
  ],
  "projectRecommendations": [
    {
      "title": "<string, project title>",
      "description": "<string, what the project is about and what skills it proves>"
    }
  ],
  "timeline": "<string, estimated overall timeline to be ready for the role>"
}<|eot_id|><|start_header_id|>user<|end_header_id|>

Resume Text:
${resumeText.substring(0, 15000)}

Output ONLY valid JSON matching the schema above.<|eot_id|><|start_header_id|>assistant<|end_header_id|>
{`;

  const response = await fetch(`https://eu-de.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29`, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      input: prompt,
      parameters: {
        decoding_method: "greedy",
        max_new_tokens: 1500,
        min_new_tokens: 1,
        repetition_penalty: 1,
        stop_sequences: []
      },
      model_id: process.env.WATSONX_MODEL_ID || "meta-llama/llama-3-8b-instruct",
      project_id: projectId
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Watsonx API call failed for Roadmap: ${errorText}`);
  }

  const result = await response.json();
  const rawText = result.results[0].generated_text;

  try {
    const completeJsonText = "{" + rawText;
    let jsonString = completeJsonText;
    const jsonMatch = completeJsonText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonString = jsonMatch[0];
    }
    
    // Clean up trailing commas and unescaped control chars
    jsonString = jsonString.replace(/,\s*([}\]])/g, '$1');
    jsonString = jsonString.replace(/[\u0000-\u001F]+/g, " ");
    
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Failed to parse Roadmap JSON:", rawText);
    throw new Error("AI returned invalid format");
  }
}
