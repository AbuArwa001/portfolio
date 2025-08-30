// app/page.tsx (enhanced version)
"use client";

// import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Certification } from "@/types";
import { motion } from "framer-motion";
import {
  BookOpen,
  Briefcase,
  Monitor,
  Award,
  Code,
  Database,
  Cloud,
  Server,
} from "lucide-react";
import ContributionHeatmap from "@/components/ContributionHeatmap";

// Define the project data type
interface ProjectData {
  id: number;
  name: string;
  description: string;
  type: string;
  status: string;
  technologies: string;
  completion: string;
  link: string;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

export default function Page() {
  // const { data: session, status } = useSession();
  const { status } = useSession();
  const [projectData, setProjectData] = useState<ProjectData[]>([]);
  const [certificationData, setCertificationData] = useState<Certification[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch projects
        const projects = await api.projects.get();
        const mappedProjectData = projects.map((project) => ({
          id: project.id,
          name: project.name,
          description: project.description,
          type: project.type,
          status: project.status,
          technologies: project.technologies,
          completion: project.completion,
          link: project.link || "#",
        }));
        setProjectData(mappedProjectData);

        // Fetch certifications
        const certifications = await api.certifications.get();
        setCertificationData(certifications);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-极 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-300">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Count projects by type
  const webProjects = projectData.filter((p) => p.type === "web").length;
  const mobileProjects = projectData.filter((p) => p.type === "mobile").length;
  const dataProjects = projectData.filter((p) => p.type === "data").length;

  return (
    <div className="flex flex-1 flex-col bg-gradient-to-b极 from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 min-h-screen">
      <div className="@container/main flex flex-1 flex-col gap-4 p-4 md:p-6">
        {/* Header */}
        <motion.div
          className="flex flex-col gap-2 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
            Developer Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Welcome back! Here&apos;s an overview of your projects and progress.
          </p>
        </motion.div>

        {/* Metric Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Projects
                </CardTitle>
                <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <Code className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                  {projectData.length}+
                </div>
                <div className="flex items-center mt-2 text-xs text-blue-600 dark:text-blue-300">
                  <span className="mr-2">Web: {webProjects}</span>
                  <span className="mr-2">Mobile: {mobileProjects}</span>
                  <span>Data: {dataProjects}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
                  Certifications
                </CardTitle>
                <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30">
                  <Award className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-900 dark:text-green-100">
                  {certificationData.length}+
                </div>
                <p className="text-xs text-green-600 dark:text-green-300 mt-2">
                  Professional certifications
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-300">
                  Experience
                </CardTitle>
                <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30">
                  <Briefcase className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-900 dark:text-amber-100">
                  2+
                </div>
                <p className="text-xs text-amber-600 dark:text-amber-300 mt-2">
                  Years in development
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  In Progress
                </CardTitle>
                <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30">
                  <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                  2
                </div>
                <p className="text-xs text-purple-600 dark:text-purple-300 mb-2">
                  Active certifications
                </p>
                <div className="space-y-2">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium">
                        AWS Solutions Architect
                      </span>
                      <span className="text-xs font-bold">70%</span>
                    </div>
                    <Progress
                      value={70}
                      className="h-2 bg-purple-200 dark:bg-purple-800/40"
                    >
                      <div className="h-full bg-purple-500 rounded-full transition-all duration-500"></div>
                    </Progress>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium">Data Science</span>
                      <span className="text-xs font-bold">30%</span>
                    </div>
                    <Progress
                      value={30}
                      className="h-2 bg-purple-200 dark:bg-purple-800/40"
                    >
                      <div className="h-full bg-pink-500 rounded-full transition-all duration-500"></div>
                    </Progress>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* GitHub Contributions - Enhanced */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-slate-50 dark:bg-slate-800/50 rounded-t-lg">
                <CardTitle className="flex items-center">
                  <svg
                    className="mr-2 h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 
     0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466
     -.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.834.092
     -.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103
     -.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 
     2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 
     1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419
     -.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.5 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  GitHub Contributions
                </CardTitle>
                <CardDescription>
                  Your coding activity and contributions over the past year
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-800/70 rounded-lg p-4">
                  <ContributionHeatmap username="AbuArwa001" />
                </div>

                {/* Contribution Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      1,248
                    </div>
                    <div className="text-sm text-blue-700 dark:text-blue-300">
                      Total Contributions
                    </div>
                  </div>
                  <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      186
                    </div>
                    <div className="text-sm text-green-700 dark:text-green-300">
                      Current Streak
                    </div>
                  </div>
                  <div className="text-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                      42
                    </div>
                    <div className="text-sm text-amber-700 dark:text-amber-300">
                      Repositories
                    </div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      24
                    </div>
                    <div className="text-sm text-purple-极 dark:text-purple-300">
                      Pull Requests
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Skills & Technologies */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="border-0 shadow-lg h-full">
              <CardHeader className="bg-slate-50 dark:bg-slate-800/50 rounded-t-lg">
                <CardTitle className="flex items-center">
                  <Server className="mr-2 h-5 w-5" />
                  Technologies
                </CardTitle>
                <CardDescription>
                  Skills and technologies you work with
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Frontend</span>
                      <span className="text-xs text-slate-500">90%</span>
                    </div>
                    <Progress value={90} className="h-2">
                      <div className="h-full bg-blue-500 rounded-full"></div>
                    </Progress>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Backend</span>
                      <span className="text-xs text-slate-500">85%</span>
                    </div>
                    <Progress value={85} className="h-2">
                      <div className="h-full bg-green-500 rounded-full"></div>
                    </Progress>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Database</span>
                      <span className="text-xs text-slate-500">80%</span>
                    </div>
                    <Progress value={80} className="h-2">
                      <div className="h-full bg-purple-500 rounded-full"></div>
                    </Progress>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">DevOps</span>
                      <span className="text-xs text-slate-500">70%</span>
                    </div>
                    <Progress value={70} className="h-2">
                      <div className="h-full bg-amber-500 rounded-full"></div>
                    </Progress>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-3">Top Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300"
                    >
                      React
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300"
                    >
                      Node.js
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300"
                    >
                      PostgreSQL
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-300"
                    >
                      AWS
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300"
                    >
                      Python
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Projects Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6"
        >
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-slate-50 dark:极-slate-800/50 rounded-t-lg">
              <CardTitle className="flex items-center">
                <Monitor className="mr-2 h-5 w-5" />
                Recent Projects
              </CardTitle>
              <CardDescription>
                Your most recent development projects
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <DataTable data={projectData} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Certifications Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-6"
        >
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-slate-50 dark:bg-slate-800/50 rounded-t-lg">
              <CardTitle className="flex items-center">
                <Award className="mr-2 h-5 w-5" />
                Certifications & Achievements
              </CardTitle>
              <CardDescription>
                Your professional certifications and completed courses
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certificationData.map((cert) => (
                  <motion.div
                    key={cert.id}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card
                      className={`border-0 shadow-md transition-all duration-300 hover:shadow-lg ${
                        cert.type === "aws"
                          ? "bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950/20 dark:to-amber-900/30"
                          : cert.type === "alx"
                            ? "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/30"
                            : "bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-800/70"
                      }`}
                    >
                      <CardHeader className="flex flex-row items-center space-y-0 pb-3">
                        <div
                          className={`rounded-full p-3 ${
                            cert.type === "aws"
                              ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                              : cert.type === "alx"
                                ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                                : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                          }`}
                        >
                          {cert.type === "aws" ? (
                            <Cloud className="h-6 w-6" />
                          ) : cert.type === "alx" ? (
                            <Database className="h-6 w-6" />
                          ) : (
                            <Award className="h-6 w-6" />
                          )}
                        </div>
                        <div className="ml-4">
                          <CardTitle className="text-lg">
                            {cert.title}
                          </CardTitle>
                          <CardDescription>{cert.issuer}</CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <Badge
                            variant="outline"
                            className={
                              cert.type === "aws"
                                ? "bg-amber-500/10 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300 border-amber-500/30"
                                : cert.type === "alx"
                                  ? "bg-blue-500/10 text-blue-700 dark:bg-blue-400/10 dark:text-blue-300 border-blue-500/30"
                                  : "bg-slate-500/10 text-slate-700 dark:bg-slate-400/10 dark:text-slate-300 border-slate-500/30"
                            }
                          >
                            {cert.type.toUpperCase()}
                          </Badge>
                          <span className="text-sm text-slate-500 dark:text-slate-400">
                            {cert.date}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
