import NavBar from "./NavBar";
import { api } from "../lib/api";
import { About, Project } from "../types";

// Fallback data in case API fails
const fallbackAbout: About = {
  name: "Welcome to My Portfolio",
  bio: "Showcasing my projects and skills",
};

const fallbackProjects: Project[] = [
  {
    id: 1,
    title: "Sample Project 1",
    description: "This is a sample project description.",
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Sample Project 2",
    description: "Another sample project description.",
    created_at: new Date().toISOString(),
  },
];

export default async function Home() {
  let aboutData: About = fallbackAbout;
  let projects: Project[] = fallbackProjects;

  try {
    aboutData = await api.about.get();
  } catch (error) {
    console.error("Failed to fetch about data:", error);
    // Use fallback data
  }

  try {
    projects = await api.projects.get();
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    // Use fallback data
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <main className="container mx-auto px-4 py-8">
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {aboutData.name}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {aboutData.bio}
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Featured Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.slice(0, 3).map((project: Project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {project.description}
                  </p>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      View Project
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
