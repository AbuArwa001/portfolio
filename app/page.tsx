"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Code,
  Database,
  Layout,
  Server,
  Github,
  Linkedin,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Project } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await api.projects.get();
        // Take top 3 projects
        setProjects(data.slice(0, 3));
      } catch (e) {
        console.error("Failed to load projects", e);
      }
    }
    loadProjects();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 -z-10" />
        <div className="container px-4 mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto space-y-6"
          >
            <div className="inline-block px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-full dark:text-blue-400 dark:bg-blue-900/30">
              Full Stack Developer
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-7xl">
              Building Digital{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Masterpieces
              </span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Hi, I'm Khalfan Athman. I craft robust and scalable web
              applications with modern technologies. Specializing in Python
              (Django) and TypeScript (Next.js).
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Link href="/contact">
                <Button
                  size="lg"
                  className="w-full sm:w-auto text-lg h-12 px-8 bg-blue-600 hover:bg-blue-700"
                >
                  Get in Touch <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#projects">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto text-lg h-12 px-8"
                >
                  View Work
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tech Stack Preview */}
      <section className="py-12 border-y border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center justify-center gap-2">
              <Layout className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold text-slate-700 dark:text-slate-300">
                Next.js
              </span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Database className="h-8 w-8 text-green-500" />
              <span className="text-xl font-bold text-slate-700 dark:text-slate-300">
                Django
              </span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Code className="h-8 w-8 text-yellow-500" />
              <span className="text-xl font-bold text-slate-700 dark:text-slate-300">
                Python
              </span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Server className="h-8 w-8 text-purple-500" />
              <span className="text-xl font-bold text-slate-700 dark:text-slate-300">
                PostgreSQL
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section id="projects" className="py-24 bg-slate-50 dark:bg-slate-950">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
              Featured Projects
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              A selection of my recent work
            </p>
          </div>

          <motion.div
            img-loader
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {projects.length > 0
              ? projects.map((project) => (
                  <motion.div key={project.id} variants={item}>
                    <Card className="h-full flex flex-col hover:shadow-xl transition-shadow duration-300 border-none shadow-md overflow-hidden bg-white dark:bg-slate-900">
                      <div className="h-48 bg-slate-200 dark:bg-slate-800 relative group">
                        {/* Placeholder for project image if you had one */}
                        <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                          <Code className="h-12 w-12 opacity-20" />
                        </div>
                        <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-colors duration-300" />
                      </div>
                      <CardHeader>
                        <div className="flex justify-between items-start mb-2">
                          <Badge
                            variant="secondary"
                            className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                          >
                            {project.type}
                          </Badge>
                          <Badge
                            variant={
                              project.status === "Completed"
                                ? "default"
                                : "outline"
                            }
                            className={
                              project.status === "Completed"
                                ? "bg-green-600"
                                : ""
                            }
                          >
                            {project.status}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl line-clamp-1">
                          {project.name}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                          {project.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <div className="flex flex-wrap gap-2 mt-2">
                          {project.technologies
                            .split(",")
                            .slice(0, 3)
                            .map((tech, i) => (
                              <span
                                key={i}
                                className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-600 dark:text-slate-400"
                              >
                                {tech.trim()}
                              </span>
                            ))}
                          {project.technologies.split(",").length > 3 && (
                            <span className="text-xs px-2 py-1 text-slate-500">
                              +{project.technologies.split(",").length - 3}
                            </span>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button asChild className="w-full">
                          <Link href={project.link || "#"} target="_blank">
                            View Project
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))
              : // Skeleton Loading or Empty State
                [1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-96 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse"
                  />
                ))}
          </motion.div>

          <div className="text-center mt-12">
            <Link href="/projects">
              <Button variant="outline" size="lg" className="gap-2">
                View All Projects <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl opacity-20 blur-lg transform rotate-2"></div>
                <div className="relative h-[400px] w-full rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                  {/* Placeholder for Profile Pic */}
                  <span className="text-4xl">👨‍💻</span>
                  {/* You should replace this with <Image src={...} /> later */}
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 space-y-6">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                About Me
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                I am a passionate software engineer with a deep interest in
                building scalable web applications. My journey began with a
                curiosity for how things work, leading me to master the full
                stack of web development.
              </p>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                When I'm not coding, you can find me exploring new technologies,
                contributing to open source, or sharing knowledge with the
                community.
              </p>
              <div className="flex gap-4 pt-4">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Github className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Linkedin className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Mail className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-950 text-slate-400 border-t border-slate-900">
        <div className="container px-4 mx-auto text-center">
          <p>
            &copy; {new Date().getFullYear()} Khalfan Athman. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
