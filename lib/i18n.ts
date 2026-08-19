// Minimal i18n layer: a single dictionary keyed by dot-path, with each leaf
// carrying both the ES and EN copy. Consumers read via `useLanguage().t()`
// which resolves the path for the active language. Keeping it flat and
// co-located (rather than adding a dependency like next-intl) keeps the
// project tiny and makes the strings easy to audit.
export type Lang = "es" | "en";

export const LANGUAGES: Lang[] = ["es", "en"];
export const DEFAULT_LANG: Lang = "es";

type Leaf = Record<Lang, string>;
type Node = Leaf | { [key: string]: Node };

function isLeaf(node: Node): node is Leaf {
  return typeof (node as Leaf).es === "string";
}

export const DICT = {
  picker: {
    season: { es: "Season", en: "Season" },
    language: { es: "Language", en: "Language" },
  },
  seasons: {
    spring: { es: "Spring", en: "Spring" },
    summer: { es: "Summer", en: "Summer" },
    autumn: { es: "Autumn", en: "Autumn" },
    winter: { es: "Winter", en: "Winter" },
  },
  nav: {
    aria: { es: "Sections", en: "Sections" },
    home: { es: "Home", en: "Home" },
    stack: { es: "Stack", en: "Stack" },
    experience: { es: "Experience", en: "Experience" },
    project: { es: "Project", en: "Project" },
    contact: { es: "Contact", en: "Contact" },
  },
  header: {
    availability: {
      es: "Open to opportunities",
      en: "Open to opportunities",
    },
  },
  hero: {
    greeting: { es: "Hi, I am", en: "Hi, I am" },
    roleLine: {
      es: "Backend-focused Full-Stack Engineer.",
      en: "Backend-focused Full-Stack Engineer.",
    },
    tagline: {
      es: "Java · Spring Boot · Kafka · React · IIIT Bhopal '27.",
      en: "Java · Spring Boot · Kafka · React · IIIT Bhopal '27.",
    },
    cv: { es: "Download CV", en: "Download CV" },
    hire: { es: "Contact me", en: "Contact me" },
    scroll: { es: "Scroll to explore", en: "Scroll to explore" },
    keysHint: {
      es: "· hover over the keys",
      en: "· hover over the keys",
    },
  },
  stack: {
    title: { es: "Tech Stack", en: "Tech Stack" },
    hint: {
      es: "(hint: hover over a key)",
      en: "(hint: hover over a key)",
    },
    hintMobile: {
      es: "The tools I build with.",
      en: "The tools I build with.",
    },
  },
  experience: {
    title: { es: "Experience", en: "Experience" },
    subtitle: {
      es: "My professional journey.",
      en: "My professional journey.",
    },
  },
  projects: {
    kicker: { es: "project", en: "project" },
    viewMore: { es: "View more", en: "View more" },
    openSite: { es: "Visit site", en: "Visit site" },
    viewCode: { es: "View code", en: "View code" },
    close: { es: "Close", en: "Close" },
    stackLabel: { es: "Stack", en: "Stack" },
    overview: { es: "Overview", en: "Overview" },
  },
  contact: {
    kicker: { es: "contact", en: "contact" },
    title: { es: "Let's talk?", en: "Let's talk?" },
    body: {
      es: "I build things that scale, not just things that work. Open to internships, full-time roles and interesting collaborations.",
      en: "I build things that scale, not just things that work. Open to internships, full-time roles and interesting collaborations.",
    },
    copyEmail: { es: "Copy email", en: "Copy email" },
    openMail: { es: "Open mailto", en: "Open mailto" },
    github: { es: "GitHub", en: "GitHub" },
    linkedin: { es: "LinkedIn", en: "LinkedIn" },
    emailToast: { es: "Email copied", en: "Email copied" },
    footer: {
      es: "© 2026 Sahil. All rights reserved.",
      en: "© 2026 Sahil. All rights reserved.",
    },
  },
  keyboard: {
    taglines: {
      java: {
        es: "Write once, run anywhere. The backbone of enterprise.",
        en: "Write once, run anywhere. The backbone of enterprise.",
      },
      springboot: {
        es: "Production-ready Spring apps in minutes.",
        en: "Production-ready Spring apps in minutes.",
      },
      apachekafka: {
        es: "Millions of events. Zero dropped messages.",
        en: "Millions of events. Zero dropped messages.",
      },
      redis: {
        es: "Cache it. Speed it. Never wait again.",
        en: "Cache it. Speed it. Never wait again.",
      },
      docker: {
        es: "Same on my machine, same in production.",
        en: "Same on my machine, same in production.",
      },
      postgresql: {
        es: "The reliable database that always delivers.",
        en: "The reliable database that always delivers.",
      },
      mysql: {
        es: "Structured. Fast. Battle-tested at scale.",
        en: "Structured. Fast. Battle-tested at scale.",
      },
      react: {
        es: "Components, components, components.",
        en: "Components, components, components.",
      },
      typescript: {
        es: "Same JS, with a seatbelt.",
        en: "Same JS, with a seatbelt.",
      },
      javascript: {
        es: "Where it all started. Still here, still in charge.",
        en: "Where it all started. Still here, still in charge.",
      },
      git: {
        es: "History and a time machine for your code.",
        en: "History and a time machine for your code.",
      },
      githubactions: {
        es: "Push. Test. Ship. Repeat.",
        en: "Push. Test. Ship. Repeat.",
      },
      linux: {
        es: "Where servers live and backends breathe.",
        en: "Where servers live and backends breathe.",
      },
      aws: {
        es: "Scale to infinity. Pay for what you use.",
        en: "Scale to infinity. Pay for what you use.",
      },
      spring: {
        es: "The Spring ecosystem — security, cloud, and beyond.",
        en: "The Spring ecosystem — security, cloud, and beyond.",
      },
    },
  },
} as const satisfies Record<string, Node>;

// Resolve a dotted path in the dictionary for a given language.
export function translate(path: string, lang: Lang): string {
  const parts = path.split(".");
  let ref: Node = DICT as unknown as Node;
  for (const p of parts) {
    if (isLeaf(ref)) return path;
    ref = (ref as { [key: string]: Node })[p];
    if (ref === undefined) return path;
  }
  if (isLeaf(ref)) return ref[lang] ?? ref.es ?? path;
  return path;
}
