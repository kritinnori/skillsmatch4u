const translations = {
  common: {
    brand: "Quiz App",
    goBack: "Go back",
    goBackButton: "Go Back",
    errorPrefix: "Error",
    trustBadge: "Career clarity starts here",
    personalizedMatching: "Personalized career matching",
    language: "Language",
  },
  home: {
    title: "Discover Your Perfect Career Path",
    subtitle:
      "Take our comprehensive career assessment quiz to uncover your ideal profession based on your personality, work style, and values.",
    feature1Title: "Personalized Results",
    feature1Body:
      "Get career recommendations tailored to your unique personality and preferences.",
    feature2Title: "Quick & Easy",
    feature2Body: "Complete our 5-question assessment in just a few minutes.",
    feature3Title: "Data-Driven",
    feature3Body:
      "Our algorithm analyzes your responses to provide accurate insights.",
    startCta: "Start Your Career Assessment",
  },
  quiz: {
    loading: "Loading questions...",
    failedToLoad: "Failed to load questions",
    scale: {
      stronglyDisagree: "Strongly Disagree",
      disagree: "Disagree",
      neutral: "Neutral",
      agree: "Agree",
      stronglyAgree: "Strongly Agree",
    },
    next: "Next",
    additionalInfoTitle: "Is there anything else you'd like to add?",
    additionalInfoSubtitle:
      "Share any additional information that might help us better understand your career preferences.",
    additionalInfoPlaceholder: "Type your thoughts here (optional)...",
    finish: "Finish Quiz",
  },
  results: {
    analyzing: "Analyzing your responses...",
    analyzingHint: "This may take a few moments",
    failedToLoad: "Failed to load recommendation",
    heading: "Your Career Match",
    headingSubtitle: "Based on your responses",
    matchScore: "Match Score: {{score}}%",
    salaryRange: "Salary Range",
    jobGrowth: "Job Growth",
    keySkills: "Key Skills Required",
    coursesTitle: "Courses You Can Do",
    jobsTitle: "Jobs You Can Apply To",
    noCourses: "No course suggestions available right now.",
    noJobs: "No job suggestions available right now.",
    coursesError: "Failed to load courses",
    jobsError: "Failed to load jobs",
  },
};

export default translations;
export type Translations = typeof translations;
