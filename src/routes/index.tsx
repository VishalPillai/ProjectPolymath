import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { pickTopic, type Topic } from "@/lib/prompts";

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
      <header>
        <span className="font-serif text-lg tracking-tight">unprompted</span>
      </header>

      <section className="flex flex-1 flex-col justify-center py-16">
        <h1 className="font-serif text-3xl leading-[1.28] tracking-tight sm:text-[2.35rem]">
          {topic
            ? topic.text
            : "A random topic about almost anything."}
        </h1>

        <div className="mt-12">
          <button
            type="button"
            onClick={spin}
            className="pill-cta px-10 py-4 text-base font-medium"
          >
            {topic ? "Another" : "Spin"}
          </button>
        </div>
      </section>
    </main>
  );
}
