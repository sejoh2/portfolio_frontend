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
} from "lucide-react";
import { Link } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const fallbackHeroImages = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=600&h=400&fit=crop",
    alt: "Software Developer coding",
    title: "Software Developer",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
    alt: "Data Scientist analyzing data",
    title: "Data Scientist",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop",
    alt: "AI & Machine Learning",
    title: "AI & Machine Learning",
  },
];

const fallbackBuildItems = [
  {
    id: "data-science",
    title: "Data Science",
    description: "Data analysis, machine learning, and data-pipelines.",
    icon: "database",
    color: "purple",
  },
  {
    id: "software-development",
    title: "Software Development",
    description: "Scalable, efficient, and reliable software solution.",
    icon: "code",
    color: "blue",
  },
  {
    id: "mobile-app-development",
    title: "Mobile App Development",
    description: "Scalable, efficient, and reliable software solution.",
    icon: "code",
    color: "blue",
  },
  {
    id: "problem-solving",
    title: "Problem Solving",
    description: "Innovative solutions for complex challenges.",
    icon: "lightbulb",
    color: "green",
  },
];

const fallbackSkillGroups = [
  {
    id: "data-skills",
    title: "Data Science & Analytics",
    color: "purple",
    skills: ["Python", "Machine Learning", "TensorFlow", "Pandas", "NumPy", "Power BI", "Scikit-learn"],
  },
  {
    id: "software-skills",
    title: "Software Development",
    color: "blue",
    skills: ["React", "Node.js", "Tailwind CSS", "JavaScript", "Firebase"],
  },
  {
    id: "tools",
    title: "Tools",
    color: "green",
    skills: ["Git", "Docker", "AWS", "Google Cloud", "PostgreSQL", "Jupyter", "VS Code"],
  },
];

const fallbackEducation = [
  {
    id: "cs50",
    title: "Computer Science",
    institution: "Harvard University (CS50)",
    year: "2023",
    location: "Massachusetts, USA",
    description: "CS50 Computer Science Certificate covering programming fundamentals and algorithms.",
  },
  {
    id: "zetech",
    title: "Bachelors in Software Development",
    institution: "Zetech University",
    year: "2023",
    location: "Nairobi, Kenya",
    description: "Software development.",
  },
  {
    id: "plp",
    title: "Software Development",
    institution: "Power Learn Project",
    year: "2023",
    location: "Nairobi, Kenya",
    description: "Software engineering with focus on problem-solving and clean code practices.",
  },
  {
    id: "luxdev",
    title: "Data Science",
    institution: "LUXDEV HQ",
    year: "2025",
    location: "Nairobi, Kenya",
    description: "Data Science, Data Engineering.",
  },
];

const fallbackCertifications = [
  {
    id: "software-cert",
    title: "Software Professional Certificate",
    issuer: "Power Learn Project",
    year: "2024",
    imageUrl: "https://i.postimg.cc/DySP6rrf/Screenshot-2026-06-13-063130.png",
  },
  {
    id: "security-cert",
    title: "Data Security Certification",
    issuer: "CISCO academy",
    year: "2023",
    imageUrl: "https://i.postimg.cc/KvT07Xhg/Screenshot-2026-06-13-063540.png",
  },
];

const fallbackExperience = [
  {
    id: "data-scientist",
    role: "Data Scientist",
    company: "goCode softwares",
    period: "2023 - Present",
    location: "Remote",
    type: "Full-time",
    description: "Leading data science initiatives and building machine learning models that drive business decisions.",
    achievements: [
      "Built ML models that increased customer retention by 25%",
      "Leading team of junior data scientists",
      "Implemented real-time analytics dashboard",
    ],
    technologies: ["Python", "TensorFlow", "GIT", "Power BI", "React", "PostgreSQL"],
  },
  {
    id: "data-analyst",
    role: "Data Analyst",
    company: "Data Science East Africa",
    period: "2023 - Present",
    location: "Remote",
    type: "Full-time",
    description: "Analyzing data and delivering actionable insights to support decision-making.",
    achievements: [
      "Developed interactive dashboards for data visualization",
      "Collaborated with cross-functional teams",
      "Automated ETL workflows using Python and SQL",
    ],
    technologies: ["Python", "SQL", "Power BI", "Tableau", "Excel", "Git"],
  },
];

