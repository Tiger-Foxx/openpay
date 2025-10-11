/**
 * Configuration centralisée pour OpenPay
 *
 * ⚠️ IMPORTANT: Ne commit JAMAIS tes clés API réelles.
 * Utilise des variables d'environnement (.env) pour la production.
 */

export const config = {
  // API Salaires.dev
  salariesApi: {
    endpoint: "https://salaires.dev/api/salaries",
    cacheDuration: 1000 * 60 * 30, // 30 minutes
  },

  // LLM Configuration (Gemini)
  llm: {
    apiKey: import.meta.env.VITE_GEMINI_API_KEY || "",
    model: "gemini-2.5-flash", // ou 'gemini-pro'
    maxTokens: 2048,
    temperature: 0.3, // Plus bas = plus déterministe
  },

  // Supabase Configuration
  supabase: {
    enabled: false, // Toggle pour activer/désactiver Supabase
    url: import.meta.env.VITE_SUPABASE_URL || "",
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
    tableName: "salaries",
  },

  // Features Toggles
  features: {
    naturalLanguageSearch: true,
    jobMatcher: true,
    pdfExport: true,
    cameroonSalaries: true,
    aiSummary: true,
  },

  // UI Configuration
  ui: {
    itemsPerPage: 20,
    minDataPointsForStats: 5, // Minimum de salaires pour afficher des stats
    defaultChartHeight: 400,
    mobileBreakpoint: 768, // px
  },

  // Stats Configuration
  stats: {
    experienceBrackets: [
      { min: 0, max: 2, label: "0-2 ans" },
      { min: 3, max: 5, label: "3-5 ans" },
      { min: 6, max: 10, label: "6-10 ans" },
      { min: 11, max: Infinity, label: "10+ ans" },
    ],
  },

  // App Metadata
  app: {
    name: "OpenPay",
    tagline: "Salaires Tech en toute transparence",
    version: "1.0.0",
    author: "Fox",
    repository: "https://github.com/theTigerFox/openpay",
  },

  // Roadmap.sh links - Comprehensive list for AI recommendations
  roadmaps: {
    roles: [
      {
        name: "DevOps Beginner",
        url: "https://roadmap.sh/devops?r=devops-beginner",
      },
      { name: "Frontend Developer", url: "https://roadmap.sh/frontend" },
      { name: "Backend Developer", url: "https://roadmap.sh/backend" },
      { name: "Full Stack Developer", url: "https://roadmap.sh/full-stack" },
      { name: "API Design", url: "https://roadmap.sh/api-design" },
      { name: "QA Engineer", url: "https://roadmap.sh/qa" },
      { name: "DevOps Engineer", url: "https://roadmap.sh/devops" },
      { name: "Android Developer", url: "https://roadmap.sh/android" },
      { name: "iOS Developer", url: "https://roadmap.sh/ios" },
      { name: "PostgreSQL DBA", url: "https://roadmap.sh/postgresql-dba" },
      {
        name: "Software Architect",
        url: "https://roadmap.sh/software-architect",
      },
      { name: "Technical Writer", url: "https://roadmap.sh/technical-writer" },
      { name: "DevRel Engineer", url: "https://roadmap.sh/devrel" },
      { name: "Machine Learning Engineer", url: "https://roadmap.sh/mlops" },
      {
        name: "AI and Data Scientist",
        url: "https://roadmap.sh/ai-data-scientist",
      },
      { name: "AI Engineer", url: "https://roadmap.sh/ai-engineer" },
      { name: "AI Agents", url: "https://roadmap.sh/ai-agents" },
      { name: "Data Analyst", url: "https://roadmap.sh/data-analyst" },
      { name: "BI Analyst", url: "https://roadmap.sh/bi-analyst" },
      { name: "Data Engineer", url: "https://roadmap.sh/data-engineer" },
      { name: "MLOps Engineer", url: "https://roadmap.sh/mlops" },
      { name: "Product Manager", url: "https://roadmap.sh/product-manager" },
      {
        name: "Engineering Manager",
        url: "https://roadmap.sh/engineering-manager",
      },
      {
        name: "Game Developer (Client)",
        url: "https://roadmap.sh/game-developer",
      },
      {
        name: "Game Developer (Server)",
        url: "https://roadmap.sh/server-side-game-developer",
      },
      { name: "UX Designer", url: "https://roadmap.sh/ux-design" },
      { name: "Blockchain Developer", url: "https://roadmap.sh/blockchain" },
      { name: "Cyber Security", url: "https://roadmap.sh/cyber-security" },
    ],
    skills: [
      { name: "GraphQL", url: "https://roadmap.sh/graphql" },
      { name: "Git and GitHub", url: "https://roadmap.sh/git-github" },
      { name: "React", url: "https://roadmap.sh/react" },
      { name: "Vue", url: "https://roadmap.sh/vue" },
      { name: "Angular", url: "https://roadmap.sh/angular" },
      { name: "Next.js", url: "https://roadmap.sh/nextjs" },
      { name: "Spring Boot", url: "https://roadmap.sh/spring-boot" },
      { name: "ASP.NET Core", url: "https://roadmap.sh/aspnet-core" },
      { name: "HTML", url: "https://roadmap.sh/html" },
      { name: "CSS", url: "https://roadmap.sh/css" },
      { name: "JavaScript", url: "https://roadmap.sh/javascript" },
      { name: "Kotlin", url: "https://roadmap.sh/kotlin" },
      { name: "TypeScript", url: "https://roadmap.sh/typescript" },
      { name: "Node.js", url: "https://roadmap.sh/nodejs" },
      { name: "PHP", url: "https://roadmap.sh/php" },
      { name: "C++", url: "https://roadmap.sh/cpp" },
      { name: "Go", url: "https://roadmap.sh/golang" },
      { name: "Rust", url: "https://roadmap.sh/rust" },
      { name: "Python", url: "https://roadmap.sh/python" },
      { name: "Java", url: "https://roadmap.sh/java" },
      { name: "SQL", url: "https://roadmap.sh/sql" },
      { name: "Docker", url: "https://roadmap.sh/docker" },
      { name: "Kubernetes", url: "https://roadmap.sh/kubernetes" },
      { name: "AWS", url: "https://roadmap.sh/aws" },
      { name: "Cloudflare", url: "https://roadmap.sh/cloudflare" },
      { name: "Linux", url: "https://roadmap.sh/linux" },
      { name: "Terraform", url: "https://roadmap.sh/terraform" },
      { name: "React Native", url: "https://roadmap.sh/react-native" },
      { name: "Flutter", url: "https://roadmap.sh/flutter" },
      { name: "MongoDB", url: "https://roadmap.sh/mongodb" },
      { name: "Redis", url: "https://roadmap.sh/redis" },
      { name: "Computer Science", url: "https://roadmap.sh/computer-science" },
      {
        name: "Data Structures",
        url: "https://roadmap.sh/datastructures-and-algorithms",
      },
      { name: "System Design", url: "https://roadmap.sh/system-design" },
      {
        name: "Design and Architecture",
        url: "https://roadmap.sh/software-design-architecture",
      },
      { name: "Code Review", url: "https://roadmap.sh/code-review" },
      { name: "AI Red Teaming", url: "https://roadmap.sh/ai-red-teaming" },
      {
        name: "Prompt Engineering",
        url: "https://roadmap.sh/prompt-engineering",
      },
      { name: "Design System", url: "https://roadmap.sh/design-system" },
    ],
  },
} as const;

// Type helper pour l'autocomplétion
export type Config = typeof config;
