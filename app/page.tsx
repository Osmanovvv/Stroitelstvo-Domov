import SiteHeader from "./components/SiteHeader";
import ScrollReveal from "./components/ScrollReveal";
import {
  BuildingSection,
  CalculatorSection,
  ChoiceSection,
  CompareSection,
  ContactsSection,
  FaqSection,
  HeroSection,
  HomesSection,
  PaymentSection,
  PlotsSection,
  PricesSection,
  ProcessSection,
  ProjectsSection,
  TrustSection,
} from "./components/landing";

export default function Home() {
  return (
    <main>
      <ScrollReveal />
      <SiteHeader />
      <HeroSection />
      <ChoiceSection />
      <HomesSection />
      <BuildingSection />
      <ProjectsSection />
      <PlotsSection />
      <CompareSection />
      <CalculatorSection />
      <PricesSection />
      <TrustSection />
      <ProcessSection />
      <PaymentSection />
      <FaqSection />
      <ContactsSection />
    </main>
  );
}
