import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { User } from "@supabase/supabase-js";
import { HomePage } from "./components/HomePage";
import { QuizPage } from "./components/QuizPage";
import { ResultsPage } from "./components/ResultsPage";
import { DashboardPage } from "./components/DashboardPage";
import { LocationPage } from "./components/LocationPage";
import { LocalEcosystemPage } from "./components/LocalEcosystemPage";
import { OpportunitiesModal } from "./components/OpportunitiesModal";
import { LoginPage } from "./components/LoginPage";
import { fetchQuestions } from "./lib/api";
import { supabase } from "./lib/supabase";
import type { Question } from "./types/question";

type Page = "home" | "quiz" | "results" | "login" | "dashboard" | "location" | "localEcosystem";

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
  const [userState, setUserState] = useState<string>(() => localStorage.getItem("sm_state") || "");
  const [userDistrict, setUserDistrict] = useState<string>(() => localStorage.getItem("sm_district") || "");
  const [showOpportunitiesModal, setShowOpportunitiesModal] = useState(false);
  const [locationReturnTo, setLocationReturnTo] = useState<Page>("home");

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
    setCurrentPage("quiz");
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
    const hasSavedLocation = !!localStorage.getItem("sm_state") && !!localStorage.getItem("sm_district");
    if (!hasSavedLocation) {
      setCurrentPage("location");
      return;
    }
    if (loginIntent === "startQuiz") {
      actuallyStartQuiz();
    } else {
      setCurrentPage("home");
    }
    setLoginIntent("normal");
  };

  const handleLocationContinue = (state: string, district: string) => {
    localStorage.setItem("sm_state", state);
    localStorage.setItem("sm_district", district);
    setUserState(state);
    setUserDistrict(district);
    if (loginIntent === "startQuiz") {
      actuallyStartQuiz();
    } else {
      setCurrentPage(locationReturnTo);
    }
    setLoginIntent("normal");
  };

  const handleLocationSkip = () => {
    // No flag set on skip — they'll be asked again on next sign-in until they provide it
    if (loginIntent === "startQuiz") {
      actuallyStartQuiz();
    } else {
      setCurrentPage(locationReturnTo);
    }
    setLoginIntent("normal");
  };

  // Lets a user revisit the location prompt anytime (e.g. from Results "Add Your Location")
  // without resetting their "already asked" status globally.
  const handleAddLocation = () => {
    setLocationReturnTo("results");
    setCurrentPage("location");
  };

  const handleContinueWithoutAccount = () => {
    setLoginIntent("normal");
    actuallyStartQuiz();
  };

  const handleQuizComplete = (quizAnswers: number[], info?: string) => {
    setAnswers(quizAnswers);
    setAdditionalInfo(info || "");
    setCurrentPage("results");
    // Auto-prompt opportunities popup right after results, only if location is known
    if (userState && userDistrict) {
      setShowOpportunitiesModal(true);
    }
  };

  const handleRestart = () => {
    sessionStorage.removeItem("sm_page");
    sessionStorage.removeItem("sm_answers");
    sessionStorage.removeItem("sm_additionalInfo");
    sessionStorage.removeItem("sm_career");
    sessionStorage.removeItem("sm_career_score");
    // Clear all per-language career caches
    ["en","hi","bn","te","mr","ta","ur","gu","kn","or","ml","pa","as"].forEach(lang => 
      sessionStorage.removeItem(`sm_career_${lang}`)
    );
    setCurrentPage("home");
    setAnswers([]);
    setAdditionalInfo("");
    setError(null);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    handleRestart();
  };

  return (
    <>
      {currentPage === "home" && (
        <HomePage
          user={user}
          onStartQuiz={handleStartQuiz}
          onLogin={() => {
            setLoginIntent("normal");
            setCurrentPage("login");
          }}
          onDashboard={() => setCurrentPage("dashboard")}
          onShowOpportunities={() => setShowOpportunitiesModal(true)}
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
              user={user}
              onSignOut={handleSignOut}
              onDashboard={() => setCurrentPage("dashboard")}
              onShowOpportunities={() => setShowOpportunitiesModal(true)}
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
          user={user}
          onSignOut={handleSignOut}
          onDashboard={() => setCurrentPage("dashboard")}
          onShowOpportunities={() => setShowOpportunitiesModal(true)}
          onViewLocalEcosystem={() => setCurrentPage("localEcosystem")}
          onAddLocation={handleAddLocation}
          hasLocation={!!userState && !!userDistrict}
        />
      )}

      {currentPage === "dashboard" && (
        <DashboardPage
          user={user}
          onBack={() => setCurrentPage("home")}
          onHome={() => setCurrentPage("home")}
          onSignOut={handleSignOut}
          onRetakeQuiz={handleStartQuiz}
        />
      )}

      {currentPage === "location" && (
        <LocationPage
          onContinue={handleLocationContinue}
          onSkip={handleLocationSkip}
        />
      )}

      {currentPage === "localEcosystem" && (
        <LocalEcosystemPage
          state={userState}
          district={userDistrict}
          currentCareerTitle={(() => { try { const lang = i18n.resolvedLanguage || i18n.language || "en"; const cached = sessionStorage.getItem(`sm_career_${lang}`); return cached ? JSON.parse(cached).title : undefined; } catch { return undefined; } })()}
          user={user}
          onSignOut={handleSignOut}
          onBack={() => setCurrentPage("results")}
          onHome={() => setCurrentPage("home")}
          onDashboard={() => setCurrentPage("dashboard")}
          onShowOpportunities={() => setShowOpportunitiesModal(true)}
        />
      )}

      {showOpportunitiesModal && userState && userDistrict && (
        <OpportunitiesModal
          state={userState}
          district={userDistrict}
          careerTitle={(() => {
            try {
              const lang = i18n.resolvedLanguage || i18n.language || "en";
              const cached = sessionStorage.getItem(`sm_career_${lang}`);
              return cached ? JSON.parse(cached).title : undefined;
            } catch {
              return undefined;
            }
          })()}
          onClose={() => setShowOpportunitiesModal(false)}
        />
      )}
    </>
  );
}

export default App;
