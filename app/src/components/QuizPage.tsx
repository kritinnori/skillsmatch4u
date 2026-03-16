import { useState } from "react";
import { Button } from "./ui/button";
import { ArrowLeft, Star } from "lucide-react";
import type { Question } from "../types/question";

interface QuizPageProps {
  questions: Question[];
  onComplete: (answers: number[], additionalInfo?: string) => void;
  onBack: () => void;
}

const SCALE_OPTIONS = [
  { value: 1, label: "Strongly Disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Agree" },
  { value: 5, label: "Strongly Agree" },
];

export function QuizPage({ questions, onComplete, onBack }: QuizPageProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  const handleBack = () => {
    if (showAdditionalInfo) {
      // Go back from additional info screen to last question
      setShowAdditionalInfo(false);
      // Restore the answer for the last question
      if (answers.length > 0) {
        setSelectedAnswer(answers[answers.length - 1]);
      }
    } else if (isFirstQuestion) {
      // Exit quiz if on first question
      onBack();
    } else {
      // Go back to previous question
      const previousIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(previousIndex);
      // Restore the answer for the previous question
      if (answers[previousIndex] !== undefined) {
        setSelectedAnswer(answers[previousIndex]);
        // Remove the last answer from the answers array
        setAnswers(answers.slice(0, previousIndex));
      } else {
        setSelectedAnswer(null);
      }
    }
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);

    if (isLastQuestion) {
      setShowAdditionalInfo(true);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    }
  };

  const handleFinish = () => {
    onComplete(answers, additionalInfo.trim() || undefined);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navigation Bar */}
      <nav className="flex items-center justify-between p-4 md:p-6">
        <button
          onClick={handleBack}
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

      {/* Progress Bar */}
      <div className="px-4 md:px-8 pb-6">
        <div className="max-w-2xl mx-auto relative h-4 flex items-center">
          {/* Background red bar */}
          <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 bg-purple-900/30 rounded-full"></div>
          
          {/* Blue progress line */}
          <div 
            className="absolute top-1/2 left-0 h-1 -translate-y-1/2 bg-purple-500 rounded-full transition-all duration-300"
            style={{
              width: showAdditionalInfo 
                ? "100%" 
                : `${((currentQuestionIndex + 1) / questions.length) * 100}%`
            }}
          ></div>
          
          {/* Diamond markers */}
          <div className="relative w-full flex justify-between items-center">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rotate-45 z-10 ${
                  index <= currentQuestionIndex || showAdditionalInfo
                    ? "bg-purple-500"
                    : "bg-gray-600"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 md:px-6 pb-8">
        <div className="space-y-8">
          {!showAdditionalInfo ? (
            <>
              {/* Question */}
              <h2 className="text-xl leading-tight">
                {currentQuestion.question}
              </h2>

              {/* Answer Options - 1-5 Scale */}
              <div className="space-y-3">
                {SCALE_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedAnswer === option.value
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-gray-700 bg-gray-800 hover:border-gray-600"
                    }`}
                  >
                    <div className="relative flex items-center justify-center">
                      <input
                        type="radio"
                        name="answer"
                        value={option.value}
                        checked={selectedAnswer === option.value}
                        onChange={() => setSelectedAnswer(option.value)}
                        className="w-5 h-5 appearance-none rounded-full border-2 border-gray-500 bg-transparent checked:border-purple-500 checked:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent"
                      />
                      {selectedAnswer === option.value && (
                        <div className="absolute w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <span className="flex-1 text-gray-200">{option.label}</span>
                  </label>
                ))}
              </div>

              {/* Next Button */}
              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleNext}
                  disabled={selectedAnswer === null}
                  size="lg"
                  className="bg-purple-500 hover:bg-purple-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLastQuestion ? "Next" : "Next"}
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Additional Info Section */}
              <h2 className="text-xl leading-tight">
                Is there anything else you'd like to add?
              </h2>
              <p className="text-gray-400 text-sm">
                Share any additional information that might help us better understand your career preferences.
              </p>

              <textarea
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                placeholder="Type your thoughts here (optional)..."
                className="w-full p-4 rounded-lg border border-gray-700 bg-gray-800 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent min-h-[150px] resize-y"
              />

              {/* Finish Button */}
              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleFinish}
                  size="lg"
                  className="bg-purple-500 hover:bg-purple-600 text-white"
                >
                  Finish Quiz
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="max-w-2xl justify-center items-center flex flex-col mx-auto px-4 md:px-6 pb-8 mt-6 space-y-4">
        <div className="flex items-center gap-2 border-2 border-gray-800 rounded-2xl py-1 px-2 text-sm text-gray-400">
          <div className="flex -space-x-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full border-2 border-[#0a0a0a]"
                style={{
                  background: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)'
                }}
              />
            ))}
          </div>
          <span>Career clarity starts here</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <span>4.9 stars (1,500+ reviews)</span>
        </div>

        {/* Media Logos */}
        <div className="flex items-center gap-6 text-xs text-gray-500 pt-2">
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
