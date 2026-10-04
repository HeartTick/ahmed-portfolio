/** Copy for the Ask Ahmed AI section. Facts come from the other data files. */

export const assistantCopy = {
  eyebrow: "Ask Ahmed AI",
  title: "Ask about my experience",
  intro:
    "A small assistant that answers questions about my experience, projects, skills and education. It only uses the verified content on this site.",
  principles: [
    "Answers come only from the content on this site",
    "Says so when it has no verified information",
    "Conversations are not stored",
  ],
  unavailable:
    "The portfolio assistant is temporarily unavailable. You can still explore my experience and projects on this page.",
  disclaimer: "AI-generated from this site's content. Check the sections above for the exact details.",
  sessionLimit:
    "You've reached today's portfolio AI limit. You can still explore my experience and projects on this page.",
  globalLimit:
    "The portfolio assistant has reached its limit for today. You can still explore my experience and projects on this page.",
  /** Shown quietly after an answer, only when few questions are left. */
  remaining: (n: number) =>
    n === 0 ? "That was your last question for today." : `${n} ${n === 1 ? "question" : "questions"} left today`,
};

export const suggestedQuestions = [
  "What backend experience does Ahmed have?",
  "Which AWS services has he worked with?",
  "Tell me about his 8-system automation pipeline.",
  "What AI/ML projects has he built?",
  "What is Ahmed studying at TU Dresden?",
  "Which technologies has he used professionally?",
];
