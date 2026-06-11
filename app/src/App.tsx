import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { User } from "@supabase/supabase-js";
import { HomePage } from "./components/HomePage";
import { QuizPage } from "./components/QuizPage";
import { ResultsPage } from "./components/ResultsPage";
import { LoginPage } from "./components/LoginPage";
import { fetchQuestions } from "./lib/api";
import { supabase } from "./lib/supabase";
import type { Question } from "./types/question";

type Page = "home" | "quiz" | "results" | "login";

// Helper to read from sessionStorage safely
function readSession<T>(key: string, fallback: T): T {
  try {
    const raw = sessionStorage.getItem(key);
    return raw !== null ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function App() {
  const { t, i18n } = useTranslation();
  const [currentPage, setCurrentPageState] = useState<Page>(() =>
    readSession<Page>("sm_page", "home")
  );
  const [answers, setAnswersState] = useState<number[]>(() =>
    readSession<number[]>("sm_answers", [])
  );
  const [questions, setQuestions] = useState<Question[]>([]);
  const [additionalInfo, setAdditionalInfoState] = useState<string>(() =>
    readSession<string>("sm_additionalInfo", "")
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loginIntent, setLoginIntent] = useState<"startQuiz" | "normal">("normal");

  // Wrappers that keep sessionStorage in sync
  const setCurrentPage = (page: Page) => {
    sessionStorage.setItem("sm_page", JSON.stringify(page));
    setCurrentPageState(page);
  };
  const setAnswers = (a: number[]) => {
    sessionStorage.setItem("sm_answers", JSON.stringify(a));
    setAnswersState(a);
  };
  const setAdditionalInfo = (info: string) => {
    sessionStorage.setItem("sm_additionalInfo", JSON.stringify(info));
    setAdditionalInfoState(info);
  };

  const language = i18n.resolvedLanguage || i18n.language || "en";

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadQuestions = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchQuestions(language);
        if (!cancelled) setQuestions(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : t("quiz.failedToLoad"));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadQuestions();

    return () => {
      cancelled = true;
    };
  }, [language, t]);

  const actuallyStartQuiz = () => {
    setAnswers([]);
    setAdditionalInfo("");
    setError(null);
    setCurrentPage("quiz"); // set last so sessionStorage is clean
  };

  const handleStartQuiz = () => {
    if (!user) {
      setLoginIntent("startQuiz");
      setCurrentPage("login");
      return;
    }

    actuallyStartQuiz();
  };

  const handleLoginSuccess = () => {
    if (loginIntent === "startQuiz") {
      actuallyStartQuiz();
    } else {
      setCurrentPage("home");
    }

    setLoginIntent("normal");
  };

  const handleContinueWithoutAccount = () => {
    setLoginIntent("normal");
    actuallyStartQuiz();
  };

  const handleQuizComplete = (quizAnswers: number[], info?: string) => {
    setAnswers(quizAnswers);
    setAdditionalInfo(info || "");
    setCurrentPage("results");
  };

  const handleRestart = () => {
    sessionStorage.removeItem("sm_page");
    sessionStorage.removeItem("sm_answers");
    sessionStorage.removeItem("sm_additionalInfo");
    setCurrentPage("home");
    setAnswers([]);
    setAdditionalInfo("");
    setError(null);
  };

  return (
    <>
      {currentPage === "home" && (
        <HomePage user={user}
          onStartQuiz={handleStartQuiz}
          onLogin={() => {
            setLoginIntent("normal");
            setCurrentPage("login");
          }}
        />
      )}

      {currentPage === "login" && (
        <LoginPage
          onBack={() => {
            setLoginIntent("normal");
            setCurrentPage("home");
          }}
          onAuthSuccess={handleLoginSuccess}
          onContinueWithoutAccount={
            loginIntent === "startQuiz" ? handleContinueWithoutAccount : undefined
          }
        />
      )}

      {currentPage === "quiz" && (
        <>
          {loading && (
            <div className="page-shell flex items-center justify-center">
              <div className="text-center bg-[#111111] rounded-xl border border-purple-900/40 px-10 py-8 shadow-sm">
                <div className="w-10 h-10 border-4 border-purple-900/40 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-lg font-medium text-white">{t("quiz.loading")}</p>
              </div>
            </div>
          )}

          {!loading && error && (
            <div className="page-shell flex items-center justify-center px-4">
              <div className="text-center bg-[#111111] rounded-xl border border-purple-900/40 p-10 shadow-sm max-w-md">
                <p className="text-lg mb-4 text-red-400 font-medium">
                  {t("common.errorPrefix")}: {error}
                </p>
                <button
                  onClick={() => {
                    setError(null);
                    setCurrentPage("home");
                  }}
                  className="px-6 py-2.5 bg-purple-700 hover:bg-purple-600 text-white font-semibold rounded-lg transition-colors"
                >
                  {t("common.goBackButton")}
                </button>
              </div>
            </div>
          )}

          {!loading && !error && questions.length > 0 && (
            <QuizPage
              questions={questions}
              onComplete={handleQuizComplete}
              onBack={() => setCurrentPage("home")}
            />
          )}
        </>
      )}

      {currentPage === "results" && (
        <ResultsPage
          answers={answers}
          questions={questions}
          additionalInfo={additionalInfo}
          onRestart={handleRestart}
          onBack={() => setCurrentPage("home")}
        />
      )}
    </>
  );
}

export default App;
