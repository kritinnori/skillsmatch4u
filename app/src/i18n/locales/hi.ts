import type { Translations } from "./en";

const translations: Translations = {
  common: {
    brand: "क्विज़ ऐप",
    goBack: "वापस जाएँ",
    goBackButton: "वापस जाएँ",
    errorPrefix: "त्रुटि",
    trustBadge: "करियर की स्पष्टता यहीं से शुरू होती है",
    personalizedMatching: "व्यक्तिगत करियर मिलान",
    language: "भाषा",
  },
  home: {
    title: "अपना सही करियर पथ खोजें",
    subtitle:
      "हमारे विस्तृत करियर आकलन क्विज़ के माध्यम से अपने व्यक्तित्व, कार्यशैली और मूल्यों के अनुसार आदर्श पेशे की पहचान करें।",
    feature1Title: "व्यक्तिगत परिणाम",
    feature1Body:
      "आपके अनूठे व्यक्तित्व और प्राथमिकताओं के अनुरूप करियर सुझाव प्राप्त करें।",
    feature2Title: "तेज़ और आसान",
    feature2Body:
      "हमारे 5 प्रश्नों वाला आकलन कुछ ही मिनटों में पूरा करें।",
    feature3Title: "डेटा-आधारित",
    feature3Body:
      "हमारा एल्गोरिथम आपके उत्तरों का विश्लेषण करके सटीक जानकारी देता है।",
    startCta: "अपना करियर आकलन शुरू करें",
  },
  quiz: {
    loading: "प्रश्न लोड हो रहे हैं...",
    failedToLoad: "प्रश्न लोड करने में विफल",
    scale: {
      stronglyDisagree: "पूरी तरह असहमत",
      disagree: "असहमत",
      neutral: "तटस्थ",
      agree: "सहमत",
      stronglyAgree: "पूरी तरह सहमत",
    },
    next: "आगे",
    additionalInfoTitle: "क्या आप कुछ और जोड़ना चाहेंगे?",
    additionalInfoSubtitle:
      "कोई भी अतिरिक्त जानकारी साझा करें जो आपकी करियर प्राथमिकताओं को बेहतर समझने में मदद कर सके।",
    additionalInfoPlaceholder: "अपने विचार यहाँ लिखें (वैकल्पिक)...",
    finish: "क्विज़ समाप्त करें",
  },
  results: {
    analyzing: "आपके उत्तरों का विश्लेषण किया जा रहा है...",
    analyzingHint: "इसमें कुछ समय लग सकता है",
    failedToLoad: "सिफारिश लोड करने में विफल",
    heading: "आपका करियर मिलान",
    headingSubtitle: "आपके उत्तरों के आधार पर",
    matchScore: "मिलान स्कोर: {{score}}%",
    salaryRange: "वेतन सीमा",
    jobGrowth: "नौकरी वृद्धि",
    keySkills: "आवश्यक मुख्य कौशल",
    coursesTitle: "कोर्स जो आप कर सकते हैं",
    jobsTitle: "नौकरियाँ जिनके लिए आप आवेदन कर सकते हैं",
    noCourses: "अभी कोई कोर्स सुझाव उपलब्ध नहीं है।",
    noJobs: "अभी कोई नौकरी सुझाव उपलब्ध नहीं है।",
    coursesError: "कोर्स लोड करने में विफल",
    jobsError: "नौकरियाँ लोड करने में विफल",
  },
};

export default translations;
