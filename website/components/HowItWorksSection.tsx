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
    <section className="py-16 px-6">
      <div className="max-w-[560px] mx-auto">
        <ul className="space-y-6">
          {STEPS.map((step) => (
            <Reveal key={step.number}>
              <li className="flex gap-5">
                <span className="shrink-0 w-8 h-8 rounded-full bg-accent text-white font-display text-sm font-medium flex items-center justify-center">
                  {step.number}
                </span>
                <div>
                  <h3 className="font-semibold text-[15px] mb-0.5">{step.title}</h3>
                  <p className="text-[14px] text-text-dim leading-[1.55]">
                    {step.description}
                  </p>
                </div>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
