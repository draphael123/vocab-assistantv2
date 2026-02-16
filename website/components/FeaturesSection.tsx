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
    <section id="features" className="py-20 px-6">
      <div className="max-w-[1100px] mx-auto">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent mb-3 text-center">
          Features
        </p>
        <h2 className="font-display text-[clamp(32px,4vw,44px)] font-normal leading-tight tracking-tight text-center mb-14">
          Everything you need to
          <br />
          <em className="italic text-accent">master new words</em>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-[400px] sm:max-w-none mx-auto">
          {FEATURES.map((f) => (
            <Reveal key={f.title}>
              <div className="p-7 pt-6 bg-card border border-white/5 rounded-[14px] transition-all duration-300 ease-out hover:border-amber-500/10 hover:bg-card-hover hover:-translate-y-1">
                <div className="w-11 h-11 rounded-[10px] bg-accent/10 border border-amber-500/10 flex items-center justify-center text-accent mb-4">
                  {f.icon}
                </div>
                <h3 className="text-base font-bold mb-2 tracking-tight">{f.title}</h3>
                <p className="text-[13.5px] text-text-dim leading-[1.6]">
                  {f.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
