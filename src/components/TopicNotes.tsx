type Block =
  | { kind: "heading"; text: string }
  | { kind: "bullet"; text: string }
  | { kind: "para"; text: string };

function parseNotes(notes: string): Block[] {
  return notes
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map<Block>((line) => {
      if (line.startsWith("#")) {
        return { kind: "heading", text: line.replace(/^#+\s*/, "") };
      }
      if (/^[-*•]\s+/.test(line)) {
        return { kind: "bullet", text: line.replace(/^[-*•]\s+/, "") };
      }
      return { kind: "para", text: line };
    });
}

export function TopicNotes({
  topic,
  notes,
  isLoading,
  error,
  onClose,
}: {
  topic: string;
  notes: string | null;
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
}) {
  const blocks = notes ? parseNotes(notes) : [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-background animate-fade-in">
      <div className="mx-auto w-full max-w-2xl px-6 py-10 sm:px-8">
        <div className="flex items-center justify-between gap-4">
          <span className="font-serif text-sm font-medium uppercase tracking-[0.32em] text-muted-foreground">
            Project Polymath
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Close
          </button>
        </div>

        <h1 className="mt-14 font-serif text-3xl leading-[1.2] tracking-tight sm:text-[2.35rem]">
          {topic}
        </h1>

        {isLoading && (
          <p className="mt-8 text-muted-foreground">Writing your notes…</p>
        )}

        {error && <p className="mt-8 text-destructive">{error}</p>}

        {!isLoading && !error && (
          <div className="mt-10 space-y-2 pb-20">
            {blocks.map((block, i) => {
              if (block.kind === "heading") {
                return (
                  <h2
                    key={i}
                    className="pt-8 font-serif text-xl tracking-tight text-primary"
                  >
                    {block.text}
                  </h2>
                );
              }
              if (block.kind === "bullet") {
                return (
                  <div key={i} className="flex gap-3 pt-2 leading-relaxed">
                    <span className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-primary" />
                    <p className="text-[0.98rem] text-foreground/90">{block.text}</p>
                  </div>
                );
              }
              return (
                <p key={i} className="pt-2 leading-relaxed text-foreground/90">
                  {block.text}
                </p>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
