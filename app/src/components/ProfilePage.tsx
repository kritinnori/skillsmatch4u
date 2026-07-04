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
} from "lucide-react";
import { PageHeader } from "./layout/PageHeader";
import { Button } from "./ui/button";
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

  // Username: prefer the name from signup metadata, fall back to email prefix
  const username =
    user?.user_metadata?.name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    t("profile.noEmail");

  // Member-since date, localized to the current UI language
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
      // Server deleted the auth user + data; clear the local session too.
      await supabase.auth.signOut();
      onAccountDeleted();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setDeleting(false);
    }
  };

  return (
    <div className="page-shell">
      <PageHeader
        brand="SkillsMatch4U"
        onBack={onBack}
        onHome={onHome}
        title={t("profile.title")}
        user={user}
        onSignOut={onSignOut}
        onDashboard={onDashboard}
        sticky
      />

      <main className="max-w-2xl mx-auto px-3 sm:px-4 py-6 sm:py-8 space-y-4 sm:space-y-6">
        {/* Account info card */}
        <section className="bg-[#111111] rounded-xl border border-purple-900/40 p-4 sm:p-8">
          <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-purple-900/40 border border-purple-700/60 flex items-center justify-center shrink-0">
              <UserCircle className="w-7 h-7 sm:w-9 sm:h-9 text-purple-300" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-xl font-bold text-white truncate">
                {username}
              </h2>
              <p className="text-xs sm:text-sm text-gray-400">
                {t("profile.subtitle")}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 bg-[#0a0a0a] border border-purple-900/30 rounded-lg px-3 sm:px-4 py-3">
              <AtSign className="w-4 h-4 text-purple-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-gray-500">
                  {t("profile.username")}
                </p>
                <p className="text-sm text-white truncate">{username}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-[#0a0a0a] border border-purple-900/30 rounded-lg px-3 sm:px-4 py-3">
              <Mail className="w-4 h-4 text-purple-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-gray-500">{t("profile.email")}</p>
                <p className="text-sm text-white truncate">
                  {user?.email || t("profile.noEmail")}
                </p>
              </div>
            </div>

            {memberSince && (
              <div className="flex items-center gap-3 bg-[#0a0a0a] border border-purple-900/30 rounded-lg px-3 sm:px-4 py-3">
                <CalendarDays className="w-4 h-4 text-purple-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">
                    {t("profile.memberSince")}
                  </p>
                  <p className="text-sm text-white truncate">{memberSince}</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-5 sm:mt-6">
            <Button
              onClick={onSignOut}
              className="w-full sm:w-auto bg-purple-700 hover:bg-purple-600 text-white font-semibold"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {t("login.signOut")}
            </Button>
          </div>
        </section>

        {/* Danger zone */}
        <section className="bg-[#111111] rounded-xl border border-red-900/50 p-4 sm:p-8">
          <div className="flex items-start gap-3 mb-4">
            <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm sm:text-base font-bold text-red-400">
                {t("profile.dangerZone")}
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
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
            className="w-full sm:w-auto bg-red-800 hover:bg-red-700 text-white font-semibold"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {t("profile.deleteAccount")}
          </Button>
        </section>
      </main>

      {/* Confirmation modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
          <div className="bg-[#111111] border border-red-900/60 rounded-xl p-5 sm:p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-base sm:text-lg font-bold text-white mb-2">
              {t("profile.confirmTitle")}
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 mb-4">
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
    </div>
  );
}
