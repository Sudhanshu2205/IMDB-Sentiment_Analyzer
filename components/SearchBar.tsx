"use client";

import { FormEvent, useState } from "react";

interface SearchBarProps {
  loading: boolean;
  onSearch: (movieName: string) => void;
}

export default function SearchBar({ loading, onSearch }: SearchBarProps) {
  const [movieName, setMovieName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = movieName.trim();

    if (!value) {
      setError("Please enter a movie name.");
      return;
    }

    if (value.length < 2) {
      setError("Enter at least 2 characters.");
      return;
    }

    setError("");
    onSearch(value);
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <label htmlFor="movieName" className="search-label">
        Movie Name
      </label>
      <div className="search-row">
        <input
          id="movieName"
          type="text"
          placeholder="The Matrix"
          value={movieName}
          onChange={(event) => setMovieName(event.target.value)}
          className="search-input"
          autoComplete="off"
        />
        <button type="submit" className="search-button" disabled={loading}>
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>
      {error ? <p className="search-error">{error}</p> : null}
    </form>
  );
}
