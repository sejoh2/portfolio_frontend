import { useState, useEffect } from "react";
import {
  Database,
  Code2,
  Lightbulb,
  Smartphone,
  Brain,
  BarChart3,
  Globe,
  Server,
  Cloud,
  Shield,
  Workflow,
  Rocket,
  Wallet,
  Bot,
  Award,
  Download,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { Link } from "react-router-dom";
import { fetchPosts, fetchPublicPortfolio, sendContactMessage } from "../lib/portfolio";
import PostCard from "./PostCard";
import * as defaults from "../data/portfolioContent";
import ProjectCard from "./ProjectCard";
import HeroVisual from "./HeroVisual";
import { GithubIcon } from "./icons";
import { realLink } from "../lib/links";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" },
];

const TECH_LOGOS = [
  ["react", "React"],
  ["nextdotjs", "Next.js"],
  ["typescript", "TypeScript"],
  ["nodedotjs", "Node.js"],
  ["express", "Express"],
  ["python", "Python"],
  ["fastapi", "FastAPI"],
  ["flutter", "Flutter"],
  ["dart", "Dart"],
  ["postgresql", "PostgreSQL"],
  ["supabase", "Supabase"],
  ["firebase", "Firebase"],
  ["tailwindcss", "Tailwind CSS"],
  ["docker", "Docker"],
  ["githubactions", "GitHub Actions"],
  ["cloudflare", "Cloudflare"],
  ["googlegemini", "Gemini"],
  ["vite", "Vite"],
];

const COMPANY_BADGE_COLORS = ["bg-orange-50 text-orange-600", "bg-blue-50 text-blue-600", "bg-purple-50 text-purple-600"];

const getBuildIcon = (icon) => {
  const icons = {
    database: Database,
    code: Code2,
    smartphone: Smartphone,
    brain: Brain,
    "bar-chart": BarChart3,
    globe: Globe,
    server: Server,
    cloud: Cloud,
    shield: Shield,
    workflow: Workflow,
    rocket: Rocket,
    lightbulb: Lightbulb,
    wallet: Wallet,
    bot: Bot,
  };

  return icons[icon] || Code2;
};

const getIconTheme = (color) => {
  if (color === "purple") return "bg-purple-50 text-purple-600";
  if (color === "green") return "bg-green-50 text-green-600";
  if (color === "orange") return "bg-orange-50 text-orange-600";
  return "bg-blue-50 text-blue-600";
};

const getSkillTheme = (color) => {
  if (color === "purple") {
    return {
      card: "border-purple-100 bg-purple-50/70",
      badge: "border-purple-100 text-purple-700",
    };
  }

  if (color === "green") {
    return {
      card: "border-green-100 bg-green-50/80",
      badge: "border-green-100 text-green-700",
    };
  }

  return {
    card: "border-blue-100 bg-blue-50/80",
    badge: "border-blue-100 text-blue-700",
  };
};

// Database values win, but empty fields fall back to the defaults.
const mergeProfile = (row) => {
  const merged = { ...defaults.contactProfile };
  if (row) {
    Object.entries(row).forEach(([key, value]) => {
      if (value !== null && value !== "") merged[key] = value;
    });
  }
  return merged;
};

const LinkedinIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6.94 8.75H3.88V20h3.06V8.75zM5.41 4a1.78 1.78 0 1 0 0 3.56A1.78 1.78 0 0 0 5.41 4zM20.13 13.54c0-3.02-1.61-4.42-3.76-4.42a3.25 3.25 0 0 0-2.95 1.62h-.04V8.75h-2.93V20h3.05v-5.56c0-1.47.28-2.89 2.1-2.89 1.79 0 1.81 1.68 1.81 2.98V20h3.06v-6.46h-.34z" />
  </svg>
);

const XIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.4l-5.8-7.58-6.63 7.58H.48l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93Zm-1.29 19.5h2.04L6.48 3.24H4.3l13.31 17.41Z" />
  </svg>
);

const WhatsappIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.5h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88a9.82 9.82 0 0 1 6.99 2.9 9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88m8.41-18.3A11.81 11.81 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89a11.82 11.82 0 0 0-3.48-8.41" />
  </svg>
);

