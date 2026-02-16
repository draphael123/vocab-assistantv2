import Link from "next/link";

export function Footer() {
  return (
    <footer className="py-10 px-6 border-t border-white/5">
      <div className="max-w-[1100px] mx-auto flex items-center justify-between flex-wrap gap-4">
        <Link href="#" className="flex items-center gap-2 no-underline">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-accent to-accent-dim flex items-center justify-center font-display text-sm text-page">
            V
          </div>
          <span className="font-bold text-sm text-text-primary">
            Vocab Extender
          </span>
        </Link>
        <span className="text-xs text-text-muted">
          &copy; 2026 Vocab Extender. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
