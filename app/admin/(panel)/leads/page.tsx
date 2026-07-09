import { getLeads } from "@/app/lib/queries";
import LeadsTable from "./LeadsTable";

export const dynamic = "force-dynamic";

const fmt = new Intl.DateTimeFormat("ru-RU", {
  timeZone: "Europe/Moscow",
  day: "2-digit", month: "2-digit", year: "2-digit",
  hour: "2-digit", minute: "2-digit",
});

export default async function LeadsAdmin() {
  const leads = await getLeads();
  const items = leads.map((lead) => ({
    id: lead.id,
    name: lead.name,
    phone: lead.phone,
    source: lead.source,
    message: lead.message,
    fileUrl: lead.fileUrl,
    fileName: lead.fileName,
    notified: lead.notified,
    notifyError: lead.notifyError,
    processed: lead.processed,
    createdAt: fmt.format(lead.createdAt),
  }));
  const newCount = items.filter((item) => !item.processed).length;

  return (
    <>
      <div className="admin-topbar">
        <h2>Заявки{newCount ? ` · ${newCount} в работе` : ""}</h2>
      </div>
      <div className="admin-card">
        <LeadsTable items={items} />
      </div>
    </>
  );
}
