import Image from "next/image";
import HouseQuiz from "./HouseQuiz";
import {
  ArrowRight,
  BadgeCheck,
  Bath,
  BedDouble,
  Camera,
  ClipboardCheck,
  Clock3,
  Hammer,
  House,
  KeyRound,
  MapPin,
  MessageCircle,
  Phone,
  Ruler,
  ShieldCheck,
  Star,
  Trees,
  WalletCards,
} from "lucide-react";

const readyHomes = [
  {
    title: "Дом в Немецкой Деревне",
    price: "от 12,8 млн ₽",
    area: "126 м²",
    land: "5,6 сот.",
    rooms: "4 комнаты",
    baths: "2 санузла",
    location: "Краснодар, западное направление",
    status: "готов к просмотру",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Кирпичный дом у парковой зоны",
    price: "от 10,9 млн ₽",
    area: "108 м²",
    land: "4,8 сот.",
    rooms: "3 комнаты",
    baths: "2 санузла",
    location: "Краснодар +25 км",
    status: "чистовая отделка",
    image:
      "https://images.unsplash.com/photo-1605146769289-440113cc3d00?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Одноэтажный дом для семьи",
    price: "от 9,7 млн ₽",
    area: "94 м²",
    land: "5 сот.",
    rooms: "3 комнаты",
    baths: "1 санузел",
    location: "Краснодар +40 км",
    status: "можно заехать",
    image:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Дом с террасой у зеленой зоны",
    price: "от 11,6 млн ₽",
    area: "120 м²",
    land: "5,2 сот.",
    rooms: "4 комнаты",
    baths: "2 санузла",
    location: "Краснодар +30 км",
    status: "готов к сделке",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Семейный дом с просторной кухней",
    price: "от 13,4 млн ₽",
    area: "138 м²",
    land: "6 сот.",
    rooms: "5 комнат",
    baths: "2 санузла",
    location: "Краснодар, северное направление",
    status: "ипотека возможна",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85",
  },
];

const projects = [
  {
    name: "Клевер 80",
    area: "80 м²",
    floors: "1 этаж",
    price: "от 5,8 млн ₽",
    time: "4 месяца",
  },
  {
    name: "Южный 104",
    area: "104 м²",
    floors: "1 этаж",
    price: "от 7,1 млн ₽",
    time: "5 месяцев",
  },
  {
    name: "Семейный 126",
    area: "126 м²",
    floors: "2 этажа",
    price: "от 8,9 млн ₽",
    time: "6 месяцев",
  },
  {
    name: "Видный 140",
    area: "140 м²",
    floors: "2 этажа",
    price: "от 9,6 млн ₽",
    time: "6 месяцев",
  },
  {
    name: "Практичный 92",
    area: "92 м²",
    floors: "1 этаж",
    price: "от 6,4 млн ₽",
    time: "4 месяца",
  },
  {
    name: "Комфорт 118",
    area: "118 м²",
    floors: "1 этаж",
    price: "от 8,1 млн ₽",
    time: "5 месяцев",
  },
  {
    name: "Простор 136",
    area: "136 м²",
    floors: "2 этажа",
    price: "от 9,3 млн ₽",
    time: "6 месяцев",
  },
];

const buildingHomes = [
  {
    title: "Дом 118 м²",
    stage: "коробка готова",
    finish: "сдача в августе",
    location: "Краснодар +30 км",
  },
  {
    title: "Дом 132 м²",
    stage: "кровельные работы",
    finish: "сдача в сентябре",
    location: "Краснодар +55 км",
  },
  {
    title: "Дом 96 м²",
    stage: "фундамент и стены",
    finish: "сдача в октябре",
    location: "пригород Краснодара",
  },
  {
    title: "Дом 124 м²",
    stage: "кладка стен",
    finish: "сдача в ноябре",
    location: "Краснодар +35 км",
  },
  {
    title: "Дом 140 м²",
    stage: "инженерные работы",
    finish: "сдача в декабре",
    location: "южное направление",
  },
];

