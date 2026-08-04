import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const ExplainInput = z.object({
  topic: z.string().min(1).max(200),
});

const WIKI_API = "https://en.wikipedia.org/w/api.php";
const SKIP_SECTIONS = new Set([
  "see also",
  "references",
  "further reading",
  "external links",
  "notes",
  "bibliography",
  "sources",
  "citations",
]);

async function findArticleTitle(topic: string): Promise<string | null> {
  const url = `${WIKI_API}?action=query&list=search&srsearch=${encodeURIComponent(
    topic,
  )}&srlimit=1&format=json&origin=*`;
  const res = await fetch(url, {
    headers: { "User-Agent": "ProjectPolymath/1.0" },
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) return null;
  const json = (await res.json()) as {
    query?: { search?: Array<{ title?: string }> };
  };
  return json.query?.search?.[0]?.title ?? null;
}

async function fetchExtract(title: string): Promise<string | null> {
  const url = `${WIKI_API}?action=query&prop=extracts&explaintext=1&redirects=1&titles=${encodeURIComponent(
    title,
  )}&format=json&origin=*`;
  const res = await fetch(url, {
    headers: { "User-Agent": "ProjectPolymath/1.0" },
    signal: AbortSignal.timeout(12000),
  });
  if (!res.ok) return null;
  const json = (await res.json()) as {
    query?: { pages?: Record<string, { extract?: string }> };
  };
  const pages = json.query?.pages ?? {};
  const first = Object.values(pages)[0];
  return first?.extract ?? null;
}

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+(?=[A-Z0-9"'])/)
    .map((s) => s.trim())
    .filter((s) => s.length > 25);
}

// Turn the plain-text article into the "## heading" + "- bullet" shape the UI renders.
function toNotes(extract: string): string {
  const lines = extract.split("\n");
  const out: string[] = [];
  let heading = "Overview";
  let buffer: string[] = [];
  let sections = 0;

  const flush = () => {
    if (sections >= 5 || buffer.length === 0) {
      buffer = [];
      return;
    }
    const bullets = splitSentences(buffer.join(" ")).slice(0, 5);
    if (bullets.length === 0) {
      buffer = [];
      return;
    }
    out.push(`## ${heading}`);
    for (const b of bullets) out.push(`- ${b}`);
    sections += 1;
    buffer = [];
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    const match = /^=+\s*(.+?)\s*=+$/.exec(line);
    if (match) {
      flush();
      heading = match[1]!;
      continue;
    }
    if (SKIP_SECTIONS.has(heading.toLowerCase())) continue;
    buffer.push(line);
  }
  flush();

  return out.join("\n");
}

export const explainTopic = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ExplainInput.parse(input))
  .handler(async ({ data }) => {
    const title = (await findArticleTitle(data.topic)) ?? data.topic;
    const extract = await fetchExtract(title);
    if (!extract) throw new Error("No notes found for this topic.");

    const notes = toNotes(extract);
    if (!notes) throw new Error("No notes found for this topic.");

    return {
      topic: data.topic,
      notes: `${notes}\n\n## Source\n- Wikipedia article: ${title}`,
    };
  });
