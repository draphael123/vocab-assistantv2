import { Reveal } from "./Reveal";

const CHANGELOG = [
  {
    version: "1.2.1",
    date: "Feb 2025",
    items: [
      "Flashcard mode with flip cards",
      "Anki export for saved words",
      "Share word button",
      "Font size & auto-play options",
      "New-tab override with today's word",
      "SAT/GRE difficulty badges",
      "Progress stats (words learned)",
      "Keyboard shortcuts panel",
    ],
  },
  {
    version: "1.2.0",
    date: "Earlier",
    items: [
      "Daily word, quiz, saved words, past words",
      "Search all words",
      "Copy, shuffle, calendar export",
      "Dark mode support",
      "Daily reminder notification",
    ],
  },
];

export function ChangelogSection() {
  return (
    <section id="changelog" className="py-16 px-6 bg-raised/50">
      <div className="max-w-[640px] mx-auto">
        <Reveal>
          <h2 className="font-display text-[clamp(24px,3vw,30px)] font-semibold tracking-tight mb-8">
            Changelog
          </h2>
          <div className="space-y-8">
            {CHANGELOG.map((entry) => (
              <div key={entry.version}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-semibold text-accent">{entry.version}</span>
                  <span className="text-sm text-text-muted">{entry.date}</span>
                </div>
                <ul className="list-disc list-inside text-[14px] text-text-dim space-y-1">
                  {entry.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
