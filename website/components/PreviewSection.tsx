import { Reveal } from "./Reveal";

export function PreviewSection() {
  return (
    <section className="py-20 px-6 relative">
      <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-16 items-center">
        <div className="md:order-1">
          <Reveal>
            <h2 className="font-display text-[clamp(32px,4vw,44px)] font-normal leading-tight tracking-tight mb-4">
              Your daily vocabulary <em className="italic text-accent">ritual</em>
            </h2>
            <p className="text-[15px] text-text-dim leading-[1.7] max-w-[420px]">
              Click the extension icon and discover a carefully curated word
              complete with definitions, phonetic pronunciation, real-world
              examples, and an interactive quiz to lock it in.
            </p>
          </Reveal>
        </div>
        <div className="flex justify-center md:order-2">
          <Reveal>
            <div className="w-[320px] bg-raised rounded-2xl border border-white/[0.08] overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_20px_60px_rgba(0,0,0,0.5),0_0_120px_rgba(245,158,11,0.04)]">
              <div className="py-3.5 px-4 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-1.5">
                  <div className="w-[22px] h-[22px] rounded-[5px] bg-gradient-to-br from-accent to-accent-dim flex items-center justify-center font-display text-[13px] text-page font-normal">
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
                    <span className="inline-block text-[8px] font-bold uppercase tracking-wider py-0.5 px-1.5 rounded-full bg-accent/10 text-accent border border-amber-500/20 mb-1.5">
                      advanced
                    </span>
                  </div>
                  <div className="w-7 h-7 border border-white/5 rounded-md flex items-center justify-center text-accent bg-accent/10">
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
                <div className="py-2 px-2.5 bg-card rounded-md border-l-4 border-accent mb-2">
                  <div className="text-[8px] font-bold uppercase tracking-wider text-accent mb-0.5">
                    adjective
                  </div>
                  <div className="text-[11px] text-text-primary leading-[1.45]">
                    Lasting for a very short time; transitory.
                  </div>
                </div>
                <div className="py-2 px-2.5 bg-card rounded-md border-l-4 border-accent mb-2">
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
                <div className="text-[10.5px] text-text-dim italic py-1.5 px-2.5 bg-card rounded-md border-l-2 border-surface leading-[1.5]">
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
