"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Mail,
  Linkedin,
  Github,
  Calendar,
  MapPin,
} from "lucide-react";
import { downloadResume } from "@/lib/download";

// ✅ Section transition animations
const sectionVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

// ✅ Import JSON data
import resumeData from "./resume.json";

const ResumePage = () => {
  const [activeSection, setActiveSection] = useState("experience");
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadResume();
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-7xl">
      {/* ===== Header ===== */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">My Resume</h1>
          <p className="text-muted-foreground">
            A snapshot of my professional journey 🚀
          </p>
        </div>
        <Button
          onClick={handleDownload}
          disabled={isDownloading}
          className="gap-2 shadow-md"
          size="lg"
        >
          {isDownloading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Downloading...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Download PDF
            </>
          )}
        </Button>
      </div>

      {/* ===== Layout ===== */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* ===== Sidebar ===== */}
        <aside className="lg:w-1/4 space-y-6">
          {/* Profile Card */}
          <Card className="overflow-hidden text-center">
            <CardContent className="p-6">
              <div className="w-28 h-28 mx-auto rounded-full overflow-hidden border-4 border-primary shadow-lg">
                <Image
                  src={resumeData.profile.avatar}
                  alt="Profile"
                  width={112}
                  height={112}
                  className="object-cover"
                />
              </div>
              <h2 className="mt-4 text-xl font-semibold">
                {resumeData.profile.name}
              </h2>
              <Badge variant="secondary" className="mt-2">
                {resumeData.profile.role}
              </Badge>
            </CardContent>
          </Card>

          {/* Navigation */}
          <Card>
            <CardHeader>
              <CardTitle>Sections</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {["experience", "education", "skills", "certifications"].map(
                (id) => (
                  <Button
                    key={id}
                    variant={activeSection === id ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setActiveSection(id)}
                  >
                    {id.charAt(0).toUpperCase() + id.slice(1)}
                  </Button>
                )
              )}
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{resumeData.contact.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Linkedin className="h-4 w-4 text-muted-foreground" />
                <a
                  href={resumeData.contact.linkedin}
                  className="text-sm text-primary hover:underline"
                >
                  LinkedIn
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Github className="h-4 w-4 text-muted-foreground" />
                <a
                  href={resumeData.contact.github}
                  className="text-sm text-primary hover:underline"
                >
                  GitHub
                </a>
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* ===== Main Content with Motion Transitions ===== */}
        <main className="lg:w-3/4 space-y-6 relative">
          <AnimatePresence mode="wait">
            {activeSection === "experience" && (
              <motion.div
                key="experience"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Work Experience</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {resumeData.experience.map((job, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-lg border hover:shadow-md transition"
                      >
                        <h3 className="text-lg font-semibold">{job.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {job.company}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Calendar className="w-4 h-4" /> {job.period}
                          <MapPin className="w-4 h-4 ml-4" /> {job.location}
                        </div>
                        <ul className="mt-3 space-y-1">
                          {job.achievements.map((ach, j) => (
                            <li key={j} className="flex items-center gap-2">
                              <Badge variant="outline">✅</Badge>
                              {ach}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeSection === "education" && (
              <motion.div
                key="education"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Education</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {resumeData.education.map((edu, i) => (
                      <div key={i} className="p-4 border rounded-lg">
                        <h3 className="text-lg font-semibold">{edu.school}</h3>
                        <p className="text-sm">{edu.degree}</p>
                        <p className="text-xs text-muted-foreground">
                          {edu.period}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeSection === "skills" && (
              <motion.div
                key="skills"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Skills</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    {resumeData.skills.map((skill, i) => (
                      <Badge key={i} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeSection === "certifications" && (
              <motion.div
                key="certifications"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Certifications</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {resumeData.certifications.map((cert, i) => (
                      <div key={i} className="p-4 border rounded-lg">
                        <h3 className="text-lg font-semibold">{cert.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {cert.issuer} • {cert.year}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default ResumePage;
