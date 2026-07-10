import LeadModal from "./components/LeadModal";
import SiteFooter from "./components/SiteFooter";
import SiteHeader from "./components/SiteHeader";
import ScrollReveal from "./components/ScrollReveal";
import JsonLd from "./components/JsonLd";
import {
  BuildingSection,
  BuiltSection,
  ChoiceSection,
  CompareSection,
  ContactsSection,
  HeroSection,
  HomesSection,
  PaymentSection,
  PlotsSection,
  PricesSection,
  ProcessSection,
  ProjectsSection,
  ReviewsSection,
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
            (Дом или квартира, Отзывы, Контакты) — провизорная,
            согласовать с заказчиком. Квиз подбора — на первом экране (в hero);
            отдельный блок «Подбор и расчёт» убран как дубль (правка заказчика A). */}
        <ProjectsSection />
        <PricesSection />
        <HomesSection />
        <BuildingSection />
        <PlotsSection />
        <BuiltSection />
        <CompareSection />
        <PaymentSection />
        <ProcessSection />
        <ReviewsSection />
        <ContactsSection />
      </main>
      <SiteFooter />
      <LeadModal />
      <JsonLd />
    </>
  );
}
