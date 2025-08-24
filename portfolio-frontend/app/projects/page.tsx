import NavBar from "../NavBar";
import { api } from "../../lib/api";
import { Project } from "@/types";

export default async function Projects() {
  const projects = await api.projects.get();

  return (
    <div className="page-container">
      <NavBar />

      <main className="main-content">
        <h1>My Projects</h1>

        <div className="projects-grid">
          {projects.map((project: Project) => (
            <div key={project.id} className="project-card">
              <h2>{project.title}</h2>
              <p>{project.description}</p>
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Project
                </a>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
