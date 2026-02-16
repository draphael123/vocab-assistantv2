import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { WordTicker } from "@/components/WordTicker";
import { PreviewSection } from "@/components/PreviewSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { CTASection } from "@/components/CTASection";
import { ShortcutsSection } from "@/components/ShortcutsSection";
import { FAQSection } from "@/components/FAQSection";
import { ChangelogSection } from "@/components/ChangelogSection";
import { StudyTipsSection } from "@/components/StudyTipsSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <WordTicker />
        <PreviewSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CTASection />
        <ShortcutsSection />
        <FAQSection />
        <StudyTipsSection />
        <ChangelogSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
