import { Link } from "react-router-dom";
import { CalendarDays, Clock, PenLine } from "lucide-react";
import { formatPostDate, readingTime } from "../lib/blog";

// Blog post preview card, used on the home page and the /blog page.
const PostCard = ({ post }) => {
  const tags = Array.isArray(post.tags) ? post.tags : [];

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
      <Link to={`/blog/${post.slug}`} className="relative block h-44 overflow-hidden bg-gray-100" tabIndex={-1} aria-hidden="true">
        {post.cover_image_url ? (
          <img
            src={post.cover_image_url}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-orange-50 via-gray-50 to-blue-50">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-orange-500 shadow-sm">
              <PenLine className="h-6 w-6" />
            </span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-4 text-xs text-gray-500">
          {post.published_at && (
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" /> {formatPostDate(post.published_at)}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" /> {readingTime(post.content)} min read
          </span>
        </div>

        <h3 className="mt-3 text-lg font-semibold leading-snug text-gray-900">
          <Link to={`/blog/${post.slug}`} className="hover:text-blue-600">
            {post.title}
          </Link>
        </h3>
        {post.excerpt && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-600">{post.excerpt}</p>}

        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.slice(0, 4).map((tag) => (
              <span key={tag} className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                {tag}
              </span>
            ))}
          </div>
        )}

        <Link to={`/blog/${post.slug}`} className="mt-auto pt-5 text-sm font-semibold text-orange-600 hover:text-orange-700">
          Read article →
        </Link>
      </div>
    </article>
  );
};

export default PostCard;
