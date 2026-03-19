import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AuthPage from "./AuthPage";
import HomePage from "./HomePage";
import CatalogPage from "./CatalogPage";
import SettingsPage from "./SettingsPage";
import Footer from "./components/Footer";
import ServicesPage from "./ServicesPage";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#f8f9fa]">
        <div className="flex-grow">
          <Routes>
            {/* Pagina de Login */}
            <Route path="/" element={<AuthPage />} />

            {/* Rutele de interiorul portalului */}
            <Route path="/home" element={<HomePage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/services" element={<ServicesPage />} />
            {/* Redirect automat către Login dacă adresa nu există */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>

        {/* Footer-ul global (Wrapper pentru a-l ascunde pe Login) */}
        <FooterWrapper />
      </div>
    </Router>
  );
}

function FooterWrapper() {
  const isLoginPage = window.location.pathname === "/";
  if (isLoginPage) return null;
  return <Footer />;
}

export default App;
