import React from "react";
import Layout from "./Layout";
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
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { AlertProvider } from "./Alerts";
import AdminPage from "./AdminPage";


function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificăm dacă există un user logat când se deschide aplicația
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  const [searchQuery, setSearchQuery] = useState("");
  if (loading) return <div>Se încarcă...</div>;
  return (
    <AlertProvider>
      
       
    <Router>
      <div className="min-h-screen flex flex-col bg-[#f8f9fa]">
        <div className="flex-grow">
          <Routes>
  {/* Pagina de Login - Fără Layout */}
  <Route path="/" element={!user ? <AuthPage /> : <Navigate to="/home" />} />

  {/* Rute Protejate cu Layout (Navbar, Nume, Notificări) */}
  <Route 
    path="/home" 
    element={user ? (
      <Layout searchQuery={searchQuery} setSearchQuery={setSearchQuery}>
        <HomePage searchQuery={searchQuery} />
      </Layout>
    ) : <Navigate to="/" />} 
  />
  <Route 
    path="/catalog" 
    element={user ? <Layout><CatalogPage /></Layout> : <Navigate to="/" />} 
  />
  <Route 
    path="/services" 
    element={user ? <Layout><ServicesPage /></Layout> : <Navigate to="/" />} 
  />
  <Route 
    path="/settings" 
    element={user ? <Layout><SettingsPage /></Layout> : <Navigate to="/" />} 
  />
<Route 
  path="/admin" 
  element={user?.email === "admin@student.uoradea.ro" ? <AdminPage /> : <Navigate to="/home" />} 
/>
  <Route path="*" element={<Navigate to="/" />} />
</Routes>
        </div>

        {/* Footer-ul global (Wrapper pentru a-l ascunde pe Login) */}
        <FooterWrapper />
      </div>
    </Router>
    
     
    </AlertProvider>
  );
}

function FooterWrapper() {
  const isLoginPage = window.location.pathname === "/";
  if (isLoginPage) return null;
  return <Footer />;
}

export default App;
