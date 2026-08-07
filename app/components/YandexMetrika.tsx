"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { reachGoal } from "../lib/metrika";

// Яндекс.Метрика подключается СРАЗУ, не дожидаясь нажатия «Принимаю»
// (изменено 2026-08-07 под запуск рекламы). Раньше счётчик ждал согласия, и
// посетители, проигнорировавшие баннер, не попадали в статистику вообще — вместе
// с их заявками. Для Яндекс.Директа это критично: его автостратегии учатся на
// конверсиях, и терять часть данных значит оптимизировать вслепую.
// Уведомление о cookie осталось информационным, формулировки в нём и в п. 7
// Политики приведены к модели «продолжая пользоваться Сайтом — соглашаетесь».
// В админке счётчик не нужен — там нет посетителей, только сотрудники.
export default function YandexMetrika({ counterId }: { counterId?: string | null }) {
  const pathname = usePathname();

  // Цели «звонок» и «мессенджер» ловим одним делегированным слушателем: такие
  // ссылки разбросаны по шапке, контактам, футеру и мобильному меню, и вешать
  // обработчик на каждую — источник пропущенных кликов при будущих правках.
  useEffect(() => {
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
  }, []);

  const rawId = counterId?.trim();
  // Номер счётчика уходит в вызов Метрики — пускаем только цифры.
  const id = rawId && /^\d+$/.test(rawId) ? Number(rawId) : null;
  const enabled = Boolean(id) && !pathname.startsWith("/admin");

  // Подключаем счётчик вручную, а не через next/script: компонент монтируется
  // уже после гидратации, а скрипт со стратегией afterInteractive в этот момент
  // не внедряется. Обычный <script async> работает надёжно и рендер не блокирует.
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
