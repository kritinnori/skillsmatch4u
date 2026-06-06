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
  questions: Question[];
  onComplete: (answers: number[], additionalInfo?: string) => void;
  onBack: () => void;
}

export function QuizPage({ questions, onComplete, onBack }: QuizPageProps) {
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

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;
  const progress = showAdditionalInfo
    ? 100
    : ((currentQuestionIndex + 1) / questions.length) * 100;
  const answeredCount = answers.length;

  const handleBack = () => {
    if (showAdditionalInfo) {
      setShowAdditionalInfo(false);
      if (answers.length > 0) {
        setSelectedAnswer(answers[answers.length - 1]);
      }
    } else if (isFirstQuestion) {
      onBack();
    } else {
      const previousIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(previousIndex);
      if (answers[previousIndex] !== undefined) {
        setSelectedAnswer(answers[previousIndex]);
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

  const jumpToQuestion = (index: number) => {
    if (index > answers.length) return;
    setShowAdditionalInfo(false);
    setCurrentQuestionIndex(index);
    if (index < answers.length) {
      setSelectedAnswer(answers[index]);
      setAnswers(answers.slice(0, index));
    } else {
      setSelectedAnswer(null);
    }
  };

  return (
    <div className="page-shell">
      <PageHeader
        brand={t("common.brand")}
        onBack={handleBack}
        backLabel={t("common.goBack")}
        title={t("quiz.quizTitle")}
        sticky
      >
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-body-sm">
            <span className="text-gray-600">{t("quiz.progress")}</span>
            <span className="font-semibold text-primary-800">
              {showAdditionalInfo
                ? questions.length
                : currentQuestionIndex + 1}{" "}
              {t("quiz.of")} {questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary-800 h-full transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </PageHeader>

      <main className="max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <aside className="md:col-span-1 space-y-4 order-2 md:order-1">
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-body-xs font-semibold text-gray-500 uppercase mb-4">
                {t("quiz.progress")}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary-800 shrink-0" />
                  <div>
                    <p className="text-body-xs text-gray-500">
                      {t("quiz.estimatedTime")}
                    </p>
                    <p className="font-semibold text-gray-900 text-sm">
                      {t("quiz.estimatedTimeValue")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-primary-800 shrink-0" />
                  <div>
                    <p className="text-body-xs text-gray-500">
                      {t("quiz.questionsAnswered")}
                    </p>
                    <p className="font-semibold text-gray-900 text-sm">
                      {answeredCount} {t("quiz.of")} {questions.length}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-primary-800 shrink-0" />
                  <div>
                    <p className="text-body-xs text-gray-500">
                      {t("quiz.completion")}
                    </p>
                    <p className="font-semibold text-gray-900 text-sm">
                      {Math.round(progress)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {!showAdditionalInfo && currentQuestion?.category && (
              <div className="bg-primary-50 rounded-xl p-6 border border-primary-200">
                <p className="text-body-xs font-semibold text-primary-800 uppercase mb-1">
                  {t("quiz.currentCategory")}
                </p>
                <p className="text-lg font-bold text-primary-900">
                  {currentQuestion.category}
                </p>
              </div>
            )}

            <div className="bg-amber-50 rounded-xl p-5 border border-amber-200 hidden md:block">
              <p className="text-body-xs font-semibold text-amber-800 uppercase mb-2">
                {t("quiz.tipsTitle")}
              </p>
              <ul className="space-y-1.5 text-body-xs text-amber-900">
                <li>• {t("quiz.tip1")}</li>
                <li>• {t("quiz.tip2")}</li>
                <li>• {t("quiz.tip3")}</li>
              </ul>
            </div>
          </aside>

          <div className="md:col-span-2 order-1 md:order-2 space-y-6">
            <div className="bg-white rounded-xl p-6 md:p-10 border border-gray-200 shadow-md">
              {!showAdditionalInfo ? (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 leading-snug">
                      {currentQuestion.question}
                    </h2>
                    <p className="text-body-sm text-gray-600">
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
                            ? "border-primary-800 bg-primary-50 shadow-sm"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                              selectedAnswer === option.value
                                ? "border-primary-800 bg-primary-800"
                                : "border-gray-300"
                            }`}
                          >
                            {selectedAnswer === option.value && (
                              <span className="w-2 h-2 bg-white rounded-full" />
                            )}
                          </div>
                          <span
                            className={`text-body-sm font-medium ${
                              selectedAnswer === option.value
                                ? "text-primary-900"
                                : "text-gray-700"
                            }`}
                          >
                            {option.label}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      disabled={isFirstQuestion}
                      className="border-gray-300"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      {t("quiz.previous")}
                    </Button>
                    <Button
                      onClick={handleNext}
                      disabled={selectedAnswer === null}
                      className="flex-1 bg-primary-800 hover:bg-primary-900 text-white font-semibold"
                    >
                      {t("quiz.next")}
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                      {t("quiz.additionalInfoTitle")}
                    </h2>
                    <p className="text-body-sm text-gray-600">
                      {t("quiz.additionalInfoSubtitle")}
                    </p>
                  </div>

                  <textarea
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    placeholder={t("quiz.additionalInfoPlaceholder")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary-800 focus:ring-2 focus:ring-primary-100 min-h-[150px] resize-y"
                  />

                  <div className="flex justify-end pt-2">
                    <Button
                      onClick={handleFinish}
                      className="bg-primary-800 hover:bg-primary-900 text-white font-semibold px-8"
                    >
                      {t("quiz.finish")}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {!showAdditionalInfo && questions.length <= 30 && (
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <p className="text-body-xs font-semibold text-gray-500 uppercase mb-3">
                  {t("quiz.questionNavigator")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {questions.map((_, index) => {
                    const answered = index < answers.length;
                    const current = index === currentQuestionIndex;
                    const reachable = index <= answers.length;
                    return (
                      <button
                        key={index}
                        type="button"
                        disabled={!reachable}
                        onClick={() => reachable && jumpToQuestion(index)}
                        className={`w-9 h-9 rounded-lg text-body-xs font-bold transition-all ${
                          current
                            ? "bg-primary-800 text-white shadow-sm"
                            : answered
                              ? "bg-green-100 text-green-800 border border-green-300"
                              : reachable
                                ? "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200"
                                : "bg-gray-50 text-gray-400 border border-gray-100 cursor-not-allowed"
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

      <footer className="bg-white border-t border-gray-200 py-6 mt-8">
        <p className="text-center text-body-sm text-gray-600 max-w-3xl mx-auto px-4">
          {t("quiz.confidentialNote")}
        </p>
      </footer>
    </div>
  );
}
