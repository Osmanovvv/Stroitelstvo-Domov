"use client";

import { useEffect, useState } from "react";

function toMinutes(value: string, fallback: number) {
  const [h, m] = value.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return fallback;
  return h * 60 + m;
}

function getMoscowMinutes() {
  const parts = new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Europe/Moscow",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());

  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? 0);

  return hour * 60 + minute;
}

type WorkStatusProps = {
  showHours?: boolean;
  workStart?: string;
  workEnd?: string;
};

export default function WorkStatus({
  showHours = false,
  workStart = "08:00",
  workEnd = "19:00",
}: WorkStatusProps) {
  const startMinutes = toMinutes(workStart, 8 * 60);
  const endMinutes = toMinutes(workEnd, 19 * 60);

  // Начальное значение детерминировано (null) и одинаково на сервере и клиенте —
  // это исключает hydration mismatch. Реальный статус (зависит от времени)
  // вычисляется только на клиенте в useEffect.
  const [isWorking, setIsWorking] = useState<boolean | null>(null);

  useEffect(() => {
    const updateStatus = () => {
      const minutes = getMoscowMinutes();
      setIsWorking(minutes >= startMinutes && minutes < endMinutes);
    };
    const intervalId = window.setInterval(updateStatus, 60_000);
    updateStatus();
    return () => window.clearInterval(intervalId);
  }, [startMinutes, endMinutes]);

  const stateClass = isWorking === null ? "is-pending" : isWorking ? "is-open" : "is-closed";
  const label =
    isWorking === null ? "Часы работы" : isWorking ? "Сейчас работаем" : "Сейчас не работаем";

  return (
    <span className={`work-status ${stateClass}`} aria-live="polite">
      <span className="work-status-dot" aria-hidden="true" />
      <span className="work-status-copy">
        <strong>{label}</strong>
        {showHours && <small>{workStart}-{workEnd} МСК</small>}
      </span>
    </span>
  );
}
