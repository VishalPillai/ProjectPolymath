import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const ExplainInput = z.object({
  topic: z.string().min(1).max(200),
});

export const explainTopic = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ExplainInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("AI is not configured right now.");

    const gateway = createLovableAiGatewayProvider(key);

    const prompt = `Write clear, well-structured study notes about "${data.topic}" for a curious generalist.

Rules:
- Plain language, no jargon without a quick definition.
- Use short section headings written as "## Heading".
- Under each heading, use "- " bullet points, one idea per bullet, max 25 words each.
- Cover: what it is, why it matters, key ideas or moments, and one surprising detail.
- 4 sections max, 3-5 bullets each.
- No intro sentence, no conclusion, no markdown bold or links. Start with the first heading.`;

    const result = await generateText({
      model: gateway("google/gemini-3.6-flash"),
      prompt,
      abortSignal: AbortSignal.timeout(30000),
    });

    const text = result.text.trim();
    if (!text) throw new Error("No explanation was generated.");
    return { topic: data.topic, notes: text };
  });
