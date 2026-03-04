import type { SentimentInsight } from "@/lib/sentiment";

export interface MovieApiResponse {
  imdbId: string;
  title: string;
  poster: string;
  year: string;
  rating: string;
  plot: string;
  cast: string[];
  reviews: {
    count: number;
    samples: string[];
  };
  insights: SentimentInsight;
  summarySource: "openai" | "heuristic";
}
