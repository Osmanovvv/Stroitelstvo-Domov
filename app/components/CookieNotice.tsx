"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const STORAGE_KEY = "cookie-notice-accepted";

// Уведомление об использовании cookie: требование практики РКН при сборе
// технических данных (cookie, веб-аналитика). Появляется только после маунта,
// чтобы SSR-разметка не расходилась с клиентской.
// ⚠️ 2026-08-07: уведомление стало ИНФОРМАЦИОННЫМ — веб-аналитика больше не ждёт
// нажатия кнопки (см. YandexMetrika.tsx). Поэтому и текст здесь, и п. 7 Политики
// переписаны на модель «продолжая пользоваться Сайтом — соглашаетесь»: обещать
// «включим аналитику только после клика» и включать её сразу было бы неправдой.
export default function CookieNotice() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      setIsVisible(localStorage.getItem(STORAGE_KEY) !== "1");
    } catch {
      setIsVisible(true);
    }
  }, []);

  if (!isVisible || pathname.startsWith("/admin")) {
    return null;
  }

  function accept() {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Хранилище недоступно (приватный режим) — скрываем хотя бы до перезагрузки.
    }
    setIsVisible(false);
  }

  return (
    <div className="cookie-notice" role="region" aria-label="Уведомление об использовании cookie">
      <p>
        Сайт использует файлы cookie и сервисы веб-аналитики. Продолжая пользоваться сайтом, вы
        соглашаетесь на обработку файлов cookie и данных веб-аналитики в соответствии с{" "}
        <Link href="/privacy">Политикой обработки персональных данных</Link>. Отказаться можно,
        отключив cookie в настройках браузера.
      </p>
      <button className="cookie-notice-accept" type="button" onClick={accept}>
        Принимаю
      </button>
    </div>
  );
}
