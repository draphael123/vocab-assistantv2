"use client";

import { useState } from "react";

export function InstallInstructions() {
  const [open, setOpen] = useState(false);

  return (
    <div className="text-center sm:text-left">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="text-sm text-text-dim hover:text-accent transition-colors underline underline-offset-2"
      >
        {open ? "Hide" : "How do I install it?"}
      </button>
      {open && (
        <ol className="mt-3 text-[13px] text-text-dim leading-relaxed space-y-1.5 list-decimal list-inside max-w-[260px] mx-auto sm:mx-0 sm:max-w-none text-left">
          <li>Download and extract the ZIP file above</li>
          <li>Open Chrome and go to <code className="px-1.5 py-0.5 rounded bg-stone-200/60 text-text-primary text-[12px] font-mono">chrome://extensions</code></li>
          <li>Turn on <strong className="text-text-primary">Developer mode</strong> (top right)</li>
          <li>Click <strong className="text-text-primary">Load unpacked</strong> and select the extracted folder</li>
        </ol>
      )}
    </div>
  );
}
