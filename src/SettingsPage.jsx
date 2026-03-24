import { useState } from "react";
import { auth } from "./firebase";
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
  LogOut,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { updatePassword, signOut } from "firebase/auth";

const SettingsPage = () => {
  const navigate = useNavigate();
  // State-uri pentru interfață
  const [showPass, setShowPass] = useState(false);

  const [loading, setLoading] = useState(false);

  // State-uri pentru parole
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [strengthText, setStrengthText] = useState("");

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const handlePasswordInput = (e) => {
    const password = e.target.value;
    setNewPassword(password); 
    
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

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      alert("Parolele noi nu coincid!");
      return;
    }

    if (passwordStrength < 2) {
      alert("Te rugăm să alegi o parolă mai puternică.");
      return;
    }

    setLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        await updatePassword(user, newPassword);
        alert("Parola a fost actualizată cu succes!");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordStrength(0);
        setStrengthText("");
      }
    } catch (error) {
      if (error.code === "auth/requires-recent-login") {
        alert("Din motive de securitate, trebuie să te reloghezi pentru a schimba parola.");
        handleLogout();
      } else {
        alert("Eroare: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#001f3f] font-sans">
      {/* NAVBAR */}
      

      <main className="max-w-6xl mx-auto px-4 py-16 flex items-center justify-center">
        <div className="w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[650px]">
          {/* PANOU STÂNGA */}
          <div className="md:w-[40%] bg-[#001f3f] p-10 text-white flex flex-col justify-between">
            <div>
              <ShieldCheck size={48} className="text-blue-400 mb-6" />
              <h2 className="text-4xl font-bold mb-6">Protejează-ți Identitatea</h2>
              <p className="text-gray-300">Actualizarea parolei asigură siguranța datelor tale academice.</p>
            </div>
          </div>

          {/* PANOU DREAPTA */}
          <div className="md:w-[60%] p-10 md:p-16 flex flex-col justify-center">
            <h3 className="text-3xl font-bold mb-8">Setări Securitate</h3>
            <form className="space-y-8" onSubmit={handleUpdatePassword}>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-3">Parolă Nouă</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={newPassword}
                    onChange={handlePasswordInput}
                    placeholder="Minim 12 caractere recomandat"
                    className="w-full bg-gray-100 rounded-xl p-4 pr-12 outline-none focus:ring-2 focus:ring-blue-900"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {/* Strength Meter */}
                <div className="flex gap-2 mt-3">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={`h-1.5 flex-1 rounded-full ${passwordStrength >= i ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
                    ))}
                </div>
                <p className="text-[10px] font-bold mt-1 uppercase text-blue-600">{strengthText}</p>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-3">Confirmă Parola</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repetă parola nouă"
                  className="w-full bg-gray-100 rounded-xl p-4 outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#001f3f] text-white font-bold py-4 rounded-xl hover:bg-blue-950 transition-all disabled:opacity-50"
              >
                {loading ? "Se procesează..." : "Actualizează Parola"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;