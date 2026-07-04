import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import './i18n'
import App from './App.tsx'
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage.tsx'
import { TermsPage } from './components/TermsPage.tsx'
import { AboutPage } from './components/AboutPage.tsx'

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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/privacy-policy" element={<PrivacyRoute />} />
        <Route path="/terms" element={<TermsRoute />} />
        <Route path="/about" element={<AboutRoute />} />
        <Route path="*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
