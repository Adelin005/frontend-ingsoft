import { useState } from "react";
import { auth } from "./firebase"; 
import { signInWithEmailAndPassword } from "firebase/auth";
import React from "react";
import { User, Lock, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAlert } from "./components/useAlert"; // Importăm contextul de alerte
import Layout from "./Layout";
function AuthPage() {
  const { showAlert } = useAlert();
  const navigate = useNavigate();
 const [cnp, setCnp] = useState(""); 
const [password, setPassword] = useState("");

const handleSubmit = async (e) => {
  e.preventDefault();
  
  
  const fakeEmail = `${cnp}@student.uoradea.ro`;

  try {
    await signInWithEmailAndPassword(auth, fakeEmail, password);
    navigate("/home");
  } catch (error) {
    showAlert("CNP sau Parolă incorectă!", "error" );
    console.error(error.message);
  }
};

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-10 bg-[#f3f4f6]">
      <div className="max-w-6xl w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[750px]">
        <div className="md:w-[45%] bg-[#001f3f] p-8 md:p-12 text-white flex flex-col justify-between relative">
          <div>
            <div className="flex items-center gap-2 mb-12">
              <div className="bg-white/10 p-2 rounded-lg">
                <GraduationCap size={28} className="text-blue-400" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Portal Universitar
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Formăm <br />
              <span className="text-blue-400">Noua Generație</span> <br />
              de Academicieni.
            </h1>
            <p className="text-gray-300 text-lg max-w-sm leading-relaxed opacity-80 font-medium">
              Accesează-ți parcursul academic, colaborează cu facultatea și
              gestionează viața de student.
            </p>
          </div>
          
        </div>
        <div className="md:w-[55%] p-8 md:p-16 lg:p-24 flex flex-col justify-center bg-white">
          <div className="max-w-md mx-auto w-full">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Bun venit înapoi
            </h2>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  CNP (ID Național)
                </label>
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    required
                    type="text"
                    placeholder="1234567890123"
                    value={cnp}
                    onChange={(e) => setCnp(e.target.value)}
                    className="w-full bg-gray-100 border-none rounded-xl p-4 pl-12 text-sm focus:ring-2 focus:ring-blue-900 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  Parolă Securizată
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    required
                    type="password"
                    placeholder="••••••••••••"
                    value ={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-100 border-none rounded-xl p-4 pl-12 text-sm focus:ring-2 focus:ring-blue-900 outline-none transition-all"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-[#001f3f] text-white font-bold py-4 rounded-xl shadow-xl hover:bg-blue-950 transition-all transform hover:-translate-y-0.5 mt-4"
              >
                Accesează Portalul
              </button>
            </form>
          </div>
        </div>
      </div>

    </div>
  );
}
export default AuthPage;
