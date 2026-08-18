import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Routes, Route, useNavigate } from "react-router-dom";
import { HomePage } from "./components/HomePage";
import { QuizPage } from "./components/QuizPage";
import { ResultsPage } from "./components/ResultsPage";
import { DashboardPage } from "./components/DashboardPage";
import { LocationPage } from "./components/LocationPage";
import { LocalEcosystemPage } from "./components/LocalEcosystemPage";
import { OpportunitiesModal } from "./components/OpportunitiesModal";
import { LoginPage } from "./components/LoginPage";
import { fetchQuestions } from "./lib/api";
import { getAuthUser, signOut as cognitoSignOut, onAuthStateChange } from "./lib/auth";
import { fetchUserProgress } from "./lib/dashboard";
import type { AuthUser } from "./lib/auth";
import type { Question } from "./types/question";

function readSession<T>(key: string, fallback: T): T {
  try {
    const raw = sessionStorage.getItem(key);
    return raw !== null ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function AppRoutes() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  
  const [answers, setAnswersState] = useState<number[]>(() =>
    readSession<number[]>("sm_answers", [])
  );
  const [questions, setQuestions] = useState<Question[]>([]);
  const [additionalInfo, setAdditionalInfoState] = useState<string>(() =>
    readSession<string>("sm_additionalInfo", "")
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loginIntent, setLoginIntent] = useState<"startQuiz" | "normal">("normal");
  const [userState, setUserState] = useState<string>(() => localStorage.getItem("sm_state") || "");
  const [userDistrict, setUserDistrict] = useState<string>(() => localStorage.getItem("sm_district") || "");
  const [showOpportunitiesModal, setShowOpportunitiesModal] = useState(false);
  const [locationReturnTo, setLocationReturnTo] = useState<string>("/");
  const [hasCompletedQuiz, setHasCompletedQuiz] = useState(false);

  const setAnswers = (a: number[]) => {
    sessionStorage.setItem("sm_answers", JSON.stringify(a));
    setAnswersState(a);
  };
  const setAdditionalInfo = (info: string) => {
    sessionStorage.setItem("sm_additionalInfo", JSON.stringify(info));
    setAdditionalInfoState(info);
  };

  const language = i18n.resolvedLanguage || i18n.language || "en";

  // --- Auth state listener ---
  useEffect(() => {
    const unsubscribe = onAuthStateChange((authUser) => {
      setUser(authUser);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // --- Check if user has already completed a quiz ---
  useEffect(() => {
    if (!user) {
      setHasCompletedQuiz(false);
      return;
    }
    fetchUserProgress(user.id).then((progress) => {
      setHasCompletedQuiz(!!progress?.quiz_completed_at);
    }).catch(() => {
      setHasCompletedQuiz(false);
    });
  }, [user]);

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
    navigate("/quiz");
  };

  const handleStartQuiz = () => {
    if (!user) {
      setLoginIntent("startQuiz");
      navigate("/login");
      return;
    }
    actuallyStartQuiz();
  };

  const handleLoginSuccess = () => {
    // Re-fetch user after login
    getAuthUser().then((authUser) => {
      setUser(authUser);
    });

    // Don't force location prompt - let users discover it when they need it
    if (loginIntent === "startQuiz") {
      actuallyStartQuiz();
    } else {
      navigate("/");
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
      navigate(locationReturnTo);
    }
    setLoginIntent("normal");
  };

  const handleLocationSkip = () => {
    if (loginIntent === "startQuiz") {
      actuallyStartQuiz();
    } else {
      navigate(locationReturnTo);
    }
    setLoginIntent("normal");
  };

  const handleAddLocation = (returnTo: string = "/results") => {
    setLocationReturnTo(returnTo);
    navigate("/location");
  };

  const handleContinueWithoutAccount = () => {
    setLoginIntent("normal");
    actuallyStartQuiz();
  };

  const handleQuizComplete = (quizAnswers: number[], info?: string) => {
    setAnswers(quizAnswers);
    setAdditionalInfo(info || "");
    navigate("/results");
    setHasCompletedQuiz(true);
    // Auto-prompt opportunities popup right after results, only if location is known
    if (userState && userDistrict) {
      setShowOpportunitiesModal(true);
    }
  };

  const handleRestart = () => {
    sessionStorage.removeItem("sm_answers");
    sessionStorage.removeItem("sm_additionalInfo");
    sessionStorage.removeItem("sm_career");
    sessionStorage.removeItem("sm_career_score");
    // Clear all per-language career, courses, and jobs caches
    ["en","hi","bn","te","mr","ta","ur","gu","kn","or","ml","pa","as"].forEach(lang => {
      sessionStorage.removeItem(`sm_career_${lang}`);
      sessionStorage.removeItem(`sm_courses_${lang}`);
      sessionStorage.removeItem(`sm_jobs_${lang}`);
    });
    navigate("/");
    setAnswers([]);
    setAdditionalInfo("");
    setError(null);
  };

  const handleSignOut = async () => {
    cognitoSignOut();
    setUser(null);
    handleRestart();
  };

  // Header profile buttons navigation
  useEffect(() => {
    const openProfile = () => { window.location.href = '/profile'; };
    window.addEventListener("sm4u:openProfile", openProfile);
    return () => window.removeEventListener("sm4u:openProfile", openProfile);
  }, []);

  // Quiz page content (handles loading/error states)
  const renderQuizContent = () => {
    if (loading) {
      return (
        <div className="page-shell flex items-center justify-center">
          <div className="text-center bg-[#111111] rounded-xl border border-purple-900/40 px-10 py-8 shadow-sm">
            <div className="w-10 h-10 border-4 border-purple-900/40 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-lg font-medium text-white">{t("quiz.loading")}</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="page-shell flex items-center justify-center px-4">
          <div className="text-center bg-[#111111] rounded-xl border border-purple-900/40 p-10 shadow-sm max-w-md">
            <p className="text-lg mb-4 text-red-400 font-medium">
              {t("common.errorPrefix")}: {error}
            </p>
            <button
              onClick={() => {
                setError(null);
                navigate("/");
              }}
              className="px-6 py-2.5 bg-purple-700 hover:bg-purple-600 text-white font-semibold rounded-lg transition-colors"
            >
              {t("common.goBackButton")}
            </button>
          </div>
        </div>
      );
    }

    if (questions.length > 0) {
      return (
        <QuizPage
          questions={questions}
          onComplete={handleQuizComplete}
          onBack={() => navigate("/")}
          user={user}
          onSignOut={handleSignOut}
          onDashboard={() => navigate("/dashboard")}
          onShowOpportunities={() => setShowOpportunitiesModal(true)}
          onLoginRequired={() => { setLoginIntent("normal"); navigate("/login"); }}
        />
      );
    }

    return null;
  };

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              user={user}
              hasCompletedQuiz={hasCompletedQuiz}
              onStartQuiz={handleStartQuiz}
              onLogin={() => {
                setLoginIntent("normal");
                navigate("/login");
              }}
              onDashboard={() => navigate("/dashboard")}
              onShowOpportunities={() => {
                if (!userState || !userDistrict) {
                  setLocationReturnTo("/");
                  navigate("/location");
                } else {
                  setShowOpportunitiesModal(true);
                }
              }}
            />
          }
        />

        <Route
          path="/login"
          element={
            <LoginPage
              onBack={() => {
                setLoginIntent("normal");
                navigate("/");
              }}
              onAuthSuccess={handleLoginSuccess}
              onContinueWithoutAccount={
                loginIntent === "startQuiz" ? handleContinueWithoutAccount : undefined
              }
            />
          }
        />

        <Route path="/quiz" element={renderQuizContent()} />

        <Route
          path="/results"
          element={
            <ResultsPage
              answers={answers}
              questions={questions}
              additionalInfo={additionalInfo}
              onBack={() => navigate(-1)}
              onHome={() => navigate("/")}
              user={user}
              onSignOut={handleSignOut}
              onDashboard={() => navigate("/dashboard")}
              onShowOpportunities={() => setShowOpportunitiesModal(true)}
              onLoginRequired={() => { setLoginIntent("normal"); navigate("/login"); }}
              onViewLocalEcosystem={() => navigate("/local-ecosystem")}
              onAddLocation={() => handleAddLocation("/results")}
              hasLocation={!!userState && !!userDistrict}
              userState={userState}
              userDistrict={userDistrict}
              onLocationChange={(state, city) => {
                setUserState(state);
                setUserDistrict(city);
              }}
            />
          }
        />

        <Route
          path="/dashboard"
          element={
            <DashboardPage
              user={user}
              onBack={() => navigate(-1)}
              onHome={() => navigate("/")}
              onSignOut={handleSignOut}
              onRetakeQuiz={handleStartQuiz}
              onShowOpportunities={() => setShowOpportunitiesModal(true)}
              onGoToCourses={() => navigate("/results")}
              onChangeLocation={() => handleAddLocation("/dashboard")}
            />
          }
        />

        <Route
          path="/location"
          element={
            <LocationPage
              onContinue={handleLocationContinue}
              onSkip={handleLocationSkip}
              onBack={() => navigate(-1)}
              initialState={userState}
              initialDistrict={userDistrict}
            />
          }
        />

        <Route
          path="/local-ecosystem"
          element={
            <LocalEcosystemPage
              state={userState}
              district={userDistrict}
              currentCareerTitle={(() => {
                try {
                  const lang = i18n.resolvedLanguage || i18n.language || "en";
                  const cached = sessionStorage.getItem(`sm_career_${lang}`);
                  return cached ? JSON.parse(cached).title : undefined;
                } catch {
                  return undefined;
                }
              })()}
              user={user}
              onSignOut={handleSignOut}
              onBack={() => navigate(-1)}
              onHome={() => navigate("/")}
              onDashboard={() => navigate("/dashboard")}
              onShowOpportunities={() => setShowOpportunitiesModal(true)}
              onLoginRequired={() => { setLoginIntent("normal"); navigate("/login"); }}
            />
          }
        />

        {/* Catch-all redirect to home */}
        <Route path="*" element={<HomePage
          user={user}
          hasCompletedQuiz={hasCompletedQuiz}
          onStartQuiz={handleStartQuiz}
          onLogin={() => {
            setLoginIntent("normal");
            navigate("/login");
          }}
          onDashboard={() => navigate("/dashboard")}
          onShowOpportunities={() => {
            if (!userState || !userDistrict) {
              setLocationReturnTo("/");
              navigate("/location");
            } else {
              setShowOpportunitiesModal(true);
            }
          }}
        />} />
      </Routes>

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

function App() {
  return <AppRoutes />;
}

export default App;
