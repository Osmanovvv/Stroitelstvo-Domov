"use client";

import { useEffect, useState } from "react";

const WORK_START_MINUTES = 8 * 60;
const WORK_END_MINUTES = 19 * 60;

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

function isWorkingNow() {
  const minutes = getMoscowMinutes();

  return minutes >= WORK_START_MINUTES && minutes < WORK_END_MINUTES;
}

type WorkStatusProps = {
  showHours?: boolean;
};

export default function WorkStatus({ showHours = false }: WorkStatusProps) {
  const [isWorking, setIsWorking] = useState(isWorkingNow);

  useEffect(() => {
    const updateStatus = () => setIsWorking(isWorkingNow());
    const intervalId = window.setInterval(updateStatus, 60_000);

    updateStatus();

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <span className={`work-status ${isWorking ? "is-open" : "is-closed"}`} aria-live="polite">
      <span className="work-status-dot" aria-hidden="true" />
      <span className="work-status-copy">
        <strong>{isWorking ? "Сейчас работаем" : "Сейчас не работаем"}</strong>
        {showHours && <small>08:00-19:00 МСК</small>}
      </span>
    </span>
  );
}
