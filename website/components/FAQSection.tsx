"use client";

import { useState } from "react";
import { Reveal } from "./Reveal";

const FAQ_ITEMS = [
  {
    q: "How do I install the extension?",
    a: "Download the zip, extract it, go to chrome://extensions, turn on Developer mode, click Load unpacked, and select the extracted folder.",
  },
  {
    q: "What permissions does it need?",
    a: "Storage (for saved words and settings), alarms & notifications (for daily reminder), and access to the dictionary API. No tracking or personal data is collected.",
  },
  {
    q: "Does it work offline?",
    a: "Yes, partially. The word list and cached definitions load offline. Pronunciation audio and fresh API lookups require internet.",
  },
  {
    q: "How do I export to Anki?",
    a: "Go to the Saved tab, click Export for Anki, and import the .txt file in Anki via File → Import. Use tab as the separator.",
  },
];

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" className="py-16 px-6">
      <div className="max-w-[640px] mx-auto">
        <Reveal>
          <h2 className="font-display text-[clamp(24px,3vw,30px)] font-semibold tracking-tight mb-8">
            FAQ
          </h2>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <div
                key={i}
                className="border border-stone-200 rounded-lg overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full py-4 px-5 text-left font-medium text-[14px] flex justify-between items-center hover:bg-raised/50"
                >
                  {item.q}
                  <span className="text-accent text-lg shrink-0 ml-2">
                    {open === i ? "−" : "+"}
                  </span>
                </button>
                {open === i && (
                  <div className="px-5 pb-4 text-[14px] text-text-dim leading-[1.6]">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