const plots = [
  {
    title: "Участок под дом 104 м²",
    area: "5 сот.",
    utilities: "свет, вода рядом",
    location: "Краснодар +20 км",
  },
  {
    title: "Участок под дом 126 м²",
    area: "6 сот.",
    utilities: "подъезд, электричество",
    location: "Краснодар +45 км",
  },
  {
    title: "Участок под семейный проект",
    area: "7 сот.",
    utilities: "коммуникации по границе",
    location: "южное направление",
  },
];

const trustItems = [
  {
    icon: ClipboardCheck,
    title: "Фиксируем смету",
    text: "До старта согласуем комплектацию, этапы и стоимость, чтобы вы понимали итоговый бюджет.",
  },
  {
    icon: Camera,
    title: "Показываем объекты",
    text: "Можно приехать на готовый дом или стройку и увидеть качество работ до заключения договора.",
  },
  {
    icon: ShieldCheck,
    title: "Работаем по договору",
    text: "Прописываем сроки, этапы оплаты, комплектацию, ответственность и гарантийные обязательства.",
  },
];

const faq = [
  {
    question: "Можно ли посмотреть готовый дом перед покупкой?",
    answer: "Да, для готовых домов и части строящихся объектов можно назначить просмотр.",
  },
  {
    question: "Можно ли построить дом на вашем участке?",
    answer: "Да, можно выбрать участок из доступных вариантов и подобрать проект под конкретную землю.",
  },
  {
    question: "Что входит в стоимость строительства?",
    answer: "Стоимость зависит от комплектации: теплый контур, предчистовая или под ключ.",
  },
  {
    question: "Можно ли изменить типовой проект?",
    answer: "Да, планировку можно адаптировать до начала проектирования и расчета сметы.",
  },
];

const priceRows = [
  {
    work: "Фундамент",
    warm: "монолитная плита",
    pre: "монолитная плита",
    full: "монолитная плита",
  },
  {
    work: "Стены",
    warm: "кирпич + утепление",
    pre: "кирпич + утепление",
    full: "кирпич + утепление",
  },
  {
    work: "Кровля",
    warm: "металлочерепица",
    pre: "металлочерепица",
    full: "металлочерепица",
  },
  {
    work: "Окна и двери",
    warm: "входная дверь, окна",
    pre: "входная дверь, окна",
    full: "входная дверь, окна",
  },
  {
    work: "Инженерия",
    warm: "по проекту",
    pre: "электрика, вода, канализация",
    full: "электрика, вода, отопление",
  },
  {
    work: "Отделка",
    warm: "не входит",
    pre: "стяжка, штукатурка",
    full: "чистовая отделка",
  },
  {
    work: "Готовность",
    warm: "под закрытый контур",
    pre: "под финишную отделку",
    full: "можно заезжать",
  },
];

