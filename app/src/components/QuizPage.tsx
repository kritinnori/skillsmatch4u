import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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

// --- sessionStorage helpers for quiz progress ---
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

  const SCALE_OPTIONS = useMemo(
    () => [
      { value: 1, label: t("quiz.scale.stronglyDisagree") },
      { value: 2, label: t("quiz.scale.disagree") },
      { value: 3, label: t("quiz.scale.neutral") },
      { value: 4, label: t("quiz.scale.agree") },
      { value: 5, label: t("quiz.scale.stronglyAgree") },
    ],
    [t]
  );

  // All state initializes from sessionStorage so language changes don't wipe progress
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

  // Synced setters — every write also goes to sessionStorage
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
    : ((currentQuestionIndex + 1) / questions.length) * 100;

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

    // Write answer at current index, preserving any answers beyond it
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
    // Clear quiz session storage on finish
    ["sm_qIndex","sm_qSelected","sm_qAnswers","sm_qAdditionalInfo","sm_qShowAdditional"].forEach(k =>
      sessionStorage.removeItem(k)
    );
    onComplete(answers, additionalInfo.trim() || undefined);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_bottom_left,rgba(126,34,206,0.28),transparent_42%)]" />

      <div className="relative z-10">
        <PageHeader user={user} onSignOut={onSignOut} onHome={onBack} onDashboard={onDashboard} onShowOpportunities={onShowOpportunities}
          onLoginRequired={onLoginRequired}
          brand={t("common.brand")}
          sticky
        />

        <main className="max-w-2xl mx-auto px-4 sm:px-6 py-4 md:py-8">
          {/* Back link below header */}
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{t("common.goBack")}</span>
          </button>

          {/* Progress bar */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 bg-[#1a1a1a] rounded-full h-2 overflow-hidden">
              <div
                className="bg-purple-500 h-full transition-all duration-500 ease-out rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-400 whitespace-nowrap">
              {showAdditionalInfo ? questions.length : currentQuestionIndex + 1}/{questions.length}
            </span>
          </div>
          <div className="bg-[#0d0d0d] rounded-2xl p-5 md:p-8 border border-purple-900/20">
            {!showAdditionalInfo ? (
              <div className="space-y-5 md:space-y-8">
                <div>
                  <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-white leading-snug">
                    {currentQuestion.question}
                  </h2>
                  <p className="text-sm text-gray-500 mt-2">
                    {t("quiz.selectHint")}
                  </p>
                </div>

                <div className="space-y-2.5">
                  {SCALE_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setSelectedAnswer(option.value)}
                      className={`w-full text-left px-4 py-3.5 rounded-xl border transition-all duration-200 ${
                        selectedAnswer === option.value
                          ? "border-purple-500 bg-purple-900/30"
                          : "border-gray-800 bg-[#0a0a0a] hover:border-gray-600"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                            selectedAnswer === option.value
                              ? "border-purple-500 bg-purple-600"
                              : "border-gray-600"
                          }`}
                        >
                          {selectedAnswer === option.value && (
                            <span className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>

                        <span
                          className={`text-[15px] font-medium ${
                            selectedAnswer === option.value
                              ? "text-white"
                              : "text-gray-300"
                          }`}
                        >
                          {option.label}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex gap-3 pt-4">
                  {!isFirstQuestion && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      className="border-gray-700 bg-transparent text-gray-300 hover:bg-gray-800 hover:text-white px-4"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      {t("quiz.previous")}
                    </Button>
                  )}

                  <Button
                    onClick={handleNext}
                    disabled={selectedAnswer === null}
                    className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 disabled:opacity-40"
                  >
                    {t("quiz.next")}
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-white">
                    {t("quiz.additionalInfoTitle")}
                  </h2>
                  <p className="text-sm text-gray-500 mt-2">
                    {t("quiz.additionalInfoSubtitle")}
                  </p>
                </div>

                <textarea
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  placeholder={t("quiz.additionalInfoPlaceholder")}
                  className="w-full px-4 py-3 border border-gray-800 rounded-xl bg-[#0a0a0a] text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 min-h-[140px] resize-y"
                />

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="border-gray-700 bg-transparent text-gray-300 hover:bg-gray-800 hover:text-white px-4"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    {t("quiz.previous")}
                  </Button>
                  <Button
                    onClick={handleFinish}
                    className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-semibold"
                  >
                    {t("quiz.finish")}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
