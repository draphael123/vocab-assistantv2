import Link from "next/link";
import { Reveal } from "./Reveal";

const chromeStoreUrl = "#";

export function CTASection() {
  return (
    <section className="py-20 px-6">
      <Reveal>
        <div className="max-w-[700px] mx-auto text-center py-14 px-10 bg-card border border-white/5 rounded-[20px] relative overflow-hidden">
          <div
            className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.06)_0%,transparent_60%)] pointer-events-none"
            aria-hidden
          />
          <h2 className="font-display text-[clamp(28px,4vw,40px)] font-normal leading-tight tracking-tight mb-3.5 relative">
            Ready to extend your
            <br />
            <em className="italic text-accent">vocabulary?</em>
          </h2>
          <p className="text-[15px] text-text-dim mb-8 leading-[1.6] relative">
            Join thousands building a stronger vocabulary, one word at a time.
          </p>
          <Link
            href={chromeStoreUrl}
            className="relative inline-flex items-center gap-2 py-3.5 px-7 bg-accent text-page font-bold text-[15px] rounded-[10px] no-underline transition-all duration-[0.25s] shadow-[0_0_30px_rgba(245,158,11,0.15)] hover:bg-accent-dim hover:-translate-y-0.5 hover:shadow-[0_0_50px_rgba(245,158,11,0.25)]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
            Add to Chrome — It&apos;s Free
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
