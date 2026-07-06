"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Лента отзывов-скриншотов с горизонтальной прокруткой (правка заказчика: как на
// domovoy.online). Скрины показываем «как есть» (натуральная высота, без обрезки),
// листаем стрелками (десктоп) и свайпом (мобайл). Стрелки гаснут у краёв ленты.
type ReviewCard = {
  id: string;
  image: string;
  caption: string | null;
};

export default function ReviewsSlider({ reviews }: { reviews: ReviewCard[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  function scrollByPage(direction: number) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * Math.max(el.clientWidth * 0.85, 260), behavior: "smooth" });
  }

  if (reviews.length === 0) return null;

  return (
    <div className="reviews-slider">
      <div className="reviews-track" ref={trackRef}>
        {reviews.map((r) => (
          <figure className="review-card" key={r.id}>
            {/* Пользовательские скрины произвольной высоты — plain <img> сохраняет
                натуральные пропорции (без обрезки). Файлы уже оптимизированы в WebP. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={r.image} alt={r.caption || "Отзыв покупателя"} loading="lazy" />
            {r.caption && <figcaption>{r.caption}</figcaption>}
          </figure>
        ))}
      </div>

      {reviews.length > 1 && (
        <>
          <button
            type="button"
            className="reviews-arrow prev"
            aria-label="Предыдущие отзывы"
            onClick={() => scrollByPage(-1)}
            disabled={atStart}
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            className="reviews-arrow next"
            aria-label="Следующие отзывы"
            onClick={() => scrollByPage(1)}
            disabled={atEnd}
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}
    </div>
  );
}
