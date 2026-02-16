"use client";

const TICKER_WORDS = [
  "ephemeral",
  "serendipity",
  "ubiquitous",
  "eloquent",
  "enigmatic",
  "resilient",
  "pragmatic",
  "audacious",
  "meticulous",
  "cacophony",
  "juxtapose",
  "magnanimous",
  "sanguine",
  "laconic",
  "quixotic",
  "alacrity",
  "ebullient",
  "pernicious",
  "obfuscate",
  "equanimity",
  "aberration",
  "bucolic",
  "harbinger",
  "ineffable",
  "vociferous",
];

export function WordTicker() {
  const words = [...TICKER_WORDS, ...TICKER_WORDS];
  return (
    <section className="py-5 px-6 pb-14 overflow-hidden">
      <div className="flex gap-5 w-max animate-scroll hover:[animation-play-state:paused]">
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="flex-shrink-0 py-2 px-4 bg-card border border-stone-200 rounded font-display text-[15px] text-text-dim whitespace-nowrap transition-colors duration-200 cursor-default hover:text-accent hover:border-accent/40"
          >
            {word}
          </span>
        ))}
      </div>
    </section>
  );
}
