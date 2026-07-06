import { getReviews, getSettings } from "../../lib/queries";
import { sectionBgStyle } from "../../lib/sectionBg";
import ReviewsSlider from "../ReviewsSlider";
import SectionHead from "../SectionHead";

// Блок «Отзывы покупателей» — заменил FAQ (правка заказчика). Горизонтальная лента
// скриншотов. Если отзывов ещё нет — секция не рендерится (не показываем пустоту).
export default async function ReviewsSection() {
  const [reviews, s] = await Promise.all([getReviews(), getSettings()]);
  if (reviews.length === 0) return null;
  const bg = s.reviews_bg_image;

  return (
    <section
      className={`section reviews-section${bg ? " has-bg" : ""}`}
      id="reviews"
      style={sectionBgStyle(bg)}
    >
      <SectionHead id="reviews" />
      <div className="container">
        <ReviewsSlider
          reviews={reviews.map((r) => ({ id: r.id, image: r.image, caption: r.caption }))}
        />
      </div>
    </section>
  );
}