const fallbackProjects = [
  {
    id: "kweli-rentals",
    title: "Kweli_Rentals Mobile App",
    description: "A mobile app which brings together Landlords, Agents, Movers and Home Finders to solve the hectic house hunting exeperience in Kenya",
    imageUrl: "https://i.postimg.cc/5y6RWjrC/image.png",
    category: "Mobile Development",
    tags: ["Flutter", "Node.js (Express.js)", "Mobile Development", "PostgreSQL"],
    demoUrl: "#",
    codeUrl: "#",
  },
  {
    id: "pm-furniture",
    title: "PM- Furniture E-commerce",
    description: "An E-commerce website which displays client's products and work to clients, SEO integrated, ",
    imageUrl: "https://i.postimg.cc/3xnfNXHg/image.png",
    category: "Web Development",
    tags: ["React", "Firebase", "Sanity CMS"],
    demoUrl: "https://effervescent-flan-877211.netlify.app/",
    codeUrl: "https://github.com/joseh33/pm-furniture-website",
  },
];

const fallbackContactProfile = {
  email: "kyalojoseph505@gmail.com",
  phone: "+254 738 899 264",
  location: "Nairobi, Kenya",
  githubUrl: "https://github.com/sejoh2",
  github_url: "https://github.com/sejoh2",
  linkedinUrl: "https://www.linkedin.com/in/joseph-kyalo-051778349/",
  linkedin_url: "https://www.linkedin.com/in/joseph-kyalo-051778349/",
  xUrl: "https://x.com/Mksejoh",
  x_url: "https://x.com/Mksejoh",
  githubUsername: "Prime-victor",
  github_username: "Prime-victor",
  whatsappUrl: "https://wa.me/254738899264",
  whatsapp_url: "https://wa.me/254738899264",
  footerName: "Dev Kyalo",
  footer_name: "Dev Kyalo",
  footerTagline: "Building the future through data and software",
  footer_tagline: "Building the future through data and software",
};

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Education", href: "#education" },
  { label: "Experience", href: "#experience" },
  { label: "Work", href: "#projects" },
  { label: "All Projects", href: "/projects" },
  { label: "Contact", href: "#contact" },
];

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
  };

  return icons[icon] || Code2;
};

