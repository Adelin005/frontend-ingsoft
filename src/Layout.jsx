import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { 
  Bell, Settings, LogOut, Clock, 
  CheckCircle, AlertCircle, X, Info 
} from "lucide-react";

// IMPORTANT: Importă hook-ul din noul fișier creat


const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation()
  
  // 1. Folosim hook-ul global în loc de useState local

  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [userName, setUserName] = useState("Student");

  const notifications = [
    { id: 1, text: "Nota nouă la Programare Web", time: "2h în urmă", icon: "📝" },
    { id: 2, text: "Sesiunea de restanțe a fost publicată", time: "5h în urmă", icon: "📅" },
    { id: 3, text: "Bursa de merit a fost procesată", time: "1 zi în urmă", icon: "💰" },
  ];

  useEffect(() => {
    const fetchUserName = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const docSnap = await getDoc(doc(db, "student", user.uid));
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserName(`${data.Prenume} ${data.Nume}`);
          }
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }
    };
    fetchUserName();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#001f3f] font-sans flex flex-col">
      
      {/* NAVBAR */}
      <nav className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <span className="text-xl font-bold tracking-tighter text-[#001f3f] cursor-pointer" onClick={() => navigate("/home")}>
            Portal Universitar
          </span>
          <div className="hidden md:flex gap-6 text-[10px] font-black uppercase tracking-widest items-center">
            <NavLink to="/home" className={({ isActive }) => isActive ? "text-[#001f3f] border-b-2 border-[#001f3f] pb-1" : "text-gray-400 hover:text-[#001f3f]"}>Acasa</NavLink>
            <NavLink to="/catalog" className={({ isActive }) => isActive ? "text-[#001f3f] border-b-2 border-[#001f3f] pb-1" : "text-gray-400 hover:text-[#001f3f]"}>Catalog</NavLink>
            <NavLink to="/services" className={({ isActive }) => isActive ? "text-[#001f3f] border-b-2 border-[#001f3f] pb-1" : "text-gray-400 hover:text-[#001f3f]"}>Servicii</NavLink>
            <NavLink to="/settings" className={({ isActive }) => isActive ? "text-[#001f3f] border-b-2 border-[#001f3f] pb-1" : "text-gray-400 hover:text-[#001f3f]"}>Setări</NavLink>
          </div>
        </div>

        <div className="flex items-center gap-5">
          {/* NOTIFICARI */}
          <div className="relative">
            <div className="relative cursor-pointer group p-1" onClick={() => { setIsNotificationsOpen(!isNotificationsOpen); setIsProfileOpen(false); }}>
              <Bell size={20} className={isNotificationsOpen ? 'text-blue-600' : 'text-gray-400'} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 border border-white rounded-full"></span>
            </div>
            {isNotificationsOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsNotificationsOpen(false)}></div>
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-20 overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                    <h3 className="text-xs font-black uppercase tracking-widest">Notificări</h3>
                  </div>
                  <div className="max-h-[350px] overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className="px-5 py-4 border-b border-gray-50 hover:bg-blue-50 transition-colors cursor-pointer flex gap-3">
                        <span className="text-xl">{n.icon}</span>
                        <div>
                          <p className="text-sm font-bold leading-tight">{n.text}</p>
                          <p className="text-[10px] text-gray-400 flex items-center gap-1"><Clock size={10} /> {n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* PROFIL */}
          <div className="relative">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 cursor-pointer" onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotificationsOpen(false); }}>
              <img src="https://i.pravatar.cc/150?u=student" alt="profil" />
            </div>
            {isProfileOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)}></div>
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-20 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Student</p>
                    <p className="text-sm font-bold truncate">{userName}</p>
                  </div>
                  {location.pathname !== "/settings" && (
                  <button
                    onClick={() => { navigate("/settings"); setIsProfileOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-900 transition-colors"
                  >
                    <Settings size={16} /> Setări Cont
                  </button>
                  )}
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 border-t border-gray-50 mt-1">
                    <LogOut size={16} /> Deconectare
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* CONTINUTUL PAGINII */}
      <main className="flex-grow">
        {children}
      </main>

      {/* ALERTĂ GLOBALĂ - UI-ul rămâne aici pentru a fi vizibil pe orice pagină */}
    </div>
  );
};

export default Layout;