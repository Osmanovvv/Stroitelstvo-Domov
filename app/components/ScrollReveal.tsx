"use client";

import { useEffect } from "react";

// Первый экран (.hero и его текст) намеренно НЕ участвует в появлении: он и так
// всегда в зоне видимости, то есть показывался мгновенно, без анимации. Зато
// именно его абзац Chrome считает главным элементом страницы (LCP), и любая
// возня с его стилями после гидратации откладывала отрисовку. Убрали — вид
// не изменился, скорость выросла.
const SECTION_SELECTOR = [
  ".section-head",
  ".compare-layout > div:first-child",
  ".payment-card > div:first-child",
  ".contacts-layout > div:first-child",
].join(",");
const CHILD_SELECTOR = [
  ".choice-item",
  ".home-card",
  ".media-card",
  ".project-card",
  ".compare-card",
  ".quiz-card",
  ".step",
  ".bank-grid",
  ".payment-points",
  ".contact-status-card",
  ".contact-actions",
  ".lead-form",
].join(",");
const VISIBLE_OFFSET = 0.9;
const SECTION_DELAY_STEP = 55;
const CHILD_DELAY_STEP = 75;

export default function ScrollReveal() {
  useEffect(() => {
    // Progressive enhancement guard: without IntersectionObserver we never add
    // the reveal classes, so all content stays visible by default.
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      return;
    }

    const sections = Array.from(document.querySelectorAll<HTMLElement>(SECTION_SELECTOR));
    const children = Array.from(new Set(document.querySelectorAll<HTMLElement>(CHILD_SELECTOR)));
    const childGroups = new Map<HTMLElement, HTMLElement[]>();

    children.forEach((target) => {
      const groupTarget = target.parentElement ?? target;
      const group = childGroups.get(groupTarget) ?? [];

      group.push(target);
      childGroups.set(groupTarget, group);
    });

    const sectionSet = new Set(sections);
    const targets = Array.from(new Set([...sections, ...childGroups.keys()]));

    if (!targets.length) {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    // ШАГ 1 — только чтение. Раньше измерение шло вперемешку с навешиванием
    // классов, и каждый getBoundingClientRect заставлял браузер заново считать
    // стили и раскладку всей страницы (layout thrashing, ~1 с на телефоне).
    // Сначала снимаем все размеры одним проходом, потом одним проходом пишем.
    const viewportEdge = window.innerHeight * VISIBLE_OFFSET;
    const initiallyVisible = new Set<HTMLElement>();

    targets.forEach((target) => {
      if (target.getBoundingClientRect().top < viewportEdge) {
        initiallyVisible.add(target);
      }
    });

    // ШАГ 2 — только запись.
    sections.forEach((target, index) => {
      target.classList.add("reveal-target");
      target.style.setProperty("--reveal-delay", `${Math.min(index % 3, 2) * SECTION_DELAY_STEP}ms`);
    });

    childGroups.forEach((group) => {
      group.forEach((target, index) => {
        target.classList.add("reveal-child");
        target.style.setProperty("--reveal-delay", `${index * CHILD_DELAY_STEP}ms`);
      });
    });

    let observer: IntersectionObserver | null = null;

    const revealSection = (target: Element) => {
      target.classList.add("is-visible");
    };

    const revealChildGroup = (target: Element) => {
      const group = childGroups.get(target as HTMLElement);

      if (!group) {
        return;
      }

      group.forEach((child) => child.classList.add("is-visible"));
    };

    const reveal = (target: Element) => {
      if (sectionSet.has(target as HTMLElement)) {
        revealSection(target);
      }

      revealChildGroup(target);
      observer?.unobserve(target);
    };

    const cleanup = () => {
      observer?.disconnect();
      targets.forEach((target) => {
        target.classList.remove("reveal-target", "reveal-child", "is-visible");
        target.style.removeProperty("--reveal-delay");
      });
      children.forEach((target) => {
        target.classList.remove("reveal-child", "is-visible");
        target.style.removeProperty("--reveal-delay");
      });
    };

    if (prefersReducedMotion.matches) {
      targets.forEach(reveal);

      return cleanup;
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          reveal(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.08,
      },
    );

    targets.forEach((target) => {
      if (initiallyVisible.has(target)) {
        reveal(target);
        return;
      }

      observer.observe(target);
    });

    return cleanup;
  }, []);

  return null;
}
