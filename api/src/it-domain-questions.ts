/**
 * IT Domain Assessment Questions
 * 
 * 12 scenario-based questions designed for Indian high school students.
 * Each question maps to one or more IT domains.
 * 
 * 10 IT DOMAINS:
 * 1. AI & Data Science (ai_data_science)
 * 2. Data & Business Analytics (data_analytics)
 * 3. Software Development (software_dev)
 * 4. Mobile App Development (mobile_dev)
 * 5. Testing & Quality Assurance (testing_qa)
 * 6. Cybersecurity (cybersecurity)
 * 7. Cloud & DevOps (cloud_devops)
 * 8. IT Project Management (management)
 * 9. UI/UX Design (design_ux)
 * 10. IT Support & Systems (it_support)
 */

export interface ITQuestion {
  id: number;
  question: string;
  category: string;
  /** Primary domain this question measures */
  primaryDomain: string;
  /** Optional secondary domain */
  secondaryDomain?: string;
}

export const IT_DOMAINS = {
  ai_data_science: {
    name: "AI & Data Science",
    icon: "🤖",
    color: "#8B5CF6", // Purple
    description: "Build intelligent systems that learn and predict",
    careers: ["ML Engineer", "AI Developer", "Data Scientist", "AI Researcher"],
  },
  data_analytics: {
    name: "Data & Business Analytics",
    icon: "📊",
    color: "#3B82F6", // Blue
    description: "Turn data into business insights and decisions",
    careers: ["Data Analyst", "BI Analyst", "Business Analyst", "Data Engineer"],
  },
  software_dev: {
    name: "Software Development",
    icon: "💻",
    color: "#10B981", // Green
    description: "Build applications and software systems",
    careers: ["Full Stack Developer", "Backend Engineer", "Software Engineer"],
  },
  mobile_dev: {
    name: "Mobile App Development",
    icon: "📱",
    color: "#F59E0B", // Amber
    description: "Create apps for smartphones and tablets",
    careers: ["Android Developer", "iOS Developer", "Flutter Developer"],
  },
  testing_qa: {
    name: "Testing & Quality Assurance",
    icon: "🧪",
    color: "#EC4899", // Pink
    description: "Ensure software quality and find bugs",
    careers: ["QA Engineer", "Test Automation Engineer", "SDET"],
  },
  cybersecurity: {
    name: "Cybersecurity",
    icon: "🔒",
    color: "#EF4444", // Red
    description: "Protect systems and data from threats",
    careers: ["Security Analyst", "Ethical Hacker", "SOC Analyst"],
  },
  cloud_devops: {
    name: "Cloud & DevOps",
    icon: "☁️",
    color: "#06B6D4", // Cyan
    description: "Build and manage cloud infrastructure",
    careers: ["Cloud Engineer", "DevOps Engineer", "SRE", "Platform Engineer"],
  },
  management: {
    name: "IT Project Management",
    icon: "📋",
    color: "#8B5CF6", // Purple
    description: "Lead teams and deliver IT projects",
    careers: ["Project Manager", "Scrum Master", "Product Manager", "Tech Lead"],
  },
  design_ux: {
    name: "UI/UX Design",
    icon: "🎨",
    color: "#F97316", // Orange
    description: "Design beautiful and user-friendly interfaces",
    careers: ["UX Designer", "UI Designer", "Product Designer"],
  },
  it_support: {
    name: "IT Support & Systems",
    icon: "🔧",
    color: "#64748B", // Slate
    description: "Help users and maintain IT systems",
    careers: ["IT Support Specialist", "System Administrator", "Network Admin"],
  },
};

/**
 * 12 IT-focused questions for high school students
 * 
 * Question design principles:
 * - Scenario-based (not technical jargon)
 * - Relatable to Indian students (school projects, apps they use)
 * - Tests natural preferences, not existing knowledge
 * - Each question has a clear primary domain mapping
 */
export const IT_QUESTIONS: ITQuestion[] = [
  // Q1: AI & Data Science
  {
    id: 1,
    question: "You notice that YouTube always recommends videos you like. You find yourself wondering...",
    category: "Curiosity",
    primaryDomain: "ai_data_science",
    secondaryDomain: "data_analytics",
  },
  // Q2: Data & Analytics
  {
    id: 2,
    question: "Your teacher gives you IPL match data for 5 years. What excites you most?",
    category: "Activity",
    primaryDomain: "data_analytics",
  },
  // Q3: Software Development
  {
    id: 3,
    question: "You have an idea for an app that could help students in your school. Your first thought is...",
    category: "Builder",
    primaryDomain: "software_dev",
    secondaryDomain: "mobile_dev",
  },
  // Q4: Mobile Development
  {
    id: 4,
    question: "When using apps like Zomato or Swiggy, what interests you most?",
    category: "Focus",
    primaryDomain: "mobile_dev",
    secondaryDomain: "design_ux",
  },
  // Q5: Testing & QA
  {
    id: 5,
    question: "Your friend shows you their new website before launch. You naturally...",
    category: "Attention",
    primaryDomain: "testing_qa",
  },
  // Q6: Cybersecurity
  {
    id: 6,
    question: "You hear news about a company getting hacked. Your reaction is...",
    category: "Security",
    primaryDomain: "cybersecurity",
  },
  // Q7: Cloud & DevOps
  {
    id: 7,
    question: "A popular app crashes during a big sale (like Flipkart Big Billion Days). You think about...",
    category: "Systems",
    primaryDomain: "cloud_devops",
    secondaryDomain: "software_dev",
  },
  // Q8: IT Management
  {
    id: 8,
    question: "In a group project, you usually prefer to...",
    category: "Leadership",
    primaryDomain: "management",
  },
  // Q9: UI/UX Design
  {
    id: 9,
    question: "When an app or website is confusing to use, you...",
    category: "Design",
    primaryDomain: "design_ux",
  },
  // Q10: IT Support & Systems
  {
    id: 10,
    question: "When your family's WiFi or computer has problems, you typically...",
    category: "Support",
    primaryDomain: "it_support",
  },
  // Q11: Mixed (Technical vs Creative)
  {
    id: 11,
    question: "If you could choose one superpower for your future job, it would be...",
    category: "Preference",
    primaryDomain: "software_dev", // Will be determined by answer
  },
  // Q12: Mixed (Work Style)
  {
    id: 12,
    question: "When working on something challenging, you prefer to...",
    category: "WorkStyle",
    primaryDomain: "data_analytics", // Will be determined by answer
  },
];

/**
 * Question texts for seeding (matches the questions array format)
 */
export const IT_QUESTIONS_FOR_SEED = IT_QUESTIONS.map(q => ({
  question: q.question,
  category: q.category,
}));
