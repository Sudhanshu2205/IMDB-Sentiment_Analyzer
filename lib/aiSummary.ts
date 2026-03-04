import type { SentimentLabel } from "@/lib/sentiment";

interface SummaryInput {
  title: string;
  classification: SentimentLabel;
  highlights: string[];
  reviews: string[];
  heuristicSummary: string;
}

interface SummaryResult {
  summary: string;
  source: "openai" | "heuristic";
}

function truncateReviews(reviews: string[]): string {
  return reviews.slice(0, 6).join("\n- ");
}

export async function generateAudienceSummary(
  input: SummaryInput
): Promise<SummaryResult> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return {
      summary: input.heuristicSummary,
      source: "heuristic",
    };
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [
          {
            role: "system",
            content:
              "You summarize movie audience sentiment. Keep responses factual, 1-2 sentences, no hype.",
          },
          {
            role: "user",
            content: `Movie: ${input.title}
Detected class: ${input.classification}
Highlights: ${input.highlights.join(", ") || "none"}
Reviews:
- ${truncateReviews(input.reviews)}

Write a concise audience sentiment summary.`,
          },
        ],
        max_output_tokens: 120,
      }),
    });

    if (!response.ok) {
      throw new Error("OpenAI request failed");
    }

    const data = (await response.json()) as { output_text?: string };
    const summary = data.output_text?.trim();
    if (!summary) {
      throw new Error("No summary returned");
    }

    return {
      summary,
      source: "openai",
    };
  } catch {
    return {
      summary: input.heuristicSummary,
      source: "heuristic",
    };
  }
}
