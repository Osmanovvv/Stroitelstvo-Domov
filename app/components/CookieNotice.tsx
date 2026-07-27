"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CONSENT_EVENT } from "./YandexMetrika";

const STORAGE_KEY = "cookie-notice-accepted";

// Уведомление об использовании cookie: требование практики РКН при сборе
// технических данных (cookie, веб-аналитика). Появляется только после маунта,
// чтобы SSR-разметка не расходилась с клиентской.
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
    // Сообщаем Метрике, что согласие получено, — счётчик включится сразу,
    // не дожидаясь следующей загрузки страницы.
    try {
      window.dispatchEvent(new Event(CONSENT_EVENT));
    } catch {
      // Событие не критично: при следующем заходе счётчик прочитает localStorage.
    }
    setIsVisible(false);
  }

  return (
    <div className="cookie-notice" role="region" aria-label="Уведомление об использовании cookie">
      <p>
        Сайт использует файлы cookie и сервисы веб-аналитики. Нажимая «Принимаю», вы соглашаетесь
        на обработку файлов cookie и данных веб-аналитики в соответствии с{" "}
        <Link href="/privacy">Политикой обработки персональных данных</Link>.
      </p>
      <button className="cookie-notice-accept" type="button" onClick={accept}>
        Принимаю
      </button>
    </div>
  );
}
