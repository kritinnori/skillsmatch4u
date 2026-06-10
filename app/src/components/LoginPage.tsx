import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Mail, Lock, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { BrandLogo } from "./layout/BrandLogo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { supabase } from "../lib/supabase";

interface LoginPageProps {
  onBack: () => void;
}

export function LoginPage({ onBack }: LoginPageProps) {
  const { t } = useTranslation();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const isLogin = mode === "login";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        setMessage("Signed in successfully.");
        setTimeout(() => {
          onBack();
        }, 800);
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        setMessage(
          "Account created successfully. You can now sign in."
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(isLogin ? "signup" : "login");
    setMessage("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_bottom_left,rgba(126,34,206,0.28),transparent_42%)]" />

      <div className="relative z-10">
        <header className="border-b border-purple-900/40 bg-[#050505]">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
            <BrandLogo label={t("common.brand")} />
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
                Personalized career matching
              </div>

              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-5">
                {isLogin ? "Welcome back" : "Create your account"}
              </h1>

              <p className="text-gray-300 text-lg max-w-xl">
                {isLogin
                  ? "Sign in to continue your career assessment and view your recommendations."
                  : "Create an account to save your quiz progress and access your career results later."}
              </p>
            </section>

            <section className="bg-[#111111] border border-purple-900/40 rounded-2xl p-6 md:p-8 shadow-xl">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">
                  {isLogin ? "Sign in" : "Sign up"}
                </h2>
                <p className="text-gray-400 text-sm">
                  {isLogin
                    ? "Enter your email and password to continue."
                    : "Start with your email and create a password."}
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <label className="block">
                  <span className="text-sm font-medium text-gray-300">
                    Email
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

                <label className="block">
                  <span className="text-sm font-medium text-gray-300">
                    Password
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

                {isLogin && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="text-sm text-purple-300 hover:text-purple-200"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {error && (
                  <p className="rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-300">
                    {error}
                  </p>
                )}

                {message && (
                  <p className="rounded-lg border border-green-900/50 bg-green-950/30 px-4 py-3 text-sm text-green-300">
                    {message}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-purple-700 hover:bg-purple-600 text-white font-semibold py-6 disabled:opacity-60"
                >
                  {loading
                    ? "Please wait..."
                    : isLogin
                      ? "Sign in"
                      : "Create account"}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-gray-400">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={switchMode}
                  className="text-purple-300 hover:text-purple-200 font-semibold"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
