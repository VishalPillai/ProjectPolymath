import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useRef, useState } from "react";
import { generateTopic, type Topic } from "@/lib/topics.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Unprompted — A random topic for curious minds" },
      {
        name: "description",
        content:
          "Discover a random topic across history, geography, science, technology, current affairs and more. Built for polymaths who want to keep learning.",
      },
      { property: "og:title", content: "Unprompted — A random topic for curious minds" },
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
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fetchTopic = useServerFn(generateTopic);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const spin = useCallback(async () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsSpinning(true);
    console.log("[spin] starting");

    try {
      const next = await fetchTopic({ data: { exclude: topic?.text } });
      console.log("[spin] got topic:", next);
      setTopic(next);
    } catch (error) {
      console.error("[spin] Failed to generate topic", error);
    }

    timeoutRef.current = setTimeout(() => {
      setIsSpinning(false);
    }, SPIN_DURATION + 200);
  }, [topic, fetchTopic]);

  const text = topic?.text ?? PLACEHOLDER_TEXT;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-6 py-10 sm:px-8">
      <header>
        <span className="font-serif text-lg tracking-tight">unprompted</span>
      </header>

      <section className="flex flex-1 flex-col justify-center py-16">
        <h1 className="font-serif text-3xl leading-[1.28] tracking-tight sm:text-[2.35rem]">
          <span className="flex flex-wrap">
            {Array.from(text).map((c, i) => (
              <CharReel key={i} char={c} index={i} spinning={isSpinning} />
            ))}
          </span>
        </h1>

        <div className="mt-12">
          <button
            type="button"
            onClick={spin}
            disabled={isSpinning}
            className="pill-cta px-10 py-4 text-base font-medium disabled:opacity-60"
          >
            {topic ? "Another" : "Spin"}
          </button>
        </div>
      </section>
    </main>
  );
}
