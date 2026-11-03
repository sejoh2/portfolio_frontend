// Default portfolio content (from Joseph's CVs, Nov 2026).
// Shown when the matching Supabase table is empty or unreachable, and used to generate supabase/seed.sql
// (`npm run db:seed:build`). Field names match the database columns.

export const contactProfile = {
  full_name: "Joseph Kyalo",
  headline: "Software Engineer · Fintech, Mobile & AI Agents",
  tagline:
    "I build payment-grade products for SACCOs, landlords and small businesses, from the database schema to the mobile app to the AI agent on top.",
  bio: "I'm a Nairobi-based software engineer with a BSc in Software Engineering. At Wakandi Labs I build WayPoint, the in-house CRM for a fintech platform serving SACCOs and microfinance institutions, and AI agents that research, score and analyse data with a human approving every action.\n\nOutside work I'm building Kodi, a rental management platform for Kenyan landlords with M-Pesa rent collection, utility billing, SMS reminders, a caretaker app and an AI sales agent. Before Wakandi I was a Senior Software Engineer at AnnexTechnologies and led Flutter development for the Tann Mann Foundation.",
  availability: "Open to new opportunities",
  cv_url: null,
  avatar_url: null,
  email: "kyalojoseph505@gmail.com",
  phone: "+254 738 899 264",
  location: "Nairobi, Kenya",
  github_url: "https://github.com/sejoh2",
  github_username: "sejoh2",
  linkedin_url: "https://www.linkedin.com/in/joseph-kyalo-051778349/",
  x_url: "https://x.com/Mksejoh",
  whatsapp_url: "https://wa.me/254738899264",
  footer_name: "Joseph Kyalo",
  footer_tagline: "Building fintech, mobile and AI products from Nairobi.",
};

// Photos live in public/images. An avatar uploaded in the admin replaces the hero photo.
export const photos = {
  hero: "/images/speaking.jpg",
  heroCaption: "Speaking at Cyber Safety at Work 2026",
  about: "/images/community.jpg",
  aboutCaption: "With attendees at Cyber Safety at Work 2026, Nairobi",
};

export const stats = [
  { value: "3+", label: "Years building software" },
  { value: "3", label: "Companies" },
  { value: "26", label: "Merged PRs on WayPoint CRM" },
  { value: "4", label: "Apps in the Kodi platform" },
];

// Hero carousel images are optional: upload them in the admin. Without any, the hero shows a profile card.
export const heroImages = [];

export const buildItems = [
  {
    id: "fintech",
    title: "Fintech & Payments",
    description: "M-Pesa Daraja (C2B, STK Push), billing, statements and reconciliation that always add up.",
    icon: "wallet",
    color: "green",
  },
  {
    id: "web",
    title: "Web Platforms",
    description: "React and Next.js apps with PostgreSQL, real-time updates, role-based access and admin tools.",
    icon: "globe",
    color: "blue",
  },
  {
    id: "mobile",
    title: "Mobile Apps",
    description: "Flutter apps built for low-end Android phones and low-connectivity areas, with push notifications.",
    icon: "smartphone",
    color: "purple",
  },
  {
    id: "ai",
    title: "AI Agents",
    description: "MCP servers and LLM agents with guardrails, audit logs and human approval before any action.",
    icon: "bot",
    color: "blue",
  },
];

export const skillGroups = [
  { id: "languages", title: "Languages", color: "purple", skills: ["TypeScript", "JavaScript", "Python", "Dart", "SQL"] },
  {
    id: "frontend",
    title: "Frontend & Mobile",
    color: "blue",
    skills: ["React", "Next.js", "Tailwind CSS", "Vite", "Flutter", "Bloc / Provider"],
  },
  {
    id: "backend",
    title: "Backend & Data",
    color: "green",
    skills: ["Node.js", "Express", "FastAPI", "PostgreSQL", "Supabase", "Directus", "REST / OpenAPI", "SSE / WebSockets"],
  },
  {
    id: "integrations",
    title: "Payments & Integrations",
    color: "purple",
    skills: ["M-Pesa Daraja", "Africa's Talking", "WhatsApp Cloud API", "Microsoft Graph", "Brevo", "Firebase"],
  },
  {
    id: "ai",
    title: "AI & Agents",
    color: "blue",
    skills: ["MCP servers", "Gemini", "OpenRouter", "LangChain", "RAG", "Human-in-the-loop design"],
  },
  {
    id: "devops",
    title: "DevOps & Tools",
    color: "green",
    skills: ["Git & GitHub", "GitHub Actions", "Docker", "Render", "Coolify", "Cloudflare R2", "Power BI"],
  },
];

