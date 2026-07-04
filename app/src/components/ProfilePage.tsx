import { useState } from "react";
import { useTranslation } from "react-i18next";
import { UserCircle, LogOut, Trash2, Mail, ShieldAlert } from "lucide-react";
import { PageHeader } from "./layout/PageHeader";
import { Button } from "./ui/button";
import { supabase } from "../lib/supabase";
import { API_BASE_URL } from "../lib/api";

interface ProfilePageProps {
  user: { id: string; email?: string } | null;
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
  const { t } = useTranslation();
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        title={t("profile.title", { defaultValue: "My Profile" })}
        user={user}
        onSignOut={onSignOut}
        onDashboard={onDashboard}
        sticky
      />

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Account info card */}
        <section className="bg-[#111111] rounded-xl border border-purple-900/40 p-6 sm:p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-purple-900/40 border border-purple-700/60 flex items-center justify-center shrink-0">
              <UserCircle className="w-9 h-9 text-purple-300" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-white truncate">
                {t("profile.account", { defaultValue: "Account" })}
              </h2>
              <p className="text-sm text-gray-400">
                {t("profile.subtitle", {
                  defaultValue: "Manage your SkillsMatch4U account",
                })}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 bg-[#0a0a0a] border border-purple-900/30 rounded-lg px-4 py-3">
              <Mail className="w-4 h-4 text-purple-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-gray-500">
                  {t("profile.email", { defaultValue: "Email" })}
                </p>
                <p className="text-sm text-white truncate">
                  {user?.email ||
                    t("profile.noEmail", { defaultValue: "Not available" })}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Button
              onClick={onSignOut}
              className="w-full sm:w-auto bg-purple-700 hover:bg-purple-600 text-white font-semibold"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {t("login.signOut", { defaultValue: "Sign out" })}
            </Button>
          </div>
        </section>

        {/* Danger zone */}
        <section className="bg-[#111111] rounded-xl border border-red-900/50 p-6 sm:p-8">
          <div className="flex items-start gap-3 mb-4">
            <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-base font-bold text-red-400">
                {t("profile.dangerZone", { defaultValue: "Danger Zone" })}
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                {t("profile.deleteWarning", {
                  defaultValue:
                    "Deleting your account permanently removes your login, quiz results, and all saved progress. This cannot be undone.",
                })}
              </p>
            </div>
          </div>
          <Button
            onClick={() => {
              setShowConfirm(true);
              setConfirmText("");
              setError(null);
            }}
            className="bg-red-800 hover:bg-red-700 text-white font-semibold"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {t("profile.deleteAccount", { defaultValue: "Delete account" })}
          </Button>
        </section>
      </main>

      {/* Confirmation modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
          <div className="bg-[#111111] border border-red-900/60 rounded-xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">
              {t("profile.confirmTitle", {
                defaultValue: "Delete your account?",
              })}
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              {t("profile.confirmBody", {
                defaultValue:
                  'This is permanent. Type DELETE below to confirm.',
              })}
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
                {t("common.errorPrefix", { defaultValue: "Error" })}: {error}
              </p>
            )}
            <div className="flex gap-3 justify-end">
              <Button
                onClick={() => setShowConfirm(false)}
                disabled={deleting}
                className="bg-gray-800 hover:bg-gray-700 text-white"
              >
                {t("common.cancel", { defaultValue: "Cancel" })}
              </Button>
              <Button
                onClick={handleDeleteAccount}
                disabled={confirmText.trim() !== "DELETE" || deleting}
                className="bg-red-800 hover:bg-red-700 text-white font-semibold disabled:opacity-50"
              >
                {deleting
                  ? t("profile.deleting", { defaultValue: "Deleting..." })
                  : t("profile.deleteAccount", {
                      defaultValue: "Delete account",
                    })}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
