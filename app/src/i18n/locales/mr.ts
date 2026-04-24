import type { Translations } from "./en";

const translations: Translations = {
  common: {
    brand: "क्विझ अॅप",
    goBack: "मागे जा",
    goBackButton: "मागे जा",
    errorPrefix: "त्रुटी",
    trustBadge: "करिअरची स्पष्टता येथूनच सुरू होते",
    personalizedMatching: "वैयक्तिक करिअर जुळणी",
    language: "भाषा",
  },
  home: {
    title: "तुमचा योग्य करिअर मार्ग शोधा",
    subtitle:
      "तुमचे व्यक्तिमत्व, कामाची शैली आणि मूल्यांच्या आधारे आदर्श व्यवसाय शोधण्यासाठी आमची सर्वसमावेशक करिअर मूल्यांकन क्विझ घ्या.",
    feature1Title: "वैयक्तिक निकाल",
    feature1Body:
      "तुमच्या अनोख्या व्यक्तिमत्वाला आणि प्राधान्यांना अनुरूप करिअर शिफारसी मिळवा.",
    feature2Title: "जलद आणि सोपे",
    feature2Body: "फक्त काही मिनिटांत आमचे ५ प्रश्नांचे मूल्यांकन पूर्ण करा.",
    feature3Title: "डेटा-आधारित",
    feature3Body:
      "आमचे अल्गोरिदम तुमच्या उत्तरांचे विश्लेषण करून अचूक माहिती देते.",
    startCta: "तुमचे करिअर मूल्यांकन सुरू करा",
  },
  quiz: {
    loading: "प्रश्न लोड होत आहेत...",
    failedToLoad: "प्रश्न लोड करण्यात अयशस्वी",
    scale: {
      stronglyDisagree: "अजिबात सहमत नाही",
      disagree: "सहमत नाही",
      neutral: "तटस्थ",
      agree: "सहमत",
      stronglyAgree: "पूर्णपणे सहमत",
    },
    next: "पुढे",
    additionalInfoTitle: "तुम्हाला आणखी काही जोडायचे आहे का?",
    additionalInfoSubtitle:
      "तुमच्या करिअर प्राधान्यांची अधिक चांगली समज होण्यासाठी मदत करणारी कोणतीही अतिरिक्त माहिती शेअर करा.",
    additionalInfoPlaceholder: "तुमचे विचार येथे टाइप करा (ऐच्छिक)...",
    finish: "क्विझ संपवा",
  },
  results: {
    analyzing: "तुमच्या उत्तरांचे विश्लेषण होत आहे...",
    analyzingHint: "यास काही क्षण लागू शकतात",
    failedToLoad: "शिफारस लोड करण्यात अयशस्वी",
    heading: "तुमची करिअर जुळणी",
    headingSubtitle: "तुमच्या उत्तरांवर आधारित",
    matchScore: "जुळणी गुण: {{score}}%",
    salaryRange: "पगार मर्यादा",
    jobGrowth: "नोकरी वाढ",
    keySkills: "आवश्यक मुख्य कौशल्ये",
    coursesTitle: "तुम्ही करू शकता असे अभ्यासक्रम",
    jobsTitle: "तुम्ही अर्ज करू शकता अशा नोकऱ्या",
    noCourses: "सध्या कोणत्याही अभ्यासक्रमाच्या शिफारसी उपलब्ध नाहीत.",
    noJobs: "सध्या कोणत्याही नोकरीच्या शिफारसी उपलब्ध नाहीत.",
    coursesError: "अभ्यासक्रम लोड करण्यात अयशस्वी",
    jobsError: "नोकऱ्या लोड करण्यात अयशस्वी",
  },
};

export default translations;
