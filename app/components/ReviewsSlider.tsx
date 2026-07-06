"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";

// Отзывы-скрины (правка заказчика): по 3 карточки в ряд (планшет 2, телефон 1),
// листание страницами стрелками + точки, свайп. Клик по карточке → лайтбокс
// (скрин крупно целиком, листание стрелками/свайпом/клавишами, закрытие ×/Esc/фон).
type ReviewCard = {
  id: string;
  image: string;
  caption: string | null;
};

function perPageForWidth(w: number) {
  if (w >= 1024) return 3;
  if (w >= 640) return 2;
  return 1;
}

export default function ReviewsSlider({ reviews }: { reviews: ReviewCard[] }) {
  const [perPage, setPerPage] = useState(3);
  const [page, setPage] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    const onResize = () => setPerPage(perPageForWidth(window.innerWidth));
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
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

  // Клавиатура в лайтбоксе.
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      else if (e.key === "ArrowLeft") lbNav(-1);
      else if (e.key === "ArrowRight") lbNav(1);
    };
    window.addEventListener("keydown", onKey);
    // Блокируем прокрутку фона, пока открыт лайтбокс.
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
    <div className="reviews-carousel">
      <div
        className="reviews-viewport"
        onTouchStart={onTouchStart}
        onTouchEnd={(e) => onTouchEnd(e, goPage)}
      >
        <div className="reviews-track" style={{ transform: `translateX(-${page * 100}%)` }}>
          {reviews.map((r, i) => (
            <div className="review-card-cell" key={r.id}>
              <button
                type="button"
                className="review-card"
                onClick={() => setLightbox(i)}
                aria-label={`Открыть отзыв крупно${r.caption ? `: ${r.caption}` : ""}`}
              >
                <span
                  className="review-card-media"
                  style={{ backgroundImage: `url("${r.image}")` }}
                />
                <span className="review-card-zoom" aria-hidden="true">
                  <ZoomIn size={18} />
                </span>
              </button>
            </div>
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
