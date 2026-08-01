import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  COMFORT_ZONES,
  pickPrompt,
  type ComfortZone,
  type Prompt,
} from "@/lib/prompts";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Unprompted — One-minute speaking practice" },
      {
        name: "description",
        content:
          "Spin a prompt on history, geography, science or philosophy and speak for one minute. Calm, focused speaking practice for language learners.",
      },
      { property: "og:title", content: "Unprompted — One-minute speaking practice" },
      {
        property: "og:description",
        content:
          "Well-rounded speaking prompts across history, geography, science and philosophy. One minute, one idea, spoken out loud.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const ROUND_SECONDS = 60;

function Index() {
  const [zone, setZone] = useState<ComfortZone>("Balanced");
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(ROUND_SECONDS);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          setRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const spin = useCallback(() => {
    setPrompt((prev) => pickPrompt(zone, prev?.text));
    setSecondsLeft(ROUND_SECONDS);
    setRunning(true);
  }, [zone]);

  const status = running
    ? "Speaking"
    : prompt
      ? secondsLeft === 0
        ? "Time"
        : "Paused"
      : "Ready";

  const clock = useMemo(() => {
    const m = Math.floor(secondsLeft / 60);
    const s = secondsLeft % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }, [secondsLeft]);

  const progress = 1 - secondsLeft / ROUND_SECONDS;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-6 py-10 sm:px-8">
      <header className="flex items-baseline justify-between">
        <span className="font-serif text-lg tracking-tight">unprompted</span>
        <span className="text-sm text-muted-foreground">
          One minute. One idea. Out loud.
        </span>
      </header>

      <section className="flex flex-1 flex-col justify-center py-16">
        <div className="flex items-center gap-3">
          <span className="text-sm uppercase tracking-[0.18em] text-primary">
            {prompt?.category ?? "Well-rounded"}
          </span>
          <span className="h-px flex-1 bg-border" />
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <span
              className={`h-1.5 w-1.5 rounded-full ${running ? "bg-primary" : "bg-muted-foreground"}`}
            />
            {status}
          </span>
        </div>

        <h1 className="mt-8 font-serif text-3xl leading-[1.28] tracking-tight sm:text-[2.35rem]">
          {prompt
            ? prompt.text
            : "Speak for a minute on history, geography, science, or an idea worth turning over."}
        </h1>

        <p className="mt-5 text-base text-muted-foreground">
          {prompt
            ? prompt.mode === "Deep research"
              ? "Deep research — build the argument, take your time with structure."
              : "Off the cuff — start talking, let the sentences find themselves."
            : "Prompts range across the things a curious generalist should be able to talk about."}
        </p>

        <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-6">
          <button
            type="button"
            onClick={spin}
            className="pill-cta px-10 py-4 text-base font-medium"
          >
            {prompt ? "Spin again" : "Spin"}
          </button>

          <div className="flex items-baseline gap-3">
            <span className="font-serif text-3xl tabular-nums">{clock}</span>
            <span className="text-sm text-muted-foreground">left</span>
          </div>
        </div>

        <div className="mt-8 h-px w-full overflow-hidden bg-border">
          <div
            className="h-px bg-primary transition-[width] duration-1000 ease-linear"
            style={{ width: `${prompt ? progress * 100 : 0}%` }}
          />
        </div>
      </section>

      <section className="border-t border-border pt-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
            Comfort zone
          </span>
          <div className="flex gap-2">
            {COMFORT_ZONES.map((z) => (
              <button
                key={z.label}
                type="button"
                onClick={() => setZone(z.label)}
                aria-pressed={zone === z.label}
                className={`rounded-full px-4 py-2 text-sm transition-colors ${
                  zone === z.label
                    ? "bg-secondary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {z.label}
              </button>
            ))}
          </div>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          {COMFORT_ZONES.find((z) => z.label === zone)?.description}
        </p>
      </section>

      <footer className="pt-10 text-sm text-muted-foreground">
        History · Geography · Science · Art &amp; Literature · Philosophy · Economics ·
        Technology · Everyday Life
      </footer>
    </main>
  );
}