const banks = ["Сбер", "Альфа-Банк", "ВТБ", "Дом.РФ"];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="На главный экран">
          <span className="brand-mark">СВМ</span>
          <span>
            <strong>Кирпичные дома</strong>
            <small>Краснодар +70 км</small>
          </span>
        </a>
        <div className="header-proof" aria-label="Ключевая информация">
          <span className="header-claim">Готовые дома и строительство под заказ</span>
          <span className="header-rating">
            <Star size={14} />
            4,9 по отзывам
          </span>
        </div>
        <nav className="top-nav" aria-label="Основная навигация">
          <a href="#homes">Готовые дома</a>
          <a href="#projects">Проекты</a>
          <a href="#plots">Участки</a>
          <a href="#prices">Цены</a>
        </nav>
        <div className="header-actions">
          <a className="header-callback" href="#contacts">Перезвоните мне</a>
        </div>
        <details className="mobile-menu">
          <summary aria-label="Открыть меню">
            <span />
            <span />
            <span />
          </summary>
          <nav className="mobile-menu-panel" aria-label="Мобильная навигация">
            <a href="#homes">Готовые дома</a>
            <a href="#building">Строящиеся дома</a>
            <a href="#projects">Проекты</a>
            <a href="#plots">Участки</a>
            <a href="#prices">Цены</a>
            <a href="#contacts">Контакты</a>
            <a className="mobile-menu-phone" href="tel:+79990000000">
              <Phone size={16} />
              Позвонить
            </a>
          </nav>
        </details>
      </header>

      <section className="hero" id="top">
        <Image
          className="hero-image"
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2200&q=85"
          alt="Современный кирпичный дом с участком"
          fill
          priority
          sizes="100vw"
        />
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-copy">
            <span className="eyebrow">Готовые дома и строительство под заказ</span>
            <h1>
              Кирпичные дома <span className="text-accent">в Краснодаре</span> и радиусе 70 км
            </h1>
            <p>
              Подберем готовый дом, объект в строительстве или типовой проект под ваш участок,
              бюджет и срок переезда.
            </p>
            <div className="hero-badges" aria-label="Преимущества">
              <span>
                <BadgeCheck size={17} />
                Договор и смета
              </span>
              <span>
                <Camera size={17} />
                Объекты можно посмотреть
              </span>
              <span>
                <WalletCards size={17} />
                Ипотека Сбер, ВТБ, Альфа
              </span>
            </div>
            <div className="hero-actions">
              <a className="button primary" href="#homes">
                Смотреть дома
                <ArrowRight size={18} />
              </a>
              <a className="button secondary" href="#calc">
                Пройти подбор
              </a>
            </div>
            <span className="hero-note">Расчет, подбор проекта и варианты ипотеки в одном запросе</span>
          </div>
          <div className="hero-panel" aria-label="Ключевые показатели">
            <div>
              <strong>5</strong>
              <span>готовых домов</span>
            </div>
            <div>
              <strong>5</strong>
              <span>объектов строится</span>
            </div>
            <div>
              <strong>7</strong>
              <span>типовых проектов</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section choice-section">
        <div className="container choice-grid">
          <a className="choice-item" href="#homes">
            <span className="choice-icon">
              <House />
            </span>
            <span>Купить готовый дом</span>
          </a>
          <a className="choice-item" href="#building">
            <span className="choice-icon">
              <Hammer />
            </span>
            <span>Посмотреть стройку</span>
          </a>
          <a className="choice-item" href="#projects">
            <span className="choice-icon">
              <Ruler />
            </span>
            <span>Выбрать проект</span>
          </a>
          <a className="choice-item" href="#plots">
            <span className="choice-icon">
              <Trees />
            </span>
            <span>Подобрать участок</span>
          </a>
        </div>
      </section>

      <section className="section" id="homes">
        <div className="container section-head">
          <span className="eyebrow">Готовые дома</span>
          <h2>Объекты, которые можно посмотреть вживую</h2>
          <p>Выберите готовый дом с участком, коммуникациями и понятными условиями покупки.</p>
        </div>
        <div className="container homes-grid">
          {readyHomes.map((home) => (
            <article className="home-card" key={home.title}>
              <div className="home-image-wrap">
                <Image
                  src={home.image}
                  alt={home.title}
                  width={820}
                  height={560}
                  sizes="(max-width: 900px) 100vw, 33vw"
                />
                <span>{home.status}</span>
              </div>
              <div className="home-card-body">
                <div className="home-card-title">
                  <h3>{home.title}</h3>
                  <strong>{home.price}</strong>
                </div>
                <p className="location">
                  <MapPin size={16} />
                  {home.location}
                </p>
                <div className="spec-grid">
                  <span>
                    <Ruler size={16} />
                    {home.area}
                  </span>
                  <span>
                    <Trees size={16} />
                    {home.land}
                  </span>
                  <span>
                    <BedDouble size={16} />
                    {home.rooms}
                  </span>
                  <span>
                    <Bath size={16} />
                    {home.baths}
                  </span>
                </div>
                <a className="text-link" href="#contacts">
                  Записаться на просмотр
                  <ArrowRight size={17} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section split-section" id="building">
        <div className="container split-layout">
          <div>
            <span className="eyebrow">Дома в строительстве</span>
            <h2>Объекты, которые можно забронировать до сдачи</h2>
            <p>
              Дома на разных этапах готовности: можно посмотреть ход строительства,
              уточнить срок сдачи и условия бронирования.
            </p>
            <a className="button dark" href="#contacts">
              Узнать условия брони
              <ArrowRight size={18} />
            </a>
          </div>
          <div className="building-list">
            {buildingHomes.map((item) => (
              <article className="building-item" key={item.title}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.location}</p>
                </div>
                <div className="building-meta">
                  <span>{item.stage}</span>
                  <strong>{item.finish}</strong>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section tinted" id="projects">
        <div className="container section-head">
          <span className="eyebrow">Типовые проекты</span>
          <h2>Проекты 80-140 м² для своего или подобранного участка</h2>
          <p>Подберем планировку под состав семьи, участок, бюджет и желаемый срок переезда.</p>
        </div>
        <div className="container project-grid">
          {projects.map((project) => (
            <article className="project-card" key={project.name}>
              <div className="project-plan">
                <House size={42} />
                <span />
              </div>
              <h3>{project.name}</h3>
              <div className="project-specs">
                <span>{project.area}</span>
                <span>{project.floors}</span>
                <span>{project.time}</span>
              </div>
              <strong>{project.price}</strong>
              <a href="#calc">Рассчитать проект</a>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="plots">
        <div className="container two-column">
          <div className="section-head left">
            <span className="eyebrow">Участки под строительство</span>
            <h2>Земля под дом <span className="text-accent">без отдельного поиска</span></h2>
            <p>
              Предложим участок и проект дома, который можно разместить с учетом площади,
              подъезда и коммуникаций.
            </p>
          </div>
          <div className="plot-list">
            {plots.map((plot) => (
              <article className="plot-item" key={plot.title}>
                <MapPin />
                <div>
                  <h3>{plot.title}</h3>
                  <p>{plot.location}</p>
                  <span>
                    {plot.area} · {plot.utilities}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section compare-section">
        <div className="container compare-layout">
          <div>
            <span className="eyebrow">Дом или квартира</span>
            <h2>Сравните <span className="text-accent">дом в ипотеку</span> и квартиру в аренду</h2>
            <p>
              Для семей, которые переезжают в Краснодар, показываем понятную разницу:
              площадь, участок, платеж и уровень свободы.
            </p>
          </div>
          <div className="compare-card" aria-label="Сравнение дома и квартиры">
            <div>
              <House />
              <h3>Дом</h3>
              <ul>
                <li>от 94 м²</li>
                <li>участок от 5 соток</li>
                <li>своя парковка и двор</li>
              </ul>
              <strong>от 40 000 ₽ / месяц</strong>
            </div>
            <div>
              <KeyRound />
              <h3>Квартира</h3>
              <ul>
                <li>60-80 м²</li>
                <li>без участка</li>
                <li>аренда без собственности</li>
              </ul>
              <strong>от 40 000 ₽ / месяц</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="section calculator-section" id="calc">
        <div className="container calc-layout">
          <div>
            <span className="eyebrow">Подбор и расчет</span>
            <h2>Подберите <span className="text-accent">лучший дом</span> под ваши критерии</h2>
            <p>
              Ответьте на несколько вопросов, и мы подготовим ориентир по стоимости,
              ипотеке, комплектации и подходящим вариантам.
            </p>
          </div>
          <HouseQuiz />
        </div>
      </section>

      <section className="section" id="prices">
        <div className="container section-head">
          <span className="eyebrow">Комплектации и цены</span>
          <h2>Подробная <span className="text-accent">таблица комплектаций</span></h2>
          <p>Сравните основные работы и выберите формат строительства под свой бюджет.</p>
        </div>
        <div className="container price-table-wrap">
          <table className="price-table">
            <thead>
              <tr>
                <th>Тип работ</th>
                <th>Теплый контур<br /><strong>от 48 000 ₽/м²</strong></th>
                <th>Предчистовая<br /><strong>от 62 000 ₽/м²</strong></th>
                <th>Под ключ<br /><strong>от 78 000 ₽/м²</strong></th>
              </tr>
            </thead>
            <tbody>
              {priceRows.map((row) => (
                <tr key={row.work}>
                  <td>{row.work}</td>
                  <td>{row.warm}</td>
                  <td>{row.pre}</td>
                  <td>{row.full}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section trust-section">
        <div className="container section-head">
          <span className="eyebrow">Доверие</span>
          <h2>Доверие строится на прозрачности</h2>
          <p>До сделки вы видите объекты, смету, договор, этапы работ и условия оплаты.</p>
        </div>
        <div className="container trust-grid">
          {trustItems.map((item) => {
            const Icon = item.icon;
            return (
              <article className="trust-item" key={item.title}>
                <Icon />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section process-section">
        <div className="container process-layout">
          <div className="section-head left">
            <span className="eyebrow">Этапы</span>
            <h2>Путь от заявки до дома</h2>
          </div>
          <div className="steps">
            {[
              ["01", "Подбор", "Выбираем готовый дом, проект или участок."],
              ["02", "Просмотр", "Показываем объект, стройку или планировку."],
              ["03", "Смета", "Фиксируем комплектацию, цену и сроки."],
              ["04", "Договор", "Запускаем сделку или строительство по этапам."],
            ].map(([number, title, text]) => (
              <article className="step" key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section payment-section">
        <div className="container payment-card">
          <div>
            <span className="eyebrow">Оплата и ипотека</span>
            <h2>Аккредитованы в <span className="text-accent">крупных банках</span></h2>
            <p>
              Поможем подобрать ипотечную программу для готового дома, объекта в строительстве
              или строительства под заказ.
            </p>
            <div className="bank-grid" aria-label="Банки партнеры">
              {banks.map((bank) => (
                <span key={bank}>{bank}</span>
              ))}
            </div>
          </div>
          <div className="payment-points">
            <span>
              <WalletCards />
              Ипотека и семейные программы
            </span>
            <span>
              <KeyRound />
              Бронь строящихся объектов
            </span>
            <span>
              <Clock3 />
              Поэтапная оплата строительства
            </span>
          </div>
        </div>
      </section>

      <section className="section faq-section">
        <div className="container two-column">
          <div className="section-head left">
            <span className="eyebrow">Вопросы</span>
            <h2>Ответы на частые вопросы</h2>
          </div>
          <div className="faq-list">
            {faq.map((item) => (
              <article className="faq-item" key={item.question}>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section contacts-section" id="contacts">
        <div className="container contacts-layout">
          <div>
            <span className="eyebrow">Контакты</span>
            <h2>Подберем дом, проект или участок под ваш бюджет</h2>
            <p>Оставьте телефон, и мы предложим ближайший вариант для просмотра или расчета.</p>
            <div className="contact-actions">
              <a href="tel:+79990000000">
                <Phone size={18} />
                Позвонить
              </a>
              <a href="https://t.me/username">
                <MessageCircle size={18} />
                Telegram
              </a>
            </div>
          </div>
          <form className="lead-form">
            <label>
              Имя
              <input type="text" placeholder="Как к вам обращаться" />
            </label>
            <label>
              Телефон
              <input type="tel" placeholder="+7 ___ ___-__-__" />
            </label>
            <label>
              Интересует
              <select defaultValue="ready-house">
                <option value="ready-house">Готовый дом</option>
                <option value="construction">Дом в строительстве</option>
                <option value="custom">Строительство под заказ</option>
                <option value="plot">Участок</option>
              </select>
            </label>
            <button className="button primary" type="button">
              Оставить заявку
              <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
