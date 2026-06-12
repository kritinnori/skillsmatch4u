import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Mail, Lock, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { BrandLogo } from "./layout/BrandLogo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { supabase } from "../lib/supabase";

interface LoginPageProps {
  onBack: () => void;
  onAuthSuccess: () => void;
  onContinueWithoutAccount?: () => void;
}

export function LoginPage({
  onBack,
  onAuthSuccess,
  onContinueWithoutAccount,
}: LoginPageProps) {
  const { t } = useTranslation();
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const isLogin = mode === "login";
  const isForgot = mode === "forgot";

  const tr = (key: string, fallback: string) =>
    t(key, { defaultValue: fallback });

  const getFriendlyError = (rawMessage: string) => {
    const lower = rawMessage.toLowerCase();

    if (
      lower.includes("invalid login credentials") ||
      lower.includes("user not found") ||
      lower.includes("failed to fetch")
    ) {
      return tr(
        "login.accountDoesNotExist",
        "Sorry, account does not exist. Please create an account."
      );
    }

    if (lower.includes("already registered") || lower.includes("already exists")) {
      return tr("login.accountAlreadyExists", "Account already exists. Please sign in.");
    }

    return tr("login.genericError", "Something went wrong. Please try again.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      if (isForgot) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin,
        });
        if (error) throw error;
        setMessage(
          tr("login.resetEmailSent", "Check your email for a password reset link.")
        );
        return;
      }

      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        setMessage(tr("login.signedIn", "Signed in successfully."));
        setTimeout(onAuthSuccess, 600);
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        setMode("login");
        setPassword("");
        setMessage(tr("login.accountCreated", "Success! Account created. Please sign in."));
      }
    } catch (err) {
      const rawMessage =
        err instanceof Error ? err.message : "Something went wrong.";
      setError(getFriendlyError(rawMessage));
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(isLogin ? "signup" : "login");
    setMessage("");
    setError("");
    setPassword("");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_bottom_left,rgba(126,34,206,0.28),transparent_42%)]" />

      <div className="relative z-10">
        <header className="border-b border-purple-900/40 bg-[#050505]">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
            <BrandLogo label={t("common.brand")} onClick={onBack} />
            <LanguageSwitcher />
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-20">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-gray-300 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("common.goBack")}
          </button>

          <div className="grid md:grid-cols-2 gap-10 items-center">
            <section>
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-800/50 bg-purple-950/40 px-4 py-2 text-sm text-purple-200 mb-6">
                <Sparkles className="w-4 h-4" />
                {tr("login.badge", "Personalized career matching")}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-5">
                {isForgot
                  ? tr("login.forgotTitle", "Reset your password")
                  : isLogin
                    ? tr("login.welcomeBack", "Welcome back")
                    : tr("login.createAccountTitle", "Create your account")}
              </h1>

              <p className="text-gray-300 text-lg max-w-xl">
                {isForgot
                  ? tr(
                      "login.forgotDescription",
                      "Enter your email and we'll send you a link to reset your password."
                    )
                  : isLogin
                    ? tr(
                        "login.signInDescription",
                        "Sign in to continue your career assessment and view your recommendations."
                      )
                    : tr(
                        "login.signUpDescription",
                        "Create an account to save your quiz progress and access your career results later."
                      )}
              </p>
            </section>

            <section className="bg-[#111111] border border-purple-900/40 rounded-2xl p-6 md:p-8 shadow-xl">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">
                  {isForgot
                    ? tr("login.forgotTitle", "Reset your password")
                    : isLogin
                      ? tr("login.signIn", "Sign in")
                      : tr("login.signUp", "Sign up")}
                </h2>
                <p className="text-gray-400 text-sm">
                  {isForgot
                    ? tr("login.forgotSubtitle", "We'll email you a reset link.")
                    : isLogin
                      ? tr("login.signInSubtitle", "Enter your email and password to continue.")
                      : tr("login.signUpSubtitle", "Start with your email and create a password.")}
                </p>
              </div>

              {onContinueWithoutAccount && (
                <div className="mb-5 rounded-xl border border-purple-900/50 bg-purple-950/20 p-4">
                  <p className="text-sm text-gray-300 mb-3">
                    {tr(
                      "login.promptText",
                      "Sign in to save your progress, or continue without an account."
                    )}
                  </p>
                  <Button
                    type="button"
                    onClick={onContinueWithoutAccount}
                    variant="outline"
                    className="w-full border-purple-700 text-purple-200 hover:bg-purple-900/30 hover:text-white"
                  >
                    {tr("login.continueWithoutAccount", "No thanks, continue")}
                  </Button>
                </div>
              )}

              <form className="space-y-4" onSubmit={handleSubmit}>
                <label className="block">
                  <span className="text-sm font-medium text-gray-300">
                    {tr("login.email", "Email")}
                  </span>
                  <div className="mt-2 flex items-center gap-3 rounded-lg border border-purple-900/50 bg-[#080808] px-4 py-3 focus-within:border-purple-500">
                    <Mail className="w-5 h-5 text-purple-300" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-transparent text-white placeholder:text-gray-500 outline-none"
                    />
                  </div>
                </label>

                {!isForgot && (
                <label className="block">
                  <span className="text-sm font-medium text-gray-300">
                    {tr("login.password", "Password")}
                  </span>
                  <div className="mt-2 flex items-center gap-3 rounded-lg border border-purple-900/50 bg-[#080808] px-4 py-3 focus-within:border-purple-500">
                    <Lock className="w-5 h-5 text-purple-300" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-transparent text-white placeholder:text-gray-500 outline-none"
                    />
                  </div>
                </label>
                )}

                {isLogin && (
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setMode("forgot");
                        setMessage("");
                        setError("");
                        setPassword("");
                      }}
                      className="text-sm text-purple-300 hover:text-purple-200 font-medium"
                    >
                      {tr("login.forgotPassword", "Forgot password?")}
                    </button>
                  </div>
                )}

                {error && (
                  <p className="rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-300">
                    {error}
                  </p>
                )}

                {message && (
                  <p className="rounded-lg border border-green-900/50 bg-green-950/30 px-4 py-3 text-sm text-green-300 font-semibold">
                    {message}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-purple-700 hover:bg-purple-600 text-white font-semibold py-6 disabled:opacity-60"
                >
                  {loading
                    ? tr("login.pleaseWait", "Please wait...")
                    : isForgot
                      ? tr("login.sendResetLink", "Send reset link")
                      : isLogin
                        ? tr("login.signIn", "Sign in")
                        : tr("login.createAccountButton", "Create account")}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-gray-400">
                {isForgot ? (
                  <button
                    type="button"
                    onClick={() => {
                      setMode("login");
                      setMessage("");
                      setError("");
                    }}
                    className="text-purple-300 hover:text-purple-200 font-semibold"
                  >
                    {tr("login.backToSignIn", "Back to sign in")}
                  </button>
                ) : (
                  <>
                    {isLogin
                      ? tr("login.noAccount", "Don't have an account?")
                      : tr("login.hasAccount", "Already have an account?")}{" "}
                    <button
                      type="button"
                      onClick={switchMode}
                      className="text-purple-300 hover:text-purple-200 font-semibold"
                    >
                      {isLogin ? tr("login.signUp", "Sign up") : tr("login.signIn", "Sign in")}
                    </button>
                  </>
                )}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
