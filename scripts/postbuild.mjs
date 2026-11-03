// Runs after `vite build`. Makes shared links look good and helps search engines:
//  - dist/index.html: absolute link-preview tags (WhatsApp, LinkedIn and X need full URLs)
//  - dist/projects/, dist/blog/ and dist/blog/<slug>/index.html: page-specific titles, descriptions
//    and preview images, so a shared blog post shows its own title and cover
//  - dist/sitemap.xml and dist/robots.txt
// Needs VITE_SITE_URL (e.g. https://josephkyalo.dev). Blog posts are read from Supabase when it is configured.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "vite";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const env = { ...loadEnv("production", root, ""), ...process.env };
const siteUrl = (env.VITE_SITE_URL || "").replace(/\/+$/, "");

const SITE_NAME = "Joseph Kyalo";
const DEFAULT_DESCRIPTION =
  "Joseph Kyalo is a Nairobi-based software engineer building fintech platforms, M-Pesa integrations, Flutter apps and AI agents for SACCOs, landlords and small businesses.";
const DEFAULT_IMAGE = "/og-image.jpg";

const escapeHtml = (text) =>
  String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const absolute = (url) => (!url ? "" : /^https?:\/\//.test(url) ? url : siteUrl ? `${siteUrl}${url.startsWith("/") ? "" : "/"}${url}` : url);

const template = readFileSync(join(dist, "index.html"), "utf8");

// Rebuilds the <head> link-preview block for one page.
function renderPage({ path, title, description, image, type = "website" }) {
  const url = absolute(path);
  const tags = [
    `<meta name="description" content="${escapeHtml(description)}" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:type" content="${type}" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:image" content="${escapeHtml(absolute(image || DEFAULT_IMAGE))}" />`,
    `<meta property="og:image:alt" content="${escapeHtml(title)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(absolute(image || DEFAULT_IMAGE))}" />`,
    url ? `<meta property="og:url" content="${escapeHtml(url)}" />` : "",
    url ? `<link rel="canonical" href="${escapeHtml(url)}" />` : "",
  ].filter(Boolean);

  return template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
    // drop the preview tags from index.html; the full set is added below
    .replace(/\s*<meta (name|property)="(description|og:[^"]+|twitter:[^"]+)"[^>]*\/?>/g, "")
    .replace(/\s*<link rel="canonical"[^>]*\/?>/g, "")
    .replace("</head>", `    ${tags.join("\n    ")}\n  </head>`);
}

function writePage(path, html) {
  const file = path === "/" ? join(dist, "index.html") : join(dist, path, "index.html");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}

async function fetchPosts() {
  const url = env.VITE_SUPABASE_URL;
  const key = env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return [];
  try {
    const response = await fetch(
      `${url}/rest/v1/posts?select=slug,title,excerpt,cover_image_url,published_at,updated_at&published=eq.true&order=published_at.desc`,
      { headers: { apikey: key } }
    );
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn(`[postbuild] Could not load blog posts (${error.message}); building without post pages.`);
    return [];
  }
}

const posts = await fetchPosts();

const pages = [
  { path: "/", title: `${SITE_NAME} · Software Engineer`, description: DEFAULT_DESCRIPTION, priority: "1.0" },
  { path: "/projects", title: `All Projects · ${SITE_NAME}`, description: "Fintech platforms, AI agents, mobile apps and more, built by Joseph Kyalo.", priority: "0.8" },
  ...(posts.length
    ? [{ path: "/blog", title: `Blog · ${SITE_NAME}`, description: "Notes on building fintech, mobile and AI products in Kenya.", priority: "0.8" }]
    : []),
  ...posts.map((post) => ({
    path: `/blog/${post.slug}`,
    title: `${post.title} · ${SITE_NAME}`,
    description: post.excerpt || DEFAULT_DESCRIPTION,
    image: post.cover_image_url || DEFAULT_IMAGE,
    type: "article",
    lastmod: (post.updated_at || post.published_at || "").slice(0, 10),
    priority: "0.7",
  })),
];

for (const page of pages) writePage(page.path, renderPage(page));

// Search engines
const robots = ["User-agent: *", "Allow: /", "Disallow: /admin", ""];
if (siteUrl) {
  const today = new Date().toISOString().slice(0, 10);
  const urls = pages
    .map(
      (page) =>
        `  <url>\n    <loc>${escapeHtml(siteUrl + (page.path === "/" ? "/" : page.path))}</loc>\n    <lastmod>${page.lastmod || today}</lastmod>\n    <priority>${page.priority}</priority>\n  </url>`
    )
    .join("\n");
  writeFileSync(join(dist, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
  robots.push(`Sitemap: ${siteUrl}/sitemap.xml`, "");
} else {
  console.warn("[postbuild] VITE_SITE_URL is not set: link previews use relative image URLs and no sitemap is written.");
}
writeFileSync(join(dist, "robots.txt"), robots.join("\n"));

console.log(`[postbuild] ${pages.length} pages with link previews${siteUrl ? `, sitemap.xml for ${siteUrl}` : ""}, robots.txt`);
