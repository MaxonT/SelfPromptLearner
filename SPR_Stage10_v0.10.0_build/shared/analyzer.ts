export type PromptAnalysis = {
  taxonomy?: {
    taskType: string[];
    intent: string[];
    constraints: string[];
    riskFlags: string[];
  };
  scores?: {
    clarity: number;
    ambiguity: number;
    reproducibility: number;
  };
  traits?: string[];
  suggestions?: string[];
};

function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n));
}

function uniq(list: string[]) {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const item of list) {
    const v = item.trim();
    if (!v) continue;
    if (seen.has(v)) continue;
    seen.add(v);
    out.push(v);
  }
  return out;
}

function includesAny(haystack: string, needles: string[]) {
  return needles.some((n) => haystack.includes(n));
}

export function analyzePromptText(promptText: string): PromptAnalysis {
  const text = (promptText || "").trim();
  const lower = text.toLowerCase();

  const taskType: string[] = [];
  if (
    includesAny(lower, [
      "write code",
      "implement",
      "bug",
      "fix",
      "refactor",
      "typescript",
      "javascript",
      "python",
      "react",
      "sql",
      "api",
    ])
  ) {
    taskType.push("coding");
  }
  if (
    includesAny(lower, [
      "explain",
      "what is",
      "difference between",
      "why",
      "how does",
      "teach",
      "tutorial",
    ])
  ) {
    taskType.push("study");
  }
  if (includesAny(lower, ["summarize", "outline", "rewrite", "edit", "polish", "proofread"])) {
    taskType.push("writing");
  }
  if (includesAny(lower, ["plan", "roadmap", "strategy", "steps", "checklist"])) {
    taskType.push("planning");
  }
  if (taskType.length === 0) taskType.push("general");

  const intent: string[] = [];
  if (/[?？]/.test(text) || includesAny(lower, ["can you", "could you", "what", "why", "how"])) {
    intent.push("ask");
  }
  if (includesAny(lower, ["write", "generate", "create", "build", "make", "design", "do"])) {
    intent.push("command");
  }
  if (intent.length === 0) intent.push("statement");

  const constraints: string[] = [];
  const constraintRegexes: RegExp[] = [
    /\bmust\b[^.\n]{0,80}/gi,
    /\bshould\b[^.\n]{0,80}/gi,
    /\bwithout\b[^.\n]{0,80}/gi,
    /\binclude\b[^.\n]{0,80}/gi,
    /\bdo not\b[^.\n]{0,80}/gi,
    /\bavoid\b[^.\n]{0,80}/gi,
  ];
  for (const r of constraintRegexes) {
    const matches = text.match(r) || [];
    for (const m of matches) constraints.push(m.trim());
  }

  const riskFlags: string[] = [];
  if (
    includesAny(lower, [
      "ignore previous",
      "disregard previous",
      "system prompt",
      "reveal your instructions",
      "jailbreak",
      "bypass",
      "developer message",
    ])
  ) {
    riskFlags.push("prompt-injection");
  }
  if (includesAny(lower, ["api key", "password", "secret", "token", "ssh key", "credit card"])) {
    riskFlags.push("sensitive-data");
  }
  if (includesAny(lower, ["malware", "phishing", "exploit", "ransomware", "ddos"])) {
    riskFlags.push("harmful-request");
  }

  const length = text.length;
  const hasBullets = /\n\s*[-*\d+\.]/.test(text);
  const hasContext =
    includesAny(lower, ["context", "background", "here is", "given", "assume"]) || length > 200;
  const hasConstraints = constraints.length > 0;

  let clarity = 50;
  if (hasConstraints) clarity += 15;
  if (hasBullets) clarity += 10;
  if (hasContext) clarity += 10;
  if (length < 30) clarity -= 15;
  if (length > 1200) clarity -= 5;
  if (riskFlags.length > 0) clarity -= 5;

  let ambiguity = 30;
  const vagueWords = [
    "something",
    "anything",
    "whatever",
    "maybe",
    "probably",
    "kind of",
    "a bit",
    "nice",
    "good",
    "better",
  ];
  if (includesAny(lower, vagueWords)) ambiguity += 15;
  if (!hasConstraints) ambiguity += 10;
  if (length < 60) ambiguity += 10;
  if (hasBullets) ambiguity -= 5;

  let reproducibility = 55;
  if (hasContext) reproducibility += 10;
  if (hasConstraints) reproducibility += 10;
  if (includesAny(lower, ["exact", "step-by-step", "reproducible", "copy-paste", "commands"])) {
    reproducibility += 10;
  }
  if (
    taskType.includes("coding") &&
    !includesAny(lower, ["typescript", "javascript", "python", "node", "react"])
  ) {
    reproducibility -= 10;
  }
  if (length < 40) reproducibility -= 15;

  clarity = clamp(clarity);
  ambiguity = clamp(ambiguity);
  reproducibility = clamp(reproducibility);

  const traits: string[] = [];
  if (hasBullets || includesAny(lower, ["checklist", "steps", "criteria", "definition of done"])) {
    traits.push("structured");
  }
  if (hasConstraints) traits.push("constraint-driven");
  if (length > 500) traits.push("context-rich");
  if (length < 80) traits.push("context-light");
  if (riskFlags.length > 0) traits.push("adversarial");

  const suggestions: string[] = [];
  if (taskType.includes("coding") && !includesAny(lower, ["input", "output", "example", "requirements"])) {
    suggestions.push("Add an input/output example and edge cases.");
  }
  if (!hasConstraints) suggestions.push("Add explicit constraints (format, length, must/avoid).");
  if (!hasContext) suggestions.push("Add minimal context (goal, audience, environment).");
  if (riskFlags.includes("prompt-injection")) {
    suggestions.push("Remove instructions that override system/developer messages.");
  }

  return {
    taxonomy: {
      taskType: uniq(taskType),
      intent: uniq(intent),
      constraints: uniq(constraints).slice(0, 8),
      riskFlags: uniq(riskFlags),
    },
    scores: { clarity, ambiguity, reproducibility },
    traits: uniq(traits),
    suggestions: uniq(suggestions).slice(0, 6),
  };
}
