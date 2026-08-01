import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { CATEGORIES, pickTopic, type Topic } from "@/lib/prompts";

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

function Index() {
  const [topic, setTopic] = useState<Topic | null>(null);

  const spin = useCallback(() => {
    setTopic((prev) => pickTopic(prev?.text));
  }, []);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-6 py-10 sm:px-8">
      <header className="flex items-baseline justify-between">
        <span className="font-serif text-lg tracking-tight">unprompted</span>
        <span className="text-sm text-muted-foreground">One rabbit hole at a time.</span>
      </header>

      <section className="flex flex-1 flex-col justify-center py-16">
        <div className="flex items-center gap-3">
          <span className="text-sm uppercase tracking-[0.18em] text-primary">
            {topic?.category ?? "Curiosity feed"}
          </span>
          <span className="h-px flex-1 bg-border" />
          <span className="text-sm text-muted-foreground">
            {topic ? "Ready to explore" : "Press spin to begin"}
          </span>
        </div>

        <h1 className="mt-8 font-serif text-3xl leading-[1.28] tracking-tight sm:text-[2.35rem]">
          {topic
            ? topic.text
            : "A random topic about almost anything — history, geography, science, technology, current affairs, and ideas worth knowing."}
        </h1>

        <p className="mt-5 text-base text-muted-foreground">
          {topic
            ? "Follow the thread. Read for five minutes, or go as deep as you like."
            : "Designed for polymaths: broad, surprising, and slightly niche."}
        </p>

        <div className="mt-12">
          <button
            type="button"
            onClick={spin}
            className="pill-cta px-10 py-4 text-base font-medium"
          >
            {topic ? "Discover another" : "Spin"}
          </button>
        </div>

        <div className="mt-8 h-px w-full bg-border" />
      </section>

      <footer className="pt-10 text-sm text-muted-foreground">
        {CATEGORIES.join(" · ")}
      </footer>
    </main>
  );
}
