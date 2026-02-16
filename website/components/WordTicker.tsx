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
            className="flex-shrink-0 py-2.5 px-5 bg-card border border-white/5 rounded-full font-display text-base text-text-dim whitespace-nowrap transition-all duration-300 cursor-default hover:border-amber-500/20 hover:text-accent hover:bg-accent/10"
          >
            {word}
          </span>
        ))}
      </div>
    </section>
  );
}
