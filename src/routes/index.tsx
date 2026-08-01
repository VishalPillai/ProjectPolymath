import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { pickTopic, TOPICS, type Category, type Topic } from "@/lib/prompts";

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
const REEL_SIZE = 11;
const SELECTED_INDEX = 5;
const LINE_HEIGHT_EM = 1.28;
const PLACEHOLDER_TEXT = "A random topic.";

function buildReel(selected: Topic, exclude?: string): Topic[] {
  const pool = TOPICS.filter((t) => t.text !== selected.text && t.text !== exclude);
  const pick = () => {
    const idx = Math.floor(Math.random() * pool.length);
    return pool[idx]!;
  };
  const before = Array.from({ length: SELECTED_INDEX }, pick);
  const after = Array.from({ length: REEL_SIZE - SELECTED_INDEX - 1 }, pick);
  return [...before, selected, ...after];
}

const PLACEHOLDER: Topic = { category: "Nature" as Category, text: PLACEHOLDER_TEXT };

// Deterministic initial reel so SSR and client markup match exactly.
function initialReel(): Topic[] {
  const pool = TOPICS.filter((t) => t.text !== PLACEHOLDER_TEXT);
  const items = Array.from(
    { length: REEL_SIZE - 1 },
    (_, i) => pool[(i * 7) % pool.length]!,
  );
  return [...items.slice(0, SELECTED_INDEX), PLACEHOLDER, ...items.slice(SELECTED_INDEX)];
}

function Index() {
  const [topic, setTopic] = useState<Topic | null>(null);
  const [reel, setReel] = useState<Topic[]>(initialReel);
  const [isSpinning, setIsSpinning] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const spin = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    const next = pickTopic(topic?.text);
    setReel(buildReel(next, topic?.text));
    setIsSpinning(true);
    setTopic(next);

    timeoutRef.current = setTimeout(() => {
      setIsSpinning(false);
    }, SPIN_DURATION);
  }, [topic]);

  const reelEnd = `-${SELECTED_INDEX * LINE_HEIGHT_EM}em`;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-6 py-10 sm:px-8">
      <header>
        <span className="font-serif text-lg tracking-tight">unprompted</span>
      </header>

      <section className="flex flex-1 flex-col justify-center py-16">
        <h1 className="font-serif text-3xl leading-[1.28] tracking-tight sm:text-[2.35rem]">
          <span className="reel-window">
            <span
              key={topic?.text ?? "initial"}
              className={`reel-strip ${isSpinning ? "reel-spin" : ""}`}
              style={{
                "--reel-end": reelEnd,
                transform: isSpinning ? undefined : `translateY(${reelEnd})`,
              } as React.CSSProperties}
            >
              {reel.map((t, i) => (
                <span key={`${t.text}-${i}`} className="reel-item">
                  {t.text}
                </span>
              ))}
            </span>
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
