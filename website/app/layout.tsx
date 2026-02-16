import type { Metadata } from "next";
import { Instrument_Serif, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
});

// Plus Jakarta Sans is a close stand-in for Satoshi (geometric sans). Replace with local Satoshi if you have the files.
const satoshi = Plus_Jakarta_Sans({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-satoshi",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vocab Extender — Word of the Day Chrome Extension",
  description:
    "Expand your vocabulary daily with SAT & GRE-level words. Definitions, pronunciation, quizzes, and bookmarks right in your browser.",
  openGraph: {
    title: "Vocab Extender — Word of the Day Chrome Extension",
    description:
      "Expand your vocabulary daily with SAT & GRE-level words. Definitions, pronunciation, quizzes, and bookmarks right in your browser.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${instrumentSerif.variable} ${satoshi.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-page text-text-primary font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
