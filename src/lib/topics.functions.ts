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

      const prompt = `Generate a single, short, intriguing niche topic for a curious person who wants to become a polymath. It should be a short phrase (1-4 words), not a sentence. Make it diverse across history, geography, science, technology, current affairs, art, philosophy, economics, culture and nature. Avoid generic topics; pick something surprising, specific or lesser-known. Under 60 characters. Exclude: ${data.exclude || "none"}. Return ONLY the topic name, nothing else.`;

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
