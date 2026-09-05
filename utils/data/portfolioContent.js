export const portfolioContent = {
  person: {
    name: "Abdullah Al Muktadir",
    role: "Full Stack Developer | Software Engineer",
    location: "Dhaka, Bangladesh",
    email: "muktadir.96@gmail.com",
    phone: "+880 1734007734",
    summary:
      "Full Stack Developer with 4+ years of experience building enterprise applications, internal business systems, e-commerce platforms, and modern web products. Experienced across frontend, backend, databases, cloud infrastructure, CI/CD, legacy modernization, and end-to-end product delivery.",
    linkedin: "https://linkedin.com/in/aa-muktadir",
    github: "https://github.com/AAMuktadir",
  },

  seo: {
    title:
      "Abdullah Al Muktadir | Full Stack Developer — Interactive Web Terminal",
    description:
      "Interactive terminal-style portfolio of Abdullah Al Muktadir, a Full Stack Developer specializing in Next.js, React, TypeScript, Node.js, enterprise applications, and cloud infrastructure.",
    keywords: [
      "Abdullah Al Muktadir",
      "Full Stack Developer",
      "Software Engineer",
      "Next.js",
      "React",
      "TypeScript",
      "Node.js",
      "Spring Boot",
      "PostgreSQL",
      "AWS",
      "Enterprise Applications",
      "Web Terminal",
      "Developer Portfolio",
    ],
    url: "https://mywebterminal.netlify.app",
    image: "/img/background/background_large-2.jpeg",
  },

  startup: {
    title: "macOS Terminal Portfolio v2.0",
    subtitle:
      'Type "help" to see available commands, or click a suggestion below to start.',
    suggestions: [
      "help",
      "about",
      "skills",
      "projects",
      "experience",
      "contact",
    ],
  },
  resume: {
    textUrl: "/resume.txt",
    pdfUrl: "/file/Abdullah-Al-Muktadir.pdf",
  },

  skills: {
    development: [
      "Frontend: React, Next.js, TypeScript, JavaScript, Tailwind CSS, Material UI",
      "Backend: Node.js, Express.js, Spring Boot, REST APIs, GraphQL, JWT",
      "Databases: PostgreSQL, MongoDB, MySQL, Prisma ORM",
      "State & Data: TanStack Query, Redux",
      "Mobile: React Native",
    ],

    operational: [
      "Cloud: AWS (EC2, S3, RDS), Vercel, Netlify",
      "DevOps: Docker, Docker Compose, Coolify, CI/CD, GitHub Actions",
      "Servers: Linux, Nginx, PM2",
      "Tools: Git, GitHub, GitLab, Postman",
    ],

    programming: [
      "Languages: TypeScript, JavaScript, Java, Python",
      "Concepts: OOP, SOLID Principles, System Design, Data Structures & Algorithms",
      "Testing: Playwright, Vitest, Unit Testing, E2E Testing",
      "Workflow: Agile/Scrum, SDLC",
    ],

    soft: [
      "Cross-functional collaboration",
      "Technical ownership and end-to-end delivery",
      "Business requirement analysis",
      "Client and stakeholder communication",
    ],
  },

  experience: [
    {
      company: "IPDC Finance PLC",
      role: "Full Stack Developer",
      location: "Gulshan, Dhaka, Bangladesh",
      period: "March 2026 - Present",
      highlights: [
        "Rebuilt IPDC Finance's large-scale corporate website from legacy Laravel/Nuxt to Next.js",
        "Developed enterprise Admin Portal modules with reusable UI and REST API integrations",
        "Built and enhanced Card Management System, Dedupe Portal, and reporting workflows",
        "Managed UAT deployment, Linux server configuration, technical SEO, and production optimization",
      ],
    },

    {
      company: "Capita Group",
      role: "Full Stack Developer",
      location: "Banani, Dhaka, Bangladesh",
      period: "May 2025 - February 2026",
      highlights: [
        "Developed an HR Management System for attendance, leave, approvals, and employee workflows",
        "Built a Billing Management System for rent, electricity, internet, and property-related invoices",
        "Rebuilt group websites and migrated vendor-built applications to in-house solutions",
        "Introduced Coolify-based deployment infrastructure and CI/CD workflows",
      ],
    },

    {
      company: "Planet X Inc Ltd. (ATnation)",
      role: "Full Stack Developer",
      location: "Dhaka, Bangladesh",
      period: "February 2022 - April 2025",
      highlights: [
        "Delivered full-stack web and mobile applications for local and international clients",
        "Developed 5+ e-commerce platforms with commerce and administrative workflows",
        "Built separate proposal applications for the Bangladesh Tourism Ministry and Bangladesh Police",
        "Developed NGO, online library, donation, and other client platforms with cloud and on-premise deployments",
      ],
    },

    {
      company: "The Biz House Ltd.",
      role: "IT Consultant (Part-Time)",
      location: "Baridhara DOHS, Dhaka, Bangladesh",
      period: "March 2021 - January 2022",
      highlights: [
        "Managed company websites, web applications, hosting, and server environments",
        "Coordinated with software and IT vendors for implementation and technical support",
        "Supported business teams in evaluating requirements and technology solutions",
        "Handled deployments, troubleshooting, domains, hosting, and day-to-day technical operations",
      ],
    },
  ],

  education: [
    {
      degree: "Bachelor of Science (BSc) in Computer Science and Engineering",
      institute: "BRAC University",
      location: "Dhaka, Bangladesh",
      result: "CGPA: 3.43 / 4.00",
      period: "May 2018 - May 2023",
    },
    {
      degree: "Higher Secondary Certificate (HSC), Science",
      institute: "Dhaka City College",
      location: "Dhaka, Bangladesh",
      result: "GPA: 4.67 out of 5.00",
      period: "2014 - 2016",
    },
    {
      degree: "Secondary School Certificate (SSC), Science",
      institute: "Naogaon Zilla School",
      location: "Naogaon, Bangladesh",
      result: "GPA: 5.00 out of 5.00",
      period: "2008 - 2014",
    },
  ],

  projects: [
    {
      slug: "web-terminal",
      title: "Web Terminal",
      description:
        "An interactive terminal-style developer portfolio featuring a command engine, virtual file system, autocomplete, themes, and desktop-like window controls.",
      stack: [
        "Next.js",
        "React",
        "Tailwind CSS",
        "CSS Variables",
        "Clipboard API",
      ],
      github: "https://github.com/AAMuktadir/webterminal",
      live: "https://mywebterminal.netlify.app/",
      highlights: [
        "Built a command engine supporting 20+ commands, aliases, and history",
        "Implemented virtual file navigation with cd, ls, cat, and autocomplete",
        "Created draggable, resizable windows with live theme and display customization",
      ],
    },

    {
      slug: "datasecure",
      title: "DataSecure",
      description:
        "A security-focused full-stack application demonstrating encrypted data storage, authentication, and secure handling of sensitive information.",
      stack: ["Next.js", "MongoDB", "Mongoose", "JWT", "bcrypt", "AES-256"],
      github: "https://github.com/AAMuktadir/data-security",
      live: "https://dataencryption.vercel.app/",
      highlights: [
        "Implemented AES-256 encryption and decryption for sensitive user data",
        "Built JWT authentication with HttpOnly cookies and bcrypt password hashing",
        "Created protected routes and encrypted/decrypted data visualization",
      ],
    },

    {
      slug: "track-console",
      title: "TrackConsole",
      description:
        "A lightweight music search and playback application powered by the YouTube Data API.",
      stack: ["Next.js", "TypeScript", "Tailwind CSS", "YouTube Data API"],
      github: "https://github.com/AAMuktadir/TrackConsole",
      live: "https://track-console.vercel.app/",
      highlights: [
        "Integrated YouTube Data API v3 through server-side API routes",
        "Implemented official iframe playback with secure API key handling",
        "Added persistent playlists and recent search history",
      ],
    },

    {
      slug: "pro-club",
      title: "Pro-Club",
      description:
        "A full-stack sports club management platform for managing clubs, players, divisions, profiles, and competition-related data.",
      stack: ["Next.js", "React", "MongoDB", "Mongoose", "JWT", "Tailwind CSS"],
      github: "https://github.com/AAMuktadir/pro-club",
      live: "https://proclubs.vercel.app/",
      highlights: [
        "Built club and player registration, management, search, and filtering",
        "Implemented JWT authentication and middleware-protected routes",
        "Created dashboards with statistics and division management",
      ],
    },

    {
      slug: "overseas-management",
      title: "Overseas Company Management System",
      description:
        "A business management platform for clients, agents, companies, recruitment documentation, and approval workflows.",
      stack: ["Next.js", "PocketBase", "JavaScript"],
      github: "https://github.com/AAMuktadir/Overseas-Company-Management",
      live: "",
      highlights: [
        "Built role-based authentication with admin and super-admin capabilities",
        "Developed dashboards for clients, agents, companies, and operations",
        "Implemented passport, visa, work permit, medical, approval, and referral workflows",
      ],
    },
  ],

  achievements: [
    "Delivered 30+ projects across enterprise, agency, business, and personal environments",
    "Rebuilt IPDC Finance's corporate website from legacy Laravel/Nuxt to Next.js",
    "Developed 5+ e-commerce platforms for agency clients",
    "Built HR and Billing Management Systems for real-estate business operations",
    "Introduced Coolify-based application deployment and CI/CD infrastructure",
    "Built separate proposal applications presented to the Bangladesh Tourism Ministry and Bangladesh Police",
  ],

  commands: {
    aliases: {
      h: "help",
      cls: "clear",
      me: "about",
      gh: "github",
      li: "linkedin",
      mail: "email",
      exp: "experience",
      edu: "education",
      pro: "projects",
    },
    list: [
      { name: "help", description: "Show all available commands" },
      { name: "about", description: "Show professional summary" },
      { name: "skills", description: "Show technical and soft skills" },
      { name: "projects", description: "List featured projects" },
      { name: "experience", description: "Show work experience" },
      { name: "education", description: "Show education history" },

      {
        name: "achievements",
        description: "Show selected career highlights",
      },

      { name: "contact", description: "Show contact details" },
      { name: "resume", description: "View/download resume files" },
      { name: "socials", description: "List social/profile links" },
      { name: "github", description: "Open GitHub profile" },
      { name: "linkedin", description: "Open LinkedIn profile" },
      { name: "email", description: "Copy/open email contact" },
      { name: "whoami", description: "Show identity summary" },
      { name: "ls [path]", description: "List a virtual directory or file" },
      {
        name: "cat <file>",
        description:
          "Read virtual text files; cat resume opens the text resume",
      },
      {
        name: "cd [path]",
        description: "Change directory; no path returns home (~); .. moves up",
      },
      { name: "open <project-slug>", description: "Open a project link" },
      { name: "theme [name]", description: "List or change terminal theme" },
      { name: "date", description: "Show local date and time" },
      { name: "clear", description: "Clear terminal output" },
      { name: "sudo hire-me", description: "Fun recruiter command" },
    ],
  },

  terminal: {
    username: "muktadir",
    host: "portfolio",
    defaultDirectory: "~",

    directories: {
      "~": [
        "about",
        "projects",
        "experience",
        "education",
        "contact",
        "resume.txt",
      ],

      "~/about": ["summary.txt"],
      "~/experience": ["timeline.txt"],
      "~/education": ["degrees.txt"],
      "~/contact": ["links.txt"],
    },
  },

  themes: [
    {
      id: "graphite",
      label: "Graphite",
      vars: {
        "--terminal-bg": "#111a20",
        "--terminal-surface": "#0d1419",
        "--terminal-text": "#d7e6f2",
        "--terminal-muted": "#99afbf",
        "--terminal-accent": "#6fe3c0",
        "--terminal-error": "#ff7d8e",
        "--terminal-link": "#85beff",
      },
    },
    {
      id: "paper",
      label: "Paper",
      vars: {
        "--terminal-bg": "#efe8db",
        "--terminal-surface": "#f8f1e6",
        "--terminal-text": "#24313b",
        "--terminal-muted": "#566874",
        "--terminal-accent": "#157b57",
        "--terminal-error": "#b93a4b",
        "--terminal-link": "#0e5fbe",
      },
    },
    {
      id: "classic",
      label: "Classic",
      vars: {
        "--terminal-bg": "#04150f",
        "--terminal-surface": "#03100b",
        "--terminal-text": "#a8ffd0",
        "--terminal-muted": "#74dca6",
        "--terminal-accent": "#8cffb3",
        "--terminal-error": "#ff7282",
        "--terminal-link": "#6fc4ff",
      },
    },
  ],
};
