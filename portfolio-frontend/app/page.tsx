// app/page.tsx
type About = {
  id: number;
  name: string;
  bio: string;
  profile_image?: string;
  skills: string;
};

export default async function Home() {
  const res = await fetch("http://127.0.0.1:8000/api/about/1/", {
    cache: "no-store",
  });
  const about: About = await res.json();

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">{about.name}</h1>
      <p className="mt-4">{about.bio}</p>
      <h2 className="text-2xl mt-6">Skills</h2>
      <ul className="list-disc ml-6">
        {about.skills.split(",").map((skill, idx) => (
          <li key={idx}>{skill.trim()}</li>
        ))}
      </ul>
    </div>
  );
}
