"use client";

import { useEffect } from "react";

const SECTION_SELECTOR = [
  ".hero",
  ".section-head",
  ".calc-layout > div:first-child",
  ".compare-layout > div:first-child",
  ".payment-card > div:first-child",
  ".contacts-layout > div:first-child",
].join(",");
const CHILD_SELECTOR = [
  ".hero-copy > *",
  ".choice-item",
  ".home-card",
  ".media-card",
  ".project-card",
  ".compare-card",
  ".quiz-card",
  ".price-table-wrap",
  ".trust-item",
  ".step",
  ".bank-grid",
  ".payment-points",
  ".faq-item",
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

    const root = document.documentElement;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

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

    if (prefersReducedMotion.matches) {
      targets.forEach(reveal);
      root.classList.add("scroll-reveal-ready");

      return () => {
        root.classList.remove("scroll-reveal-ready");
        targets.forEach((target) => {
          target.classList.remove("reveal-target", "reveal-child", "is-visible");
          target.style.removeProperty("--reveal-delay");
        });
      };
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
      const isAlreadyVisible = target.getBoundingClientRect().top < window.innerHeight * VISIBLE_OFFSET;

      if (isAlreadyVisible) {
        reveal(target);
        return;
      }

      observer.observe(target);
    });

    root.classList.add("scroll-reveal-ready");

    return () => {
      observer?.disconnect();
      root.classList.remove("scroll-reveal-ready");
      targets.forEach((target) => {
        target.classList.remove("reveal-target", "reveal-child", "is-visible");
        target.style.removeProperty("--reveal-delay");
      });
    };
  }, []);

  return null;
}
