import type { NextApiRequest, NextApiResponse } from "next";
import { fetchMovie } from "@/lib/fetchMovie";
import { fetchCast } from "@/lib/fetchCast";
import { fetchReviews } from "@/lib/fetchReviews";
import { analyzeSentiment } from "@/lib/sentiment";
import { generateAudienceSummary } from "@/lib/aiSummary";
import { validateMovieName } from "@/lib/validators";

type ErrorResponse = { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" } satisfies ErrorResponse);
  }

  try {
    const movieName = String(req.body?.movieName || "").trim();

    if (!movieName) {
      return res.status(400).json({ error: "Movie name is required" } satisfies ErrorResponse);
    }

    if (!validateMovieName(movieName)) {
      return res.status(400).json({
        error: "Movie name must have at least 2 characters.",
      } satisfies ErrorResponse);
    }

    const movie = await fetchMovie(movieName);
    const cast = fetchCast(movie.actors);
    const reviews = await fetchReviews(movie.imdbId, {
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
        samples: reviews.slice(0, 6),
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
