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
        {/* Порядок секций — как в навигации шапки (правка заказчика ЛОГО100):
            Проекты → Готовые дома → Объекты в строительстве → Участки →
            Построенные объекты → Ипотека → Как мы работаем. «Комплектации и цены»
            идут сразу после «Проектов». Расстановка вне-меню блоков
            (Дом или квартира, Подбор и расчёт, Отзывы, FAQ, Контакты) — провизорная,
            согласовать с заказчиком. */}
        <ProjectsSection />
        <PricesSection />
        <HomesSection />
        <BuildingSection />
        <PlotsSection />
        <BuiltSection />
        <CompareSection />
        <CalculatorSection />
        <PaymentSection />
        <ProcessSection />
        <TrustSection />
        <FaqSection />
        <ContactsSection />
      </main>
      <SiteFooter />
      <LeadModal />
    </>
  );
}
