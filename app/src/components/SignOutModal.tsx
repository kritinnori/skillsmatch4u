import { useTranslation } from "react-i18next";
import { LogOut } from "lucide-react";
import { Button } from "./ui/button";

interface SignOutModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export function SignOutModal({ onConfirm, onCancel }: SignOutModalProps) {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
      <div className="bg-[#111111] border border-purple-900/40 rounded-xl p-6 sm:p-8 max-w-sm w-full shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-purple-900/40 border border-purple-700/60 flex items-center justify-center shrink-0">
            <LogOut className="w-5 h-5 text-purple-300" />
          </div>
          <h3 className="text-lg font-bold text-white">
            {t("signOut.confirmTitle", { defaultValue: "Sign out?" })}
          </h3>
        </div>
        <p className="text-sm text-gray-400 mb-6 leading-relaxed">
          {t("signOut.confirmBody", {
            defaultValue: "You'll need to sign in again to access your dashboard, saved results, and profile.",
          })}
        </p>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-end">
          <Button
            onClick={onCancel}
            className="bg-gray-800 hover:bg-gray-700 text-white w-full sm:w-auto"
          >
            {t("signOut.cancel", { defaultValue: "Cancel" })}
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-purple-700 hover:bg-purple-600 text-white font-semibold w-full sm:w-auto"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {t("signOut.confirm", { defaultValue: "Sign out" })}
          </Button>
        </div>
      </div>
    </div>
  );
}
