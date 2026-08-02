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
    console.log("[generateTopic] handler called", data);
    return { category: "History", text: "Test topic" };
  });