export const experience = [
  {
    id: "wakandi",
    role: "Growth Hacker · AI Process Automation & Agents",
    company: "Wakandi Labs",
    period: "Aug 2026 – Present",
    location: "Nairobi, Kenya",
    type: "Full-time",
    description:
      "Building WayPoint, the in-house CRM replacing HubSpot at a fintech platform for SACCOs and microfinance institutions, plus AI agents for growth and analytics.",
    achievements: [
      "Shipped 26 merged pull requests on WayPoint across UI, API routes and SQL migrations, all through code review and CI",
      "Built a shared inbox for email, calls and SMS with Microsoft Graph mail sync, threading, assignment and live updates",
      "Built ticket and customer-journey pipelines with a drag-and-drop stage builder and Kanban boards",
      "Built a SACCO lead-qualification agent on three MCP servers that scores leads out of 100, with human approval before saving",
    ],
    technologies: ["Next.js", "React", "TypeScript", "PostgreSQL", "Directus", "Supabase", "MCP"],
  },
  {
    id: "annex",
    role: "Senior Software Engineer",
    company: "AnnexTechnologies",
    period: "Mar 2025 – Aug 2026",
    location: "Nairobi, Kenya",
    type: "Full-time",
    description: "Designed and built backend services, APIs and enterprise modules for business clients.",
    achievements: [
      "Designed scalable backend services for business workflows, data processing and system-to-system communication",
      "Built and maintained REST APIs for internal platforms, third-party integrations and secure data exchange",
      "Implemented modules for reporting, user management, workflow automation and operational dashboards",
      "Built tuRide, a ride-hailing aggregator that compares Uber, Bolt, Yego and Faras fares in real time",
    ],
    technologies: ["Node.js", "Express", "Python", "PostgreSQL", "REST APIs"],
  },
  {
    id: "tannmann",
    role: "Software Developer · Flutter Lead",
    company: "Tann Mann Foundation",
    period: "Jan 2023 – Nov 2023",
    location: "Bengaluru, India",
    type: "Contract",
    description: "Led Flutter development of nonprofit mobile apps for registration, field data capture and reporting.",
    achievements: [
      "Led Flutter development of features for user registration, field data capture, reporting and service access",
      "Built offline-friendly data handling and validation for low-connectivity areas, improving data quality",
      "Integrated REST APIs for authentication, record retrieval and real-time updates",
    ],
    technologies: ["Flutter", "Dart", "REST APIs"],
  },
];

