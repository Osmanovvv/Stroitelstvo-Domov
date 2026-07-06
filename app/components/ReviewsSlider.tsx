"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

// Отзывы-скрины: компактная горизонтальная лента (листается стрелками/свайпом),
// клик по карточке → лайтбокс (скрин крупно, листание стрелками/свайпом/клавишами,
// закрытие ×/Esc/тап по фону).
type ReviewCard = {
  id: string;
  image: string;
  caption: string | null;
};

export default function ReviewsSlider({ reviews }: { reviews: ReviewCard[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const touchX = useRef<number | null>(null);

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

  function scrollByPage(dir: number) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(el.clientWidth * 0.8, 260), behavior: "smooth" });
  }

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

  return (
    <div className="reviews-slider">
      <div className="reviews-track" ref={trackRef}>
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

      {reviews.length > 1 && (
        <>
          <button
            type="button"
            className="reviews-arrow prev"
            onClick={() => scrollByPage(-1)}
            disabled={atStart}
            aria-label="Предыдущие отзывы"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            className="reviews-arrow next"
            onClick={() => scrollByPage(1)}
            disabled={atEnd}
            aria-label="Следующие отзывы"
          >
            <ChevronRight size={22} />
          </button>
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
