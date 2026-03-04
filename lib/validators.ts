export function validateImdbId(imdbId: string): boolean {
  return /^tt\d{7,9}$/i.test(imdbId.trim());
}

export function validateMovieName(movieName: string): boolean {
  return movieName.trim().length >= 2;
}
