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
      console.log("[generateTopic] key present:", !!key);
      if (!key) throw new Error("Missing LOVABLE_API_KEY");

      const gateway = createLovableAiGatewayProvider(key);
      console.log("[generateTopic] calling gateway");

      const result = await Promise.race([
        generateText({
          model: gateway("google/gemini-3.6-flash"),
          prompt: `Generate a single, short, intriguing niche topic for a curious person who wants to become a polymath. The topic should be something they can research or think about. It should be a short phrase (1-4 words), not a full sentence. Make it diverse across areas like history, geography, science, technology, current affairs, art, philosophy, economics, culture, and nature. Avoid generic topics like "climate change" or "World War II"; pick something surprising, specific, or lesser-known. Keep it under 120 characters. Exclude: ${data.exclude || "none"}. Return ONLY the topic name, nothing else.`,
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("AI gateway timeout")), 3000),
        ),
      ]);
      console.log("[generateTopic] got result:", result.text);

      const text = result.text
        .trim()
        .replace(/^[^\w\s]+|[^\w\s]+$/g, "")
        .split("\n")[0]!
        .trim();

      if (text.length === 0 || text.length >= 120) {
        throw new Error("Generated topic empty or too long");
      }

      return { category: "Generated" as unknown as Topic["category"], text } as Topic;
    } catch (error) {
      console.error(
        "AI topic generation failed, falling back to static list:",
        error,
      );
      return pickTopic(data.exclude);
    }
  });
