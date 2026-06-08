import { redirect } from "next/navigation";

// Дашборда нет — вход в админку сразу открывает первый раздел.
export default function AdminIndex() {
  redirect("/admin/homes");
}
