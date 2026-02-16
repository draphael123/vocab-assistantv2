import { Reveal } from "./Reveal";

export function PreviewSection() {
  return (
    <section className="py-16 px-6">
      <div className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
        <div className="md:order-1 md:pr-8">
          <Reveal>
            <h2 className="font-display text-[clamp(26px,3.5vw,34px)] font-semibold leading-tight tracking-tight mb-3">
              Click. Read. Quiz.
            </h2>
            <p className="text-[15px] text-text-dim leading-[1.65]">
              Each word comes with definitions, phonetic spelling, audio, and a quiz. Save favorites to build your own vocabulary list.
            </p>
          </Reveal>
        </div>
        <div className="flex justify-center md:justify-end md:order-2">
          <Reveal>
            <div className="w-[300px] bg-card rounded-lg border border-stone-200 overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
              <div className="py-3 px-4 flex items-center justify-between border-b border-stone-200">
                <div className="flex items-center gap-1.5">
                  <div className="w-[20px] h-[20px] rounded bg-accent flex items-center justify-center font-display text-[11px] text-white font-medium">
                    V
                  </div>
                  <span className="text-xs font-bold text-text-primary">
                    Vocab Extender
                  </span>
                </div>
                <span className="text-[10px] text-text-muted">Sun, Feb 15</span>
              </div>
              <div className="flex gap-1 pt-2.5 px-3">
                <span className="py-1.5 px-3 text-[10px] font-semibold text-accent bg-surface rounded-md">
                  Today&apos;s Word
                </span>
                <span className="py-1.5 px-3 text-[10px] font-semibold text-text-muted rounded-md">
                  Quiz
                </span>
                <span className="py-1.5 px-3 text-[10px] font-semibold text-text-muted rounded-md">
                  Saved
                </span>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <div className="font-display text-[26px] text-accent leading-tight">
                      ephemeral
                    </div>
                    <span className="inline-block text-[8px] font-semibold uppercase tracking-wider py-0.5 px-1.5 rounded bg-accent/10 text-accent mb-1.5">
                      advanced
                    </span>
                  </div>
                  <div className="w-6 h-6 border border-stone-200 rounded flex items-center justify-center text-accent bg-accent/5">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                </div>
                <div className="text-[11px] text-text-muted italic mb-3.5">
                  /ɪˈfɛm(ə)r(ə)l/
                </div>
                <div className="py-2 px-2.5 bg-raised/60 rounded border-l-2 border-accent mb-2">
                  <div className="text-[8px] font-bold uppercase tracking-wider text-accent mb-0.5">
                    adjective
                  </div>
                  <div className="text-[11px] text-text-primary leading-[1.45]">
                    Lasting for a very short time; transitory.
                  </div>
                </div>
                <div className="py-2 px-2.5 bg-raised/60 rounded border-l-2 border-accent mb-2">
                  <div className="text-[8px] font-bold uppercase tracking-wider text-accent mb-0.5">
                    noun
                  </div>
                  <div className="text-[11px] text-text-primary leading-[1.45]">
                    An ephemeral plant or insect.
                  </div>
                </div>
                <div className="text-[8px] font-bold uppercase tracking-widest text-text-muted mt-3 mb-1.5">
                  Examples
                </div>
                <div className="text-[10.5px] text-text-dim italic py-1.5 px-2.5 bg-raised/40 rounded border-l-2 border-stone-300 leading-[1.5]">
                  &quot;The ephemeral beauty of cherry blossoms draws millions of
                  visitors each spring.&quot;
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
