# IMDb Sentiment Analyzer

A Next.js app where users enter an IMDb ID (example: `tt0133093`) and get:
- movie title and poster
- cast list
- release year and IMDb rating
- short plot summary
- AI-style audience sentiment summary
- overall sentiment class (`positive`, `mixed`, `negative`)
- optional OpenAI-generated sentiment summary (fallback to local heuristic)

## Tech Stack Rationale
- **Next.js + React + TypeScript**: modern full-stack JavaScript ecosystem, fast development, strong typing, and easy deployment.
- **Node.js API route (`pages/api/movies.ts`)**: server-side orchestration for OMDb + IMDb review fetching and sentiment analysis.
- **Tailwind v4 + custom CSS**: responsive UI with modern styling and animations while keeping code maintainable.

This stack is aligned with scalable web app development and simple to deploy to Vercel.

## Setup Instructions
1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env.local`:
```env
OMDB_API_KEY=your_omdb_api_key
OPENAI_API_KEY=your_openai_api_key_optional
```

3. Run development server:
```bash
npm run dev
```

4. Open:
`http://localhost:3000`

## Testing
Run unit tests:
```bash
npm test
```

## Deployment (Mandatory)
Recommended: **Vercel**

1. Push this repo to GitHub.
2. Import project in Vercel.
3. Add environment variable:
   - `OMDB_API_KEY`
   - `OPENAI_API_KEY` (optional, for LLM summary)
4. Deploy.

Vercel handles Next.js build and hosting automatically.

## Assumptions
- IMDb audience reviews are fetched via IMDb review endpoint; if unavailable, fallback review snippets are generated from movie context.
- If `OPENAI_API_KEY` is unavailable or fails, summary falls back to the heuristic sentiment output.
- IMDb IDs follow format `tt` + 7 to 9 digits.

## Project Structure
- `app/page.tsx`: main UI and request workflow
- `pages/api/movies.ts`: backend endpoint
- `lib/fetchMovie.ts`: OMDb movie metadata
- `lib/fetchReviews.ts`: audience review snippet retrieval
- `lib/fetchCast.ts`: cast extraction
- `lib/sentiment.ts`: sentiment scoring + summary
- `tests/movie.test.ts`: unit tests
