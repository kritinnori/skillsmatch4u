import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Mail, Lock, ArrowLeft, CheckCircle2, Shield, Zap } from "lucide-react";
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
  const [confirmPassword, setConfirmPassword] = useState("");

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

      if (!isLogin && password !== confirmPassword) {
        setError(tr("login.passwordMismatch", "Passwords do not match. Please try again."));
        setLoading(false);
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
    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-purple-900/40 bg-[#050505] sticky top-0 z-20">
        <div className="w-full px-4 md:px-10 py-3 flex items-center justify-between">
          <BrandLogo label={t("common.brand")} onClick={onBack} />
          <LanguageSwitcher />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-10 md:py-16">
        <div className="w-full max-w-5xl grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left side — value prop */}
          <section className="hidden md:block">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-purple-300 transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("common.goBack", { defaultValue: "Go back" })}
            </button>

            <h1 className="text-3xl lg:text-4xl font-bold leading-tight mb-4">
              {isForgot
                ? tr("login.forgotTitle", "Reset your password")
                : isLogin
                  ? tr("login.welcomeBack", "Welcome back")
                  : tr("login.createAccountTitle", "Create your account")}
            </h1>

            <p className="text-gray-400 text-base lg:text-lg mb-10 leading-relaxed">
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

            {/* Trust signals */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-900/30 border border-purple-800/40 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 text-purple-300" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {tr("login.trust1Title", "AI-powered career matching")}
                  </p>
                  <p className="text-xs text-gray-500">
                    {tr("login.trust1Body", "Get personalized recommendations based on your skills and interests")}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-900/30 border border-purple-800/40 flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4 text-purple-300" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {tr("login.trust2Title", "Your data stays private")}
                  </p>
                  <p className="text-xs text-gray-500">
                    {tr("login.trust2Body", "We never share your information with third parties for advertising")}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-900/30 border border-purple-800/40 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-purple-300" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {tr("login.trust3Title", "Free to use, always")}
                  </p>
                  <p className="text-xs text-gray-500">
                    {tr("login.trust3Body", "No credit card required, no hidden fees")}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Right side — form card */}
          <section>
            {/* Mobile back button */}
            <button
              type="button"
              onClick={onBack}
              className="md:hidden inline-flex items-center gap-2 text-sm text-gray-400 hover:text-purple-300 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("common.goBack", { defaultValue: "Go back" })}
            </button>

            <div className="bg-[#0c0c0c] border border-purple-900/30 rounded-2xl p-6 sm:p-8 shadow-2xl">
              {/* Form header */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white mb-1">
                  {isForgot
                    ? tr("login.forgotTitle", "Reset your password")
                    : isLogin
                      ? tr("login.signIn", "Sign in")
                      : tr("login.signUp", "Sign up")}
                </h2>
                <p className="text-sm text-gray-500">
                  {isForgot
                    ? tr("login.forgotSubtitle", "We'll email you a reset link.")
                    : isLogin
                      ? tr("login.signInSubtitle", "Enter your email and password to continue.")
                      : tr("login.signUpSubtitle", "Start with your email and create a password.")}
                </p>
              </div>

              {/* Continue without account */}
              {onContinueWithoutAccount && (
                <div className="mb-6 rounded-lg border border-purple-900/40 bg-purple-950/20 p-4">
                  <p className="text-sm text-gray-300 mb-3">
                    {tr(
                      "login.promptText",
                      "Sign in to save your progress, or continue without an account."
                    )}
                  </p>
                  <Button
                    type="button"
                    onClick={onContinueWithoutAccount}
                    className="w-full bg-[#050505] text-white hover:bg-gray-900 border border-purple-900/40 font-medium"
                  >
                    {tr("login.continueWithoutAccount", "No thanks, continue")}
                  </Button>
                </div>
              )}

              {/* Form */}
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {tr("login.email", "Email")}
                  </label>
                  <div className="flex items-center gap-3 rounded-lg border border-purple-900/40 bg-[#050505] px-4 py-3 focus-within:border-purple-500 transition-colors">
                    <Mail className="w-4 h-4 text-gray-500 shrink-0" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-transparent text-white text-sm placeholder:text-gray-600 outline-none"
                    />
                  </div>
                </div>

                {!isForgot && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {tr("login.password", "Password")}
                    </label>
                    <div className="flex items-center gap-3 rounded-lg border border-purple-900/40 bg-[#050505] px-4 py-3 focus-within:border-purple-500 transition-colors">
                      <Lock className="w-4 h-4 text-gray-500 shrink-0" />
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-transparent text-white text-sm placeholder:text-gray-600 outline-none"
                      />
                    </div>
                    {!isLogin && (
                      <p className="text-xs text-gray-600 mt-1.5">
                        {tr("login.passwordHint", "Must be at least 6 characters")}
                      </p>
                    )}
                  </div>
                )}

                {!isForgot && !isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {tr("login.confirmPassword", "Confirm password")}
                    </label>
                    <div className="flex items-center gap-3 rounded-lg border border-purple-900/40 bg-[#050505] px-4 py-3 focus-within:border-purple-500 transition-colors">
                      <Lock className="w-4 h-4 text-gray-500 shrink-0" />
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-transparent text-white text-sm placeholder:text-gray-600 outline-none"
                      />
                    </div>
                  </div>
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
                      className="text-xs text-purple-400 hover:text-purple-300 font-medium transition-colors"
                    >
                      {tr("login.forgotPassword", "Forgot password?")}
                    </button>
                  </div>
                )}

                {error && (
                  <div className="rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3">
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                )}

                {message && (
                  <div className="rounded-lg border border-green-900/50 bg-green-950/30 px-4 py-3">
                    <p className="text-sm text-green-300 font-medium">{message}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-purple-700 hover:bg-purple-600 text-white font-semibold py-3 text-sm disabled:opacity-60 transition-colors"
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

              {/* Mode switch */}
              <div className="mt-6 pt-5 border-t border-purple-900/20 text-center text-sm text-gray-500">
                {isForgot ? (
                  <button
                    type="button"
                    onClick={() => {
                      setMode("login");
                      setMessage("");
                      setError("");
                    }}
                    className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
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
                      className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                    >
                      {isLogin ? tr("login.signUp", "Sign up") : tr("login.signIn", "Sign in")}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Terms note */}
            {!isForgot && !isLogin && (
              <p className="text-xs text-gray-600 text-center mt-4 leading-relaxed">
                {tr(
                  "login.termsNote",
                  "By creating an account, you agree to our Terms of Service and Privacy Policy."
                )}
              </p>
            )}
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-900/40 py-4">
        <div className="w-full px-4 md:px-10">
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} {t("common.brand")}
          </p>
        </div>
      </footer>
    </div>
  );
}
