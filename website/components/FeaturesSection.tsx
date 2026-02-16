import { Reveal } from "./Reveal";

const FEATURES = [
  {
    title: "Daily Word",
    description:
      "A fresh SAT/GRE-level word every day at midnight, synced across all users so everyone learns together.",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
  {
    title: "Pronunciation",
    description:
      "Phonetic spelling and audio pronunciation so you can confidently use every word in conversation.",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      </svg>
    ),
  },
  {
    title: "Interactive Quiz",
    description:
      "Test yourself with multiple choice questions. Build streaks and reinforce retention through active recall.",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  {
    title: "Bookmarks",
    description:
      "Save your favorite words to a searchable collection. Build your own personal vocabulary library over time.",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-16 px-6 bg-raised/50">
      <div className="max-w-[900px] mx-auto">
        <h2 className="font-display text-[clamp(28px,3.5vw,36px)] font-semibold tracking-tight text-text-primary mb-10">
          Daily word, pronunciation, quiz, bookmarks.
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          {FEATURES.map((f) => (
            <Reveal key={f.title}>
              <div className="flex gap-4 p-5 bg-card rounded border border-stone-200/80 transition-colors hover:border-accent/20">
                <div className="shrink-0 w-10 h-10 rounded flex items-center justify-center text-accent bg-accent/5">
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-[15px] mb-1">{f.title}</h3>
                  <p className="text-[14px] text-text-dim leading-[1.55]">
                    {f.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
