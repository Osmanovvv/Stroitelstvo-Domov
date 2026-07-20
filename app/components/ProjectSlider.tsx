"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

// Слайдер изображений в карточке: в самой карточке фото аккуратно заполняет
// единый кадр, а по КЛИКУ открывается ЦЕЛИКОМ во всплывающем окне (лайтбокс) —
// так фото любого формата можно рассмотреть полностью, без обрезки. Стрелки и
// точки листают галерею и в карточке, и в лайтбоксе. Лайтбокс рендерится
// порталом в body, чтобы его не обрезал overflow/transform карточки.
type ProjectSliderProps = {
  images: string[];
  alt: string;
  sizes?: string;
};

export default function ProjectSlider({ images, alt, sizes }: ProjectSliderProps) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const count = images.length;
  const current = Math.min(index, Math.max(count - 1, 0));
  const go = (direction: number) => setIndex((i) => (i + direction + count) % count);

  // Автоподгон кадра под конкретное фото. Вертикальные снимки и планировки в
  // широком кадре карточки обрезало бы до неузнаваемости (у планировки видно
  // только полоску середины) — такие показываем ЦЕЛИКОМ. Горизонтальные фото
  // заполняют кадр как обычно, сетка карточек остаётся ровной. Порог 0.8:
  // срабатывает, только когда обрезка съела бы больше ~20% высоты.
  const frameRef = useRef<HTMLButtonElement>(null);
  const [fitContain, setFitContain] = useState(false);

  const handleFrameLoad = (e: { currentTarget: HTMLImageElement }) => {
    const img = e.currentTarget;
    const frame = frameRef.current;
    if (!frame || !img.naturalWidth || !img.naturalHeight) return;
    const rect = frame.getBoundingClientRect();
    if (!rect.height) return;
    setFitContain(img.naturalWidth / img.naturalHeight < (rect.width / rect.height) * 0.8);
  };

  // Пока лайтбокс открыт: Esc закрывает, стрелки листают, фон не прокручивается.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      else if (e.key === "ArrowLeft" && count > 1) setIndex((i) => (i - 1 + count) % count);
      else if (e.key === "ArrowRight" && count > 1) setIndex((i) => (i + 1 + count) % count);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, count]);

  if (count === 0) return null;

  return (
    <>
      <button
        type="button"
        ref={frameRef}
        className={`ps-open${fitContain ? " is-contain" : ""}`}
        aria-label="Открыть фото на весь экран"
        onClick={() => setOpen(true)}
      >
        <Image
          key={images[current]}
          src={images[current]}
          alt={alt}
          fill
          sizes={sizes}
          onLoad={handleFrameLoad}
        />
      </button>

      {count > 1 && (
        <>
          <button
            type="button"
            className="project-slider-arrow prev"
            aria-label="Предыдущее изображение"
            onClick={() => go(-1)}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            className="project-slider-arrow next"
            aria-label="Следующее изображение"
            onClick={() => go(1)}
          >
            <ChevronRight size={20} />
          </button>
          <div className="project-slider-dots">
            {images.map((src, i) => (
              <button
                key={src + i}
                type="button"
                className={`project-dot${i === current ? " is-active" : ""}`}
                aria-label={`Изображение ${i + 1} из ${count}`}
                aria-current={i === current ? "true" : undefined}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        </>
      )}

      {open &&
        createPortal(
          <div
            className="ps-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={alt}
            onClick={() => setOpen(false)}
          >
            <button type="button" className="ps-lb-close" aria-label="Закрыть" onClick={() => setOpen(false)}>
              <X size={22} />
            </button>

            {/* eslint-disable-next-line @next/next/no-img-element -- лайтбокс: фото целиком в натуральных пропорциях */}
            <img className="ps-lb-img" src={images[current]} alt={alt} onClick={(e) => e.stopPropagation()} />

            {count > 1 && (
              <>
                <button
                  type="button"
                  className="ps-lb-arrow prev"
                  aria-label="Предыдущее"
                  onClick={(e) => {
                    e.stopPropagation();
                    go(-1);
                  }}
                >
                  <ChevronLeft size={30} />
                </button>
                <button
                  type="button"
                  className="ps-lb-arrow next"
                  aria-label="Следующее"
                  onClick={(e) => {
                    e.stopPropagation();
                    go(1);
                  }}
                >
                  <ChevronRight size={30} />
                </button>
                <div className="ps-lb-counter">
                  {current + 1} / {count}
                </div>
              </>
            )}
          </div>,
          document.body,
        )}
    </>
  );
}
