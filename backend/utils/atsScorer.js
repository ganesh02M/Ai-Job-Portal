// ---------- RULES-BASED SCORING (out of 100) ----------
const ACTION_VERBS = [
  "built", "developed", "designed", "implemented", "created", "led",
  "managed", "optimized", "improved", "launched", "deployed", "engineered",
  "architected", "automated", "integrated", "reduced", "increased",
  "collaborated", "coordinated", "delivered",
];

const SECTION_KEYWORDS = {
  skills: /skills|technical skills|technologies/i,
  experience: /experience|projects|work history/i,
  education: /education|academic/i,
};

export const runRuleChecks = (rawText) => {
  const checks = [];
  let score = 0;
  const maxScore = 100;

  // 1. Contact info (email + phone) — 15 points
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(rawText);
  const hasPhone = /(\+?\d[\d\s-]{8,}\d)/.test(rawText);
  if (hasEmail && hasPhone) {
    score += 15;
    checks.push({ check: "Contact info", passed: true, points: 15 });
  } else {
    checks.push({
      check: "Contact info",
      passed: false,
      points: 0,
      note: !hasEmail ? "Email not found" : "Phone number not found",
    });
  }

  // 2. Section headers present — 20 points (≈6.6 each)
  let sectionPoints = 0;
  Object.entries(SECTION_KEYWORDS).forEach(([section, regex]) => {
    if (regex.test(rawText)) sectionPoints += 20 / 3;
  });
  sectionPoints = Math.round(sectionPoints);
  score += sectionPoints;
  checks.push({
    check: "Section headers (Skills/Experience/Education)",
    passed: sectionPoints > 13,
    points: sectionPoints,
  });

  // 3. Bullet point usage — 15 points
  const bulletMatches = (rawText.match(/[•\-\u2022]\s/g) || []).length;
  const bulletPoints = bulletMatches >= 5 ? 15 : Math.round((bulletMatches / 5) * 15);
  score += bulletPoints;
  checks.push({
    check: "Bullet point usage",
    passed: bulletMatches >= 5,
    points: bulletPoints,
    note: `${bulletMatches} bullet points found`,
  });

  // 4. Action verbs — 20 points
  const lowerText = rawText.toLowerCase();
  const verbCount = ACTION_VERBS.filter((verb) =>
    new RegExp(`\\b${verb}\\b`).test(lowerText)
  ).length;
  const verbPoints = Math.min(20, verbCount * 3);
  score += verbPoints;
  checks.push({
    check: "Action verbs (Built, Developed, Led, etc.)",
    passed: verbCount >= 4,
    points: verbPoints,
    note: `${verbCount} distinct action verbs found`,
  });

  // 5. Resume length — 15 points (too short or too long is penalized)
  const wordCount = rawText.trim().split(/\s+/).length;
  let lengthPoints;
  if (wordCount >= 250 && wordCount <= 900) {
    lengthPoints = 15;
  } else if (wordCount < 250) {
    lengthPoints = Math.round((wordCount / 250) * 15);
  } else {
    lengthPoints = Math.max(5, 15 - Math.round((wordCount - 900) / 100));
  }
  score += lengthPoints;
  checks.push({
    check: "Resume length",
    passed: wordCount >= 250 && wordCount <= 900,
    points: lengthPoints,
    note: `${wordCount} words`,
  });

  // 6. Links present (GitHub/LinkedIn/Portfolio) — 15 points
  const hasLinks = /(github\.com|linkedin\.com|portfolio|leetcode\.com)/i.test(rawText);
  const linkPoints = hasLinks ? 15 : 0;
  score += linkPoints;
  checks.push({
    check: "Professional links (GitHub/LinkedIn/Portfolio)",
    passed: hasLinks,
    points: linkPoints,
  });

  return {
    ruleScore: Math.min(maxScore, Math.round(score)),
    checks,
  };
};

import { getAIQualityScore } from "./groqClient.js";
import { groq } from "./groqClient.js";

export const calculateATSScore = async (rawText) => {
  const { ruleScore, checks } = runRuleChecks(rawText);
  const aiResult = await getAIQualityScore(rawText, groq);

  // Hybrid: 40% rules (formatting/structure), 60% AI (content quality)
  const finalScore = Math.round(ruleScore * 0.4 + aiResult.score * 0.6);

  const feedback = `${aiResult.feedback} (Formatting/structure score: ${ruleScore}/100)`;

  return {
    atsScore: finalScore,
    atsFeedback: feedback,
    ruleChecks: checks,
    suggestions: aiResult.suggestions || [],
  };
};