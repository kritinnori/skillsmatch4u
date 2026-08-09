import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Mail, Lock, ArrowLeft, CheckCircle2, Shield, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { PageHeader } from "./layout/PageHeader";
import {
  signIn,
  signUp,
  forgotPassword,
  confirmSignUp,
  resendConfirmationCode,
} from "../lib/auth";

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
  const [mode, setMode] = useState<"login" | "signup" | "forgot" | "confirm">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState<"email" | "password" | "confirmPassword" | "code" | null>(null);

  const isLogin = mode === "login";
  const isForgot = mode === "forgot";
  const isConfirm = mode === "confirm";

  const tr = (key: string, fallback: string) =>
    t(key, { defaultValue: fallback });

  const getFriendlyError = (rawMessage: string) => {
    const lower = rawMessage.toLowerCase();

    if (lower.includes("user does not exist") || lower.includes("incorrect username or password")) {
      return tr("login.accountDoesNotExist", "Sorry, account does not exist or incorrect password. Please check your credentials.");
    }
    if (lower.includes("user already exists") || lower.includes("already registered")) {
      return tr("login.accountAlreadyExists", "Account already exists. Please sign in.");
    }
    if (lower.includes("user is not confirmed")) {
      return tr("login.userNotConfirmed", "Please verify your email first. Check your inbox for a verification code.");
    }
    if (lower.includes("invalid verification code") || lower.includes("invalid code")) {
      return tr("login.invalidCode", "Invalid verification code. Please try again.");
    }
    if (lower.includes("password") && lower.includes("policy")) {
      return tr("login.passwordPolicy", "Password must be at least 8 characters with uppercase, lowercase, and a number.");
    }
    return rawMessage;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    setFieldError(null);

    try {
      if (isForgot) {
        await forgotPassword(email);
        setMessage(tr("login.resetEmailSent", "Check your email for a password reset code."));
        return;
      }

      if (isConfirm) {
        await confirmSignUp(email, verificationCode);
        setMessage(tr("login.emailVerified", "Email verified! You can now sign in."));
        setMode("login");
        setVerificationCode("");
        return;
      }

      if (!isLogin && password !== confirmPassword) {
        setError(tr("login.passwordMismatch", "Passwords do not match. Please try again."));
        setFieldError("confirmPassword");
        setLoading(false);
        return;
      }

      if (isLogin) {
        await signIn(email, password);
        setMessage(tr("login.signedIn", "Signed in successfully."));
        setTimeout(onAuthSuccess, 600);
      } else {
        await signUp(email, password);
        setMode("confirm");
        setMessage(tr("login.verificationSent", "A verification code has been sent to your email. Please enter it below."));
      }
    } catch (err) {
      const rawMessage = err instanceof Error ? err.message : "Something went wrong.";

      if (rawMessage.toLowerCase().includes("user is not confirmed")) {
        setMode("confirm");
        setFieldError(null);
        setError(getFriendlyError(rawMessage));
      } else if (rawMessage.toLowerCase().includes("incorrect") || rawMessage.toLowerCase().includes("password")) {
        setFieldError("password");
        setError(getFriendlyError(rawMessage));
      } else if (rawMessage.toLowerCase().includes("user does not exist") || rawMessage.toLowerCase().includes("email")) {
        setFieldError("email");
        setError(getFriendlyError(rawMessage));
      } else if (rawMessage.toLowerCase().includes("code") || rawMessage.toLowerCase().includes("verification")) {
        setFieldError("code");
        setError(getFriendlyError(rawMessage));
      } else {
        setFieldError(null);
        setError(getFriendlyError(rawMessage));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      await resendConfirmationCode(email);
      setMessage(tr("login.codeSent", "A new verification code has been sent to your email."));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend code");
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
    setVerificationCode("");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col overflow-x-hidden">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-600/8 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 left-0 w-[300px] h-[300px] bg-purple-500/6 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <PageHeader
          brand={t("common.brand")}
          onHome={onBack}
          sticky
        />

        {/* Main content */}
        <main className="flex-1 flex flex-col px-4 py-6 md:py-10">
          {/* Content grid */}
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-5xl">
              {/* Back button - aligned with grid */}
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-purple-300 transition-colors mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                {t("common.goBack", { defaultValue: "Go back" })}
              </button>

              <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
              
              {/* Left side — value prop (hidden on mobile) */}
              <section className="hidden md:block">
                <h1 className="text-3xl lg:text-4xl font-bold leading-tight mb-4">
                  {isForgot
                    ? tr("login.forgotTitle", "Reset your password")
                    : isConfirm
                      ? tr("login.confirmTitle", "Verify your email")
                      : isLogin
                        ? tr("login.welcomeBack", "Welcome back")
                        : tr("login.createAccountTitle", "Create your account")}
                </h1>

                <p className="text-gray-400 text-base lg:text-lg mb-10 leading-relaxed">
                  {isForgot
                    ? tr("login.forgotDescription", "Enter your email and we'll send you a code to reset your password.")
                    : isConfirm
                      ? tr("login.confirmDescription", "Enter the verification code sent to your email to activate your account.")
                      : isLogin
                        ? tr("login.signInDescription", "Sign in to continue your career assessment and view your recommendations.")
                        : tr("login.signUpDescription", "Create an account to save your quiz progress and access your career results later.")}
                </p>

                {/* Trust signals */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-900/30 border border-purple-800/40 flex items-center justify-center shrink-0">
                      <Zap className="w-4 h-4 text-purple-300" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{tr("login.trust1Title", "AI-powered career matching")}</p>
                      <p className="text-xs text-gray-500">{tr("login.trust1Body", "Get personalized recommendations based on your skills and interests")}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-900/30 border border-purple-800/40 flex items-center justify-center shrink-0">
                      <Shield className="w-4 h-4 text-purple-300" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{tr("login.trust2Title", "Your data stays private")}</p>
                      <p className="text-xs text-gray-500">{tr("login.trust2Body", "We never share your information with third parties for advertising")}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-900/30 border border-purple-800/40 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-purple-300" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{tr("login.trust3Title", "Free to use, always")}</p>
                      <p className="text-xs text-gray-500">{tr("login.trust3Body", "No credit card required, no hidden fees")}</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Right side — form card */}
              <section>
                <div className="bg-[#0c0c0c] border border-purple-900/30 rounded-2xl p-6 sm:p-8 shadow-2xl">
                  {/* Form header */}
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-white mb-1">
                      {isForgot
                        ? tr("login.forgotTitle", "Reset your password")
                        : isConfirm
                          ? tr("login.confirmTitle", "Verify your email")
                          : isLogin
                            ? tr("login.signIn", "Sign in")
                            : tr("login.signUp", "Sign up")}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {isForgot
                        ? tr("login.forgotSubtitle", "We'll email you a reset code.")
                        : isConfirm
                          ? tr("login.confirmSubtitle", "Check your inbox for a 6-digit code.")
                          : isLogin
                            ? tr("login.signInSubtitle", "Enter your email and password to continue.")
                            : tr("login.signUpSubtitle", "Start with your email and create a password.")}
                    </p>
                  </div>

                  {/* Continue without account */}
                  {onContinueWithoutAccount && !isConfirm && (
                    <div className="mb-6 rounded-lg border border-purple-900/40 bg-purple-950/20 p-4">
                      <p className="text-sm text-gray-300 mb-3">
                        {tr("login.promptText", "Sign in to save your progress, or continue without an account.")}
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
                    {error && (
                      <div className="rounded-lg border border-red-500/50 bg-red-950/30 px-4 py-3">
                        <p className="text-sm text-red-300">{error}</p>
                      </div>
                    )}

                    {message && (
                      <div className="rounded-lg border border-green-500/50 bg-green-950/30 px-4 py-3">
                        <p className="text-sm text-green-300">{message}</p>
                      </div>
                    )}

                    {/* Email field */}
                    {!isConfirm && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">{tr("login.email", "Email")}</label>
                        <div className={`flex items-center gap-3 rounded-lg border bg-[#050505] px-4 py-3 transition-colors ${fieldError === "email" ? "border-red-500" : "border-purple-900/40 focus-within:border-purple-500"}`}>
                          <Mail className={`w-4 h-4 shrink-0 ${fieldError === "email" ? "text-red-400" : "text-gray-500"}`} />
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setFieldError(null); }}
                            placeholder="you@example.com"
                            className="w-full bg-transparent text-white text-sm placeholder:text-gray-600 outline-none"
                          />
                        </div>
                      </div>
                    )}

                    {/* Verification code */}
                    {isConfirm && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">{tr("login.verificationCode", "Verification code")}</label>
                        <div className={`flex items-center gap-3 rounded-lg border bg-[#050505] px-4 py-3 transition-colors ${fieldError === "code" ? "border-red-500" : "border-purple-900/40 focus-within:border-purple-500"}`}>
                          <Lock className={`w-4 h-4 shrink-0 ${fieldError === "code" ? "text-red-400" : "text-gray-500"}`} />
                          <input
                            type="text"
                            required
                            value={verificationCode}
                            onChange={(e) => { setVerificationCode(e.target.value); setFieldError(null); }}
                            placeholder="123456"
                            maxLength={6}
                            className="w-full bg-transparent text-white text-sm placeholder:text-gray-600 outline-none tracking-widest"
                          />
                        </div>
                        <button type="button" onClick={handleResendCode} disabled={loading} className="text-xs text-purple-400 hover:text-purple-300 font-medium transition-colors mt-2">
                          {tr("login.resendCode", "Resend code")}
                        </button>
                      </div>
                    )}

                    {/* Password fields */}
                    {!isForgot && !isConfirm && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">{tr("login.password", "Password")}</label>
                        <div className={`flex items-center gap-3 rounded-lg border bg-[#050505] px-4 py-3 transition-colors ${fieldError === "password" ? "border-red-500" : "border-purple-900/40 focus-within:border-purple-500"}`}>
                          <Lock className={`w-4 h-4 shrink-0 ${fieldError === "password" ? "text-red-400" : "text-gray-500"}`} />
                          <input
                            type="password"
                            required
                            minLength={6}
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setFieldError(null); }}
                            placeholder="••••••••"
                            className="w-full bg-transparent text-white text-sm placeholder:text-gray-600 outline-none"
                          />
                        </div>
                        {!isLogin && <p className="text-xs text-gray-400 mt-1.5">{tr("login.passwordHint", "Must be at least 8 characters with uppercase, lowercase, and a number")}</p>}
                      </div>
                    )}

                    {!isForgot && !isLogin && !isConfirm && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">{tr("login.confirmPassword", "Confirm password")}</label>
                        <div className={`flex items-center gap-3 rounded-lg border bg-[#050505] px-4 py-3 transition-colors ${fieldError === "confirmPassword" ? "border-red-500" : "border-purple-900/40 focus-within:border-purple-500"}`}>
                          <Lock className={`w-4 h-4 shrink-0 ${fieldError === "confirmPassword" ? "text-red-400" : "text-gray-500"}`} />
                          <input
                            type="password"
                            required
                            minLength={6}
                            value={confirmPassword}
                            onChange={(e) => { setConfirmPassword(e.target.value); setFieldError(null); }}
                            placeholder="••••••••"
                            className="w-full bg-transparent text-white text-sm placeholder:text-gray-600 outline-none"
                          />
                        </div>
                      </div>
                    )}

                    {isLogin && (
                      <div className="text-right">
                        <button type="button" onClick={() => { setMode("forgot"); setMessage(""); setError(""); setPassword(""); }} className="text-xs text-purple-400 hover:text-purple-300 font-medium transition-colors">
                          {tr("login.forgotPassword", "Forgot password?")}
                        </button>
                      </div>
                    )}

                    <Button type="submit" disabled={loading} className="w-full bg-purple-700 hover:bg-purple-600 text-white font-semibold py-3 text-sm disabled:opacity-60 transition-colors">
                      {loading
                        ? tr("login.pleaseWait", "Please wait...")
                        : isForgot
                          ? tr("login.sendResetLink", "Send reset code")
                          : isConfirm
                            ? tr("login.verifyButton", "Verify email")
                            : isLogin
                              ? tr("login.signIn", "Sign in")
                              : tr("login.createAccountButton", "Create account")}
                    </Button>
                  </form>

                  {/* Mode switch */}
                  <div className="mt-6 pt-5 border-t border-purple-900/20 text-center text-sm text-gray-500">
                    {isForgot || isConfirm ? (
                      <button type="button" onClick={() => { setMode("login"); setMessage(""); setError(""); setVerificationCode(""); }} className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                        {tr("login.backToSignIn", "Back to sign in")}
                      </button>
                    ) : (
                      <>
                        {isLogin ? tr("login.noAccount", "Don't have an account?") : tr("login.hasAccount", "Already have an account?")}{" "}
                        <button type="button" onClick={switchMode} className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                          {isLogin ? tr("login.signUp", "Sign up") : tr("login.signIn", "Sign in")}
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Terms note */}
                {!isForgot && !isLogin && !isConfirm && (
                  <p className="text-xs text-gray-500 text-center mt-4 leading-relaxed">
                    {tr("login.termsNote", "By creating an account, you agree to our Terms of Service and Privacy Policy.")}
                  </p>
                )}
              </section>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-800/50 py-4">
          <div className="max-w-5xl mx-auto px-4">
            <p className="text-xs text-gray-600 text-center sm:text-left">
              &copy; {new Date().getFullYear()} {t("common.brand")}
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
