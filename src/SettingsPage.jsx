import React, { useState } from "react";
import {
  Lock,
  ShieldCheck,
  Eye,
  EyeOff,
  Info,
  CheckCircle,
  AlertCircle,
  Bell,
  Settings,
  LogOut, // Redenumit pentru a evita conflictul cu numele componentei
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const SettingsPage = () => {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [strengthText, setStrengthText] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handlePasswordInput = (e) => {
    const password = e.target.value;
    if (password.length === 0) {
      setPasswordStrength(0);
      setStrengthText("");
    } else if (password.length < 6) {
      setPasswordStrength(1);
      setStrengthText("Prea slabă");
    } else if (password.length < 10) {
      setPasswordStrength(2);
      setStrengthText("Acceptabilă");
    } else if (password.length < 14) {
      setPasswordStrength(3);
      setStrengthText("Puternică");
    } else {
      setPasswordStrength(4);
      setStrengthText("Foarte sigură");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#001f3f] font-sans">
      {/* NAVBAR */}
      <nav className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <span className="text-xl font-bold tracking-tighter text-[#001f3f]">
            Portal Universitar
          </span>
          <div className="hidden md:flex gap-6 text-[10px] font-black uppercase tracking-widest items-center">
            <NavLink
              to="/home"
              className={({ isActive }) =>
                isActive
                  ? "text-[#001f3f] border-b-2 border-[#001f3f] pb-1"
                  : "text-gray-400 hover:text-[#001f3f] transition-colors"
              }
            >
              Acasă
            </NavLink>
            <NavLink
              to="/catalog"
              className={({ isActive }) =>
                isActive
                  ? "text-[#001f3f] border-b-2 border-[#001f3f] pb-1"
                  : "text-gray-400 hover:text-[#001f3f] transition-colors"
              }
            >
              Catalog
            </NavLink>
            <NavLink
              to="/services"
              className={({ isActive }) =>
                isActive
                  ? "text-[#001f3f] border-b-2 border-[#001f3f] pb-1"
                  : "text-gray-400 hover:text-[#001f3f] transition-colors"
              }
            >
              Servicii
            </NavLink>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                isActive
                  ? "text-[#001f3f] border-b-2 border-[#001f3f] pb-1"
                  : "text-gray-400 hover:text-[#001f3f] transition-colors"
              }
            >
              Setări
            </NavLink>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <Bell
            size={18}
            className="text-gray-400 cursor-pointer hover:text-blue-900 transition-colors"
          />
          <div className="relative">
            <div
              className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 cursor-pointer hover:ring-2 hover:ring-blue-900 transition-all shadow-sm"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <img src="https://i.pravatar.cc/150?u=student" alt="profil" />
            </div>

            {isProfileOpen && (
              <>
                {/* Overlay pentru a închide dropdown-ul la click în afară */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsProfileOpen(false)}
                ></div>

                <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-20 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                      Student
                    </p>
                    <p className="text-sm font-bold text-[#001f3f] truncate">
                      Ion Popescu
                    </p>
                  </div>


                  <button
                    onClick={() => {
                      /* Logout logic */ navigate("/");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors border-t border-gray-50"
                  >
                    <LogOut size={16} /> Deconectare
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-16 flex items-center justify-center">
        <div className="w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[650px] animate-in fade-in zoom-in duration-500">
          {/* PANOU STÂNGA - INFORMAȚII SECURITATE */}
          <div className="md:w-[40%] bg-[#001f3f] p-10 text-white flex flex-col justify-between relative">
            <div>
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-10 shadow-inner">
                <ShieldCheck size={28} className="text-blue-400" />
              </div>
              <h2 className="text-4xl font-bold leading-tight mb-6 tracking-tight text-balance">
                Protejează-ți Identitatea Academică
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed opacity-80 font-medium">
                Actualizarea regulată a parolei asigură faptul că cercetările,
                notele și datele tale personale rămân în siguranță în rețeaua
                institțională.
              </p>
            </div>

            <div className="space-y-8 mt-12">
              <div className="flex items-start gap-4">
                <CheckCircle size={20} className="text-blue-400 mt-1" />
                <div>
                  <p className="font-bold text-sm">Gata pentru 2FA</p>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                    Modificările se vor aplica imediat pe toate serviciile
                    portalului.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <AlertCircle size={20} className="text-blue-400 mt-1" />
                <div>
                  <p className="font-bold text-sm">Protocol de Securitate</p>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                    Parolele trebuie să aibă peste 12 caractere și simboluri
                    speciale.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* PANOU DREAPTA - FORMULAR SETĂRI */}
          <div className="md:w-[60%] p-10 md:p-16 flex flex-col justify-center">
            <h3 className="text-3xl font-bold mb-2 tracking-tight text-[#001f3f]">
              Setări de Securitate
            </h3>
            <p className="text-gray-400 text-sm font-medium mb-12">
              Actualizează datele de autentificare ale portalului
            </p>

            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              {/* Parola Curentă */}
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                  Parola Curentă
                </label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••••••"
                    className="w-full bg-gray-100 border-none rounded-xl p-4 pr-12 text-sm focus:ring-2 focus:ring-blue-900 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-900 transition-colors"
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Parola Nouă */}
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                  Parolă Nouă
                </label>
                <div className="relative mb-4">
                  <input
                    type="password"
                    onChange={handlePasswordInput}
                    placeholder="Creează o parolă puternică"
                    className="w-full bg-gray-100 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-900 outline-none transition-all"
                  />
                  <Lock
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300"
                    size={18}
                  />
                </div>

                {/* Indicator Putere Parolă */}
                <div className="flex gap-2 mb-2">
                  <div
                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${passwordStrength >= 1 ? "bg-red-500" : "bg-gray-200"}`}
                  ></div>
                  <div
                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${passwordStrength >= 2 ? "bg-orange-500" : "bg-gray-200"}`}
                  ></div>
                  <div
                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${passwordStrength >= 3 ? "bg-yellow-500" : "bg-gray-200"}`}
                  ></div>
                  <div
                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${passwordStrength >= 4 ? "bg-green-500" : "bg-gray-200"}`}
                  ></div>
                </div>
                {strengthText && (
                  <p
                    className={`text-[10px] font-bold uppercase tracking-widest italic transition-all ${
                      passwordStrength <= 1
                        ? "text-red-500"
                        : passwordStrength === 2
                          ? "text-orange-500"
                          : passwordStrength === 3
                            ? "text-yellow-600"
                            : "text-green-500"
                    }`}
                  >
                    Putere: {strengthText}
                  </p>
                )}
              </div>

              {/* Confirmare Parolă */}
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                  Confirmă Parola Nouă
                </label>
                <input
                  type="password"
                  placeholder="Repetă noua parolă"
                  className="w-full bg-gray-100 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-900 outline-none transition-all"
                />
              </div>

              {/* Butoane Acțiune */}
              <div className="flex items-center gap-6 pt-4">
                <button className="bg-[#001f3f] text-white px-10 py-4 rounded-xl shadow-xl hover:bg-blue-950 transition-all transform hover:-translate-y-0.5 active:translate-y-0">
                  Actualizează Parola
                </button>
                <button
                  type="button"
                  className="text-gray-400 font-bold text-sm hover:text-red-500 transition-colors"
                >
                  Anulează
                </button>
              </div>
            </form>

            {/* Sfat Securitate */}
            <div className="mt-12 bg-blue-50/50 p-6 rounded-2xl border border-blue-100 flex items-start gap-4">
              <Info className="text-blue-600 mt-1" size={20} />
              <div className="text-xs leading-relaxed text-gray-500 font-medium">
                <span className="font-bold text-blue-900 block mb-1 uppercase tracking-wider">
                  Știai că?
                </span>
                Managerii de parole te ajută să menții parole unice și complexe
                pentru toate conturile tale academice, fără a fi nevoie să le
                memorezi.
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
