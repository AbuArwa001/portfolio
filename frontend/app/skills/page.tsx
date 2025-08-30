"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

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
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Skills & Technologies</h1>
        <p className="text-muted-foreground">
          A comprehensive overview of my technical skills and proficiency
          levels.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {skillsData.map((category) => (
          <Card key={category.category}>
            <CardHeader>
              <CardTitle>{category.category}</CardTitle>
              <CardDescription>
                Proficiency in {category.category.toLowerCase()} technologies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {category.skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">{skill.name}</span>
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

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Certification Progress</CardTitle>
          <CardDescription>
            Current progress on professional certifications
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
