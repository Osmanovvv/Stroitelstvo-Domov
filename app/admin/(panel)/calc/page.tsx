import { getSettings } from "@/app/lib/queries";
import { quizTargetDefaults } from "@/app/content/quiz";
import CalcForm from "./CalcForm";

export const dynamic = "force-dynamic";

export default async function CalcAdmin() {
  const s = await getSettings();

  // existing = сохранённое переопределение (пусто, если дефолт); preview = что реально
  // покажется на сайте (переопределение или фолбэк).
  const quizImages = [
    { label: "Готовый дом", field: "quizReady", existing: s.quiz_target_ready_image ?? "", preview: s.quiz_target_ready_image || quizTargetDefaults.ready },
    { label: "Строительство", field: "quizBuild", existing: s.quiz_target_build_image ?? "", preview: s.quiz_target_build_image || quizTargetDefaults.build },
    { label: "Дом + участок", field: "quizPlot", existing: s.quiz_target_plot_image ?? "", preview: s.quiz_target_plot_image || quizTargetDefaults.plot },
  ];

  return (
    <>
      <div className="admin-topbar">
        <h2>Фото квиза</h2>
      </div>
      <div className="admin-card">
        <CalcForm quizImages={quizImages} />
      </div>
    </>
  );
}
