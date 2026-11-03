import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PenLine } from "lucide-react";
import { fetchPosts } from "../lib/portfolio";
import PostCard from "../components/PostCard";

const ArrowLeftIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M19 12H5" />
    <path d="m12 19-7-7 7-7" />
  </svg>
);

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tag, setTag] = useState("All");

  useEffect(() => {
    document.title = "Blog · Joseph Kyalo";
    window.scrollTo(0, 0);
    fetchPosts()
      .then(setPosts)
      .catch((error) => console.error("Failed to load posts:", error))
      .finally(() => setLoading(false));
  }, []);

  const tags = ["All", ...new Set(posts.flatMap((post) => post.tags || []))];
  const shown = tag === "All" ? posts : posts.filter((post) => (post.tags || []).includes(tag));

  return (
    <div
      className="min-h-screen bg-gray-100"
      style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}
    >
      <main className="max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-12 pt-14 pb-20">
        <header className="mb-10">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm">
            <ArrowLeftIcon />
            Back to Home
          </Link>

          <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">Blog</h1>
          <p className="mt-2 max-w-2xl text-gray-500">
            Notes on building fintech, mobile and AI products: what worked, what broke, and what I learned.
          </p>

          {tags.length > 2 && (
            <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter posts by tag">
              {tags.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setTag(item)}
                  aria-pressed={tag === item}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                    tag === item ? "border-orange-500 bg-orange-500 text-white" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </header>

        {loading ? (
          <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600">Loading posts...</div>
        ) : shown.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-orange-50 text-orange-500">
              <PenLine className="h-6 w-6" />
            </span>
            <h2 className="mt-4 text-lg font-semibold text-gray-900">Posts are on the way</h2>
            <p className="mt-1 text-sm text-gray-500">Check back soon for articles on fintech, mobile and AI engineering.</p>
          </div>
        ) : (
          <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {shown.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </section>
        )}
      </main>
    </div>
  );
};

export default BlogPage;
