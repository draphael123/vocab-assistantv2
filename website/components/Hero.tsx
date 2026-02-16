import Link from "next/link";

const chromeStoreUrl = "#";

export function Hero() {
  return (
    <section className="pt-40 pb-24 px-6 text-center relative overflow-hidden">
      <div
        className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.06)_0%,transparent_65%)] pointer-events-none"
        aria-hidden
      />
      <div className="inline-flex items-center gap-1.5 py-1.5 px-3.5 rounded-full bg-accent/10 border border-amber-500/20 text-xs font-semibold text-accent mb-7 animate-fade-up">
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
        Free Chrome Extension
      </div>
      <h1 className="font-display text-[clamp(42px,7vw,78px)] font-normal leading-[1.05] tracking-tight text-text-primary max-w-[700px] mx-auto mb-6 animate-fade-up [animation-delay:0.1s] [animation-fill-mode:both]">
        One new word.
        <br />
        <em className="italic text-accent">Every single day.</em>
      </h1>
      <p className="text-[17px] text-text-dim max-w-[480px] mx-auto mb-10 leading-[1.65] animate-fade-up [animation-delay:0.2s] [animation-fill-mode:both]">
        Expand your vocabulary effortlessly with SAT & GRE-level words, interactive
        quizzes, and pronunciation guides — all from your browser toolbar.
      </p>
      <div className="flex items-center justify-center gap-3.5 flex-wrap animate-fade-up [animation-delay:0.3s] [animation-fill-mode:both]">
        <Link
          href={chromeStoreUrl}
          className="inline-flex items-center gap-2 py-3.5 px-7 bg-accent text-page font-bold text-[15px] rounded-[10px] no-underline transition-all duration-[0.25s] shadow-[0_0_30px_rgba(245,158,11,0.15)] hover:bg-accent-dim hover:-translate-y-0.5 hover:shadow-[0_0_50px_rgba(245,158,11,0.25)]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
          </svg>
          Add to Chrome — It&apos;s Free
        </Link>
        <Link
          href="#features"
          className="inline-flex items-center gap-2 py-3.5 px-7 bg-transparent text-text-dim font-semibold text-[15px] rounded-[10px] border border-white/5 no-underline transition-all duration-[0.25s] hover:text-text-primary hover:border-white/10 hover:bg-white/[0.03]"
        >
          See Features
        </Link>
      </div>
    </section>
  );
}
