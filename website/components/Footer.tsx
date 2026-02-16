import Link from "next/link";

export function Footer() {
  return (
    <footer className="py-8 px-6 border-t border-stone-200">
      <div className="max-w-[1100px] mx-auto flex items-center justify-between flex-wrap gap-4">
        <Link href="/" className="flex items-center gap-2 no-underline text-text-primary">
          <div className="w-6 h-6 rounded bg-accent flex items-center justify-center font-display text-xs text-white font-medium">
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
