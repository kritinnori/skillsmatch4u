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
    howItWorksTitle: "यह कैसे काम करता है",
    howItWorksSubtitle: "तीन सरल चरणों में अपना आदर्श करियर पथ खोजें।",
    step1Title: "क्विज़ लें",
    step1Body: "अपने कौशल, रुचियों और कार्यशैली के बारे में प्रश्नों के उत्तर दें।",
    step2Title: "AI विश्लेषण",
    step2Body: "हमारी AI आपके उत्तरों का विश्लेषण करके उपयुक्त करियर खोजती है।",
    step3Title: "सिफारिशें पाएं",
    step3Body: "अपना करियर मैच, कोर्स और नौकरी सुझाव प्राप्त करें।",
    ctaTitle: "अपना सही करियर खोजने के लिए तैयार हैं?",
    ctaSubtitle: "आज ही अपना व्यक्तिगत करियर आकलन शुरू करें।",
    ctaNote: "कुछ मिनट लगते हैं • मुफ़्त • क्रेडिट कार्ड की ज़रूरत नहीं",
  },
  quiz: {
    loading: "प्रश्न लोड हो रहे हैं...",
    failedToLoad: "प्रश्न लोड करने में विफल",
    quizTitle: "करियर पथ क्विज़",
    progress: "प्रगति",
    of: "में से",
    estimatedTime: "अनुमानित समय",
    estimatedTimeValue: "10–15 मिनट",
    questionsAnswered: "उत्तर दिए गए प्रश्न",
    completion: "पूर्णता",
    currentCategory: "वर्तमान श्रेणी",
    selectHint: "वह विकल्प चुनें जो आपके उत्तर का सबसे अच्छा प्रतिनिधित्व करे",
    tipsTitle: "सुझाव",
    tip1: "सर्वोत्तम परिणाम के लिए ईमानदारी से उत्तर दें",
    tip2: "कोई गलत उत्तर नहीं है",
    tip3: "आप उत्तर बदलने के लिए पीछे जा सकते हैं",
    previous: "पिछला",
    questionNavigator: "प्रश्न नेविगेटर",
    confidentialNote: "सभी उत्तर गोपनीय हैं और केवल करियर सिफारिशों के लिए उपयोग किए जाते हैं",
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
    pageTitle: "आपके करियर परिणाम",
    idealCareer: "आपका आदर्श करियर पथ",
    aboutRole: "इस भूमिका के बारे में",
    heading: "आपका करियर मिलान",
    headingSubtitle: "आपके उत्तरों के आधार पर",
    matchScore: "मिलान स्कोर: {{score}}%",
    salaryRange: "वेतन सीमा",
    jobGrowth: "नौकरी वृद्धि",
    keySkills: "आवश्यक मुख्य कौशल",
    coursesTitle: "भारत में आप जो कोर्स कर सकते हैं",
    jobsTitle: "भारत में जिन नौकरियों के लिए आवेदन कर सकते हैं",
    noCoursesTitle: "दिखाने के लिए कोई कोर्स नहीं",
    noCoursesDescription:
      "इस करियर के लिए भारत में अभी हमें कोई कोर्स सुझाव नहीं मिला।",
    coursesUnavailableTitle: "कोर्स सुझाव लोड नहीं हो सके",
    coursesUnavailableDescription:
      "भारत में कोर्स खोजते समय कुछ गड़बड़ हुई। ऊपर दिया गया करियर मिलान अभी भी मान्य है — कृपया थोड़ी देर बाद फिर कोशिश करें।",
    noJobsTitle: "दिखाने के लिए कोई नौकरी नहीं",
    noJobsDescription:
      "इस करियर के लिए भारत में अभी हमें कोई नौकरी सूचीबद्ध नहीं मिली।",
    jobsUnavailableTitle: "नौकरी सुझाव लोड नहीं हो सके",
    jobsUnavailableDescription:
      "भारत में भूमिकाएँ खोजते समय कुछ गड़बड़ हुई। ऊपर दिया गया करियर मिलान अभी भी मान्य है — कृपया थोड़ी देर बाद फिर कोशिश करें।",
    coursesError: "कोर्स लोड करने में विफल",
    jobsError: "नौकरियाँ लोड करने में विफल",
  },
};

export default translations;
