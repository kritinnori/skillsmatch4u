import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Zap,
  BarChart3,
} from "lucide-react";
import type { Question } from "../types/question";
import { PageHeader } from "./layout/PageHeader";

interface QuizPageProps {
  user?: { id: string; email?: string } | null;
  onSignOut?: () => void;
  onDashboard?: () => void;
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

export function QuizPage({ questions, onComplete, onBack, user, onSignOut, onDashboard }: QuizPageProps) {
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
  const answeredCount = answers.filter(a => a !== undefined).length;
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

  const jumpToQuestion = (index: number) => {
    if (index > answeredCount) return;

    // FIX: save the current selectedAnswer before jumping away
    if (selectedAnswer !== null) {
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = selectedAnswer;
      setAnswers(newAnswers);
    }

    setShowAdditionalInfo(false);
    setCurrentQuestionIndex(index);
    setSelectedAnswer(answers[index] ?? null);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_bottom_left,rgba(126,34,206,0.28),transparent_42%)]" />

      <div className="relative z-10">
        <PageHeader user={user} onSignOut={onSignOut} onHome={onBack} onDashboard={onDashboard}
          brand={t("common.brand")}
          onBack={handleBack}
          backLabel={t("common.goBack")}
          title={t("quiz.quizTitle")}
          sticky
        >
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-body-sm">
              <span className="text-gray-300">{t("quiz.progress")}</span>
              <span className="font-semibold text-purple-300">
                {showAdditionalInfo
                  ? questions.length
                  : currentQuestionIndex + 1}{" "}
                {t("quiz.of")} {questions.length}
              </span>
            </div>

            <div className="w-full bg-[#1a1a1a] rounded-full h-2 overflow-hidden">
              <div
                className="bg-purple-600 h-full transition-all duration-500 ease-out rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </PageHeader>

        <main className="max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <aside className="md:col-span-1 space-y-4 order-2 md:order-1">
              <div className="bg-[#111111] rounded-xl p-6 border border-purple-900/40 shadow-sm">
                <h3 className="text-body-xs font-semibold text-gray-400 uppercase mb-4">
                  {t("quiz.progress")}
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-purple-400 shrink-0" />
                    <div>
                      <p className="text-body-xs text-gray-400">
                        {t("quiz.estimatedTime")}
                      </p>
                      <p className="font-semibold text-white text-sm">
                        {t("quiz.estimatedTimeValue")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-purple-400 shrink-0" />
                    <div>
                      <p className="text-body-xs text-gray-400">
                        {t("quiz.questionsAnswered")}
                      </p>
                      <p className="font-semibold text-white text-sm">
                        {answeredCount} {t("quiz.of")} {questions.length}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-5 h-5 text-purple-400 shrink-0" />
                    <div>
                      <p className="text-body-xs text-gray-400">
                        {t("quiz.completion")}
                      </p>
                      <p className="font-semibold text-white text-sm">
                        {Math.round(progress)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-purple-950/40 rounded-xl p-5 border border-purple-800/50 hidden md:block">
                <p className="text-body-xs font-semibold text-purple-300 uppercase mb-2">
                  {t("quiz.tipsTitle")}
                </p>
                <ul className="space-y-1.5 text-body-xs text-gray-300">
                  <li>• {t("quiz.tip1")}</li>
                  <li>• {t("quiz.tip2")}</li>
                  <li>• {t("quiz.tip3")}</li>
                </ul>
              </div>
            </aside>

            <div className="md:col-span-2 order-1 md:order-2 space-y-6">
              <div className="bg-[#111111] rounded-xl p-6 md:p-10 border border-purple-900/40 shadow-md">
                {!showAdditionalInfo ? (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-white mb-2 leading-snug">
                        {currentQuestion.question}
                      </h2>
                      <p className="text-body-sm text-gray-300">
                        {t("quiz.selectHint")}
                      </p>
                    </div>

                    <div className="space-y-3">
                      {SCALE_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setSelectedAnswer(option.value)}
                          className={`w-full text-left px-5 py-4 rounded-lg border-2 transition-all duration-200 ${
                            selectedAnswer === option.value
                              ? "border-purple-500 bg-purple-900/40 shadow-sm"
                              : "border-purple-900/40 bg-[#0b0b0b] hover:border-purple-500"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                selectedAnswer === option.value
                                  ? "border-purple-500 bg-purple-600"
                                  : "border-gray-500"
                              }`}
                            >
                              {selectedAnswer === option.value && (
                                <span className="w-2 h-2 bg-white rounded-full" />
                              )}
                            </div>

                            <span
                              className={`text-body-sm font-medium ${
                                selectedAnswer === option.value
                                  ? "text-purple-200"
                                  : "text-gray-200"
                              }`}
                            >
                              {option.label}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-purple-900/40">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleBack}
                        disabled={isFirstQuestion}
                        className="border-purple-900/50 bg-[#0b0b0b] text-white hover:bg-purple-950/50"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        {t("quiz.previous")}
                      </Button>

                      <Button
                        onClick={handleNext}
                        disabled={selectedAnswer === null}
                        className="flex-1 bg-purple-700 hover:bg-purple-600 text-white font-semibold"
                      >
                        {t("quiz.next")}
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                        {t("quiz.additionalInfoTitle")}
                      </h2>
                      <p className="text-body-sm text-gray-300">
                        {t("quiz.additionalInfoSubtitle")}
                      </p>
                    </div>

                    <textarea
                      value={additionalInfo}
                      onChange={(e) => setAdditionalInfo(e.target.value)}
                      placeholder={t("quiz.additionalInfoPlaceholder")}
                      className="w-full px-4 py-3 border border-purple-900/50 rounded-lg bg-[#0b0b0b] text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-900/50 min-h-[150px] resize-y"
                    />

                    <div className="flex justify-end pt-2">
                      <Button
                        onClick={handleFinish}
                        className="bg-purple-700 hover:bg-purple-600 text-white font-semibold px-8"
                      >
                        {t("quiz.finish")}
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {!showAdditionalInfo && questions.length <= 30 && (
                <div className="bg-[#111111] rounded-xl p-5 border border-purple-900/40 shadow-sm">
                  <p className="text-body-xs font-semibold text-gray-400 uppercase mb-3">
                    {t("quiz.questionNavigator")}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {questions.map((_, index) => {
                      const answered = answers[index] !== undefined;
                      const current = index === currentQuestionIndex;
                      const reachable = index <= answeredCount;

                      return (
                        <button
                          key={index}
                          type="button"
                          disabled={!reachable}
                          onClick={() => reachable && jumpToQuestion(index)}
                          className={`w-9 h-9 rounded-lg text-body-xs font-bold transition-all ${
                            current
                              ? "bg-purple-700 text-white shadow-sm"
                              : answered
                                ? "bg-purple-900/50 text-purple-200 border border-purple-600"
                                : reachable
                                  ? "bg-[#0b0b0b] text-gray-300 border border-purple-900/40 hover:bg-purple-950/50"
                                  : "bg-[#080808] text-gray-600 border border-gray-800 cursor-not-allowed"
                          }`}
                          title={`${index + 1}`}
                        >
                          {answered && !current ? "✓" : index + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        <footer className="bg-[#050505] border-t border-purple-900/40 py-6 mt-8">
          <p className="text-center text-body-sm text-gray-400 max-w-3xl mx-auto px-4">
            {t("quiz.confidentialNote")}
          </p>
        </footer>
      </div>
    </div>
  );
}
