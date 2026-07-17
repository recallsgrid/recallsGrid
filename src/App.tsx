import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProductPage } from './pages/product';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';

function RouteChatCleanup() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== '/') {
      document.querySelectorAll('[id*="tawk"], [class*="tawk"], iframe[src*="tawk.to"], script[src*="tawk.to"], div[src*="tawk.to"]').forEach((node) => node.remove());
      const script = document.getElementById('tawk-script');
      if (script) script.remove();
      if (window.Tawk_API) delete window.Tawk_API;
      if (window.Tawk_LoadStart) delete window.Tawk_LoadStart;
    }
  }, [location.pathname]);

  return null;
}

export function App() {
  return (
    <BrowserRouter>
      <RouteChatCleanup />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsPage />} />
      </Routes>
    </BrowserRouter>);

}