const translations = {
  common: {
    brand: "skillsmatch4u",
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
    howItWorksTitle: "How It Works",
    howItWorksSubtitle:
      "Discover your ideal career path in three simple steps.",
    step1Title: "Take the Quiz",
    step1Body:
      "Answer questions about your skills, interests, and work style.",
    step2Title: "AI Analysis",
    step2Body:
      "Our AI analyzes your responses to find careers that fit you.",
    step3Title: "Get Recommendations",
    step3Body:
      "Receive your career match with courses and job suggestions.",
    ctaTitle: "Ready to Find Your Perfect Career?",
    ctaSubtitle:
      "Start your personalized career assessment today.",
    ctaNote: "Takes just a few minutes • Free • No credit card required",
  },
  quiz: {
    loading: "Loading questions...",
    failedToLoad: "Failed to load questions",
    quizTitle: "Career Path Quiz",
    progress: "Progress",
    of: "of",
    estimatedTime: "Estimated Time",
    estimatedTimeValue: "10–15 minutes",
    questionsAnswered: "Questions Answered",
    completion: "Completion",
    currentCategory: "Current Category",
    selectHint: "Select the option that best represents your answer",
    tipsTitle: "Tips",
    tip1: "Answer honestly for best results",
    tip2: "There are no wrong answers",
    tip3: "You can go back to change answers",
    previous: "Previous",
    questionNavigator: "Question Navigator",
    confidentialNote:
      "All answers are confidential and used only for career recommendations",
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
    pageTitle: "Your Career Results",
    idealCareer: "Your Ideal Career Path",
    aboutRole: "About This Role",
    heading: "Your Career Match",
    headingSubtitle: "Based on your responses",
    matchScore: "Match Score: {{score}}%",
    salaryRange: "Salary Range",
    jobGrowth: "Job Growth",
    keySkills: "Key Skills Required",
    coursesTitle: "Courses You Can Do in India",
    jobsTitle: "Jobs You Can Apply To in India",
    noCoursesTitle: "No courses to show",
    noCoursesDescription:
      "We didn't find course suggestions for this career in India right now.",
    coursesUnavailableTitle: "Couldn't load course suggestions",
    coursesUnavailableDescription:
      "Something went wrong while we looked for courses in India. Your career match above is still valid — please try again in a moment.",
    noJobsTitle: "No jobs to show",
    noJobsDescription:
      "We didn't find job openings in India to list for this career right now.",
    jobsUnavailableTitle: "Couldn't load job suggestions",
    jobsUnavailableDescription:
      "Something went wrong while we looked for roles in India. Your career match above is still valid — please try again in a moment.",
    coursesError: "Failed to load courses",
    jobsError: "Failed to load jobs",
  },
};

export default translations;
export type Translations = typeof translations;
