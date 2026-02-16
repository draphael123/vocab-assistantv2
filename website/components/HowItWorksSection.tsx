import { Reveal } from "./Reveal";

const STEPS = [
  {
    number: 1,
    title: "Install",
    description:
      "Add Vocab Extender to Chrome in one click. No account or setup required.",
  },
  {
    number: 2,
    title: "Click",
    description:
      "Open the popup from your toolbar to discover today's word with full details.",
  },
  {
    number: 3,
    title: "Learn",
    description:
      "Read, listen, quiz yourself, and bookmark words to grow your vocabulary daily.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-[800px] mx-auto">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent mb-3 text-center">
          How It Works
        </p>
        <h2 className="font-display text-[clamp(32px,4vw,44px)] font-normal leading-tight tracking-tight text-center mb-14">
          Three steps to a
          <br />
          <em className="italic text-accent">bigger vocabulary</em>
        </h2>
        <div className="flex gap-6 justify-center flex-wrap">
          {STEPS.map((step) => (
            <Reveal key={step.number}>
              <div className="flex-1 min-w-[200px] max-w-[260px] text-center relative">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-accent/10 border-[1.5px] border-amber-500/20 flex items-center justify-center font-display text-[22px] text-accent">
                  {step.number}
                </div>
                <h3 className="text-base font-bold mb-1.5">{step.title}</h3>
                <p className="text-[13px] text-text-dim leading-[1.55]">
                  {step.description}
                </p>
                {step.number < 3 && (
                  <div
                    className="hidden sm:block absolute top-6 -right-6 w-6 h-px bg-amber-500/20"
                    aria-hidden
                  />
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
