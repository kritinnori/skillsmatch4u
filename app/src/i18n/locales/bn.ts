import type { Translations } from "./en";

const translations: Translations = {
  common: {
    brand: "কুইজ অ্যাপ",
    goBack: "পিছনে যান",
    goBackButton: "পিছনে যান",
    errorPrefix: "ত্রুটি",
    trustBadge: "ক্যারিয়ারের স্পষ্টতা এখানেই শুরু",
    personalizedMatching: "ব্যক্তিগত ক্যারিয়ার মিলন",
    language: "ভাষা",
  },
  home: {
    title: "আপনার সঠিক ক্যারিয়ার পথ খুঁজুন",
    subtitle:
      "আমাদের বিস্তৃত ক্যারিয়ার মূল্যায়ন কুইজের মাধ্যমে আপনার ব্যক্তিত্ব, কাজের ধরন এবং মূল্যবোধের ভিত্তিতে আদর্শ পেশা খুঁজে বের করুন।",
    feature1Title: "ব্যক্তিগত ফলাফল",
    feature1Body:
      "আপনার অনন্য ব্যক্তিত্ব এবং পছন্দ অনুযায়ী ক্যারিয়ার সুপারিশ পান।",
    feature2Title: "দ্রুত এবং সহজ",
    feature2Body:
      "মাত্র কয়েক মিনিটে আমাদের ৫টি প্রশ্নের মূল্যায়ন সম্পন্ন করুন।",
    feature3Title: "ডেটা-চালিত",
    feature3Body:
      "আমাদের অ্যালগরিদম আপনার উত্তর বিশ্লেষণ করে সঠিক তথ্য প্রদান করে।",
    startCta: "আপনার ক্যারিয়ার মূল্যায়ন শুরু করুন",
  },
  quiz: {
    loading: "প্রশ্ন লোড হচ্ছে...",
    failedToLoad: "প্রশ্ন লোড করতে ব্যর্থ",
    scale: {
      stronglyDisagree: "দৃঢ়ভাবে অসম্মত",
      disagree: "অসম্মত",
      neutral: "নিরপেক্ষ",
      agree: "সম্মত",
      stronglyAgree: "দৃঢ়ভাবে সম্মত",
    },
    next: "পরবর্তী",
    additionalInfoTitle: "আপনি কি আরও কিছু যোগ করতে চান?",
    additionalInfoSubtitle:
      "যেকোনো অতিরিক্ত তথ্য শেয়ার করুন যা আপনার ক্যারিয়ার পছন্দ আরও ভালভাবে বুঝতে সাহায্য করবে।",
    additionalInfoPlaceholder: "এখানে আপনার চিন্তাভাবনা লিখুন (ঐচ্ছিক)...",
    finish: "কুইজ শেষ করুন",
  },
  results: {
    analyzing: "আপনার উত্তর বিশ্লেষণ করা হচ্ছে...",
    analyzingHint: "এতে কিছু সময় লাগতে পারে",
    failedToLoad: "সুপারিশ লোড করতে ব্যর্থ",
    heading: "আপনার ক্যারিয়ার মিলন",
    headingSubtitle: "আপনার উত্তরের ভিত্তিতে",
    matchScore: "মিল স্কোর: {{score}}%",
    salaryRange: "বেতনের পরিসর",
    jobGrowth: "চাকরির বৃদ্ধি",
    keySkills: "প্রয়োজনীয় প্রধান দক্ষতা",
    coursesTitle: "যে কোর্সগুলি আপনি করতে পারেন",
    jobsTitle: "যে চাকরিগুলিতে আবেদন করতে পারেন",
    noCoursesTitle: "দেখানোর মতো কোনো কোর্স নেই",
    noCoursesDescription:
      "এই ক্যারিয়ারের জন্য এখন কোনো কোর্সের সুপারিশ পাওয়া যায়নি।",
    coursesUnavailableTitle: "কোর্সের সুপারিশ লোড করা যায়নি",
    coursesUnavailableDescription:
      "কোর্স খুঁজতে গিয়ে সমস্যা হয়েছে। উপরের ক্যারিয়ার মিল এখনও সঠিক — একটু পরে আবার চেষ্টা করুন।",
    noJobsTitle: "দেখানোর মতো কোনো চাকরি নেই",
    noJobsDescription:
      "এই ক্যারিয়ারের জন্য এখন কোনো চাকরির তালিকা পাওয়া যায়নি।",
    jobsUnavailableTitle: "চাকরির সুপারিশ লোড করা যায়নি",
    jobsUnavailableDescription:
      "চাকরি খুঁজতে গিয়ে সমস্যা হয়েছে। উপরের ক্যারিয়ার মিল এখনও সঠিক — একটু পরে আবার চেষ্টা করুন।",
    coursesError: "কোর্স লোড করতে ব্যর্থ",
    jobsError: "চাকরি লোড করতে ব্যর্থ",
  },
};

export default translations;
