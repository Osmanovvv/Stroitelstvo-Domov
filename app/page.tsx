import LeadModal from "./components/LeadModal";
import SiteFooter from "./components/SiteFooter";
import SiteHeader from "./components/SiteHeader";
import ScrollReveal from "./components/ScrollReveal";
import {
  BuildingSection,
  BuiltSection,
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

// Контент обновляется по запросу через revalidatePath('/') из админки;
// фоновая ISR-ревалидация раз в час — страховка от устаревания и сбоев.
export const revalidate = 3600;

export default function Home() {
  return (
    <>
      <main>
        <ScrollReveal />
        <SiteHeader />
        <HeroSection />
        <ChoiceSection />
        <HomesSection />
        <BuildingSection />
        <ProjectsSection />
        <PlotsSection />
        <BuiltSection />
        <CompareSection />
        <CalculatorSection />
        <PricesSection />
        <TrustSection />
        <ProcessSection />
        <PaymentSection />
        <FaqSection />
        <ContactsSection />
      </main>
      <SiteFooter />
      <LeadModal />
    </>
  );
}
