import axios from "axios";
import { validateImdbId } from "@/lib/validators";

export interface MovieDetails {
  imdbId: string;
  title: string;
  poster: string;
  year: string;
  rating: string;
  plot: string;
  actors: string;
}

interface OmdbResponse {
  Response: "True" | "False";
  Error?: string;
  Title?: string;
  Poster?: string;
  Year?: string;
  imdbRating?: string;
  Plot?: string;
  Actors?: string;
}

export async function fetchMovie(imdbId: string) {
  if (!validateImdbId(imdbId)) {
    throw new Error("Invalid IMDb ID format");
  }

  try {
    const response = await axios.get(
      "https://www.omdbapi.com/",
      {
        params: {
          i: imdbId,
          apikey: process.env.OMDB_API_KEY,
          plot: "short",
        },
      }
    );

    const data = response.data as OmdbResponse;

    if (data.Response === "False") {
      throw new Error(data.Error || "Movie not found");
    }

    return <MovieDetails>{
      imdbId,
      title: data.Title || "Unknown title",
      poster:
        data.Poster && data.Poster !== "N/A"
          ? data.Poster
          : "https://placehold.co/480x720?text=Poster+Unavailable",
      year: data.Year || "Unknown",
      rating: data.imdbRating || "N/A",
      plot: data.Plot || "No plot summary available.",
      actors: data.Actors || "",
    };
  } catch {
    throw new Error("Failed to fetch movie data");
  }
}
