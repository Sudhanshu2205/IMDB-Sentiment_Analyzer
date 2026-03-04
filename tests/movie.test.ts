import test from "node:test";
import assert from "node:assert/strict";
import { analyzeSentiment } from "../lib/sentiment.ts";
import { validateImdbId } from "../lib/validators.ts";
import { fetchCast } from "../lib/fetchCast.ts";
import { generateAudienceSummary } from "../lib/aiSummary.ts";

test("validateImdbId should accept valid ids", () => {
  assert.equal(validateImdbId("tt0133093"), true);
  assert.equal(validateImdbId("tt0468569"), true);
});

test("validateImdbId should reject invalid ids", () => {
  assert.equal(validateImdbId("0133093"), false);
  assert.equal(validateImdbId("ttabc"), false);
  assert.equal(validateImdbId(""), false);
});

test("analyzeSentiment should classify clearly positive input", () => {
  const insight = analyzeSentiment([
    "Amazing performances and great writing. Best experience.",
    "Excellent movie with powerful direction and beautiful visuals.",
  ]);

  assert.equal(insight.classification, "positive");
  assert.ok(insight.score > 0);
});

test("analyzeSentiment should classify mixed input", () => {
  const insight = analyzeSentiment([
    "Great first half but slow and confusing ending.",
    "Strong acting, but predictable screenplay in places.",
  ]);

  assert.equal(insight.classification, "mixed");
});

test("fetchCast should normalize and limit cast members", () => {
  const cast = fetchCast(
    "A, B, C, D, E, F, G, H, I, J"
  );
  assert.equal(cast.length, 8);
  assert.equal(cast[0], "A");
  assert.equal(cast[7], "H");
});

test("generateAudienceSummary should fallback when OPENAI_API_KEY is missing", async () => {
  const previous = process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_API_KEY;

  const summary = await generateAudienceSummary({
    title: "The Matrix",
    classification: "positive",
    highlights: ["performances", "writing"],
    reviews: ["Great movie", "Excellent action"],
    heuristicSummary: "Audience sentiment is mostly positive.",
  });

  assert.equal(summary.source, "heuristic");
  assert.equal(summary.summary, "Audience sentiment is mostly positive.");

  if (previous) {
    process.env.OPENAI_API_KEY = previous;
  }
});
