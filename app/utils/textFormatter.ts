// utils/formatExplanation.ts
export function formatExplanation(explanation: string): string[] {
  if (!explanation) return [];

  // Step 1: Remove weird commas between points
  let cleaned = explanation.replace(/,\s*\d+\./g, "\n$&"); // put newlines before numbers

  // Step 2: Split by numbered points (1., 2., 3., etc.)
  const steps = cleaned.split(/\d+\.\s/).filter(step => step.trim() !== "");

  // Step 3: Re-add numbering
  return steps.map((step, index) => step.trim());
}
