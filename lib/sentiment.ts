export type SentimentLabel = "positive" | "mixed" | "negative";

export interface SentimentInsight {
  score: number;
  classification: SentimentLabel;
  audienceSummary: string;
  highlights: string[];
}

const positiveWords = [
  "great",
  "excellent",
  "amazing",
  "love",
  "masterpiece",
  "strong",
  "enjoyable",
  "beautiful",
  "best",
  "fantastic",
  "impressive",
  "smart",
  "powerful",
];

const negativeWords = [
  "bad",
  "poor",
  "boring",
  "worst",
  "weak",
  "disappointing",
  "confusing",
  "slow",
  "messy",
  "awful",
  "predictable",
  "overrated",
];

const stopWords = new Set([
  "the",
  "and",
  "for",
  "with",
  "that",
  "this",
  "movie",
  "film",
  "was",
  "are",
  "you",
  "they",
  "have",
  "has",
  "from",
  "into",
  "its",
  "their",
  "about",
  "just",
  "very",
]);

function tokenScore(text: string): number {
  const tokens = text.toLowerCase().match(/[a-z']+/g) || [];
  let score = 0;

  for (const token of tokens) {
    if (positiveWords.includes(token)) {
      score += 1;
    }
    if (negativeWords.includes(token)) {
      score -= 1;
    }
  }

  return score;
}

function buildHighlights(reviews: string[]): string[] {
  const counts = new Map<string, number>();

  for (const review of reviews) {
    const tokens = review.toLowerCase().match(/[a-z']+/g) || [];
    for (const token of tokens) {
      if (token.length < 4 || stopWords.has(token)) {
        continue;
      }
      counts.set(token, (counts.get(token) || 0) + 1);
    }
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);
}

function classify(score: number): SentimentLabel {
  if (score > 2) {
    return "positive";
  }
  if (score < -2) {
    return "negative";
  }
  return "mixed";
}

export function analyzeSentiment(reviews: string[]): SentimentInsight {
  if (!reviews.length) {
    return {
      score: 0,
      classification: "mixed",
      audienceSummary:
        "Audience sentiment is mixed due to limited review content.",
      highlights: [],
    };
  }

  const totalScore = reviews.reduce((sum, review) => sum + tokenScore(review), 0);
  const normalizedScore = Number((totalScore / reviews.length).toFixed(2));
  const classification = classify(normalizedScore);
  const highlights = buildHighlights(reviews);

  const audienceSummary =
    classification === "positive"
      ? "Audience sentiment is mostly positive, with viewers highlighting performances, writing, and overall impact."
      : classification === "negative"
        ? "Audience sentiment trends negative, with repeated concerns about pacing, clarity, or execution."
        : "Audience sentiment is mixed, with clear praise for key strengths but recurring criticism in specific areas.";

  return {
    score: normalizedScore,
    classification,
    audienceSummary,
    highlights,
  };
}
