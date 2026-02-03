"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { api } from "@/lib/api";
import { UserProfile, Certification, SkillCategory, Language } from "@/types";
import { motion, easeInOut } from "framer-motion";
import {
  Mail,
  Linkedin,
  Github,
  Award,
  Code,
  Globe,
  Server,
  Database,
  Cpu,
  Calendar,
  MapPin,
  Briefcase,
  GraduationCap,
  ExternalLink,
} from "lucide-react";

// Helper type for the initial API response
type ProfileData = Omit<
  UserProfile,
  "skill_categories" | "certifications" | "languages"
> & {
  skill_categories?: number[];
  certifications?: number[];
  languages?: number[];
};

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

import { easeOut } from "framer-motion";

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: easeOut,
    },
  },
};

const hoverVariants = {
  hover: {
    y: -5,
    transition: {
      duration: 0.2,
      ease: easeInOut,
    },
  },
};

// Skill category icons
const skillCategoryIcons: Record<string, React.ElementType> = {
  frontend: Code,
  backend: Server,
  database: Database,
  devops: Cpu,
  tools: Cpu,
  default: Code,
};

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: ProfileData = (await api.profile.get()) as ProfileData;
        console.log("Fetched profile data:", data);

        // Create base profile with empty arrays for the expanded data
        const baseProfile: UserProfile = {
          ...data,
          skill_categories: [],
          certifications: [],
          languages: [],
        };

        setProfileData(baseProfile);

        // Fetch detailed data for each category if we have IDs
        if (data.skill_categories && Array.isArray(data.skill_categories)) {
          const skillCategoryPromises = data.skill_categories
            .filter((id) => typeof id === "number")
            .map((id) =>
              api.skillCategory.getById(id).catch((error) => {
                console.error(`Error fetching skill category ${id}:`, error);
                return null;
              })
            );

          Promise.all(skillCategoryPromises).then((skillCategories) => {
            const validCategories = skillCategories.filter(
              Boolean
            ) as SkillCategory[];
            setProfileData((prev) =>
              prev ? { ...prev, skill_categories: validCategories } : prev
            );
          });
        }

        if (data.certifications && Array.isArray(data.certifications)) {
          const certificationPromises = data.certifications
            .filter((id) => typeof id === "number")
            .map((id) =>
              api.certifications.getById(id).catch((error) => {
                console.error(`Error fetching certification ${id}:`, error);
                return null;
              })
            );

          Promise.all(certificationPromises).then((certifications) => {
            const validCerts = certifications.filter(
              Boolean
            ) as Certification[];
            setProfileData((prev) =>
              prev ? { ...prev, certifications: validCerts } : prev
            );
          });
        }

        if (data.languages && Array.isArray(data.languages)) {
          const languagePromises = data.languages
            .filter((id) => typeof id === "number")
            .map((id) =>
              api.Languages.getById(id).catch((error) => {
                console.error(`Error fetching language ${id}:`, error);
                return null;
              })
            );

          Promise.all(languagePromises).then((languages) => {
            const validLanguages = languages.filter(Boolean) as Language[];
            setProfileData((prev) =>
              prev ? { ...prev, languages: validLanguages } : prev
            );
          });
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-300">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 dark:bg-red-900/20 rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-red-700 dark:text-red-300">
            Error loading profile
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-2">
            Unable to load profile data. Please try again later.
          </p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Type guard functions to check if items are full objects or IDs
  const isSkillCategory = (
    item: number | SkillCategory
  ): item is SkillCategory => {
    return typeof item !== "number" && "name" in item;
  };

  const isCertification = (
    item: number | Certification
  ): item is Certification => {
    return typeof item !== "number" && "title" in item;
  };

  const isLanguage = (item: number | Language): item is Language => {
    return typeof item !== "number" && "name" in item;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        {/* Header Section */}
        <motion.div
          className="flex flex-col lg:flex-row items-center gap-8 mb-12 p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="relative"
            whileHover="hover"
            variants={hoverVariants}
          >
            <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1 shadow-lg">
              <div className="w-full h-full rounded-full bg-white dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                {profileData.profile_image ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={`${API_BASE_URL}${profileData.profile_image}`}
                      alt={profileData.username || "Profile image"}
                      fill
                      className="rounded-full object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={true}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 w-full h-full flex items-center justify-center">
                    <span className="text-4xl lg:text-5xl font-bold text-blue-600 dark:text-blue-400">
                      {profileData.username?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white">
              {profileData.first_name && profileData.last_name
                ? `${profileData.first_name} ${profileData.last_name}`
                : profileData.username}
            </h1>
            <p className="text-xl text-blue-600 dark:text-blue-400 font-medium mt-2">
              {profileData.title}
            </p>

            <div className="flex items-center justify-center lg:justify-start gap-4 mt-3 text-slate-600 dark:text-slate-300">
              {profileData.location && (
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{profileData.location}</span>
                </div>
              )}
              {profileData.email && (
                <a
                  href={`mailto:${profileData.email}`}
                  className="flex items-center text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <Mail className="w-4 h-4 mr-1" />
                  Email
                </a>
              )}
            </div>

            <p className="text-slate-600 dark:text-slate-300 mt-4 leading-relaxed max-w-2xl">
              {profileData.bio ||
                "Passionate developer with expertise in modern web technologies and software architecture."}
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-3 mt-6">
              {profileData.linkedin && (
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                >
                  <a
                    href={profileData.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    <Linkedin className="w-4 h-4 mr-2" />
                    LinkedIn
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </Button>
              )}
              {profileData.github && (
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                >
                  <a
                    href={profileData.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    <Github className="w-4 h-4 mr-2" />
                    GitHub
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-8 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:dark:bg-slate-700 rounded-lg"
            >
              <Briefcase className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="skills"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:dark:bg-slate-700 rounded-lg"
            >
              <Code className="w-4 h-4 mr-2" />
              Skills
            </TabsTrigger>
            <TabsTrigger
              value="certifications"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:dark:bg-slate-700 rounded-lg"
            >
              <Award className="w-4 h-4 mr-2" />
              Certifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants} className="lg:col-span-2">
                <Card className="border-0 shadow-lg">
                  <CardHeader className="bg-slate-50 dark:bg-slate-800/50 rounded-t-lg">
                    <CardTitle className="flex items-center">
                      <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
                      Professional Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
                      {profileData.bio ||
                        "Experienced software developer with a passion for creating innovative solutions and solving complex problems. Strong background in full-stack development and system architecture."}
                    </p>

                    <div className="mt-8">
                      <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-4 flex items-center">
                        <span className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg mr-3">
                          <Globe className="w-5 h-5 text-blue-600" />
                        </span>
                        Experience Highlights
                      </h3>
                      <ul className="space-y-3">
                        {[
                          "4+ years in IT infrastructure and full-stack development",
                          "Configured, maintained, and secured enterprise-level network infrastructures",
                          "Implemented automation scripts using Python and Bash",
                          "Led network security assessments and firewall configuration",
                        ].map((item, index) => (
                          <motion.li
                            key={index}
                            className="flex items-start text-slate-700 dark:text-slate-300"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                          >
                            <span className="text-blue-500 mr-3 mt-1">•</span>
                            <span>{item}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader className="bg-slate-50 dark:bg-slate-800/50 rounded-t-lg">
                    <CardTitle className="flex items-center">
                      <Globe className="w-5 h-5 mr-2 text-green-600" />
                      Languages
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {Array.isArray(profileData.languages) &&
                      profileData.languages.length > 0 ? (
                        profileData.languages
                          .filter(isLanguage)
                          .map((language, index) => (
                            <div
                              key={language.id || `language-${index}`}
                              className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
                            >
                              <span className="font-medium text-slate-800 dark:text-slate-200">
                                {language.name}
                              </span>
                              <Badge
                                variant="secondary"
                                className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                              >
                                {language.proficiency}
                              </Badge>
                            </div>
                          ))
                      ) : (
                        <div className="text-center py-4">
                          <div className="bg-slate-100 dark:bg-slate-700 rounded-full p-3 w-12 h-12 flex items-center justify-center mx-auto mb-3">
                            <Globe className="w-6 h-6 text-slate-400" />
                          </div>
                          <p className="text-slate-500 dark:text-slate-400">
                            No languages added
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader className="bg-slate-50 dark:bg-slate-800/50 rounded-t-lg">
                    <CardTitle className="flex items-center">
                      <GraduationCap className="w-5 h-5 mr-2 text-purple-600" />
                      Education
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                        <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                          Certificate in Software Engineering
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          ALX Africa • 2024
                        </p>
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                        <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                          BSc in Computer Science
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          International University of Africa • 2018
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>

          <TabsContent value="skills">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {Array.isArray(profileData.skill_categories) &&
              profileData.skill_categories.length > 0 ? (
                profileData.skill_categories
                  .filter(isSkillCategory)
                  .map((category, index) => {
                    const IconComponent =
                      skillCategoryIcons[category.name.toLowerCase()] ||
                      skillCategoryIcons.default;
                    return (
                      <motion.div
                        key={category.id || `category-${index}`}
                        variants={itemVariants}
                      >
                        <Card className="border-0 shadow-lg h-full">
                          <CardHeader className="bg-slate-50 dark:bg-slate-800/50 rounded-t-lg">
                            <CardTitle className="flex items-center">
                              <span className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg mr-3">
                                <IconComponent className="w-5 h-5 text-blue-600" />
                              </span>
                              {category.name}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-6">
                            <div className="space-y-4">
                              {category.skills?.map((skill, skillIndex) => (
                                <div key={skill.id || `skill-${skillIndex}`}>
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                      {skill.name}
                                    </span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                      {skill.level}%
                                    </span>
                                  </div>
                                  <Progress
                                    value={skill.level}
                                    className="h-2 bg-slate-200 dark:bg-slate-700"
                                  >
                                    <div
                                      className={`h-full rounded-full ${
                                        skill.level >= 80
                                          ? "bg-green-500"
                                          : skill.level >= 60
                                            ? "bg-blue-500"
                                            : skill.level >= 40
                                              ? "bg-yellow-500"
                                              : "bg-red-500"
                                      }`}
                                    />
                                  </Progress>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })
              ) : (
                <motion.div className="col-span-2" variants={itemVariants}>
                  <Card className="border-0 shadow-lg">
                    <CardContent className="py-12 text-center">
                      <div className="bg-slate-100 dark:bg-slate-700 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <Code className="w-8 h-8 text-slate-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        No skills added yet
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400">
                        Skills will be displayed here once added to your
                        profile.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          </TabsContent>

          <TabsContent value="certifications">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-slate-50 dark:bg-slate-800/50 rounded-t-lg">
                  <CardTitle className="flex items-center">
                    <Award className="w-5 h-5 mr-2 text-amber-600" />
                    Certifications & Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Array.isArray(profileData.certifications) &&
                    profileData.certifications.length > 0 ? (
                      profileData.certifications
                        .filter(isCertification)
                        .map((certification, index) => (
                          <motion.div
                            key={certification.id || `cert-${index}`}
                            variants={itemVariants}
                            whileHover="hover"
                            className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-800/70 p-5 rounded-xl border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:shadow-md"
                          >
                            <div className="flex items-start">
                              <div
                                className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${
                                  certification.in_progress
                                    ? "bg-amber-100 dark:bg-amber-900/30"
                                    : "bg-green-100 dark:bg-green-900/30"
                                }`}
                              >
                                <Award
                                  className={`w-6 h-6 ${
                                    certification.in_progress
                                      ? "text-amber-600 dark:text-amber-400"
                                      : "text-green-600 dark:text-green-400"
                                  }`}
                                />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center">
                                  {certification.title}
                                  {certification.in_progress && (
                                    <Badge className="ml-2 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                                      In Progress
                                    </Badge>
                                  )}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 mt-1">
                                  {certification.issuer}
                                </p>
                                <div className="flex items-center mt-2 text-sm text-slate-500 dark:text-slate-400">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  {certification.date}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))
                    ) : (
                      <motion.div
                        className="col-span-2"
                        variants={itemVariants}
                      >
                        <div className="text-center py-12">
                          <div className="bg-slate-100 dark:bg-slate-700 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                            <Award className="w-8 h-8 text-slate-400" />
                          </div>
                          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            No certifications yet
                          </h3>
                          <p className="text-slate-500 dark:text-slate-400">
                            Certifications will be displayed here once added to
                            your profile.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
