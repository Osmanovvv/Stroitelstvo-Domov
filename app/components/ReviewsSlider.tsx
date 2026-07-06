"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

// Отзывы-скрины: постранично по 4 карточки по центру (планшет 3/2, телефон 1).
// Карточки фиксированного компактного размера. Стрелки по бокам листают страницами
// (следующие 4 в том же месте). Клик по карточке → лайтбокс (скрин крупно).
type ReviewCard = {
  id: string;
  image: string;
  caption: string | null;
};

const CARD = 256; // ширина карточки, px (совпадает с CSS)
const GAP = 16;
const STEP = CARD + GAP; // шаг одной карточки
const ARROWS = 104; // суммарные боковые зоны под стрелки (2×52)

export default function ReviewsSlider({ reviews }: { reviews: ReviewCard[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [perPage, setPerPage] = useState(4);
  const [page, setPage] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    function calc() {
      // Доступная ширина = ширина контейнера минус зоны под стрелки.
      const container = wrapRef.current?.parentElement;
      const w = container?.clientWidth ?? 1000;
      const avail = w - ARROWS;
      const fit = Math.floor((avail + GAP) / STEP);
      setPerPage(Math.max(1, Math.min(4, fit)));
    }
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  const pages = Math.max(1, Math.ceil(reviews.length / perPage));
  useEffect(() => {
    setPage((p) => Math.min(p, pages - 1));
  }, [pages]);

  const goPage = (dir: number) => setPage((p) => Math.min(Math.max(p + dir, 0), pages - 1));

  const lbNav = useCallback(
    (dir: number) =>
      setLightbox((i) => (i === null ? i : (i + dir + reviews.length) % reviews.length)),
    [reviews.length],
  );

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      else if (e.key === "ArrowLeft") lbNav(-1);
      else if (e.key === "ArrowRight") lbNav(1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, lbNav]);

  function onTouchStart(e: React.TouchEvent) {
    touchX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent, handler: (dir: number) => void) {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 45) handler(dx < 0 ? 1 : -1);
  }

  if (reviews.length === 0) return null;

  const active = lightbox !== null ? reviews[lightbox] : null;
  const viewportW = perPage * CARD + (perPage - 1) * GAP;
  // Сдвиг ограничиваем концом ленты — последняя страница прижимается вправо
  // (показываем последние N карточек без пустого места, если их не кратно N).
  const trackW = reviews.length * CARD + (reviews.length - 1) * GAP;
  const maxOffset = Math.max(0, trackW - viewportW);
  const offset = Math.min(page * perPage * STEP, maxOffset);

  return (
    <div className="reviews-carousel" ref={wrapRef}>
      <div className="reviews-viewport" style={{ width: viewportW }}>
        <div
          className="reviews-track"
          style={{ transform: `translateX(-${offset}px)` }}
          onTouchStart={onTouchStart}
          onTouchEnd={(e) => onTouchEnd(e, goPage)}
        >
          {reviews.map((r, i) => (
            <button
              type="button"
              className="review-card"
              key={r.id}
              onClick={() => setLightbox(i)}
              aria-label={`Открыть отзыв крупно${r.caption ? `: ${r.caption}` : ""}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={r.image} alt={r.caption || "Отзыв покупателя"} loading="lazy" />
            </button>
          ))}
        </div>
      </div>

      {pages > 1 && (
        <>
          <button
            type="button"
            className="reviews-arrow prev"
            onClick={() => goPage(-1)}
            disabled={page === 0}
            aria-label="Предыдущие отзывы"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            className="reviews-arrow next"
            onClick={() => goPage(1)}
            disabled={page >= pages - 1}
            aria-label="Следующие отзывы"
          >
            <ChevronRight size={22} />
          </button>
          <div className="reviews-dots" role="tablist" aria-label="Страницы отзывов">
            {Array.from({ length: pages }).map((_, i) => (
              <button
                type="button"
                key={i}
                className={`reviews-dot${i === page ? " is-active" : ""}`}
                onClick={() => setPage(i)}
                aria-label={`Страница ${i + 1} из ${pages}`}
                aria-current={i === page ? "true" : undefined}
              />
            ))}
          </div>
        </>
      )}

      {active && (
        <div
          className="review-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Отзыв покупателя"
          onClick={() => setLightbox(null)}
          onTouchStart={onTouchStart}
          onTouchEnd={(e) => onTouchEnd(e, lbNav)}
        >
          <button
            type="button"
            className="review-lightbox-close"
            onClick={() => setLightbox(null)}
            aria-label="Закрыть"
          >
            <X size={22} />
          </button>
          {reviews.length > 1 && (
            <button
              type="button"
              className="review-lightbox-arrow prev"
              onClick={(e) => {
                e.stopPropagation();
                lbNav(-1);
              }}
              aria-label="Предыдущий отзыв"
            >
              <ChevronLeft size={26} />
            </button>
          )}
          <figure className="review-lightbox-figure" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={active.image} alt={active.caption || "Отзыв покупателя"} />
            {active.caption && <figcaption>{active.caption}</figcaption>}
          </figure>
          {reviews.length > 1 && (
            <button
              type="button"
              className="review-lightbox-arrow next"
              onClick={(e) => {
                e.stopPropagation();
                lbNav(1);
              }}
              aria-label="Следующий отзыв"
            >
              <ChevronRight size={26} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
