import { Reveal } from "./Reveal";

const TIPS = [
  "Review new words within 24 hours to strengthen memory.",
  "Use the quiz and flashcards for active recall instead of passive rereading.",
  "Save words you struggle with and revisit them in the Saved tab.",
  "Read example sentences aloud to practice pronunciation and usage.",
  "Build a habit: set the daily reminder for a consistent time each day.",
];

export function StudyTipsSection() {
  return (
    <section id="tips" className="py-16 px-6">
      <div className="max-w-[640px] mx-auto">
        <Reveal>
          <h2 className="font-display text-[clamp(24px,3vw,30px)] font-semibold tracking-tight mb-8">
            Study tips
          </h2>
          <ul className="space-y-4">
            {TIPS.map((tip, i) => (
              <li
                key={i}
                className="flex gap-3 text-[14px] text-text-dim leading-[1.6]"
              >
                <span className="text-accent font-semibold shrink-0">{i + 1}.</span>
                {tip}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
