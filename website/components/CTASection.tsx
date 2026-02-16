import { Reveal } from "./Reveal";
import { EXTENSION_DOWNLOAD_URL } from "@/lib/constants";
import { InstallInstructions } from "./InstallInstructions";

export function CTASection() {
  return (
    <section className="py-16 px-6 bg-raised/50">
      <Reveal>
        <div className="max-w-[480px] mx-auto text-center py-12 px-6">
          <h2 className="font-display text-[clamp(24px,3vw,30px)] font-semibold tracking-tight mb-2">
            Download and start learning
          </h2>
          <p className="text-[14px] text-text-dim mb-6 leading-[1.6]">
            Free. No account required.
          </p>
          <a
            href={EXTENSION_DOWNLOAD_URL}
            download="vocab-extender.zip"
            className="inline-flex items-center gap-2 py-3 px-6 bg-accent text-white font-medium text-[14px] rounded no-underline transition-colors hover:bg-accent-dim"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
            Download extension
          </a>
          <div className="flex justify-center mt-6">
            <InstallInstructions />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
