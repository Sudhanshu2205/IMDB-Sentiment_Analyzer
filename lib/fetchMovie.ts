import axios from "axios";
import { validateMovieName } from "@/lib/validators";

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
  imdbID?: string;
  Title?: string;
  Poster?: string;
  Year?: string;
  imdbRating?: string;
  Plot?: string;
  Actors?: string;
}

export async function fetchMovie(movieName: string) {
  if (!validateMovieName(movieName)) {
    throw new Error("Invalid movie name");
  }

  try {
    const response = await axios.get(
      "https://www.omdbapi.com/",
      {
        params: {
          t: movieName,
          apikey: process.env.OMDB_API_KEY,
          plot: "full",
        },
      }
    );

    const data = response.data as OmdbResponse;

    if (data.Response === "False") {
      throw new Error(data.Error || "Movie not found");
    }
    if (!data.imdbID) {
      throw new Error("IMDb ID not available for this title");
    }

    return <MovieDetails>{
      imdbId: data.imdbID,
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
