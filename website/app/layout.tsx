import type { Metadata } from "next";
import { Fraunces, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-source-serif",
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
    <html lang="en" className={`${fraunces.variable} ${sourceSerif.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-page text-text-primary font-serif antialiased">
        {children}
      </body>
    </html>
  );
}
