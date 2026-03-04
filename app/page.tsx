"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import MovieCard from "@/components/MovieCard";
import type { MovieApiResponse } from "@/lib/types";

export default function Home() {
  const [movie, setMovie] = useState<MovieApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (imdbId: string) => {
    setLoading(true);
    setError("");
    setMovie(null);

    try {
      const response = await fetch("/api/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imdbId }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to fetch movie details");
      }

      setMovie(data as MovieApiResponse);
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Unexpected error while fetching movie details.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-shell">
      <section className="hero fade-in">
        <p className="eyebrow">IMDb Sentiment Analyzer</p>
        <h1>Movie Intelligence from a Single IMDb ID</h1>
        <p className="hero-text">
          Enter any IMDb ID and instantly get metadata, cast details, and an AI-generated summary of audience sentiment.
        </p>
      </section>

      <section className="panel slide-up">
        <SearchBar onSearch={handleSearch} loading={loading} />
        {error ? <p className="api-error">{error}</p> : null}
      </section>

      <section className="result-zone">
        {loading ? <LoadingSkeleton /> : null}
        {!loading && movie ? <MovieCard movie={movie} /> : null}
      </section>
    </main>
  );
}
