import { useState, useEffect } from "react";
import { ArrowLeft, Star } from "lucide-react";
import { analyzeAnswers, type CareerRecommendation } from "../lib/api";
import type { Question } from "../types/question";

interface ResultsPageProps {
  answers: number[];
  questions: Question[];
  additionalInfo?: string;
  onRestart: () => void;
  onBack: () => void;
}

export function ResultsPage({ answers, questions, additionalInfo, onBack }: ResultsPageProps) {
  const [career, setCareer] = useState<CareerRecommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        setLoading(true);
        const recommendation = await analyzeAnswers({
          answers,
          questions,
          additionalInfo,
        });
        setCareer(recommendation);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to get recommendation");
        setLoading(false);
      }
    };

    if (answers.length > 0 && questions.length > 0) {
      fetchRecommendation();
    }
  }, [answers, questions, additionalInfo]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <nav className="flex items-center justify-between p-4 md:p-6">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
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
          
          <div className="w-9"></div>
        </nav>

        <div className="max-w-3xl mx-auto px-4 md:px-6 pb-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="text-xl mb-4">Analyzing your responses...</div>
              <div className="text-gray-500">This may take a few moments</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !career) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <nav className="flex items-center justify-between p-4 md:p-6">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
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
          
          <div className="w-9"></div>
        </nav>

        <div className="max-w-3xl mx-auto px-4 md:px-6 pb-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="text-xl mb-4 text-red-500">Error: {error || "Failed to load recommendation"}</div>
              <button
                onClick={onBack}
                className="px-4 py-2 bg-purple-500 rounded-lg mt-4"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
