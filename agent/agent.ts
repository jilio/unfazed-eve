import { defineAgent } from "eve";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

// Model: Claude Sonnet 4.6 via OpenRouter (OpenAI-compatible), with a raw key
// from the OPENROUTER_API_KEY env var — no Vercel AI Gateway needed. eve can't
// derive the context window for a custom provider model, so it's given here.
const openrouter = createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY });

export default defineAgent({
  model: openrouter("anthropic/claude-sonnet-4.6"),
  modelContextWindowTokens: 200000,
});
