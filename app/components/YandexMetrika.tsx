"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { reachGoal } from "../lib/metrika";

// Событие, которым CookieNotice сообщает о согласии, — чтобы счётчик включился
// сразу после нажатия «Принимаю», без перезагрузки страницы.
export const CONSENT_EVENT = "cookie-consent-accepted";
const STORAGE_KEY = "cookie-notice-accepted";

// Яндекс.Метрика. Подключается ТОЛЬКО после согласия на cookie: политика сайта
// обещает загружать веб-аналитику после согласия, и это же требование практики
// РКН. В админке счётчик не нужен — там нет посетителей, только сотрудники.
export default function YandexMetrika({ counterId }: { counterId?: string | null }) {
  const pathname = usePathname();
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const read = () => {
      try {
        setAccepted(localStorage.getItem(STORAGE_KEY) === "1");
      } catch {
        setAccepted(false);
      }
    };
    read();
    window.addEventListener(CONSENT_EVENT, read);
    return () => window.removeEventListener(CONSENT_EVENT, read);
  }, []);

  // Цели «звонок» и «мессенджер» ловим одним делегированным слушателем: такие
  // ссылки разбросаны по шапке, контактам, футеру и мобильному меню, и вешать
  // обработчик на каждую — источник пропущенных кликов при будущих правках.
  useEffect(() => {
    if (!accepted) return;
    function onClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      const link = target?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!link) return;
      const href = link.getAttribute("href") ?? "";
      if (href.startsWith("tel:")) reachGoal("phone");
      else if (/(wa\.me|whatsapp\.com|t\.me|telegram\.me|max\.ru)/i.test(href)) reachGoal("messenger");
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [accepted]);

  const rawId = counterId?.trim();
  // Номер счётчика уходит в вызов Метрики — пускаем только цифры.
  const id = rawId && /^\d+$/.test(rawId) ? Number(rawId) : null;
  const enabled = Boolean(id) && accepted && !pathname.startsWith("/admin");

  // Подключаем счётчик вручную, а не через next/script: посетитель нажимает
  // «Принимаю» уже после гидратации, и скрипт со стратегией afterInteractive
  // в этот момент уже не внедряется. Обычный <script> работает в обоих случаях —
  // и когда согласие уже было, и когда его дали только что.
  useEffect(() => {
    if (!enabled || !id) return;
    if (window.__ymCounterId) return; // уже подключён — второй раз не нужно

    type YmQueue = typeof window.ym & { a?: unknown[]; l?: number };
    const w = window as Window & { ym?: YmQueue };
    if (typeof w.ym !== "function") {
      const queued: YmQueue = function (...args: unknown[]) {
        (queued.a = queued.a || []).push(args);
      } as unknown as YmQueue;
      queued.l = Date.now();
      w.ym = queued;
    }

    if (!document.querySelector('script[src="https://mc.yandex.ru/metrika/tag.js"]')) {
      const script = document.createElement("script");
      script.src = "https://mc.yandex.ru/metrika/tag.js";
      script.async = true;
      document.head.appendChild(script);
    }

    window.__ymCounterId = id;
    w.ym?.(id, "init", {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: true,
    });
  }, [enabled, id]);

  return null;
}
