import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import type { Question } from "../types/question";
import { PageHeader } from "./layout/PageHeader";

interface QuizPageProps {
  user?: { id: string; email?: string } | null;
  onSignOut?: () => void;
  onDashboard?: () => void;
  onShowOpportunities?: () => void;
  onLoginRequired?: () => void;
  questions: Question[];
  onComplete: (answers: number[], additionalInfo?: string) => void;
  onBack: () => void;
}

function readQuizSession<T>(key: string, fallback: T): T {
  try {
    const raw = sessionStorage.getItem(key);
    return raw !== null ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function QuizPage({ questions, onComplete, onBack, user, onSignOut, onDashboard, onShowOpportunities, onLoginRequired }: QuizPageProps) {
  const { t } = useTranslation();

  // 7-point scale - "How interested/curious are you?"
  const SCALE_OPTIONS = useMemo(
    () => [
      { value: 1, color: "from-red-500 to-red-600", hoverBg: "hover:bg-red-500/20", activeBg: "bg-red-500", label: t("quiz.scale.notAtAll", { defaultValue: "Not at all" }) },
      { value: 2, color: "from-orange-500 to-orange-600", hoverBg: "hover:bg-orange-500/20", activeBg: "bg-orange-500", label: t("quiz.scale.notReally", { defaultValue: "Not really" }) },
      { value: 3, color: "from-amber-500 to-amber-600", hoverBg: "hover:bg-amber-500/20", activeBg: "bg-amber-400", label: t("quiz.scale.aLittle", { defaultValue: "A little" }) },
      { value: 4, color: "from-gray-400 to-gray-500", hoverBg: "hover:bg-gray-500/20", activeBg: "bg-gray-400", label: t("quiz.scale.neutral") },
      { value: 5, color: "from-lime-500 to-lime-600", hoverBg: "hover:bg-lime-500/20", activeBg: "bg-lime-500", label: t("quiz.scale.interested", { defaultValue: "Interested" }) },
      { value: 6, color: "from-emerald-500 to-emerald-600", hoverBg: "hover:bg-emerald-500/20", activeBg: "bg-emerald-500", label: t("quiz.scale.veryCurious", { defaultValue: "Very curious" }) },
      { value: 7, color: "from-green-500 to-green-600", hoverBg: "hover:bg-green-500/20", activeBg: "bg-green-500", label: t("quiz.scale.loveToKnow", { defaultValue: "Would love to know!" }) },
    ],
    [t]
  );

  const [currentQuestionIndex, setCurrentQuestionIndexRaw] = useState(() =>
    readQuizSession<number>("sm_qIndex", 0)
  );
  const [selectedAnswer, setSelectedAnswerRaw] = useState<number | null>(() =>
    readQuizSession<number | null>("sm_qSelected", null)
  );
  const [answers, setAnswersRaw] = useState<number[]>(() =>
    readQuizSession<number[]>("sm_qAnswers", [])
  );
  const [additionalInfo, setAdditionalInfoRaw] = useState<string>(() =>
    readQuizSession<string>("sm_qAdditionalInfo", "")
  );
  const [showAdditionalInfo, setShowAdditionalInfoRaw] = useState<boolean>(() =>
    readQuizSession<boolean>("sm_qShowAdditional", false)
  );

  const setCurrentQuestionIndex = (i: number) => {
    sessionStorage.setItem("sm_qIndex", JSON.stringify(i));
    setCurrentQuestionIndexRaw(i);
  };
  const setSelectedAnswer = (a: number | null) => {
    sessionStorage.setItem("sm_qSelected", JSON.stringify(a));
    setSelectedAnswerRaw(a);
  };
  const setAnswers = (a: number[]) => {
    sessionStorage.setItem("sm_qAnswers", JSON.stringify(a));
    setAnswersRaw(a);
  };
  const setAdditionalInfo = (s: string) => {
    sessionStorage.setItem("sm_qAdditionalInfo", JSON.stringify(s));
    setAdditionalInfoRaw(s);
  };
  const setShowAdditionalInfo = (v: boolean) => {
    sessionStorage.setItem("sm_qShowAdditional", JSON.stringify(v));
    setShowAdditionalInfoRaw(v);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;
  const progress = showAdditionalInfo
    ? 100
    : ((currentQuestionIndex) / questions.length) * 100;

  const handleBack = () => {
    if (showAdditionalInfo) {
      setShowAdditionalInfo(false);
      const lastIndex = questions.length - 1;
      setSelectedAnswer(answers[lastIndex] ?? null);
    } else if (isFirstQuestion) {
      onBack();
    } else {
      const previousIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(previousIndex);
      setSelectedAnswer(answers[previousIndex] ?? null);
    }
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = selectedAnswer;
    setAnswers(newAnswers);

    if (isLastQuestion) {
      setShowAdditionalInfo(true);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(newAnswers[currentQuestionIndex + 1] ?? null);
    }
  };

  const handleFinish = () => {
    ["sm_qIndex","sm_qSelected","sm_qAnswers","sm_qAdditionalInfo","sm_qShowAdditional"].forEach(k =>
      sessionStorage.removeItem(k)
    );
    onComplete(answers, additionalInfo.trim() || undefined);
  };

  // Get selected option for styling
  const selectedOption = SCALE_OPTIONS.find(o => o.value === selectedAnswer);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0a1a] via-[#0a0a0a] to-[#0a0a0a] text-white">
      <PageHeader 
        user={user} 
        onSignOut={onSignOut} 
        onHome={onBack} 
        onDashboard={onDashboard} 
        onShowOpportunities={onShowOpportunities}
        onLoginRequired={onLoginRequired}
        brand={t("common.brand")}
        sticky
      />

      <main className="max-w-3xl mx-auto px-4 flex flex-col" style={{ minHeight: 'calc(100vh - 56px)' }}>
        {/* Progress Bar - Thin line at top like Typeform */}
        <div className="h-1 bg-[#1a1a2e] w-full mt-4 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Navigation Row */}
        <div className="flex items-center justify-between py-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{t("common.goBack")}</span>
          </button>
          <span className="text-sm font-medium text-purple-400">
            {showAdditionalInfo ? questions.length : currentQuestionIndex + 1} / {questions.length}
          </span>
        </div>

        {!showAdditionalInfo ? (
          <div className="flex-1 flex flex-col justify-center py-4">
            {/* Question - Centered */}
            <div className="text-center px-2 mb-10 md:mb-12">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-snug">
                {currentQuestion?.question}
              </h1>
            </div>

            {/* 7-Point Scale */}
            <div className="space-y-4">
              {/* Scale Labels */}
              <div className="flex justify-between text-xs text-gray-400 px-1">
                <span>{t("quiz.notInterested", { defaultValue: "Not interested" })}</span>
                <span>{t("quiz.veryCurious", { defaultValue: "Very curious" })}</span>
              </div>
              
              {/* Scale Buttons - Touch friendly sizes */}
              <div className="flex items-center justify-center gap-2.5 sm:gap-3 md:gap-4">
                {SCALE_OPTIONS.map((option, index) => {
                  const isSelected = selectedAnswer === option.value;
                  // Larger touch targets
                  const sizes = [
                    "w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16",
                    "w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14",
                    "w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12",
                    "w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10",
                    "w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12",
                    "w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14",
                    "w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16",
                  ];
                  const sizeClass = sizes[index];
                  
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setSelectedAnswer(isSelected ? null : option.value)}
                      className={`${sizeClass} rounded-full border-2 transition-all duration-200 ${
                        isSelected
                          ? "bg-purple-500 border-purple-400 scale-110 shadow-lg shadow-purple-500/40"
                          : "bg-transparent border-purple-500/50 active:scale-95 active:bg-purple-500/30"
                      }`}
                      title={option.label}
                    />
                  );
                })}
              </div>

              {/* Selected Label */}
              <div className="h-6 text-center">
                {selectedOption && (
                  <span className="text-sm font-medium text-purple-400">
                    {selectedOption.label}
                  </span>
                )}
              </div>
            </div>

            {/* Next Button */}
            <div className="flex justify-center mt-10 md:mt-12">
              <Button
                onClick={handleNext}
                disabled={selectedAnswer === null}
                className={`px-10 py-3 text-base font-semibold rounded-full transition-all duration-200 ${
                  selectedAnswer !== null
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-500/25 active:scale-95"
                    : "bg-[#2a2a3e] text-gray-400 border border-gray-600 cursor-not-allowed"
                }`}
              >
                {isLastQuestion ? t("quiz.finish", { defaultValue: "Finish" }) : t("quiz.next")}
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        ) : (
          /* Final Step */
          <div className="max-w-xl mx-auto space-y-8">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-3xl">🎯</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                {t("quiz.almostThere", { defaultValue: "Almost there!" })}
              </h1>
              <p className="text-gray-400 mt-3 text-lg">
                {t("quiz.additionalInfoSubtitle")}
              </p>
            </div>

            <textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder={t("quiz.additionalInfoPlaceholder")}
              className="w-full px-5 py-4 border-2 border-[#2a2a3e] rounded-2xl bg-[#111118] text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 min-h-[140px] resize-none text-base transition-colors"
            />

            <p className="text-sm text-gray-500 text-center">
              {t("quiz.optionalSkip", { defaultValue: "This is optional - feel free to skip" })}
            </p>

            <div className="flex justify-center">
              <Button
                onClick={handleFinish}
                className="px-12 py-4 text-base font-semibold rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-500/25"
              >
                {t("quiz.seeResults", { defaultValue: "See My Results" })}
                <Sparkles className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
