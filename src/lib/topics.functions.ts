import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { pickTopic, type Topic } from "@/lib/prompts";

export type { Topic };

const GenerateTopicInput = z.object({
  exclude: z.string().optional(),
});

export const generateTopic = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => GenerateTopicInput.parse(input))
  .handler(async ({ data }) => {
    try {
      const key = process.env["LOVABLE_API_KEY"];
      if (!key) return pickTopic(data.exclude);

      const gateway = createLovableAiGatewayProvider(key);

      const prompt = `Give me one simple, interesting topic worth learning about — the kind of thing a curious generalist would enjoy looking up. Use plain, everyday words (1-3 words), no jargon, no obscure academic terms. Mix areas: history, geography, science, technology, current affairs, art, philosophy, economics, culture, nature. Under 30 characters. Exclude: ${data.exclude || "none"}. Return ONLY the topic name, nothing else.`;

      const result = await generateText({
        model: gateway("google/gemini-3.6-flash"),
        prompt,
        abortSignal: AbortSignal.timeout(15000),
      });

      const text = result.text
        .trim()
        .split("\n")[0]!
        .replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N})]+$/gu, "")
        .trim();

      if (text.length === 0 || text.length >= 120) {
        throw new Error("Generated topic empty or too long");
      }

      return { category: "Generated" as Topic["category"], text } as Topic;
    } catch (error) {
      console.error("AI topic generation failed, falling back:", error);
      return pickTopic(data.exclude);
    }
  });
