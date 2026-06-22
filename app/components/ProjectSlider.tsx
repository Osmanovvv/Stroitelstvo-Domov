"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Слайдер изображений проекта прямо в карточке (рендеры + планировка):
// стрелки и точки листают список. Рендерим только текущий слайд — лёгкая
// загрузка; стили cover/hover наследуются от .project-media img.
type ProjectSliderProps = {
  images: string[];
  alt: string;
  sizes?: string;
};

export default function ProjectSlider({ images, alt, sizes }: ProjectSliderProps) {
  const [index, setIndex] = useState(0);

  if (images.length === 0) return null;

  const count = images.length;
  const current = Math.min(index, count - 1);
  const go = (direction: number) => setIndex((i) => (i + direction + count) % count);

  return (
    <>
      <Image src={images[current]} alt={alt} fill sizes={sizes} />

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
    </>
  );
}
