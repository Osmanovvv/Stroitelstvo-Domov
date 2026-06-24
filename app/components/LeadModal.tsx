"use client";

import { type ChangeEvent, type FormEvent, useEffect, useRef, useState } from "react";
import { CheckCircle2, Paperclip, X } from "lucide-react";
import ConsentField from "./ConsentField";

// Всплывающая форма заявки. Открывается из любой кнопки на странице через
// глобальное событие "open-lead-modal" (см. LeadModalTrigger) — посетитель
// оставляет имя/телефон, не уходя со своего места (фон не прокручивается).
// Для кнопки «Отправить проект на расчёт» (withFile) показываем поле прикрепления
// файла (проект/планировка).
// ВАЖНО: реальная отправка (модель Lead + Telegram + загрузка файла) — отдельная
// задача; сейчас сабмит показывает заглушку «спасибо».
const DEFAULT_TITLE = "Узнать стоимость строительства";
const MAX_FILE_BYTES = 20 * 1024 * 1024; // 20 МБ
const FILE_ACCEPT =
  ".pdf,.jpg,.jpeg,.png,.webp,.heic,.doc,.docx,.xls,.xlsx,.dwg,.zip,.rar,image/*,application/pdf";

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} КБ`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
}

export default function LeadModal() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [withFile, setWithFile] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onOpen(event: Event) {
      const detail = (event as CustomEvent<{ title?: string; withFile?: boolean }>).detail;
      setTitle(detail?.title || DEFAULT_TITLE);
      setWithFile(Boolean(detail?.withFile));
      setFile(null);
      setFileError(null);
      setSent(false);
      setOpen(true);
    }
    window.addEventListener("open-lead-modal", onOpen as EventListener);
    return () => window.removeEventListener("open-lead-modal", onOpen as EventListener);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    nameRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    const picked = event.target.files?.[0] ?? null;
    if (!picked) {
      setFile(null);
      return;
    }
    if (picked.size > MAX_FILE_BYTES) {
      setFileError("Файл больше 20 МБ — прикрепите файл поменьше или пришлите ссылку.");
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
      return;
    }
    setFileError(null);
    setFile(picked);
  }

  function clearFile() {
    setFile(null);
    setFileError(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <div className="modal-overlay" role="presentation" onClick={() => setOpen(false)}>
      <div
        className="modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <button className="modal-close" type="button" aria-label="Закрыть" onClick={() => setOpen(false)}>
          <X size={20} />
        </button>

        {sent ? (
          <div className="modal-success" aria-live="polite">
            <span className="modal-success-icon">
              <CheckCircle2 />
            </span>
            <strong>Спасибо! Заявка принята</strong>
            <p>Перезвоним в рабочее время и подготовим расчёт.</p>
            <button className="button primary" type="button" onClick={() => setOpen(false)}>
              Хорошо
            </button>
          </div>
        ) : (
          <form className="modal-form" onSubmit={handleSubmit}>
            <h3>{title}</h3>
            <p>
              {withFile
                ? "Прикрепите проект или планировку и оставьте контакты — рассчитаем смету и перезвоним. Это бесплатно и ни к чему не обязывает."
                : "Оставьте контакты — посчитаем смету и перезвоним. Это бесплатно и ни к чему не обязывает."}
            </p>
            <label>
              Имя
              <input
                ref={nameRef}
                type="text"
                name="name"
                autoComplete="name"
                placeholder="Как к вам обращаться"
              />
            </label>
            <label>
              Телефон
              <input
                required
                type="tel"
                name="phone"
                autoComplete="tel"
                inputMode="tel"
                placeholder="+7 ___ ___-__-__"
              />
            </label>

            {withFile && (
              <div className="modal-file">
                <span className="modal-file-label">Проект или планировка (необязательно)</span>
                {file ? (
                  <div className="modal-file-chosen">
                    <Paperclip size={16} />
                    <span className="modal-file-name">{file.name}</span>
                    <span className="modal-file-size">{formatSize(file.size)}</span>
                    <button
                      type="button"
                      className="modal-file-remove"
                      aria-label="Убрать файл"
                      onClick={clearFile}
                    >
                      <X size={15} />
                    </button>
                  </div>
                ) : (
                  <label className="modal-file-drop">
                    <Paperclip size={16} />
                    Прикрепить файл
                    <input
                      ref={fileRef}
                      type="file"
                      name="projectFile"
                      className="modal-file-input"
                      accept={FILE_ACCEPT}
                      onChange={onFileChange}
                    />
                  </label>
                )}
                {fileError ? (
                  <span className="modal-file-error" role="alert">
                    {fileError}
                  </span>
                ) : (
                  <span className="modal-file-hint">PDF, JPG, PNG, DOC, DWG, ZIP — до 20 МБ</span>
                )}
              </div>
            )}

            <ConsentField />
            <button className="button primary" type="submit">
              Отправить заявку
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
