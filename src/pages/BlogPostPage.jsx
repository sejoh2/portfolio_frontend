import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CalendarDays, Check, Clock, Link2 } from "lucide-react";
import { fetchPost } from "../lib/portfolio";
import { formatPostDate, readingTime } from "../lib/blog";
import Markdown from "../components/Markdown";

const ArrowLeftIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M19 12H5" />
    <path d="m12 19-7-7 7-7" />
  </svg>
);

const setMetaDescription = (text) => {
  let meta = document.querySelector('meta[name="description"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "description";
    document.head.appendChild(meta);
  }
  meta.content = text;
};

const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(undefined); // undefined = loading, null = not found
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchPost(slug)
      .then((result) => {
        setPost(result);
        if (result) {
          document.title = `${result.title} · Joseph Kyalo`;
          if (result.excerpt) setMetaDescription(result.excerpt);
        }
      })
      .catch(() => setPost(null));
  }, [slug]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked: ignore */
    }
  };

  const shareUrl = encodeURIComponent(typeof window !== "undefined" ? window.location.href : "");

  return (
    <div
      className="min-h-screen bg-gray-100"
      style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}
    >
      <main className="mx-auto max-w-3xl px-5 sm:px-8 pt-14 pb-20">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeftIcon />
          All posts
        </Link>

        {post === undefined && <p className="mt-10 text-gray-500">Loading…</p>}

        {post === null && (
          <div className="mt-10 rounded-xl border border-gray-200 bg-white px-6 py-14 text-center">
            <h1 className="text-xl font-semibold text-gray-900">Post not found</h1>
            <p className="mt-2 text-sm text-gray-500">It may have been moved or unpublished.</p>
            <Link to="/blog" className="mt-6 inline-block rounded-full bg-orange-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-orange-600">
              Browse all posts
            </Link>
          </div>
        )}

        {post && (
          <article className="mt-8">
            {(post.tags || []).length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="rounded-md bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-700">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl">{post.title}</h1>
            {post.excerpt && <p className="mt-4 text-lg leading-relaxed text-gray-600">{post.excerpt}</p>}

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-gray-200 py-4 text-sm text-gray-500">
              <span className="font-medium text-gray-900">Joseph Kyalo</span>
              {post.published_at && (
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" /> {formatPostDate(post.published_at)}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> {readingTime(post.content)} min read
              </span>
            </div>

            {post.cover_image_url && (
              <img src={post.cover_image_url} alt="" className="mt-8 w-full rounded-2xl border border-gray-200 object-cover" />
            )}

            <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 sm:p-10">
              <Markdown>{post.content}</Markdown>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-5">
              <p className="text-sm font-medium text-gray-900">Found this useful? Share it.</p>
              <div className="flex flex-wrap gap-2">
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  LinkedIn
                </a>
                <a
                  href={`https://x.com/intent/post?url=${shareUrl}&text=${encodeURIComponent(post.title)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  X
                </a>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`${post.title} ${decodeURIComponent(shareUrl)}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  WhatsApp
                </a>
                <button
                  type="button"
                  onClick={copyLink}
                  className="inline-flex items-center gap-1.5 rounded-md bg-gray-900 px-3 py-2 text-xs font-semibold text-white hover:bg-gray-800"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
                  {copied ? "Copied" : "Copy link"}
                </button>
              </div>
            </div>

            <div className="mt-8 rounded-xl bg-gray-900 p-6 text-center sm:p-8">
              <p className="text-lg font-semibold text-white">Building something similar?</p>
              <p className="mt-1 text-sm text-gray-400">I'm open to roles and projects in fintech, mobile and AI.</p>
              <a href="/#contact" className="mt-5 inline-block rounded-full bg-orange-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-orange-600">
                Get in touch
              </a>
            </div>
          </article>
        )}
      </main>
    </div>
  );
};

export default BlogPostPage;
