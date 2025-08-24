import NavBar from "../NavBar";
import { publicApi } from "../../lib/api";

export default async function Projects() {
  const projects = await publicApi.get("/projects/");

  return (
    <div className="page-container">
      <NavBar />

      <main className="main-content">
        <h1>My Projects</h1>

        <div className="projects-grid">
          {projects.map((project: any) => (
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
