import { ArrowRight } from "lucide-react";
import { getProjects } from "../../lib/queries";
import LeadModalTrigger from "../LeadModalTrigger";
import ProjectSlider from "../ProjectSlider";
import SectionHead from "../SectionHead";

const PROJECT_IMAGE_SIZES =
  "(max-width: 1040px) calc((100vw - 90px) / 2), (max-width: 1180px) calc((100vw - 108px) / 2), 325px";

export default async function ProjectsSection() {
  const projects = await getProjects();
  return (
    <section className="section tinted" id="projects">
      <SectionHead id="projects" />
      <div className="container project-grid">
        {projects.map((project) => {
          const gallery = [project.image, project.image2, project.image3, project.plan].filter(
            (src): src is string => Boolean(src),
          );

          return (
          <article className="project-card" key={project.id}>
            <div className="project-media">
              <ProjectSlider images={gallery} alt={project.name} sizes={PROJECT_IMAGE_SIZES} />
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
              <LeadModalTrigger title="Рассчитать проект" withFile>
                Рассчитать проект
                <ArrowRight size={18} />
              </LeadModalTrigger>
            </div>
          </article>
          );
        })}
      </div>
    </section>
  );
}
