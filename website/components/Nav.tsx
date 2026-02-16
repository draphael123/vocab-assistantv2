import Link from "next/link";
import { EXTENSION_DOWNLOAD_URL } from "@/lib/constants";

export function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] py-4 bg-page/95 border-b border-stone-200/60">
      <div className="max-w-[1100px] mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-8 h-8 rounded bg-accent flex items-center justify-center font-display text-lg text-white font-medium">
            V
          </div>
          <span className="font-extrabold text-base text-text-primary tracking-tight">
            Vocab Extender
          </span>
        </Link>
        <a
          href={EXTENSION_DOWNLOAD_URL}
          download="vocab-extender.zip"
          className="inline-flex items-center gap-1.5 py-2 px-4 bg-accent text-white font-medium text-[13px] rounded cursor-pointer no-underline transition-colors duration-200 hover:bg-accent-dim"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
          Download Extension
        </a>
      </div>
    </nav>
  );
}
