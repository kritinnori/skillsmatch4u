import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Trash2, AlertTriangle, LogIn } from "lucide-react";
import { BrandLogo } from "./layout/BrandLogo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { supabase } from "../lib/supabase";
import { API_BASE_URL } from "../lib/api";
import { Button } from "./ui/button";

interface DeleteAccountPageProps {
  onHome: () => void;
}

export function DeleteAccountPage({ onHome }: DeleteAccountPageProps) {
  const { t } = useTranslation();

  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Delete state
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ? { id: data.user.id, email: data.user.email ?? undefined } : null);
      setLoading(false);
    });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const { data } = await supabase.auth.getUser();
      setUser(data.user ? { id: data.user.id, email: data.user.email ?? undefined } : null);
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleDelete = async () => {
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
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <header className="border-b border-purple-900/40 bg-[#050505] sticky top-0 z-20">
        <div className="w-full px-4 md:px-10 py-3 flex items-center justify-between">
          <BrandLogo label={t("common.brand")} onClick={onHome} />
          <LanguageSwitcher />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-16">
        {/* Success state */}
        {deleted && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-900/30 border border-green-700/50 flex items-center justify-center mx-auto">
              <Trash2 className="w-8 h-8 text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Account Deleted</h1>
            <p className="text-body-sm text-gray-400">
              Your account and all associated data have been permanently deleted. You may close this page.
            </p>
          </div>
        )}

        {/* Loading */}
        {!deleted && loading && (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-purple-900/40 border-t-purple-500 rounded-full animate-spin" />
          </div>
        )}

        {/* Not logged in — show login form */}
        {!deleted && !loading && !user && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-red-900/30 border border-red-700/50 flex items-center justify-center mx-auto">
                <LogIn className="w-7 h-7 text-red-400" />
              </div>
              <h1 className="text-2xl font-bold text-white">Delete Your Account</h1>
              <p className="text-body-sm text-gray-400">
                Sign in to verify your identity before deleting your account.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-body-xs text-gray-400 block mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-purple-900/50 bg-[#0b0b0b] text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="text-body-xs text-gray-400 block mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-purple-900/50 bg-[#0b0b0b] text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500"
                  placeholder="••••••••"
                />
              </div>
              {loginError && (
                <p className="text-body-xs text-red-400">{loginError}</p>
              )}
              <Button
                type="submit"
                disabled={loginLoading}
                className="w-full bg-purple-700 hover:bg-purple-600 text-white font-semibold"
              >
                {loginLoading ? "Signing in..." : "Sign in to continue"}
              </Button>
            </form>
          </div>
        )}

        {/* Logged in — show delete confirmation */}
        {!deleted && !loading && user && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-red-900/30 border border-red-700/50 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-7 h-7 text-red-400" />
              </div>
              <h1 className="text-2xl font-bold text-white">Delete Your Account</h1>
              <p className="text-body-sm text-gray-400">
                Signed in as <span className="text-white font-medium">{user.email}</span>
              </p>
            </div>

            <div className="rounded-xl border border-red-900/40 bg-red-950/20 p-5 space-y-3">
              <p className="text-body-sm text-gray-300 font-medium">
                This action is permanent and cannot be undone. The following data will be deleted:
              </p>
              <ul className="text-body-sm text-gray-400 space-y-1.5 ml-4 list-disc">
                <li>Your account credentials and login</li>
                <li>Career assessment results</li>
                <li>Course and job interaction history</li>
                <li>All saved progress and preferences</li>
              </ul>
            </div>

            <div>
              <label className="text-body-xs text-gray-400 block mb-2">
                Type <span className="text-white font-bold">DELETE</span> to confirm
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-purple-900/50 bg-[#0b0b0b] text-white placeholder:text-gray-500 focus:outline-none focus:border-red-500"
                placeholder="DELETE"
              />
            </div>

            {error && (
              <p className="text-body-xs text-red-400">Error: {error}</p>
            )}

            <div className="flex gap-3">
              <Button
                onClick={onHome}
                variant="outline"
                className="flex-1 border-purple-900/50 bg-[#0b0b0b] text-white hover:bg-purple-950/50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                disabled={confirmText !== "DELETE" || deleting}
                className="flex-1 bg-red-700 hover:bg-red-600 text-white font-semibold disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete my account"}
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
