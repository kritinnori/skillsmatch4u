import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Lock } from "lucide-react";
import { Button } from "./ui/button";
import { BrandLogo } from "./layout/BrandLogo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { supabase } from "../lib/supabase";

interface ResetPasswordPageProps {
  onDone: () => void;
}

export function ResetPasswordPage({ onDone }: ResetPasswordPageProps) {
  const { t } = useTranslation();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const tr = (key: string, fallback: string) =>
    t(key, { defaultValue: fallback });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (password !== confirm) {
      setError(tr("login.passwordsDontMatch", "Passwords don't match."));
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setMessage(tr("login.passwordUpdated", "Password updated! Taking you home..."));
      setTimeout(onDone, 1200);
    } catch {
      setError(tr("login.genericError", "Something went wrong. Please try again."));
    } finally {
      setLoading(false);
    }
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

        <main className="max-w-md mx-auto px-4 py-16 md:py-24">
          <section className="bg-[#111111] border border-purple-900/40 rounded-2xl p-6 md:p-8 shadow-xl">
            <h1 className="text-2xl font-bold mb-2">
              {tr("login.resetPasswordTitle", "Set a new password")}
            </h1>
            <p className="text-gray-400 text-sm mb-6">
              {tr("login.resetPasswordSubtitle", "Enter your new password below.")}
            </p>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <label className="block">
                <span className="text-sm font-medium text-gray-300">
                  {tr("login.newPassword", "New password")}
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

              <label className="block">
                <span className="text-sm font-medium text-gray-300">
                  {tr("login.confirmPassword", "Confirm new password")}
                </span>
                <div className="mt-2 flex items-center gap-3 rounded-lg border border-purple-900/50 bg-[#080808] px-4 py-3 focus-within:border-purple-500">
                  <Lock className="w-5 h-5 text-purple-300" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-transparent text-white placeholder:text-gray-500 outline-none"
                  />
                </div>
              </label>

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
                  : tr("login.updatePassword", "Update password")}
              </Button>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
}