export const projects = [
  {
    id: "kodi",
    title: "Kodi · Rental Management Platform",
    description:
      "Rent collection, utility billing and caretaker tools for Kenyan landlords. Four apps on one PostgreSQL core (owner web app, REST API, Flutter caretaker app and a Gemini AI sales agent) with M-Pesa payments, SMS reminders and CI on GitHub Actions. Live on Render.",
    category: "Fintech",
    tags: ["React", "Node.js", "PostgreSQL", "Flutter", "M-Pesa", "Gemini"],
    image_url: "/projects/kodi.png",
    demo_url: "https://rental-managemtn-system-frontend.onrender.com",
    code_url: "https://github.com/sejoh2/Rental_managemtn_system_backend",
    links: [
      { label: "API docs", url: "https://rental-managemtn-system-backend.onrender.com/api-docs" },
      { label: "AI agent", url: "https://rental-management-system-agent.onrender.com" },
      { label: "Web app code", url: "https://github.com/sejoh2/Rental_managemtn_system_frontend" },
      { label: "Mobile app code", url: "https://github.com/sejoh2/Rental_Management_System_Mobile" },
    ],
    featured: true,
  },
  {
    id: "kodi-agent",
    title: "Kodi AI Agent",
    description:
      "An AI sales and support agent for Kodi. It qualifies landlord leads over web chat, WhatsApp and Messenger, books demos in Google Calendar, and gives owners a morning brief and a voice assistant. Actions run at three autonomy levels (act alone, needs approval with a PIN for money, alert at once) with an append-only audit log.",
    category: "AI Agents",
    tags: ["Node.js", "Express", "PostgreSQL", "Gemini", "WhatsApp Cloud API", "Google Calendar", "React"],
    image_url: "/projects/kodi-agent.jpg",
    demo_url: "https://rental-management-system-agent.onrender.com",
    code_url: null,
    links: [{ label: "Kodi web app", url: "https://rental-managemtn-system-frontend.onrender.com" }],
    featured: true,
  },
  {
    id: "turide",
    title: "tuRide · Ride Aggregator",
    description:
      "Compares ride-hailing fares across Uber, Bolt, Yego and Faras in real time. Riders enter pickup and drop-off and get a side-by-side comparison of price, arrival time and vehicle type in under 5 seconds, so they stop overpaying. Built at AnnexTechnologies.",
    category: "Mobility",
    tags: ["Node.js", "PostgreSQL", "REST APIs"],
    image_url: "/projects/turide.jpg",
    demo_url: "https://tu-ride.netlify.app",
    code_url: null,
    links: [{ label: "Case study", url: "https://annex-technologies.com/projects/turide-ride-aggregator-platform-8a9d9e" }],
    featured: true,
  },
  {
    id: "waypoint",
    title: "WayPoint CRM (Wakandi)",
    description:
      "The in-house CRM replacing HubSpot: shared inbox for email, calls and SMS, ticket and deal pipelines, quotes with PDF generation, and meeting scheduling on Microsoft calendars.",
    category: "Work · Private",
    tags: ["Next.js", "TypeScript", "PostgreSQL", "Microsoft Graph"],
    image_url: null,
    demo_url: null,
    code_url: null,
    featured: true,
  },
  {
    id: "forex",
    title: "Forex Trading Agent",
    description:
      "A multi-agent research system: seven analyst agents vote on trades, a code-only risk manager sizes positions, and every strategy is tested walk-forward. 432 automated tests.",
    category: "AI · Research",
    tags: ["Python", "pandas", "scikit-learn", "MetaTrader 5"],
    image_url: null,
    demo_url: null,
    code_url: "https://github.com/sejoh2/forex-trading-agent",
    featured: true,
  },
  {
    id: "sacco-agent",
    title: "SACCO Lead-Qualification Agent",
    description:
      "An MCP agent that researches SACCOs from public sources, cleans and scores them out of 100 on seven factors, and saves nothing without human approval.",
    category: "AI Agents",
    tags: ["MCP", "Node.js", "PostgreSQL"],
    image_url: null,
    demo_url: null,
    code_url: null,
    featured: true,
  },
  {
    id: "kweli",
    title: "Kweli Rentals Mobile App",
    description:
      "A Flutter marketplace that brings together home finders, landlords and movers, with map search, photo and video listings, and real-time updates.",
    category: "Mobile",
    tags: ["Flutter", "Node.js", "Socket.IO", "Firebase"],
    image_url: "https://i.postimg.cc/5y6RWjrC/image.png",
    demo_url: null,
    code_url: null,
    featured: false,
  },
  {
    id: "pm-furniture",
    title: "PM Furniture E-commerce",
    description: "An SEO-friendly storefront showcasing a furniture maker's products, managed through Sanity CMS.",
    category: "Web",
    tags: ["React", "Firebase", "Sanity CMS"],
    image_url: "https://i.postimg.cc/3xnfNXHg/image.png",
    demo_url: "https://effervescent-flan-877211.netlify.app/",
    code_url: "https://github.com/joseh33/pm-furniture-website",
    featured: false,
  },
];

export const education = [
  {
    id: "zetech",
    title: "BSc Software Engineering",
    institution: "Zetech University",
    year: "",
    location: "Nairobi, Kenya",
    description: "Systems design, databases, web and mobile development.",
  },
  {
    id: "luxdev",
    title: "Data Science Fundamentals",
    institution: "LuxDev HQ",
    year: "",
    location: "Nairobi, Kenya",
    description: "Data cleaning, analysis, visualisation and an introduction to data engineering.",
  },
  {
    id: "plp",
    title: "Software Development",
    institution: "Power Learn Project",
    year: "2023",
    location: "Nairobi, Kenya",
    description: "Software engineering with a focus on problem solving and clean code.",
  },
  {
    id: "cs50",
    title: "Computer Science (in progress)",
    institution: "Harvard University · CS50",
    year: "",
    location: "Online",
    description: "Algorithms, data structures and programming fundamentals.",
  },
];

export const certifications = [
  {
    id: "plp-cert",
    title: "Software Development Professional Certificate",
    issuer: "Power Learn Project",
    year: "2024",
    image_url: "https://i.postimg.cc/DySP6rrf/Screenshot-2026-06-13-063130.png",
  },
  {
    id: "cisco",
    title: "Data Security",
    issuer: "Cisco Networking Academy",
    year: "2023",
    image_url: "https://i.postimg.cc/KvT07Xhg/Screenshot-2026-06-13-063540.png",
  },
  {
    id: "wakandi-academy",
    title: "Wakandi Academy · 20 courses (15 Gold, 5 Silver)",
    issuer: "Wakandi Kenya Limited",
    year: "2026",
    image_url: null,
  },
  {
    id: "gadts",
    title: "Cybersecurity Training",
    issuer: "GADTS",
    year: "2026",
    image_url: null,
  },
];
