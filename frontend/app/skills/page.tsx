"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  FaReact,
  FaNodeJs,
  FaAws,
  FaPython,
  FaDocker,
} from "react-icons/fa";
import {
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiExpress,
  SiPandas,
} from "react-icons/si";

// Skill icon map
const skillIcons: Record<string, JSX.Element> = {
  React: <FaReact className="text-blue-500" />,
  "Next.js": <SiNextdotjs className="text-black dark:text-white" />,
  TypeScript: <SiTypescript className="text-blue-600" />,
  "Tailwind CSS": <SiTailwindcss className="text-cyan-500" />,
  "Node.js": <FaNodeJs className="text-green-600" />,
  Express: <SiExpress className="text-gray-700 dark:text-gray-300" />,
  Python: <FaPython className="text-yellow-500" />,
  "REST APIs": <FaNodeJs className="text-orange-500" />,
  AWS: <FaAws className="text-orange-400" />,
  Docker: <FaDocker className="text-blue-400" />,
  "Load Balancing": <FaAws className="text-gray-500" />,
  "Server Architecture": <FaAws className="text-gray-500" />,
  Pandas: <SiPandas className="text-black dark:text-white" />,
  "Data Visualization": <FaPython className="text-teal-600" />,
  "Statistical Analysis": <FaPython className="text-purple-500" />,
};

const skillsData = [
  {
    category: "Frontend",
    skills: [
      { name: "React", level: 85 },
      { name: "Next.js", level: 80 },
      { name: "TypeScript", level: 75 },
      { name: "Tailwind CSS", level: 90 },
    ],
  },
  {
    category: "Backend",
    skills: [
      { name: "Node.js", level: 80 },
      { name: "Express", level: 75 },
      { name: "Python", level: 70 },
      { name: "REST APIs", level: 85 },
    ],
  },
  {
    category: "Cloud & DevOps",
    skills: [
      { name: "AWS", level: 75 },
      { name: "Docker", level: 65 },
      { name: "Load Balancing", level: 70 },
      { name: "Server Architecture", level: 75 },
    ],
  },
  {
    category: "Data Science",
    skills: [
      { name: "Python", level: 70 },
      { name: "Pandas", level: 60 },
      { name: "Data Visualization", level: 65 },
      { name: "Statistical Analysis", level: 60 },
    ],
  },
];

export default function SkillsPage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-2">🚀 Skills & Technologies</h1>
        <p className="text-muted-foreground text-lg">
          A visual overview of my current stack and learning journey.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {skillsData.map((category) => (
          <Card key={category.category}>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                📂 {category.category}
              </CardTitle>
              <CardDescription>
                Proficiency in {category.category.toLowerCase()} tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {category.skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2">
                        {skillIcons[skill.name] && (
                          <span className="text-xl">{skillIcons[skill.name]}</span>
                        )}
                        <span className="text-sm font-medium">{skill.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {skill.level}%
                      </span>
                    </div>
                    <Progress value={skill.level} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-10">
        <CardHeader>
          <CardTitle className="text-xl">🎓 Certification Progress</CardTitle>
          <CardDescription>
            Currently pursuing industry certifications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">
                  AWS Solutions Architect
                </span>
                <span className="text-xs text-muted-foreground">70%</span>
              </div>
              <Progress value={70} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Expected completion: End of September
              </p>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Data Science</span>
                <span className="text-xs text-muted-foreground">30%</span>
              </div>
              <Progress value={30} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Expected completion: End of February
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