const getIconColor = (color) => {
  if (color === "purple") return "text-purple-600";
  if (color === "green") return "text-green-600";
  return "text-blue-600";
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

const normalizeHeroImages = (items) => {
  if (!items?.length) return fallbackHeroImages;

  return items.map((item, index) => ({
    ...item,
    src: item.src,
    alt: fallbackHeroImages[index]?.alt || "Portfolio hero image",
    title: fallbackHeroImages[index]?.title || "Portfolio",
  }));
};

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [portfolioData, setPortfolioData] = useState(null);

  const currentYear = new Date().getFullYear();

  const heroImages = normalizeHeroImages(portfolioData?.heroImages);
  const buildItems = portfolioData?.buildItems?.length ? portfolioData.buildItems : fallbackBuildItems;
  const skillGroups = portfolioData?.skillGroups?.length ? portfolioData.skillGroups : fallbackSkillGroups;
  const educationItems = portfolioData?.education?.length ? portfolioData.education : fallbackEducation;
  const certifications = portfolioData?.certifications?.length ? portfolioData.certifications : fallbackCertifications;
  const experienceItems = portfolioData?.experience?.length ? portfolioData.experience : fallbackExperience;
  const projects = portfolioData?.projects?.length ? portfolioData.projects : fallbackProjects;
  const contactProfile = portfolioData?.contactProfile || fallbackContactProfile;

  const githubUrl = contactProfile.githubUrl || contactProfile.github_url || fallbackContactProfile.githubUrl;
  const linkedinUrl = contactProfile.linkedinUrl || contactProfile.linkedin_url || fallbackContactProfile.linkedinUrl;
  const xUrl = contactProfile.xUrl || contactProfile.x_url || fallbackContactProfile.xUrl;
  const githubUsername = contactProfile.githubUsername || contactProfile.github_username || fallbackContactProfile.githubUsername;
  const whatsappUrl = contactProfile.whatsappUrl || contactProfile.whatsapp_url || fallbackContactProfile.whatsappUrl;
  const footerName = contactProfile.footerName || contactProfile.footer_name || fallbackContactProfile.footerName;
  const footerTagline = contactProfile.footerTagline || contactProfile.footer_tagline || fallbackContactProfile.footerTagline;

  useEffect(() => {
    async function loadPortfolioData() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/public/portfolio`);
        const result = await response.json();

        if (result.success) {
          setPortfolioData(result.data);
        }
      } catch (error) {
        console.error("Failed to load portfolio data:", error);
      }
    }

    loadPortfolioData();
  }, []);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";

    const revealSections = document.querySelectorAll("[data-reveal]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateX(0)";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealSections.forEach((section) => observer.observe(section));

    return () => {
      document.documentElement.style.scrollBehavior = "";
      observer.disconnect();
    };
  }, [portfolioData]);

  useEffect(() => {
    if (!heroImages.length) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  useEffect(() => {
    if (currentImageIndex >= heroImages.length) {
      setCurrentImageIndex(0);
    }
  }, [currentImageIndex, heroImages.length]);

  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + heroImages.length) % heroImages.length);
  };

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
  };

  const revealLeft = {
    opacity: 0,
    transform: "translateX(-80px)",
    transition: "opacity 800ms ease, transform 800ms ease",
  };

  const revealRight = {
    opacity: 0,
    transform: "translateX(80px)",
    transition: "opacity 800ms ease, transform 800ms ease",
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
      <nav className="fixed top-0 w-full bg-white z-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="text-lg font-normal text-gray-900">
              Dev Kyalo
            </div>

            <div className="hidden md:flex space-x-10">
              {navLinks.map((link) =>
                link.href.startsWith("/") ? (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="text-gray-500 hover:text-gray-900 text-sm font-normal"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-gray-500 hover:text-gray-900 text-sm font-normal"
                  >
                    {link.label}
                  </a>
                )
              )}
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
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
              <div className="flex flex-col space-y-3">
                {navLinks.map((link) =>
                  link.href.startsWith("/") ? (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-gray-500 py-2 text-sm"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-gray-500 py-2 text-sm"
                    >
                      {link.label}
                    </a>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="pt-60 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="mb-2">
                <h4 className="text-2xl sm:text-3xl md:text-3xl font-medium text-gray-900 leading-tight">
                  Joseph
                </h4>
              </div>

              <div className="mb-2">
                <h4 className="text-2xl sm:text-3xl md:text-3xl font-medium text-gray-900 leading-tight">
                  Kyalo
                </h4>
              </div>

              <p className="text-gray-600 text-base max-w-md mb-8 leading-relaxed">
                Software Engineer and Data Scientist passionate about building intelligent, scalable systems.
              </p>

              <div className="flex gap-3">
                <a href="#contact" className="bg-orange-500 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-orange-600 transition flex items-center gap-2">
                  Let's Connect
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>

                <a href="#projects" className="border border-gray-300 text-gray-900 px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-50 transition">
                  View My Work
                </a>
              </div>
            </div>

            <div>
              <div className="relative group">
                <div className="relative overflow-hidden rounded-2xl shadow-lg">
                  <img
                    src={heroImages[currentImageIndex]?.src}
                    alt={heroImages[currentImageIndex]?.alt}
                    className="w-full h-64 md:h-80 object-cover transition-opacity duration-500"
                  />

                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <p className="text-white font-semibold text-lg">
                      {heroImages[currentImageIndex]?.title}
                    </p>
                  </div>

                  <button
                    onClick={goToPrevious}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <button
                    onClick={goToNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                <div className="flex justify-center gap-2 mt-3">
                  {heroImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`h-2 rounded-full transition-all duration-200 ${
                        currentImageIndex === index
                          ? "w-6 bg-orange-500"
                          : "w-2 bg-gray-300 hover:bg-gray-400"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <section id="about" data-reveal style={revealLeft} className="bg-white scroll-mt-24">
        <div className="pt-6 pb-32">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">About Me</h2>
              <p className="mt-3 text-sm text-gray-500">What I build</p>
            </div>

            <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
              {buildItems.map((item) => {
                const Icon = getBuildIcon(item.icon);
                return (
                  <div
  key={item.id || item.title}
  className="relative overflow-hidden bg-white border border-gray-200 rounded-lg p-6 text-center h-40 flex flex-col items-center justify-center group"
>
  <Icon
    className={`w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 ${getIconColor(item.color)} mb-3`}
    strokeWidth={2.5}
  />

  <h3 className="text-base font-semibold text-gray-800 mb-3">
    {item.title}
  </h3>

  <div className="relative">
    <p className="text-sm text-gray-600 leading-6 cursor-pointer">
      {item.description.length > 45
        ? `${item.description.slice(0, 45)}...`
        : item.description}
    </p>

    <div
      className="
        absolute inset-x-0 bottom-0
        bg-gray-100/95 backdrop-blur-sm
        px-4 py-3 rounded-t-lg
        translate-y-full
        opacity-0
        scale-95
        transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
        group-hover:translate-y-0
        group-hover:opacity-100
        group-hover:scale-100
        z-10
      "
    >
      <p className="text-xs text-gray-700 leading-relaxed">
        {item.description}
      </p>
    </div>
  </div>
</div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="skills" data-reveal style={revealRight} className="bg-gray-50 pt-24 pb-16 scroll-mt-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Skills</h2>
            <p className="mt-3 text-sm text-gray-500">Technologies and tools I work with</p>
          </div>

         <div className="mt-14 flex flex-wrap justify-center gap-4 max-w-6xl mx-auto">
            {skillGroups.map((group) => {
              const theme = getSkillTheme(group.color);
              const skills = Array.isArray(group.skills) ? group.skills : [];

              return (
                <div
  key={group.id || group.title}
  className={`w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)] rounded-lg border ${theme.card} p-5 text-center min-h-40`}
>
                  <h3 className="text-sm font-semibold text-gray-800 mb-4">{group.title}</h3>
                  <div className="flex flex-wrap justify-center gap-2">
                    {skills.map((skill) => (
                      <span key={skill} className={`px-2.5 py-1 bg-white border ${theme.badge} rounded text-xs font-semibold`}>
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

      <section id="education" data-reveal style={revealLeft} className="bg-white pt-4 pb-10 scroll-mt-24">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-center text-lg font-bold text-gray-900 mb-8">Education</h2>

          <div className="space-y-4">
            {educationItems.map((item) => (
              <div key={item.id || `${item.title}-${item.institution}`} className="bg-gray-50 border border-gray-200 rounded-lg px-5 py-5">
                <h3 className="text-base font-semibold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-sm font-semibold text-blue-600 mb-3">{item.institution}</p>
                <div className="flex items-center gap-4 text-xs text-gray-600 mb-4">
                  <span>{item.year}</span>
                  <span>{item.location}</span>
                </div>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section data-reveal style={revealRight} className="bg-white pt-6 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-center text-lg font-bold text-gray-900 mb-8">Certifications</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certifications.map((certificate) => (
              <div key={certificate.id || certificate.title} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="relative h-40 overflow-hidden bg-gray-100">
                  <img src={certificate.imageUrl || certificate.image_url} alt={certificate.title} className="w-full h-full object-cover" />
                </div>
                <div className="px-4 py-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">{certificate.title}</h3>
                  <p className="text-xs font-semibold text-blue-600 mb-2">{certificate.issuer}</p>
                  <p className="text-xs text-gray-500">{certificate.year}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="experience" data-reveal style={revealLeft} className="bg-gray-50 pt-6 pb-16 scroll-mt-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900">Experience</h2>
            <p className="mt-3 text-sm text-gray-500">My professional journey in tech</p>
          </div>

          <div className="space-y-6">
            {experienceItems.map((job) => {
              const achievements = Array.isArray(job.achievements) ? job.achievements : [];
              const technologies = Array.isArray(job.technologies) ? job.technologies : [];

              return (
                <div key={job.id || `${job.role}-${job.company}`} className="bg-white border border-gray-200 rounded-lg px-5 py-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{job.role}</h3>
                  <p className="text-base font-semibold text-blue-600 mb-4">{job.company}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-5">
                    <span>{job.period}</span>
                    <span>{job.location}</span>
                    <span>{job.type}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-6">{job.description}</p>
                  <h4 className="text-sm font-semibold text-gray-800 mb-3">Key Achievements:</h4>
                  <ul className="space-y-2 mb-5">
                    {achievements.map((achievement) => (
                      <li key={achievement} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-green-500 flex-shrink-0" />
                        {achievement}
                      </li>
                    ))}
                  </ul>
                  <h4 className="text-sm font-semibold text-gray-800 mb-3">Technologies:</h4>
                  <div className="flex flex-wrap gap-2">
                    {technologies.map((tech) => (
                      <span key={tech} className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="projects" data-reveal style={revealRight} className="bg-white pt-6 pb-16 scroll-mt-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
            <p className="mt-3 text-sm text-gray-500">Recent work and experiments</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => {
              const tags = Array.isArray(project.tags) ? project.tags : [];
              return (
                <div key={project.id || project.title} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                  <div className="relative h-56 overflow-hidden bg-gray-100">
                    <img src={project.imageUrl || project.image_url} alt={project.title} className="w-full h-full object-cover" />
                  </div>

                  <div className="p-5">
                    <h3 className="text-base font-semibold text-gray-900 mb-3">{project.title}</h3>
                    <p className="text-sm text-gray-600 leading-7 mb-5">{project.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {tags.map((tag) => (
                        <span key={tag} className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <a href={project.demoUrl || project.demo_url || "#"} className="flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
                        Demo
                      </a>
                      <a href={project.codeUrl || project.code_url || "#"} className="flex items-center justify-center gap-2 rounded-md border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                        Code
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 text-center">
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

      <section id="contact" data-reveal style={revealLeft} className="bg-gray-50 pt-14 pb-12 scroll-mt-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-9">
            <h2 className="text-2xl font-bold text-gray-900">Let's Connect</h2>
            <p className="mt-3 text-sm text-gray-500">Open to new opportunities</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-5">
                  Contact Info
                </h3>

                <div className="space-y-4 text-sm text-gray-700">
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M4 4h16v16H4z" />
                      <path d="m4 6 8 7 8-7" />
                    </svg>
                    <span>{contactProfile.email}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07A19.5 19.5 0 0 1 5.15 12 19.8 19.8 0 0 1 2.08 3.36 2 2 0 0 1 4.06 1.18h3a2 2 0 0 1 2 1.72c.12.9.33 1.77.62 2.6a2 2 0 0 1-.45 2.11L8 8.84a16 16 0 0 0 7.16 7.16l1.23-1.23a2 2 0 0 1 2.11-.45c.83.29 1.7.5 2.6.62A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <span>{contactProfile.phone}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M12 21s7-4.35 7-11a7 7 0 1 0-14 0c0 6.65 7 11 7 11z" />
                      <circle cx="12" cy="10" r="2" />
                    </svg>
                    <span>{contactProfile.location}</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 mt-7 pt-5 flex gap-2">
                  <a href={githubUrl} className="grid h-9 w-9 place-items-center rounded-md bg-gray-100 text-gray-600 hover:text-gray-900" aria-label="GitHub">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6A4.6 4.6 0 0 0 18.7 6a4.2 4.2 0 0 0-.1-3.3s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.4 5.4 2.7 5.4 2.7A4.2 4.2 0 0 0 5.3 6 4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
                    </svg>
                  </a>

                  <a href={linkedinUrl} className="grid h-9 w-9 place-items-center rounded-md bg-gray-100 text-gray-600 hover:text-gray-900" aria-label="LinkedIn">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6.94 8.75H3.88V20h3.06V8.75zM5.41 4a1.78 1.78 0 1 0 0 3.56A1.78 1.78 0 0 0 5.41 4zM20.13 13.54c0-3.02-1.61-4.42-3.76-4.42a3.25 3.25 0 0 0-2.95 1.62h-.04V8.75h-2.93V20h3.05v-5.56c0-1.47.28-2.89 2.1-2.89 1.79 0 1.81 1.68 1.81 2.98V20h3.06v-6.46h-.34z" />
                    </svg>
                  </a>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-5 mt-4">
                <p className="text-xs text-gray-700 mb-3">
                  GitHub contributions
                </p>

                <div className="border-t border-gray-200 pt-3 overflow-hidden">
                  <img
                    src={`https://ghchart.rshah.org/${githubUsername}`}
                    alt="GitHub contribution chart"
                    className="w-full"
                  />

                  <p className="mt-3 text-[10px] text-gray-500">
                    GitHub activity chart
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-5">Send Message</h3>
              <form className="space-y-4">
                <input type="text" placeholder="Your Name" className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500" />
                <input type="email" placeholder="Email Address" className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500" />
                <textarea placeholder="Your message..." rows="4" className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500" />
                <a href={whatsappUrl} className="flex items-center justify-center gap-2 rounded-md bg-blue-500 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-600">
                  Send via WhatsApp
                </a>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-950 pt-14 pb-8 text-center">
        <h2 className="text-2xl font-normal text-blue-500">{footerName}</h2>
        <p className="mt-6 text-sm text-gray-300">{footerTagline}</p>

        <div className="mt-8 flex justify-center gap-7 text-sm text-gray-300">
          <a href={githubUrl} className="hover:text-white">GitHub</a>
          <a href={linkedinUrl} className="hover:text-white">LinkedIn</a>
          <a href={xUrl} className="hover:text-white">X</a>
        </div>
        <p className="mt-8 text-sm text-gray-500">
          © {currentYear} Joseph Kyalo. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;