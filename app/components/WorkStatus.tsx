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

  const isWorkingNow = () => {
    const minutes = getMoscowMinutes();
    return minutes >= startMinutes && minutes < endMinutes;
  };

  const [isWorking, setIsWorking] = useState(isWorkingNow);

  useEffect(() => {
    const updateStatus = () => setIsWorking(isWorkingNow());
    const intervalId = window.setInterval(updateStatus, 60_000);
    updateStatus();
    return () => window.clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startMinutes, endMinutes]);

  return (
    <span className={`work-status ${isWorking ? "is-open" : "is-closed"}`} aria-live="polite">
      <span className="work-status-dot" aria-hidden="true" />
      <span className="work-status-copy">
        <strong>{isWorking ? "Сейчас работаем" : "Сейчас не работаем"}</strong>
        {showHours && <small>{workStart}-{workEnd} МСК</small>}
      </span>
    </span>
  );
}
