type BlogPost = {
  id: number;
  title: string;
  slug: string;
  content: string;
  created_at: string;
};

export default async function BlogPage() {
  const res = await fetch("http://127.0.0.1:8000/api/blog/", {
    cache: "no-store",
  });
  const posts: BlogPost[] = await res.json();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Blog</h1>
      {posts.map((post) => (
        <div key={post.id} className="mb-6 border-b pb-4">
          <h2 className="text-xl font-semibold">{post.title}</h2>
          <p className="text-gray-600 text-sm">
            {new Date(post.created_at).toLocaleDateString()}
          </p>
          <p className="mt-2">{post.content.slice(0, 200)}...</p>
        </div>
      ))}
    </div>
  );
}
