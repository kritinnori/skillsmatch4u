import { ArrowLeft, Star } from "lucide-react";

interface ResultsPageProps {
  answers: number[];
  onRestart: () => void;
  onBack: () => void;
}

// Career recommendation based on answers
function getCareerRecommendation(answers: number[]): {
  title: string;
  description: string;
  matchScore: number;
  skills: string[];
  salary: string;
  growth: string;
} {
  // Simple algorithm based on answer patterns
  const totalScore = answers.reduce((sum, ans) => sum + ans, 0);
  
  if (totalScore <= 2) {
    return {
      title: "Software Engineer",
      description: "You thrive in structured environments and enjoy solving complex problems. A career in software engineering would allow you to work independently while contributing to meaningful projects.",
      matchScore: 92,
      skills: ["Problem Solving", "Logical Thinking", "Attention to Detail", "Technical Skills"],
      salary: "$100,000 - $150,000",
      growth: "22% growth expected"
    };
  } else if (totalScore <= 4) {
    return {
      title: "Product Manager",
      description: "Your balanced approach to work and preference for collaborative environments makes you an ideal fit for product management. You excel at leading teams and making strategic decisions.",
      matchScore: 88,
      skills: ["Leadership", "Strategic Thinking", "Communication", "Team Collaboration"],
      salary: "$120,000 - $180,000",
      growth: "18% growth expected"
    };
  } else if (totalScore <= 6) {
    return {
      title: "UX Designer",
      description: "Your creative mindset and focus on user impact align perfectly with UX design. You enjoy flexible work environments and making a meaningful difference in people's lives.",
      matchScore: 95,
      skills: ["Creativity", "User Empathy", "Design Thinking", "Problem Solving"],
      salary: "$85,000 - $130,000",
      growth: "15% growth expected"
    };
  } else {
    return {
      title: "Marketing Manager",
      description: "Your dynamic personality and preference for fast-paced environments make you perfect for marketing. You excel at creative campaigns and thrive in adaptable settings.",
      matchScore: 90,
      skills: ["Creativity", "Communication", "Analytics", "Strategic Planning"],
      salary: "$70,000 - $120,000",
      growth: "10% growth expected"
    };
  }
}

export function ResultsPage({ answers, onBack }: ResultsPageProps) {
  const career = getCareerRecommendation(answers);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navigation Bar */}
      <nav className="flex items-center justify-between p-4 md:p-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <div 
              className="w-8 h-8 rounded-lg"
              style={{
                background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 25%, #10b981 50%, #3b82f6 75%, #a855f7 100%)',
                clipPath: 'polygon(0 0, 100% 0, 100% 70%, 50% 100%, 0 70%)'
              }}
            />
            <span className="text-2xl font-bold ml-1">Quiz App</span>
          </div>
        </div>
        
        <div className="w-9"></div> {/* Spacer for centering */}
      </nav>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 md:px-6 pb-8">
        <div className="space-y-8 py-12">
          {/* Header */}
          <div className="text-center space-y-1">
            <h1 className="text-xl font-bold tracking-tight">Your Career Match</h1>
            <p className="text-md text-gray-500">Based on your responses</p>
          </div>

          {/* Career Title - Large */}
          <div className="text-center border-b border-gray-800 pb-8">
            <h2 className="text-5xl font-bold mb-4">{career.title}</h2>
            <p className="text-xl text-gray-500 font-light">Match Score: {career.matchScore}%</p>
          </div>

          {/* Description */}
          <div className="max-w-2xl mx-auto">
            <p className="text-md text-gray-400 leading-relaxed text-center">
              {career.description}
            </p>
          </div>

          {/* Career Details */}
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="text-center space-y-2">
              <p className="text-sm uppercase tracking-wider text-gray-600 font-semibold">Salary Range</p>
              <p className="text-md font-bold">{career.salary}</p>
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm uppercase tracking-wider text-gray-600 font-semibold">Job Growth</p>
              <p className="text-md font-bold">{career.growth}</p>
            </div>
          </div>

          {/* Skills */}
          <div className="max-w-2xl mx-auto space-y-6">
            <h3 className="text-md uppercase tracking-wider text-gray-600 font-semibold text-center">Key Skills Required</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {career.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-6 py-2 rounded-full border border-gray-800 bg-gray-900/50 text-base text-gray-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Trust Indicators */}
      <div className="max-w-2xl justify-center items-center flex flex-col mx-auto px-4 md:px-6 pb-8 mt-0 space-y-6">
        <div className="flex items-center gap-2 border border-gray-800 rounded-lg py-2 px-4 text-sm text-gray-500">
          <div className="flex -space-x-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full border-2 border-[#0a0a0a] bg-gray-700"
              />
            ))}
          </div>
          <span>Trusted by 700,000+ people</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-gray-600 text-gray-600" />
            ))}
          </div>
          <span>4.9 stars (1,500+ reviews)</span>
        </div>

        {/* Media Logos */}
        <div className="flex items-center gap-6 text-xs text-gray-600 pt-2">
          <span>FOX</span>
          <span>CNN</span>
          <span>WSJ</span>
          <span>TechCrunch</span>
          <span>MSNBC</span>
        </div>
      </div>
    </div>
  );
}
