import Link from "next/link";
import { EXTENSION_DOWNLOAD_URL } from "@/lib/constants";

export function Hero() {
  return (
    <section className="pt-36 pb-20 px-6 text-center relative">
      <h1 className="font-display text-[clamp(38px,6vw,64px)] font-semibold leading-[1.1] tracking-[-0.02em] text-text-primary max-w-[640px] mx-auto mb-5">
        One new word.
        <br />
        <em className="italic font-normal text-accent">Every day.</em>
      </h1>
      <p className="text-[16px] text-text-dim max-w-[460px] mx-auto mb-9 leading-[1.7]">
        SAT & GRE vocabulary, definitions, pronunciation, and quizzes — right in your browser.
      </p>
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <a
          href={EXTENSION_DOWNLOAD_URL}
          download="vocab-extender.zip"
          className="inline-flex items-center gap-2 py-3 px-6 bg-accent text-white font-medium text-[14px] rounded-md no-underline transition-colors duration-200 hover:bg-accent-dim"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
          </svg>
          Download
        </a>
        <Link
          href="#features"
          className="inline-flex items-center py-3 px-6 text-text-dim text-[14px] no-underline border-b border-text-dim/30 hover:border-accent hover:text-accent transition-colors duration-200"
        >
          What&apos;s inside
        </Link>
      </div>
    </section>
  );
}
