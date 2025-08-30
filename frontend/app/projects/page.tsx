// app/projects/page.tsx
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  ExternalLink,
  Github,
  Calendar,
  ArrowUpRight,
  Code,
} from "lucide-react";

interface ProjectData {
  id: number;
  name: string;
  description: string;
  type: string;
  status: string;
  technologies: string[];
  completion: string;
  link: string;
  image?: string;
  github?: string;
  date?: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ProjectData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Define the type that matches the API response
  type ProjectApi = Omit<
    ProjectData,
    "technologies" | "link" | "image" | "github"
  > & {
    technologies: string[] | string;
    link?: string | null;
    image?: string | null;
    github?: string | null;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch projects data and normalize fields as needed
        const projectsData: ProjectApi[] = await api.projects.get();
        // Ensure technologies is always an array of strings and link is a string
        const normalizedProjects: ProjectData[] = projectsData.map(
          (project) => ({
            ...project,
            technologies: Array.isArray(project.technologies)
              ? project.technologies
              : typeof project.technologies === "string"
                ? [project.technologies]
                : [],
            link: project.link ?? "",
            image: project.image ?? undefined,
            github: project.github ?? undefined,
          })
        );
        setProjects(normalizedProjects);
        setFilteredProjects(normalizedProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter projects based on search and filters
  useEffect(() => {
    let result = projects;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (project) =>
          project.name.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          project.technologies.some((tech) =>
            tech.toLowerCase().includes(query)
          )
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((project) => project.status === statusFilter);
    }

    // Apply type filter
    if (typeFilter !== "all") {
      result = result.filter((project) => project.type === typeFilter);
    }

    setFilteredProjects(result);
  }, [searchQuery, statusFilter, typeFilter, projects]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-12 w-12 border-b-2 border-primary"
        ></motion.div>
      </div>
    );
  }

  // Get unique statuses and types for filters
  const statuses = [...new Set(projects.map((p) => p.status))];
  const types = [...new Set(projects.map((p) => p.type))];

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          My Projects
        </h1>
        <p className="text-muted-foreground text-lg max-w-3xl">
          A curated collection of my work, including personal projects,
          professional work, and contributions to open source. Each project
          represents a unique challenge and learning experience.
        </p>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8 flex flex-col md:flex-row gap-4 items-start md:items-center"
      >
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search projects or technologies..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <Code className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {types.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              layout
            >
              <Card className="flex flex-col h-full overflow-hidden group hover:shadow-lg transition-all duration-300">
                {project.image && (
                  <div className="h-48 bg-muted overflow-hidden relative">
                    <Image
                      src={project.image}
                      alt={project.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                )}
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {project.name}
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className={
                        project.status === "Completed"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 border-0"
                          : project.status === "In Progress"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 border-0"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300 border-0"
                      }
                    >
                      {project.status}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow pb-4">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 4).map((tech, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {tech}
                      </Badge>
                    ))}
                    {project.technologies.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{project.technologies.length - 4} more
                      </Badge>
                    )}
                  </div>

                  {project.date && (
                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                      <Calendar className="h-4 w-4 mr-1" />
                      Completed: {project.date}
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-auto">
                    <div className="text-sm text-muted-foreground capitalize">
                      {project.type}
                    </div>
                    <div className="flex gap-2">
                      {project.github && (
                        <Button
                          asChild
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="View on GitHub"
                          >
                            <Github className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {project.link && (
                        <Button asChild size="sm" className="gap-1">
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Live
                            <ArrowUpRight className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Voting System API Project - Highlighted */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="md:col-span-2" // Make this project span 2 columns on medium screens and up
        >
          <Card className="flex flex-col h-full border-2 border-blue-500/20 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 group hover:shadow-lg transition-all duration-300 overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-2xl text-blue-700 dark:text-blue-400">
                  Voting System API
                </CardTitle>
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 border-0">
                  Featured
                </Badge>
              </div>
              <CardDescription className="text-lg">
                A secure voting API with three-server architecture (2 web
                servers, 1 load balancer)
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow pb-4">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">Node.js</Badge>
                <Badge variant="secondary">Express</Badge>
                <Badge variant="secondary">AWS</Badge>
                <Badge variant="secondary">Load Balancing</Badge>
                <Badge variant="secondary">REST API</Badge>
                <Badge variant="secondary">MongoDB</Badge>
                <Badge variant="secondary">JWT Auth</Badge>
              </div>

              <div className="mb-4 p-4 bg-blue-100/50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center">
                  <Code className="h-4 w-4 mr-2" />
                  Architecture:
                </h4>
                <ul className="text-sm list-disc list-inside text-muted-foreground space-y-1">
                  <li>
                    Two web servers for handling requests with load balancing
                  </li>
                  <li>
                    Secure JWT authentication system with role-based access
                  </li>
                  <li>Database replication for data integrity and failover</li>
                  <li>Rate limiting and DDoS protection mechanisms</li>
                  <li>Comprehensive API documentation with Swagger/OpenAPI</li>
                </ul>
              </div>

              <div className="flex justify-between items-center mt-auto">
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 border-0">
                  Completed
                </Badge>
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm" className="gap-1">
                    <a
                      href="https://github.com/yourusername/voting-system"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="h-4 w-4" />
                      Code
                    </a>
                  </Button>
                  <Button asChild size="sm" className="gap-1">
                    <a
                      href="https://voting-system-demo.example.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Live Demo
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Empty state */}
      {filteredProjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12 text-center"
        >
          <div className="rounded-full bg-muted p-4 mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No projects found</h3>
          <p className="text-muted-foreground max-w-md">
            Try adjusting your search or filters to find what you&apos;re
            looking for.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("all");
              setTypeFilter("all");
            }}
          >
            Clear all filters
          </Button>
        </motion.div>
      )}
    </div>
  );
}
