import Link from "next/link";

const chromeStoreUrl = "#"; // Replace with your Chrome Web Store link when published

export function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] py-4 backdrop-blur-[20px] bg-page/80 border-b border-white/5">
      <div className="max-w-[1100px] mx-auto px-6 flex items-center justify-between">
        <Link href="#" className="flex items-center gap-2.5 no-underline">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent-dim flex items-center justify-center font-display text-xl text-page font-normal">
            V
          </div>
          <span className="font-extrabold text-base text-text-primary tracking-tight">
            Vocab Extender
          </span>
        </Link>
        <Link
          href={chromeStoreUrl}
          className="inline-flex items-center gap-2 py-2.5 px-5 bg-accent text-page font-bold text-[13px] rounded-lg border-0 cursor-pointer no-underline transition-all duration-200 hover:bg-accent-dim hover:-translate-y-0.5"
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
          Add to Chrome
        </Link>
      </div>
    </nav>
  );
}
