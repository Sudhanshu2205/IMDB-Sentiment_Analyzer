import type { NextApiRequest, NextApiResponse } from "next";
import { fetchMovie } from "@/lib/fetchMovie";
import { fetchCast } from "@/lib/fetchCast";
import { fetchReviews } from "@/lib/fetchReviews";
import { analyzeSentiment } from "@/lib/sentiment";
import { generateAudienceSummary } from "@/lib/aiSummary";
import { validateImdbId } from "@/lib/validators";

type ErrorResponse = { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" } satisfies ErrorResponse);
  }

  try {
    const imdbId = String(req.body?.imdbId || "").trim();

    if (!imdbId) {
      return res.status(400).json({ error: "IMDb ID is required" } satisfies ErrorResponse);
    }

    if (!validateImdbId(imdbId)) {
      return res.status(400).json({
        error: "Invalid IMDb ID format. Use values like tt0133093.",
      } satisfies ErrorResponse);
    }

    const movie = await fetchMovie(imdbId);
    const cast = fetchCast(movie.actors);
    const reviews = await fetchReviews(imdbId, {
      title: movie.title,
      plot: movie.plot,
      rating: movie.rating,
    });
    const insights = analyzeSentiment(reviews);
    const aiSummary = await generateAudienceSummary({
      title: movie.title,
      classification: insights.classification,
      highlights: insights.highlights,
      reviews,
      heuristicSummary: insights.audienceSummary,
    });

    const finalInsights = {
      ...insights,
      audienceSummary: aiSummary.summary,
    };

    return res.status(200).json({
      imdbId: movie.imdbId,
      title: movie.title,
      poster: movie.poster,
      year: movie.year,
      rating: movie.rating,
      plot: movie.plot,
      cast,
      reviews: {
        count: reviews.length,
        samples: reviews.slice(0, 3),
      },
      insights: finalInsights,
      summarySource: aiSummary.source,
    });
  } catch {
    return res.status(500).json({
      error: "Failed to fetch movie details",
    } satisfies ErrorResponse);
  }
}
