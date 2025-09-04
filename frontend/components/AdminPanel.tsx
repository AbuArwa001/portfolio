// components/AdminPanel.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Skill,
  Project,
  SkillCategory,
  Certification,
  UserProfile,
} from "@/types";
import {
  User,
  Briefcase,
  Award,
  Code,
  FileText,
  Save,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { api } from "@/lib/api";

interface ResumeData {
  profile: {
    name: string;
    role: string;
    avatar: string;
  };
  experience: Array<{
    title: string;
    company: string;
    period: string;
    location: string;
    achievements: string[];
  }>;
  education: Array<{
    school: string;
    degree: string;
    period: string;
  }>;
  skills: string[];
  certifications: Array<{
    name: string;
    issuer: string;
    year: string;
  }>;
}

export function AdminPanel() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("profile");
  const [profileData, setProfileData] = useState<UserProfile>({
    id: 0,
    user: 0,
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    title: "",
    bio: "",
    location: "",
    profile_image: "",
    linkedin: "",
    github: "",
    phone: "",
    website: "",
    twitter: "",
  });
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState<Skill>({
    id: 0,
    name: "",
    level: 50,
    category: 0,
  });
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [newCertification, setNewCertification] = useState<Certification>({
    id: 0,
    title: "",
    issuer: "",
    date: new Date().toISOString().split("T")[0],
    in_progress: false,
    badge: "",
    type: "other",
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState<Project>({
    id: 0,
    name: "",
    description: "",
    technologies: "",
    link: "",
    type: "web",
    status: "completed",
    completion: "",
    user: 0,
  });
  const [resumeData, setResumeData] = useState<ResumeData>({
    profile: {
      name: "",
      role: "",
      avatar: "",
    },
    experience: [],
    education: [],
    skills: [],
    certifications: [],
  });
  const [newExperience, setNewExperience] = useState({
    title: "",
    company: "",
    period: "",
    location: "",
    achievements: [""],
  });
  const [newEducation, setNewEducation] = useState({
    school: "",
    degree: "",
    period: "",
  });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      fetchData();
    }
  }, [status]);

  const fetchData = async () => {
    try {
      // Fetch profile data
      const profile = await api.profile.get();
      setProfileData({
        ...profile,
        profile_image: profile.profile_image ?? "",
      });

      // Fetch skills
      const skillsData = await api.skills.get();
      setSkills(
        skillsData.map((skill: Skill) => ({
          ...skill,
        }))
      );

      // Fetch certifications
      const certsData = await api.certifications.get();
      setCertifications(certsData);

      // Fetch projects
      const projectsData = await api.projects.get();
      setProjects(
        projectsData.map((project: Project) => ({
          ...project,
          link: project.link ?? "",
        }))
      );

      // For resume data, you might need to create a new endpoint or use local data
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      await api.profile.update(profileData);
      // Show success message
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleAddSkill = async () => {
    try {
      const response = await api.skills.create(newSkill);
      setSkills([...skills, response]);
      setNewSkill({ id: 0, name: "", level: 50, category: 0 });
    } catch (error) {
      console.error("Error adding skill:", error);
    }
  };

  const handleDeleteSkill = async (id: number) => {
    try {
      await api.skills.delete(id);
      setSkills(skills.filter((skill) => skill.id !== id));
    } catch (error) {
      console.error("Error deleting skill:", error);
    }
  };

  const handleAddCertification = async () => {
    try {
      const response = await api.certifications.create(newCertification);
      setCertifications([...certifications, response]);
      setNewCertification({
        id: 0,
        title: "",
        issuer: "",
        date: new Date().toISOString().split("T")[0],
        in_progress: false,
        badge: "",
        type: "other",
      });
    } catch (error) {
      console.error("Error adding certification:", error);
    }
  };

  const handleDeleteCertification = async (id: number) => {
    try {
      await api.certifications.delete(id);
      setCertifications(certifications.filter((cert) => cert.id !== id));
    } catch (error) {
      console.error("Error deleting certification:", error);
    }
  };

  const handleAddProject = async () => {
    try {
      const response = await api.projects.create(newProject);
      setProjects([...projects, response]);
      setNewProject({
        id: 0,
        name: "",
        description: "",
        technologies: "",
        link: "",
        type: "web",
        status: "completed",
        completion: "",
        user: 0,
      });
    } catch (error) {
      console.error("Error adding project:", error);
    }
  };

  const handleDeleteProject = async (id: number) => {
    try {
      await api.projects.delete(id);
      setProjects(projects.filter((project) => project.id !== id));
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setIsUploading(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("profile_image", file);

    try {
      const response = await fetch("/api/upload-profile-image", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setProfileData({ ...profileData, profile_image: data.imageUrl });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  if (status !== "authenticated") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={() => setActiveTab("profile")}
        className="rounded-full w-12 h-12 shadow-lg"
      >
        <User className="h-5 w-5" />
      </Button>

      {activeTab && (
        <div className="absolute bottom-16 right-0 w-96 bg-white dark:bg-slate-800 rounded-lg shadow-xl border">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="font-semibold">Portfolio Editor</h3>
            <Button variant="ghost" size="sm" onClick={() => setActiveTab("")}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="profile" className="text-xs">
                <User className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="skills" className="text-xs">
                <Code className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="certs" className="text-xs">
                <Award className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="projects" className="text-xs">
                <Briefcase className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="resume" className="text-xs">
                <FileText className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>

            <div className="p-4 max-h-96 overflow-y-auto">
              {/* Profile Tab */}
              <TabsContent value="profile">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={
                          profileData.profile_image || "/placeholder-avatar.jpg"
                        }
                        alt="Profile"
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <Label
                        htmlFor="profile-image"
                        className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1 cursor-pointer"
                      >
                        <Upload className="h-3 w-3" />
                        <Input
                          id="profile-image"
                          type="file"
                          className="hidden"
                          onChange={handleImageUpload}
                          accept="image/*"
                        />
                      </Label>
                    </div>
                    <div>
                      <h4 className="font-medium">Profile Image</h4>
                      <p className="text-sm text-muted-foreground">
                        {isUploading
                          ? "Uploading..."
                          : "Click camera to upload"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input
                        id="first-name"
                        value={profileData.first_name}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            first_name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input
                        id="last-name"
                        value={profileData.last_name}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            last_name: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={profileData.title}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          title: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) =>
                        setProfileData({ ...profileData, bio: e.target.value })
                      }
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={profileData.location}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          location: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        value={profileData.linkedin}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            linkedin: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="github">GitHub</Label>
                      <Input
                        id="github"
                        value={profileData.github}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            github: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <Button onClick={handleProfileUpdate} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Save Profile
                  </Button>
                </div>
              </TabsContent>

              {/* Skills Tab */}
              <TabsContent value="skills">
                <div className="space-y-4">
                  <h4 className="font-medium">Add New Skill</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="skill-name">Skill Name</Label>
                      <Input
                        id="skill-name"
                        value={newSkill.name}
                        onChange={(e) =>
                          setNewSkill({ ...newSkill, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="skill-category">Category</Label>
                      <select
                        id="skill-category"
                        value={newSkill.category}
                        onChange={(e) =>
                          setNewSkill({
                            ...newSkill,
                            category: Number(e.target.value),
                          })
                        }
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="frontend">Frontend</option>
                        <option value="backend">Backend</option>
                        <option value="database">Database</option>
                        <option value="devops">DevOps</option>
                        <option value="tools">Tools</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skill-level">
                      Level: {newSkill.level}%
                    </Label>
                    <Input
                      id="skill-level"
                      type="range"
                      min="0"
                      max="100"
                      value={newSkill.level}
                      onChange={(e) =>
                        setNewSkill({
                          ...newSkill,
                          level: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>

                  <Button onClick={handleAddSkill} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Skill
                  </Button>

                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Your Skills</h4>
                    <div className="space-y-2">
                      {skills.map((skill) => (
                        <div
                          key={skill.id}
                          className="flex items-center justify-between p-2 border rounded"
                        >
                          <div>
                            <span className="font-medium">{skill.name}</span>
                            <Badge variant="secondary" className="ml-2">
                              {skill.category}
                            </Badge>
                            <div className="text-xs text-muted-foreground">
                              Level: {skill.level}%
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSkill(skill.id!)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Certifications Tab */}
              <TabsContent value="certs">
                <div className="space-y-4">
                  <h4 className="font-medium">Add New Certification</h4>
                  <div className="space-y-2">
                    <Label htmlFor="cert-title">Title</Label>
                    <Input
                      id="cert-title"
                      value={newCertification.title}
                      onChange={(e) =>
                        setNewCertification({
                          ...newCertification,
                          title: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cert-issuer">Issuer</Label>
                    <Input
                      id="cert-issuer"
                      value={newCertification.issuer}
                      onChange={(e) =>
                        setNewCertification({
                          ...newCertification,
                          issuer: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cert-date">Date</Label>
                    <Input
                      id="cert-date"
                      type="date"
                      value={newCertification.date}
                      onChange={(e) =>
                        setNewCertification({
                          ...newCertification,
                          date: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="cert-in-progress"
                      checked={newCertification.in_progress}
                      onCheckedChange={(checked) =>
                        setNewCertification({
                          ...newCertification,
                          in_progress: checked,
                        })
                      }
                    />
                    <Label htmlFor="cert-in-progress">In Progress</Label>
                  </div>

                  <Button onClick={handleAddCertification} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Certification
                  </Button>

                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Your Certifications</h4>
                    <div className="space-y-2">
                      {certifications.map((cert) => (
                        <div
                          key={cert.id}
                          className="flex items-center justify-between p-2 border rounded"
                        >
                          <div>
                            <span className="font-medium">{cert.title}</span>
                            <div className="text-xs text-muted-foreground">
                              {cert.issuer} • {cert.date}
                              {cert.in_progress && (
                                <Badge variant="outline" className="ml-2">
                                  In Progress
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCertification(cert.id!)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Projects Tab */}
              <TabsContent value="projects">
                <div className="space-y-4">
                  <h4 className="font-medium">Add New Project</h4>
                  <div className="space-y-2">
                    <Label htmlFor="project-name">Project Name</Label>
                    <Input
                      id="project-name"
                      value={newProject.name}
                      onChange={(e) =>
                        setNewProject({ ...newProject, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="project-desc">Description</Label>
                    <Textarea
                      id="project-desc"
                      value={newProject.description}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          description: e.target.value,
                        })
                      }
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="project-tech">Technologies</Label>
                    <Input
                      id="project-tech"
                      value={newProject.technologies}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          technologies: e.target.value,
                        })
                      }
                      placeholder="React, Node.js, PostgreSQL, etc."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="project-type">Type</Label>
                      <select
                        id="project-type"
                        value={newProject.type}
                        onChange={(e) =>
                          setNewProject({ ...newProject, type: e.target.value })
                        }
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="web">Web</option>
                        <option value="mobile">Mobile</option>
                        <option value="data">Data</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="project-status">Status</Label>
                      <select
                        id="project-status"
                        value={newProject.status}
                        onChange={(e) =>
                          setNewProject({
                            ...newProject,
                            status: e.target.value,
                          })
                        }
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="completed">Completed</option>
                        <option value="in-progress">In Progress</option>
                        <option value="planned">Planned</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="project-link">
                      Project Link (optional)
                    </Label>
                    <Input
                      id="project-link"
                      value={newProject.link ?? ""}
                      onChange={(e) =>
                        setNewProject({ ...newProject, link: e.target.value })
                      }
                      placeholder="https://..."
                    />
                  </div>

                  <Button onClick={handleAddProject} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Project
                  </Button>

                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Your Projects</h4>
                    <div className="space-y-2">
                      {projects.map((project) => (
                        <div
                          key={project.id}
                          className="flex items-center justify-between p-2 border rounded"
                        >
                          <div>
                            <span className="font-medium">{project.name}</span>
                            <div className="text-xs text-muted-foreground">
                              {project.type} • {project.status}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteProject(project.id!)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Resume Tab */}
              <TabsContent value="resume">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Edit your resume data. Changes will be reflected on the
                    resume page.
                  </p>

                  <div className="space-y-2">
                    <Label htmlFor="resume-name">Full Name</Label>
                    <Input
                      id="resume-name"
                      value={resumeData.profile.name}
                      onChange={(e) =>
                        setResumeData({
                          ...resumeData,
                          profile: {
                            ...resumeData.profile,
                            name: e.target.value,
                          },
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="resume-role">Professional Role</Label>
                    <Input
                      id="resume-role"
                      value={resumeData.profile.role}
                      onChange={(e) =>
                        setResumeData({
                          ...resumeData,
                          profile: {
                            ...resumeData.profile,
                            role: e.target.value,
                          },
                        })
                      }
                    />
                  </div>

                  <Button className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Save Resume Data
                  </Button>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      )}
    </div>
  );
}
