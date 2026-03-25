// ─────────────────────────────────────────────────────────────────────────────
// PORTFOLIO DATA  —  Edit this file to update your entire site
// ─────────────────────────────────────────────────────────────────────────────

// ── 1. Personal Info ─────────────────────────────────────────────────────────
export const personal = {
  name: 'Sahil Sheoran',
  shortName: 'Sahil',
  tagline: 'Full Stack Developer',
  email: 'sahil.sheoran.agroha@gmail.com',
  phone: '+91 98125 91172',
  location: 'Haryana, India',

  bio: "Full Stack Developer specializing in building scalable, secure, and production-ready web applications. Experienced in Java, Spring Boot, Spring Cloud, and React, with strong expertise in microservices architecture, REST APIs, and modern UI development. Passionate about clean code, system design, and delivering high-performance solutions.",

  availableForWork: true,
  github: 'https://github.com/SahilAgroha',
  linkedin: 'https://www.linkedin.com/in/sahilagroha/',
  leetcode: 'https://leetcode.com/u/sahilagroha/',
};

// ── 2. Typewriter Roles (Hero) ────────────────────────────────────────────────
export const roles = [
  'Full Stack Developer',
  'Spring Boot Engineer',
  'Spring Cloud Specialist',
  'React Developer',
];

// ── 3. Hero Stats (profile card) ─────────────────────────────────────────────
export const heroStats = [
  { val: '3+', label: 'Projects' },
  { val: '12+', label: 'Skills' },
  { val: '1+', label: 'Year' },
];

// ── 4. About ─────────────────────────────────────────────────────────────────
export const aboutStats = [
  { value: '3+', label: 'Projects Shipped' },
  { value: '12+', label: 'Technologies' },
  { value: '1+', label: 'Year Coding' },
  { value: '100%', label: 'Commitment' },
];

export const aboutFocuses = [
  {
    emoji: '⚙️',
    title: 'Backend Engineering',
    desc: 'Building secure, scalable REST APIs and microservices with Java, Spring Boot, Spring Cloud, and Spring Security.',
    color: 'var(--blue)',
  },
  {
    emoji: '🎨',
    title: 'Frontend Development',
    desc: 'Crafting responsive, modern UIs with React, Framer Motion, and design-to-code precision.',
    color: 'var(--amber)',
  },
  {
    emoji: '🛠️',
    title: 'System Design',
    desc: 'Designing distributed systems using event-driven architecture, Kafka, Redis, and Docker.',
    color: 'var(--emerald)',
  },
];

// ── 5. Tech Stack ─────────────────────────────────────────────────────────────
export const techCategories = [
  {
    label: 'Frontend',
    emoji: '🎨',
    color: '#60a5fa',
    gradient: 'linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(96,165,250,0.05) 100%)',
    skills: [
      { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg' },
      { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg' },
      { name: 'HTML5', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg' },
      { name: 'CSS3', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg' },
      { name: 'Tailwind', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg' },
    ],
  },
  {
    label: 'Backend',
    emoji: '⚙️',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(245,158,11,0.04) 100%)',
    skills: [
      { name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg' },
      { name: 'Spring Boot', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/spring/spring-original.svg' },
      { name: 'Spring Cloud', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/spring/spring-original.svg' },
      { name: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg' },
    ],
  },
  {
    label: 'DevOps & Tools',
    emoji: '🛠️',
    color: '#10b981',
    gradient: 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(16,185,129,0.04) 100%)',
    skills: [
      { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg' },
      { name: 'Redis', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-original.svg' },
      { name: 'Kafka', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/apachekafka/apachekafka-original.svg' },
      { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg' },
    ],
  },
];

// ── 6. Projects ───────────────────────────────────────────────────────────────
export const projects = [
  {
    title: 'NexaMed — Healthcare Microservices',
    description:
      'A full-scale healthcare platform built on Spring Cloud Microservices — 8+ independent services including Patient, Doctor, Appointment, Billing, Notification, and API Gateway with Eureka service discovery.',
    tech: ['React', 'Spring Cloud', 'Spring Boot', 'Spring Security', 'MySQL', 'Docker','Kafka','Redis'],
    github: 'https://github.com/SahilAgroha/NexaMed',
    live: '#',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=80',
    accent: '#10b981',
    tag: 'Microservices',
  },
  {
    title: 'E-Baazar — E-Commerce Platform',
    description:
      'A scalable e-commerce platform with secure payment integration, user authentication, product listings, cart system, and a full admin dashboard for store management.',
    tech: ['React', 'Spring Boot', 'Spring Security', 'MySQL', 'Docker','Payment integration'],
    github: 'https://github.com/SahilAgroha/E-Baazar',
    live: 'https://e-bazaar-pi.vercel.app/',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop&q=80',
    accent: '#3b82f6',
    tag: 'E-Commerce',
  },
  {
    title: 'Hiredly — Job Portal',
    description:
      'A modern job portal connecting recruiters and job seekers with job posting, real-time application tracking, JWT authentication, and email notification systems.',
    tech: ['React', 'Spring Boot', 'JWT Auth', 'MySQL'],
    github: 'https://github.com/SahilAgroha/Hiredly',
    live: '#',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80',
    accent: '#f59e0b',
    tag: 'SaaS Platform',
  },
  
];

// ── 7. Experience & Education Timeline ───────────────────────────────────────
export const timeline = [
  {
    type: 'work',
    period: '2024 — Present',
    title: 'Freelance Full Stack Developer',
    org: 'Self-Employed',
    location: 'Remote',
    accent: 'var(--blue)',
    points: [
      'Designed and developed 3 full-stack web applications used in production.',
      'Built scalable REST APIs using Java Spring Boot & Spring Cloud with JWT authentication and role-based access control.',
      'Created responsive React frontends with modern UI libraries and animation frameworks.',
      'Containerized applications with Docker for consistent deployment environments.',
    ],
  },
  {
  type: 'education',
  period: '2021 — 2025',
  title: 'Bachelor of Technology (B.Tech) in Information Technology',
  org: 'Indian Institute of Information Technology, Bhopal',
  location: 'Bhopal, Madhya Pradesh',
  accent: 'var(--amber)',
  points: [
    'Focused on Data Structures, Algorithms, DBMS, and Software Engineering fundamentals.',
    'Developed multiple full-stack and microservices-based projects using Java, Spring Boot, and React.',
    'Actively practiced problem-solving on LeetCode and participated in coding contests.',
    'Gained hands-on experience in system design, backend architecture, and scalable application development.',
  ],
},
];