const SectionTitle = ({ title, subtitle }) => (
  <div className="text-center mb-12">
    <h2 className="text-3xl font-bold tracking-tight text-gray-900">{title}</h2>
    {subtitle && <p className="mt-3 text-base text-gray-500">{subtitle}</p>}
  </div>
);

const SocialLinks = ({ profile, className = "" }) => {
  const links = [
    { href: profile.github_url, label: "GitHub", Icon: GithubIcon },
    { href: profile.linkedin_url, label: "LinkedIn", Icon: LinkedinIcon },
    { href: profile.x_url, label: "X", Icon: XIcon },
    { href: profile.whatsapp_url, label: "WhatsApp", Icon: WhatsappIcon },
  ].filter((link) => realLink(link.href));

  return (
    <div className={`flex gap-2 ${className}`}>
      {links.map(({ href, label, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={label}
          title={label}
          className="grid h-10 w-10 place-items-center rounded-full border border-gray-200 bg-white text-gray-600 transition hover:border-gray-300 hover:text-gray-900"
        >
          <Icon />
        </a>
      ))}
    </div>
  );
};

const ContactForm = ({ whatsappUrl }) => {
  const [form, setForm] = useState({ name: "", email: "", message: "", website: "" });
  const [status, setStatus] = useState({ state: "idle", text: "" });
  // Bots usually submit instantly; people take a few seconds to type.
  const [openedAt] = useState(() => Date.now());

  const update = (field) => (event) => setForm({ ...form, [field]: event.target.value });

  const whatsappLink = () => {
    const text = `Hi Joseph, I'm ${form.name || "…"}${form.email ? ` (${form.email})` : ""}.\n\n${form.message}`;
    return `${whatsappUrl}?text=${encodeURIComponent(text)}`;
  };

  const submit = async (event) => {
    event.preventDefault();
    // Spam traps: the hidden "website" field is only filled in by bots, and nobody types a message in under 3 seconds.
    // Bots get the normal success message so they don't learn they were caught.
    if (form.website || Date.now() - openedAt < 3000) {
      setForm({ name: "", email: "", message: "", website: "" });
      setStatus({ state: "sent", text: "Thanks! Your message has been sent. I'll get back to you soon." });
      return;
    }
    setStatus({ state: "sending", text: "" });
    try {
      await sendContactMessage(form);
      setForm({ name: "", email: "", message: "", website: "" });
      setStatus({ state: "sent", text: "Thanks! Your message has been sent. I'll get back to you soon." });
    } catch (error) {
      const tooMany = /too many/i.test(error.message);
      setStatus({
        state: "error",
        text: tooMany
          ? "You've sent several messages already. Please wait a few minutes, or reach me on WhatsApp."
          : "Couldn't send right now. Please use WhatsApp or email instead.",
      });
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-gray-700">Name</label>
        <input id="contact-name" required maxLength={120} value={form.name} onChange={update("name")} placeholder="Your name" className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
      </div>
      <div>
        <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
        <input id="contact-email" type="email" required maxLength={200} value={form.email} onChange={update("email")} placeholder="you@example.com" className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
      </div>
      <div>
        <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-gray-700">Message</label>
        <textarea id="contact-message" required maxLength={5000} rows="4" value={form.message} onChange={update("message")} placeholder="Tell me about your project or role…" className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
      </div>

      {/* Hidden from people (and screen readers); bots fill it in. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: "1px", height: "1px", overflow: "hidden" }}>
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" tabIndex={-1} autoComplete="off" value={form.website} onChange={update("website")} />
      </div>

      <button
        type="submit"
        disabled={status.state === "sending"}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
      >
        <Mail className="w-4 h-4" />
        {status.state === "sending" ? "Sending…" : "Send Message"}
      </button>

      {realLink(whatsappUrl) && (
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <WhatsappIcon /> Send via WhatsApp instead
        </a>
      )}

      {status.text && (
        <p role="status" className={`text-sm ${status.state === "error" ? "text-red-600" : "text-green-700"}`}>
          {status.text}
        </p>
      )}
    </form>
  );
};

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [portfolioData, setPortfolioData] = useState(null);
  const [latestPosts, setLatestPosts] = useState([]);

  const currentYear = new Date().getFullYear();

  const heroImages = portfolioData?.heroImages || [];
  const buildItems = portfolioData?.buildItems?.length ? portfolioData.buildItems : defaults.buildItems;
  const skillGroups = portfolioData?.skillGroups?.length ? portfolioData.skillGroups : defaults.skillGroups;
  const educationItems = portfolioData?.education?.length ? portfolioData.education : defaults.education;
  const certifications = portfolioData?.certifications?.length ? portfolioData.certifications : defaults.certifications;
  const experienceItems = portfolioData?.experience?.length ? portfolioData.experience : defaults.experience;
  const projects = portfolioData?.projects?.length ? portfolioData.projects : defaults.projects.filter((p) => p.featured);
  const profile = mergeProfile(portfolioData?.contactProfile);

  const initials = profile.full_name.split(" ").map((part) => part[0]).slice(0, 2).join("");
  const bioParagraphs = String(profile.bio || "").split(/\n\s*\n/).filter(Boolean);
  const activeImageIndex = currentImageIndex < heroImages.length ? currentImageIndex : 0;
  const activeImage = heroImages[activeImageIndex];

  useEffect(() => {
    async function loadPortfolioData() {
      try {
        const result = await fetchPublicPortfolio();

        if (result.success) {
          setPortfolioData(result.data);
        }
      } catch (error) {
        console.error("Failed to load portfolio data:", error);
      }
    }

    loadPortfolioData();
    fetchPosts({ limit: 3 })
      .then(setLatestPosts)
      .catch(() => setLatestPosts([]));
  }, []);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";

    const revealSections = document.querySelectorAll("[data-reveal]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "none";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05 }
    );

    revealSections.forEach((section) => observer.observe(section));

    return () => {
      document.documentElement.style.scrollBehavior = "";
      observer.disconnect();
    };
  }, [portfolioData]);

  useEffect(() => {
    if (heroImages.length < 2) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + heroImages.length) % heroImages.length);
  };

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
  };

  // Gentle fade-up as sections scroll into view (vertical only, so nothing overflows sideways on mobile).
  const reveal = {
    opacity: 0,
    transform: "translateY(24px)",
    transition: "opacity 700ms ease, transform 700ms ease",
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900" style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
      <a href="#about" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-orange-500 focus:px-4 focus:py-2 focus:text-white">
        Skip to content
      </a>

      <nav className="fixed top-0 w-full bg-gray-100/90 backdrop-blur z-50 border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center h-16">
            <a href="#" className="text-lg font-semibold text-gray-900">
              {profile.full_name}
            </a>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} className="text-gray-500 hover:text-gray-900 text-sm font-medium transition-colors">
                  {link.label}
                </a>
              ))}
              {latestPosts.length > 0 && (
                <Link to="/blog" className="text-gray-500 hover:text-gray-900 text-sm font-medium transition-colors">
                  Blog
                </Link>
              )}
              {realLink(profile.cv_url) && (
                <a
                  href={profile.cv_url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-orange-500 px-4 py-1.5 text-sm font-medium text-orange-600 hover:bg-orange-50"
                >
                  Resume
                </a>
              )}
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100">
              <div className="flex flex-col space-y-1">
                {navLinks.map((link) => (
                  <a key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className="text-gray-600 py-2 text-sm">
                    {link.label}
                  </a>
                ))}
                <Link to="/projects" onClick={() => setMobileMenuOpen(false)} className="text-gray-600 py-2 text-sm">
                  All Projects
                </Link>
                {latestPosts.length > 0 && (
                  <Link to="/blog" onClick={() => setMobileMenuOpen(false)} className="text-gray-600 py-2 text-sm">
                    Blog
                  </Link>
                )}
                {realLink(profile.cv_url) && (
                  <a href={profile.cv_url} target="_blank" rel="noreferrer" className="py-2 text-sm font-medium text-orange-600">
                    Download Resume
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero */}
      <header className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28 bg-[#eceef1]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            backgroundImage: "radial-gradient(#d1d5db 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          }}
        />
        <div aria-hidden="true" className="pointer-events-none absolute -top-32 -right-32 h-[28rem] w-[28rem] rounded-full bg-orange-200/50 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -left-32 h-[28rem] w-[28rem] rounded-full bg-blue-200/40 blur-3xl" />
        <div className="relative max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              {profile.availability && (
                <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                  </span>
                  {profile.availability}
                </span>
              )}

              <h1 className="mt-5 text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
                {profile.full_name}
              </h1>

              <p className="mt-3 text-lg sm:text-xl font-medium text-gray-700">{profile.headline}</p>

              <p className="mt-5 text-gray-600 text-base max-w-lg leading-relaxed">{profile.tagline}</p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#contact" className="bg-orange-500 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-orange-600 transition flex items-center gap-2">
                  Let's Connect
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>

                <a href="#projects" className="border border-gray-300 bg-white text-gray-900 px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-50 transition">
                  View My Work
                </a>

                {realLink(profile.cv_url) && (
                  <a href={profile.cv_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 hover:text-orange-600">
                    <Download className="w-4 h-4" /> Download CV
                  </a>
                )}
              </div>

              <SocialLinks profile={profile} className="mt-8" />
            </div>

            <div>
              {heroImages.length > 0 ? (
                <div className="relative group">
                  <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
                    <img
                      src={activeImage?.src}
                      alt={activeImage?.title || `${profile.full_name} portfolio`}
                      className="w-full aspect-[16/10] object-cover object-top transition-opacity duration-500"
                    />

                    {activeImage?.title && (
                      <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-4">
                        <p className="text-white font-semibold">{activeImage.title}</p>
                      </div>
                    )}

                    {heroImages.length > 1 && (
                      <>
                        <button
                          onClick={goToPrevious}
                          aria-label="Previous image"
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-200"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>

                        <button
                          onClick={goToNext}
                          aria-label="Next image"
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-200"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>

                  {heroImages.length > 1 && (
                    <div className="flex justify-center gap-2 mt-4">
                      {heroImages.map((image, index) => (
                        <button
                          key={image.id || index}
                          onClick={() => setCurrentImageIndex(index)}
                          aria-label={`Show image ${index + 1}`}
                          className={`h-2 rounded-full transition-all duration-200 ${
                            activeImageIndex === index ? "w-6 bg-orange-500" : "w-2 bg-gray-300 hover:bg-gray-400"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <HeroVisual
                  profile={profile}
                  photo={realLink(profile.avatar_url) || defaults.photos.hero}
                  photoCaption={defaults.photos.heroCaption}
                  currentJob={experienceItems[0]}
                  initials={initials}
                  liveUrl={defaults.projects.find((p) => p.id === "kodi")?.demo_url}
                />
              )}
            </div>
          </div>
        </div>
      </header>

      <main>
        <section aria-label="Technologies" className="marquee border-y border-gray-200 bg-gray-100 py-8">
          <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Technologies I work with</p>
          <div className="relative overflow-hidden" style={{ maskImage: "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)", WebkitMaskImage: "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)" }}>
            <ul className="flex w-max animate-marquee gap-12">
              {[...TECH_LOGOS, ...TECH_LOGOS].map(([slug, name], index) => (
                <li key={`${slug}-${index}`} className="group flex items-center gap-2.5" aria-hidden={index >= TECH_LOGOS.length}>
                  <img
                    src={`https://cdn.simpleicons.org/${slug}`}
                    alt=""
                    loading="lazy"
                    className="h-7 w-7 opacity-60 grayscale transition group-hover:opacity-100 group-hover:grayscale-0"
                  />
                  <span className="text-sm font-medium text-gray-500 transition group-hover:text-gray-900">{name}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* About */}
        <section id="about" data-reveal style={reveal} className="bg-gray-100 py-20 md:py-24 scroll-mt-16">
          <div className="max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-12">
            <SectionTitle title="About Me" subtitle="Who I am and what I build" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
              <div>
                <h3 className="mb-5 text-lg font-semibold text-gray-900">Who I am</h3>
                <div className="space-y-4 text-base leading-relaxed text-gray-600">
                  {bioParagraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                  ))}
                </div>

                {defaults.photos.about && (
                  <figure className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">
                    <img
                      src={defaults.photos.about}
                      alt={defaults.photos.aboutCaption}
                      loading="lazy"
                      onError={(event) => event.currentTarget.closest("figure").remove()}
                      className="aspect-[2/1] w-full rounded-xl object-cover object-[center_30%]"
                    />
                    <figcaption className="px-2 pt-3 pb-1 text-xs text-gray-500">{defaults.photos.aboutCaption}</figcaption>
                  </figure>
                )}
              </div>

              <div>
                <h3 className="mb-5 text-lg font-semibold text-gray-900">What I build</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {buildItems.map((item) => {
                    const Icon = getBuildIcon(item.icon);
                    return (
                      <div key={item.id || item.title} className="rounded-xl border border-gray-200 bg-white p-4 transition hover:border-gray-300 hover:shadow-sm">
                        <div className={`grid h-10 w-10 place-items-center rounded-lg ${getIconTheme(item.color)}`}>
                          <Icon className="w-5 h-5" strokeWidth={2} />
                        </div>
                        <h4 className="mt-3 text-base font-semibold text-gray-900">{item.title}</h4>
                        <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{item.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Experience */}
        <section id="experience" data-reveal style={reveal} className="bg-[#eceef1] py-20 md:py-24 scroll-mt-16">
          <div className="max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-12">
            <SectionTitle title="Experience" subtitle="My professional journey in tech" />

            <div className="space-y-4">
              {experienceItems.map((job, index) => {
                const achievements = Array.isArray(job.achievements) ? job.achievements : [];
                const technologies = Array.isArray(job.technologies) ? job.technologies : [];

                return (
                  <article
                    key={job.id || `${job.role}-${job.company}`}
                    className="grid gap-5 bg-white border border-gray-200 rounded-xl p-5 md:p-6 lg:grid-cols-[280px_1fr] lg:gap-10"
                  >
                    <div>
                      <span className={`mb-3 grid h-10 w-10 place-items-center rounded-lg text-xs font-bold ${COMPANY_BADGE_COLORS[index % COMPANY_BADGE_COLORS.length]}`}>
                        {String(job.company || "?").split(/\s+/).map((word) => word[0]).slice(0, 2).join("").toUpperCase()}
                      </span>
                      <span className="text-sm font-medium text-orange-600">{job.period}</span>
                      <h3 className="mt-2 text-lg font-semibold text-gray-900">{job.role}</h3>
                      <p className="mt-1 text-base font-semibold text-blue-600">{job.company}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-600">
                        {job.location && <span className="rounded-full bg-gray-100 px-2.5 py-1">{job.location}</span>}
                        {job.type && <span className="rounded-full bg-gray-100 px-2.5 py-1">{job.type}</span>}
                      </div>
                    </div>

                    <div>
                    {job.description && <p className="text-sm leading-relaxed text-gray-600">{job.description}</p>}

                    {achievements.length > 0 && (
                      <ul className="mt-3 space-y-1.5">
                        {achievements.map((achievement) => (
                          <li key={achievement} className="flex items-start gap-3 text-sm leading-relaxed text-gray-600">
                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" />
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    )}

                    {technologies.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {technologies.map((tech) => (
                          <span key={tech} className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    </div>
                  </article>
                );
              })}
            </div>

            {realLink(profile.cv_url) && (
              <div className="mt-10 text-center">
                <a href={profile.cv_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700">
                  <Download className="w-4 h-4" /> Download full CV
                </a>
              </div>
            )}
          </div>
        </section>

        {/* Projects */}
        <section id="projects" data-reveal style={reveal} className="bg-gray-100 py-20 md:py-24 scroll-mt-16">
          <div className="max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-12">
            <SectionTitle title="Featured Projects" subtitle="Products I've built, from fintech platforms to AI agents" />

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id || project.title} project={project} />
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link to="/projects" className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800">
                View All Projects
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Blog */}
        {latestPosts.length > 0 && (
          <section id="blog" className="border-t border-gray-200 bg-gray-100 py-20 md:py-24 scroll-mt-16">
            <div className="max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-12">
              <SectionTitle title="Latest from the Blog" subtitle="Notes on building fintech, mobile and AI products" />
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {latestPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
              <div className="mt-12 text-center">
                <Link to="/blog" className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800">
                  Read the Blog
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Skills */}
        <section id="skills" data-reveal style={reveal} className="bg-[#eceef1] py-20 md:py-24 scroll-mt-16">
          <div className="max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-12">
            <SectionTitle title="Skills" subtitle="Technologies and tools I work with" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {skillGroups.map((group) => {
                const theme = getSkillTheme(group.color);
                const skills = Array.isArray(group.skills) ? group.skills : [];

                return (
                  <div key={group.id || group.title} className={`rounded-xl border ${theme.card} p-6`}>
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">{group.title}</h3>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <span key={skill} className={`px-2.5 py-1 bg-white border ${theme.badge} rounded-md text-xs font-semibold`}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Education & certifications */}
        <section id="education" data-reveal style={reveal} className="bg-gray-100 py-20 md:py-24 scroll-mt-16">
          <div className="max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-12">
            <SectionTitle title="Education & Certifications" subtitle="Where I learned, and keep learning" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div>
                <h3 className="mb-5 text-lg font-semibold text-gray-900">Education</h3>
                <div className="space-y-3">
                  {educationItems.map((item) => (
                    <div key={item.id || `${item.title}-${item.institution}`} className="rounded-xl border border-gray-200 bg-white px-4 py-3.5">
                      <div className="flex items-start justify-between gap-4">
                        <h4 className="text-base font-semibold text-gray-900">{item.title}</h4>
                        {item.year && <span className="shrink-0 text-xs font-medium text-gray-500">{item.year}</span>}
                      </div>
                      <p className="mt-0.5 text-sm">
                        <span className="font-semibold text-blue-600">{item.institution}</span>
                        {item.location && <span className="text-gray-500"> · {item.location}</span>}
                      </p>
                      {item.description && <p className="mt-1.5 text-sm text-gray-600">{item.description}</p>}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-5 text-lg font-semibold text-gray-900">Certifications</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {certifications.map((certificate) => {
                    const image = certificate.image_url || certificate.imageUrl;
                    return (
                      <div key={certificate.id || certificate.title} className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                        {image ? (
                          <a href={image} target="_blank" rel="noreferrer" className="block h-24 overflow-hidden bg-gray-100">
                            <img src={image} alt={certificate.title} loading="lazy" className="w-full h-full object-cover" />
                          </a>
                        ) : (
                          <div className="grid h-24 place-items-center bg-linear-to-br from-orange-50 to-gray-50">
                            <Award className="w-7 h-7 text-orange-400" />
                          </div>
                        )}
                        <div className="px-4 py-3">
                          <h4 className="text-sm font-semibold text-gray-900">{certificate.title}</h4>
                          <p className="mt-1 text-xs font-semibold text-blue-600">{certificate.issuer}</p>
                          {certificate.year && <p className="mt-1 text-xs text-gray-500">{certificate.year}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" data-reveal style={reveal} className="bg-[#eceef1] py-20 md:py-24 scroll-mt-16">
          <div className="max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-12">
            <SectionTitle title="Let's Connect" subtitle="Hiring, have a project in mind, or just want to talk tech? I'd love to hear from you." />

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              <div className="md:col-span-2 space-y-4">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-5">Contact Info</h3>

                  <ul className="space-y-4 text-sm text-gray-700">
                    <li>
                      <a href={`mailto:${profile.email}`} className="flex items-center gap-3 hover:text-blue-600">
                        <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-blue-600"><Mail className="w-4 h-4" /></span>
                        <span className="break-all">{profile.email}</span>
                      </a>
                    </li>
                    {profile.phone && (
                      <li>
                        <a href={`tel:${profile.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 hover:text-blue-600">
                          <span className="grid h-9 w-9 place-items-center rounded-lg bg-green-50 text-green-600"><Phone className="w-4 h-4" /></span>
                          {profile.phone}
                        </a>
                      </li>
                    )}
                    <li className="flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-lg bg-purple-50 text-purple-600"><MapPin className="w-4 h-4" /></span>
                      {profile.location}
                    </li>
                  </ul>

                  <div className="border-t border-gray-200 mt-6 pt-5">
                    <SocialLinks profile={profile} />
                  </div>
                </div>

                {profile.github_username && (
                  <a
                    href={profile.github_url || `https://github.com/${profile.github_username}`}
                    target="_blank"
                    rel="noreferrer"
                    className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300"
                  >
                    <p className="text-xs font-medium text-gray-700 mb-3">GitHub contributions</p>
                    <img
                      src={`https://ghchart.rshah.org/${profile.github_username}`}
                      alt={`GitHub contribution chart for ${profile.github_username}`}
                      loading="lazy"
                      className="w-full"
                    />
                  </a>
                )}
              </div>

              <div className="md:col-span-3 bg-white border border-gray-200 rounded-xl p-6 md:p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-5">Send a Message</h3>
                <ContactForm whatsappUrl={profile.whatsapp_url} />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-950 text-gray-400">
        <div className="max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-12 pt-10 pb-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-orange-500 text-sm font-bold text-white">{initials}</span>
                <span className="text-lg font-semibold text-white">{profile.footer_name}</span>
              </div>
              <p className="mt-3 max-w-sm text-sm leading-relaxed">{profile.footer_tagline}</p>
              <div className="mt-4 flex gap-2">
                {[
                  { href: profile.github_url, label: "GitHub", Icon: GithubIcon },
                  { href: profile.linkedin_url, label: "LinkedIn", Icon: LinkedinIcon },
                  { href: profile.x_url, label: "X", Icon: XIcon },
                  { href: profile.whatsapp_url, label: "WhatsApp", Icon: WhatsappIcon },
                ]
                  .filter((link) => realLink(link.href))
                  .map(({ href, label, Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={label}
                      className="grid h-9 w-9 place-items-center rounded-lg border border-gray-800 text-gray-400 transition hover:border-gray-600 hover:text-white"
                    >
                      <Icon />
                    </a>
                  ))}
              </div>
            </div>

            <div className="lg:col-span-3">
              <h3 className="text-sm font-semibold text-white">Navigate</h3>
              <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="hover:text-white">{link.label}</a>
                  </li>
                ))}
                {latestPosts.length > 0 && (
                  <li>
                    <Link to="/blog" className="hover:text-white">Blog</Link>
                  </li>
                )}
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h3 className="text-sm font-semibold text-white">Contact</h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li><a href={`mailto:${profile.email}`} className="break-all hover:text-white">{profile.email}</a></li>
                {profile.phone && (
                  <li><a href={`tel:${profile.phone.replace(/\s/g, "")}`} className="hover:text-white">{profile.phone}</a></li>
                )}
                <li>{profile.location}</li>
              </ul>
            </div>

            <div className="lg:col-span-3">
              <h3 className="text-sm font-semibold text-white">Let's work together</h3>
              <p className="mt-3 text-sm leading-relaxed">Have a role or project in mind? I usually reply within a day.</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a href="#contact" className="rounded-full bg-orange-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-orange-600">
                  Get in touch
                </a>
                {realLink(profile.cv_url) && (
                  <a href={profile.cv_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-gray-700 px-5 py-2.5 text-sm font-medium text-gray-200 hover:border-gray-500">
                    <Download className="w-4 h-4" /> CV
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-gray-800 pt-5 text-sm sm:flex-row sm:items-center sm:justify-between">
            <p>© {currentYear} {profile.full_name}. All rights reserved.</p>
            <a href="#" className="inline-flex items-center gap-1.5 hover:text-white">
              Back to top
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path d="m18 15-6-6-6 6" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
