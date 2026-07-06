import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  UserCircle,
  LogOut,
  Trash2,
  Mail,
  ShieldAlert,
  CalendarDays,
  AtSign,
  LayoutDashboard,
  ArrowLeft,
} from "lucide-react";
import { BrandLogo } from "./layout/BrandLogo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Button } from "./ui/button";
import { SignOutModal } from "./SignOutModal";
import { supabase } from "../lib/supabase";
import { API_BASE_URL } from "../lib/api";

interface ProfileUser {
  id: string;
  email?: string;
  created_at?: string;
  user_metadata?: { name?: string; full_name?: string };
}

interface ProfilePageProps {
  user: ProfileUser | null;
  onBack: () => void;
  onHome: () => void;
  onSignOut: () => void;
  onDashboard: () => void;
  onAccountDeleted: () => void;
}

export function ProfilePage({
  user,
  onBack,
  onHome,
  onSignOut,
  onDashboard,
  onAccountDeleted,
}: ProfilePageProps) {
  const { t, i18n } = useTranslation();
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleted, setDeleted] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  const username =
    user?.user_metadata?.name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    t("profile.noEmail");

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString(
        i18n.resolvedLanguage || i18n.language || "en",
        { year: "numeric", month: "long", day: "numeric" }
      )
    : null;

  const handleDeleteAccount = async () => {
    if (!user) return;
    setDeleting(true);
    setError(null);
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error("Not signed in");

      const res = await fetch(`${API_BASE_URL}/account/delete`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to delete account");
      }
      await supabase.auth.signOut();
      setDeleted(true);
      setDeleting(false);
      setTimeout(() => onAccountDeleted(), 4000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setDeleting(false);
    }
  };

  const goHome = onHome || onBack;

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <header className="border-b border-purple-900/40 bg-[#050505] sticky top-0 z-20">
        <div className="w-full px-4 md:px-10 py-3 flex items-center justify-between">
          <BrandLogo label={t("common.brand")} onClick={goHome} />
          <LanguageSwitcher />
        </div>
      </header>

      {/* Content */}
      <div className="w-full px-4 md:px-10 py-10 md:py-14">
        {/* Account deleted success */}
        {deleted && (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center space-y-4 bg-[#111111] rounded-xl border border-purple-900/40 p-8 sm:p-12 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-green-900/30 border border-green-700/50 flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white">Account Deleted</h2>
              <p className="text-sm text-gray-400">
                Your account and all associated data have been permanently removed. Thank you for using SkillsMatch4U.
              </p>
              <p className="text-xs text-gray-500">Redirecting to home page...</p>
            </div>
          </div>
        )}

        {/* Profile content */}
        {!deleted && (
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 lg:gap-16">
            {/* Sidebar */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-purple-900/40 border-2 border-purple-700/60 flex items-center justify-center shrink-0">
                  <UserCircle className="w-9 h-9 text-purple-300" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-white truncate">{username}</h2>
                  <p className="text-sm text-gray-400 truncate">
                    {user?.email || t("profile.noEmail")}
                  </p>
                </div>
              </div>

              {/* Sidebar nav / actions */}
              <nav className="space-y-2">
                <button
                  type="button"
                  onClick={onDashboard}
                  className="w-full flex items-center gap-3 text-sm text-gray-300 hover:text-white hover:bg-purple-900/20 rounded-lg px-3 py-2.5 transition-colors text-left"
                >
                  <LayoutDashboard className="w-4 h-4 text-purple-400" />
                  {t("dashboard.title", { defaultValue: "My Dashboard" })}
                </button>
                <button
                  type="button"
                  onClick={() => setShowSignOutConfirm(true)}
                  className="w-full flex items-center gap-3 text-sm text-gray-300 hover:text-white hover:bg-purple-900/20 rounded-lg px-3 py-2.5 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4 text-purple-400" />
                  {t("login.signOut")}
                </button>
              </nav>

              {memberSince && (
                <p className="text-xs text-gray-600 mt-6 px-3">
                  {t("profile.memberSince")}: {memberSince}
                </p>
              )}
            </aside>

            {/* Main content */}
            <main className="space-y-8">
              {/* Back navigation */}
              <button
                type="button"
                onClick={goHome}
                className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-purple-300 transition-colors -mt-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {t("common.goBackButton", { defaultValue: "Back to Home" })}
              </button>

              {/* Section: Account details */}
              <section>
                <h1 className="text-2xl font-bold text-white mb-1">
                  {t("profile.title")}
                </h1>
                <p className="text-sm text-gray-500 mb-6">
                  {t("profile.subtitle")}
                </p>

                <div className="space-y-4">
                  {/* Username */}
                  <div className="bg-[#111111] border border-purple-900/20 rounded-lg px-5 py-4">
                    <div className="flex items-center gap-3">
                      <AtSign className="w-4 h-4 text-purple-400 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500 mb-0.5">{t("profile.username")}</p>
                        <p className="text-sm text-white truncate">{username}</p>
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="bg-[#111111] border border-purple-900/20 rounded-lg px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-purple-400 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500 mb-0.5">{t("profile.email")}</p>
                        <p className="text-sm text-white truncate">
                          {user?.email || t("profile.noEmail")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Member since */}
                  {memberSince && (
                    <div className="bg-[#111111] border border-purple-900/20 rounded-lg px-5 py-4">
                      <div className="flex items-center gap-3">
                        <CalendarDays className="w-4 h-4 text-purple-400 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-gray-500 mb-0.5">{t("profile.memberSince")}</p>
                          <p className="text-sm text-white truncate">{memberSince}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Section: Danger zone */}
              <section className="pt-4 border-t border-purple-900/20">
                <div className="flex items-start gap-3 mb-4">
                  <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-base font-bold text-red-400">
                      {t("profile.dangerZone")}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1 leading-relaxed">
                      {t("profile.deleteWarning")}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    setShowConfirm(true);
                    setConfirmText("");
                    setError(null);
                  }}
                  className="bg-red-900/60 hover:bg-red-800 text-red-200 font-semibold border border-red-800/60"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {t("profile.deleteAccount")}
                </Button>
              </section>
            </main>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-purple-900/40 py-6 mt-auto">
        <div className="w-full px-4 md:px-10">
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} {t("common.brand")}
          </p>
        </div>
      </footer>

      {/* Confirmation modal */}
      {showConfirm && !deleted && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
          <div className="bg-[#111111] border border-red-900/60 rounded-xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">
              {t("profile.confirmTitle")}
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              {t("profile.confirmBody")}
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              className="w-full bg-[#0a0a0a] border border-purple-900/40 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-red-500 mb-4"
              autoFocus
            />
            {error && (
              <p className="text-sm text-red-400 mb-3">
                {t("common.errorPrefix")}: {error}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-end">
              <Button
                onClick={() => setShowConfirm(false)}
                disabled={deleting}
                className="bg-gray-800 hover:bg-gray-700 text-white w-full sm:w-auto"
              >
                {t("profile.cancel")}
              </Button>
              <Button
                onClick={handleDeleteAccount}
                disabled={confirmText.trim() !== "DELETE" || deleting}
                className="bg-red-800 hover:bg-red-700 text-white font-semibold disabled:opacity-50 w-full sm:w-auto"
              >
                {deleting ? t("profile.deleting") : t("profile.deleteAccount")}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Sign out confirmation modal */}
      {showSignOutConfirm && (
        <SignOutModal
          onConfirm={onSignOut}
          onCancel={() => setShowSignOutConfirm(false)}
        />
      )}
    </div>
  );
}
