import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useRef, useState } from "react";
import { generateTopic, type Topic } from "@/lib/topics.functions";
import { explainTopic } from "@/lib/explain.functions";
import { TopicNotes } from "@/components/TopicNotes";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Project Polymath" },
      {
        name: "description",
        content:
          "Discover a random topic across history, geography, science, technology, current affairs and more. Built for polymaths who want to keep learning.",
      },
      { property: "og:title", content: "Project Polymath, for those who aspire to become unique" },
      {
        property: "og:description",
        content:
          "History, geography, science, technology, current affairs and niche ideas. One click, one rabbit hole.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const SPIN_DURATION = 500;
const REEL_SIZE = 8;
const LINE_HEIGHT_EM = 1.28;
const PLACEHOLDER_TEXT = "A random topic.";
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

function randomGlyph() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]!;
}

// One reel per character. Even indices fall down, odd indices roll up.
function buildCharReel(finalChar: string, down: boolean): string[] {
  const fillers = Array.from({ length: REEL_SIZE - 1 }, randomGlyph);
  return down ? [finalChar, ...fillers] : [...fillers, finalChar];
}

function CharReel({
  char,
  index,
  spinning,
}: {
  char: string;
  index: number;
  spinning: boolean;
}) {
  if (char === " ") return <span className="inline-block">&nbsp;</span>;

  const down = index % 2 === 0;
  const reel = spinning ? buildCharReel(char, down) : [char];
  const restIndex = spinning ? (down ? 0 : reel.length - 1) : 0;
  const rest = `-${restIndex * LINE_HEIGHT_EM}em`;
  const from = down
    ? `-${(reel.length - 1) * LINE_HEIGHT_EM}em`
    : "0em";

  return (
    <span className="reel-window">
      {/* invisible sizer keeps each letter locked to its final width */}
      <span className="reel-ghost">{char}</span>
      <span
        className={`reel-strip ${spinning ? "reel-spin" : ""}`}
        style={
          {
            "--reel-from": from,
            "--reel-end": rest,
            "--reel-delay": `${(index % 6) * 30}ms`,
            transform: spinning ? undefined : `translateY(${rest})`,
          } as React.CSSProperties
        }
      >
        {reel.map((c, i) => (
          <span key={i} className="reel-item">
            {c}
          </span>
        ))}
      </span>
    </span>
  );

}

function Index() {
  const [topic, setTopic] = useState<Topic | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [notes, setNotes] = useState<string | null>(null);
  const [notesLoading, setNotesLoading] = useState(false);
  const [notesError, setNotesError] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fetchTopic = useServerFn(generateTopic);
  const fetchNotes = useServerFn(explainTopic);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const spin = useCallback(async () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsLoading(true);

    try {
      const next = await fetchTopic({ data: { exclude: topic?.text } });
      // Only start the reel once the new text is what's on screen.
      setTopic(next);
      setIsSpinning(true);
      timeoutRef.current = setTimeout(() => {
        setIsSpinning(false);
      }, SPIN_DURATION + 200);
    } catch (error) {
      console.error("[spin] Failed to generate topic", error);
    } finally {
      setIsLoading(false);
    }
  }, [topic, fetchTopic]);

  const openNotes = useCallback(async () => {
    if (!topic) return;
    setNotesOpen(true);
    setNotesError(null);
    setNotes(null);
    setNotesLoading(true);
    try {
      const result = await fetchNotes({ data: { topic: topic.text } });
      setNotes(result.notes);
    } catch (error) {
      console.error("[notes] Failed to explain topic", error);
      setNotesError("Couldn't write the notes just now. Try again in a moment.");
    } finally {
      setNotesLoading(false);
    }
  }, [topic, fetchNotes]);

  const text = topic?.text ?? PLACEHOLDER_TEXT;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-6 py-10 sm:px-8">
      <header>
        <span className="font-serif text-lg tracking-tight">Project Polymath</span>
      </header>

      <section className="flex flex-1 flex-col justify-center py-16">
        <h1 className="font-serif text-3xl leading-[1.28] tracking-tight sm:text-[2.35rem]">
          <span className="flex flex-wrap">
            {Array.from(text).map((c, i) => (
              <CharReel key={i} char={c} index={i} spinning={isSpinning} />
            ))}
          </span>
        </h1>

        <div className="mt-12 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={spin}
            disabled={isSpinning || isLoading}
            className="pill-cta px-10 py-4 text-base font-medium disabled:opacity-60"
          >
            {topic ? "Another" : "Spin"}
          </button>

          {topic && (
            <button
              type="button"
              onClick={openNotes}
              className="rounded-full border border-border px-8 py-4 text-base font-medium text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
            >
              Read up on it
            </button>
          )}
        </div>
      </section>

      {notesOpen && topic && (
        <TopicNotes
          topic={topic.text}
          notes={notes}
          isLoading={notesLoading}
          error={notesError}
          onClose={() => setNotesOpen(false)}
        />
      )}
    </main>
  );
}
