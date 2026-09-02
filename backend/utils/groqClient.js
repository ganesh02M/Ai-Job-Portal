import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
export { groq };

export const extractResumeData = async (rawText) => {
  const prompt = `You are a resume parser. Extract structured information from the resume text below.

Return ONLY valid JSON in this exact format, with no preamble, no markdown, no code fences:
{
  "skills": ["skill1", "skill2", ...],
  "experience": ["short bullet describing role/project 1", "short bullet describing role/project 2", ...],
  "education": ["degree - institution - year", ...]
}

Rules:
- "skills" should be a flat list of individual technical skills (languages, frameworks, tools), not sentences.
- "experience" should summarize each job/project as one short line each (role + key achievement).
- "education" should have one entry per degree/institution.
- If a section is missing in the resume, return an empty array for it.

Resume text:
"""
${rawText}
"""`;

  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
  });

  const responseText = completion.choices[0]?.message?.content?.trim() || "{}";

  // Strip markdown code fences if the model adds them despite instructions
  const cleaned = responseText.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Failed to parse Groq response as JSON:", cleaned);
    return { skills: [], experience: [], education: [] };
  }
};
export const getAIQualityScore = async (rawText, groq) => {
  const prompt = `You are an expert technical resume reviewer. Evaluate the resume below on content quality, clarity, and impact — NOT formatting (formatting is scored separately).

Return ONLY valid JSON, no markdown, no preamble:
{
  "score": <integer 0-100>,
  "feedback": "<2-3 sentence summary of strengths and weaknesses>",
  "suggestions": ["<actionable suggestion 1>", "<actionable suggestion 2>", "<actionable suggestion 3>"]
}

Scoring guidance:
- Are achievements quantified (numbers, %, scale)?
- Is the language impact-driven vs just descriptive?
- Are skills relevant and well-organized?
- Is there unnecessary fluff or filler?

Resume text:
"""
${rawText}
"""`;

  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
  });

  const responseText = completion.choices[0]?.message?.content?.trim() || "{}";
  const cleaned = responseText.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Failed to parse AI quality score response:", cleaned);
    return { score: 50, feedback: "AI evaluation unavailable.", suggestions: [] };
  }
};

export const matchResumeToJD = async (rawText, jobDescription) => {
  const prompt = `You are an expert ATS and technical recruiter. Compare the resume below against the job description and evaluate how well they match.

Return ONLY valid JSON, no markdown, no preamble:
{
  "matchPercent": <integer 0-100>,
  "matchingSkills": ["<skills/keywords present in both resume and JD>"],
  "missingKeywords": ["<important skills/keywords in JD but missing from resume>"],
  "suggestions": ["<specific actionable suggestion to improve match 1>", "<suggestion 2>", "<suggestion 3>"]
}

Scoring guidance:
- matchPercent should reflect overall fit: required skills coverage, relevant experience, and role alignment.
- missingKeywords should only include meaningful technical/domain terms, not generic words.
- suggestions should be specific to closing the gap (e.g., "Add experience with X", "Mention Y explicitly since JD requires it").

Resume:
"""
${rawText}
"""

Job Description:
"""
${jobDescription}
"""`;

  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
  });

  const responseText = completion.choices[0]?.message?.content?.trim() || "{}";
  const cleaned = responseText.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Failed to parse JD match response:", cleaned);
    return {
      matchPercent: 0,
      matchingSkills: [],
      missingKeywords: [],
      suggestions: [],
    };
  }
};

export const generateCoverLetter = async (rawText, jobDescription, userName) => {
   const prompt = `You are an expert career coach writing a compelling, personalized cover letter.

Write a professional cover letter for the candidate below, tailored to the job description. Use a confident, natural tone — not generic or robotic. Reference specific projects/skills from the resume that match the job description. Keep it concise (250-350 words), 3-4 paragraphs. Do not use markdown formatting (no **, no #, no bullet symbols) — plain prose only.

Return ONLY valid JSON, no markdown, no preamble:
{
  "coverLetter": "<the full cover letter text, with paragraphs separated by \\n\\n>"
}

Candidate name: ${userName}

Resume:
"""
${rawText}
"""

Job Description:
"""
${jobDescription}
"""`;

  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.5,
  });

  const responseText = completion.choices[0]?.message?.content?.trim() || "{}";
  const cleaned = responseText.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Failed to parse cover letter response:", cleaned);
    return { coverLetter: "" };
  }
};