export function fetchCast(actorsRaw: string): string[] {
  if (!actorsRaw) {
    return [];
  }

  return actorsRaw
    .split(",")
    .map((actor) => actor.trim())
    .filter(Boolean)
    .slice(0, 8);
}
