import HouseQuiz from "../HouseQuiz";
import { calcDefaults } from "../../content/landing";
import { quizTargetDefaults } from "../../content/quiz";
import { getSettings } from "../../lib/queries";
import { renderAccent } from "../../lib/accent";

export default async function CalculatorSection() {
  const s = await getSettings();
  const d = calcDefaults;
  const bg = s.calc_bg_image;

  // Те же фото Шага 1, что и в hero-квизе (настройки с фолбэком на дефолты).
  const quizTargetImages = {
    ready: s.quiz_target_ready_image || quizTargetDefaults.ready,
    build: s.quiz_target_build_image || quizTargetDefaults.build,
    plot: s.quiz_target_plot_image || quizTargetDefaults.plot,
  };

  // Если загружена фоновая картинка — кладём её под тёмным градиентом-оверлеем,
  // чтобы светлый текст и квиз оставались читаемыми. Пусто = фирменный градиент (CSS).
  const style = bg
    ? {
        backgroundImage: `linear-gradient(180deg, rgba(10,14,32,0.82), rgba(16,26,48,0.72)), url("${bg}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }
    : undefined;

  return (
    <section className="section calculator-section" id="calc" style={style}>
      <div className="container calc-layout">
        <div>
          <span className="eyebrow">{s.calc_eyebrow || d.eyebrow}</span>
          <h2>{renderAccent(s.calc_title || d.title)}</h2>
          <p>{s.calc_subtitle || d.subtitle}</p>
        </div>
        <HouseQuiz targetImages={quizTargetImages} />
      </div>
    </section>
  );
}
