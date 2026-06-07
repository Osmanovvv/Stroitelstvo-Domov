import HouseQuiz from "../HouseQuiz";

export default function CalculatorSection() {
  return (
    <section className="section calculator-section" id="calc">
      <div className="container calc-layout">
        <div>
          <span className="eyebrow">Подбор и расчет</span>
          <h2>
            Подберите <span className="text-accent">лучший дом</span> под ваши критерии
          </h2>
          <p>
            Ответьте на несколько вопросов, и мы подготовим ориентир по стоимости,
            ипотеке, комплектации и подходящим вариантам.
          </p>
        </div>
        <HouseQuiz />
      </div>
    </section>
  );
}
