"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { resendLead, setLeadProcessed, deleteLead } from "@/app/lib/leadActions";

type LeadItem = {
  id: string;
  name: string | null;
  phone: string;
  source: string | null;
  message: string | null;
  fileUrl: string | null;
  fileName: string | null;
  notified: boolean;
  notifyError: string | null;
  processed: boolean;
  createdAt: string;
};

const badge = (bg: string, color: string): React.CSSProperties => ({
  display: "inline-flex", alignItems: "center", gap: 4,
  padding: "2px 8px", borderRadius: 999, fontSize: 12, fontWeight: 600,
  background: bg, color,
});

export default function LeadsTable({ items }: { items: LeadItem[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <p style={{ color: "#8a93a6" }}>
        Заявок пока нет. Как только с сайта придёт первая — она появится здесь и в Telegram.
      </p>
    );
  }

  async function onResend(id: string) {
    setBusyId(id);
    setNote(null);
    const res = await resendLead(id);
    setBusyId(null);
    setNote("error" in res ? `Не отправилось: ${res.error}` : "Отправлено в Telegram ✓");
    router.refresh();
  }

  async function onToggle(id: string, processed: boolean) {
    setBusyId(id);
    await setLeadProcessed(id, processed);
    setBusyId(null);
    router.refresh();
  }

  async function onDelete(id: string) {
    if (!window.confirm("Удалить заявку? Действие необратимо.")) return;
    setBusyId(id);
    await deleteLead(id);
    setBusyId(null);
    router.refresh();
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {note && (
        <p role="status" style={{ margin: 0, fontSize: 13, color: "#1f7a4d" }}>
          {note}
        </p>
      )}
      {items.map((lead) => {
        const busy = busyId === lead.id;
        return (
          <article
            key={lead.id}
            style={{
              border: "1px solid #e6e8ef", borderRadius: 12, padding: 16,
              background: lead.processed ? "#fafbfc" : "#fff",
              display: "grid", gap: 8, opacity: busy ? 0.6 : 1,
            }}
          >
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                <strong style={{ fontSize: 15 }}>{lead.name || "Без имени"}</strong>
                <a href={`tel:${lead.phone}`} style={{ fontWeight: 600, color: "#2f56c8" }}>
                  {lead.phone}
                </a>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {lead.processed ? (
                  <span style={badge("#eef1f6", "#5b6472")}>обработана</span>
                ) : (
                  <span style={badge("#e7edff", "#2f56c8")}>в работе</span>
                )}
                {lead.notified ? (
                  <span style={badge("#e4f7ec", "#1f7a4d")}>✓ в Telegram</span>
                ) : (
                  <span style={badge("#fdeaea", "#c0392b")}>не доставлено</span>
                )}
              </div>
            </div>

            <div style={{ fontSize: 13, color: "#5b6472", display: "grid", gap: 3 }}>
              {lead.source && <span>Источник: {lead.source}</span>}
              {lead.message && <span>{lead.message}</span>}
              {lead.fileUrl && (
                <a href={lead.fileUrl} target="_blank" rel="noreferrer" style={{ color: "#2f56c8" }}>
                  📎 {lead.fileName || "файл"}
                </a>
              )}
              <span style={{ color: "#9aa3b2" }}>{lead.createdAt} МСК</span>
              {lead.notifyError && (
                <span style={{ color: "#c0392b" }}>Ошибка доставки: {lead.notifyError}</span>
              )}
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
              {!lead.notified && (
                <button className="admin-btn" type="button" disabled={busy} onClick={() => onResend(lead.id)}>
                  Переслать в Telegram
                </button>
              )}
              <button className="admin-btn" type="button" disabled={busy} onClick={() => onToggle(lead.id, !lead.processed)}>
                {lead.processed ? "Вернуть в работу" : "Отметить обработанной"}
              </button>
              <button className="admin-btn" type="button" disabled={busy} onClick={() => onDelete(lead.id)} style={{ color: "#c0392b" }}>
                Удалить
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
