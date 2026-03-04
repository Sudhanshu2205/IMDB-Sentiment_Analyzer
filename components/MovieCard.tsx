import Image from "next/image";
import type { MovieApiResponse } from "@/lib/types";
import CastList from "@/components/CastList";
import SentimentBadge from "@/components/SentimentBadge";

interface MovieCardProps {
  movie: MovieApiResponse;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <article className="movie-card fade-in">
      <div className="poster-wrap">
        <Image
          src={movie.poster}
          alt={`${movie.title} poster`}
          width={480}
          height={720}
          className="poster"
          unoptimized
        />
      </div>
      <div className="movie-content">
        <header className="movie-header">
          <h2>{movie.title}</h2>
          <SentimentBadge label={movie.insights.classification} />
        </header>
        <p className="meta">
          {movie.year} | IMDb {movie.rating}
        </p>
        <p className="plot">{movie.plot}</p>

        <section>
          <h3>Cast</h3>
          <CastList cast={movie.cast} />
        </section>

        <section>
          <h3>Audience Sentiment Summary</h3>
          <p>{movie.insights.audienceSummary}</p>
          <p className="muted">Sentiment score: {movie.insights.score}</p>
          <p className="muted">
            Signal words: {movie.insights.highlights.join(", ") || "N/A"}
          </p>
          <p className="muted">Review samples analyzed: {movie.reviews.count}</p>
          <p className="muted">
            Summary engine:{" "}
            {movie.summarySource === "openai"
              ? "OpenAI"
              : "Heuristic fallback"}
          </p>
        </section>

        <section>
          <h3>Audience Review Samples</h3>
          <ul className="review-list">
            {movie.reviews.samples.map((review, index) => (
              <li key={`${index}-${review.slice(0, 18)}`}>{review}</li>
            ))}
          </ul>
        </section>
      </div>
    </article>
  );
}
