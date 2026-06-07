import ProjectForm from "../ProjectForm";
import { createProject } from "../actions";

export default function NewProject() {
  return (
    <>
      <div className="admin-topbar"><h2>Новый проект</h2></div>
      <div className="admin-card">
        <ProjectForm action={createProject} />
      </div>
    </>
  );
}
