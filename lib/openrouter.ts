const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "anthropic/claude-haiku-4-5-20251001";
const TIMEOUT_MS = 30_000;

export interface OpenRouterOptions {
  systemPrompt: string;
  userPrompt: string;
  maxTokens?: number;
  temperature?: number;
}

export async function callOpenRouter(options: OpenRouterOptions): Promise<string> {
  const { systemPrompt, userPrompt, maxTokens, temperature } = options;
  const apiKey = process.env.OPENROUTER_API_KEY;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const body: Record<string, unknown> = {
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    };

    if (maxTokens !== undefined) {
      body.max_tokens = maxTokens;
    }
    if (temperature !== undefined) {
      body.temperature = temperature;
    }

    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://animal-maths.vercel.app",
        "X-Title": "Animal Maths",
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(
        `OpenRouter API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    const content: string = data.choices[0].message.content;
    // Strip markdown code fences (```json ... ```) that models sometimes add
    const stripped = content.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "");
    return stripped;
  } finally {
    clearTimeout(timeoutId);
  }
}
