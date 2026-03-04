import test from "node:test";
import assert from "node:assert/strict";
import { analyzeSentiment } from "../lib/sentiment.ts";
import { validateMovieName } from "../lib/validators.ts";
import { fetchCast } from "../lib/fetchCast.ts";
import { generateAudienceSummary } from "../lib/aiSummary.ts";

test("validateMovieName should accept valid movie names", () => {
  assert.equal(validateMovieName("The Matrix"), true);
  assert.equal(validateMovieName("Dune"), true);
});

test("validateMovieName should reject invalid movie names", () => {
  assert.equal(validateMovieName("A"), false);
  assert.equal(validateMovieName(""), false);
  assert.equal(validateMovieName(" "), false);
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

test("fetchCast should normalize cast members", () => {
  const cast = fetchCast(
    "A, B, C, D, E, F, G, H, I, J"
  );
  assert.equal(cast.length, 10);
  assert.equal(cast[0], "A");
  assert.equal(cast[9], "J");
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
