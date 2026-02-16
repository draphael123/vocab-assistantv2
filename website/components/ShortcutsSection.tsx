import { Reveal } from "./Reveal";

const SHORTCUTS = [
  { keys: ["1", "2", "3", "4"], desc: "Select quiz answer (when Quiz tab is active)" },
  { keys: ["Tap card"], desc: "Flip flashcard to reveal definition" },
];

export function ShortcutsSection() {
  return (
    <section id="shortcuts" className="py-16 px-6 bg-raised/50">
      <div className="max-w-[640px] mx-auto">
        <Reveal>
          <h2 className="font-display text-[clamp(24px,3vw,30px)] font-semibold tracking-tight mb-8">
            Keyboard shortcuts
          </h2>
          <div className="space-y-4">
            {SHORTCUTS.map((s, i) => (
              <div
                key={i}
                className="flex flex-wrap items-center gap-3 py-3 border-b border-stone-200 last:border-0"
              >
                <div className="flex gap-1.5">
                  {s.keys.map((k) => (
                    <kbd
                      key={k}
                      className="px-2.5 py-1 text-[12px] font-mono bg-card border border-stone-200 rounded"
                    >
                      {k}
                    </kbd>
                  ))}
                </div>
                <span className="text-[14px] text-text-dim">{s.desc}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
