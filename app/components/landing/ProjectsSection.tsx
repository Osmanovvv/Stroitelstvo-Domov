import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getProjects } from "../../lib/queries";

export default async function ProjectsSection() {
  const projects = await getProjects();
  return (
    <section className="section tinted" id="projects">
      <div className="container section-head">
        <span className="eyebrow">Каталог проектов</span>
        <h2>Проекты 80-140 м² для своего или подобранного участка</h2>
        <p>Готовые решения можно адаптировать под ваш участок, фасад, планировку и ипотечный бюджет.</p>
      </div>
      <div className="container project-grid">
        {projects.map((project) => (
          <article className="project-card" key={project.id}>
            <div className="project-media">
              {project.image && (
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  sizes="(max-width: 760px) calc(100vw - 44px), (max-width: 1040px) calc((100vw - 90px) / 2), (max-width: 1180px) calc((100vw - 108px) / 2), 325px"
                />
              )}
              <span className="project-area">{project.area}</span>
            </div>
            <div className="project-body">
              <span className="project-tag">{project.tag}</span>
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <div className="project-specs">
                <span>{project.floors}</span>
                <span>{project.time}</span>
                <span>под участок</span>
              </div>
              <strong>{project.price}</strong>
              <a href="#calc">
                Рассчитать проект
                <ArrowRight size={18} />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
