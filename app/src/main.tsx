import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import './i18n'
import App from './App.tsx'
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage.tsx'
import { TermsPage } from './components/TermsPage.tsx'
import { AboutPage } from './components/AboutPage.tsx'
import { DeleteAccountPage } from './components/DeleteAccountPage.tsx'
import { ProfilePage } from './components/ProfilePage.tsx'
import { signOut as cognitoSignOut, onAuthStateChange } from './lib/auth.ts'
import type { AuthUser } from './lib/auth.ts'

function PrivacyRoute() {
  const navigate = () => { window.location.href = '/'; };
  return (
    <PrivacyPolicyPage
      onBack={navigate}
      onHome={navigate}
    />
  );
}

function TermsRoute() {
  const navigate = () => { window.location.href = '/'; };
  return (
    <TermsPage
      onBack={navigate}
      onHome={navigate}
    />
  );
}

function AboutRoute() {
  const navigate = () => { window.location.href = '/'; };
  return (
    <AboutPage
      onBack={navigate}
      onHome={navigate}
    />
  );
}

function DeleteAccountRoute() {
  const navigate = () => { window.location.href = '/'; };
  return (
    <DeleteAccountPage
      onHome={navigate}
    />
  );
}

function ProfileRoute() {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((authUser) => {
      setUser(authUser);
    });
    return () => { unsubscribe(); };
  }, []);

  const handleSignOut = () => {
    cognitoSignOut();
    setUser(null);
    window.location.href = '/';
  };

  return (
    <ProfilePage
      user={user}
      onBack={() => { window.location.href = '/'; }}
      onHome={() => { window.location.href = '/'; }}
      onSignOut={handleSignOut}
      onDashboard={() => { window.location.href = '/'; }}
      onAccountDeleted={() => { window.location.href = '/'; }}
    />
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/privacy-policy" element={<PrivacyRoute />} />
        <Route path="/terms" element={<TermsRoute />} />
        <Route path="/about" element={<AboutRoute />} />
        <Route path="/delete-account" element={<DeleteAccountRoute />} />
        <Route path="/profile" element={<ProfileRoute />} />
        <Route path="*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
