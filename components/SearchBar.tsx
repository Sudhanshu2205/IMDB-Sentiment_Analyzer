"use client";

import { FormEvent, useState } from "react";

interface SearchBarProps {
  loading: boolean;
  onSearch: (imdbId: string) => void;
}

export default function SearchBar({ loading, onSearch }: SearchBarProps) {
  const [imdbId, setImdbId] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = imdbId.trim();

    if (!value) {
      setError("Please enter an IMDb ID.");
      return;
    }

    if (!/^tt\d{7,9}$/i.test(value)) {
      setError("Use a valid IMDb ID like tt0133093.");
      return;
    }

    setError("");
    onSearch(value);
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <label htmlFor="imdbId" className="search-label">
        IMDb Movie ID
      </label>
      <div className="search-row">
        <input
          id="imdbId"
          type="text"
          placeholder="tt0133093"
          value={imdbId}
          onChange={(event) => setImdbId(event.target.value)}
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
