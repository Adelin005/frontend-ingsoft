import React, { useState } from "react";
import { User, Lock, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";

function AuthPage() {
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/home");
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
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl mt-8">
            <div className="flex items-center gap-4 mb-3">
              <img
                src="https://i.pravatar.cc/150?u=dean"
                alt="Dr. Vance"
                className="w-12 h-12 rounded-full border-2 border-blue-400/50"
              />
              <div>
                <p className="font-bold text-sm text-white">Dr. Helena Vance</p>
                <p className="text-xs text-blue-300 font-bold uppercase tracking-wider">
                  Decanul Studenților
                </p>
              </div>
            </div>
            <p className="text-sm italic text-gray-300 leading-relaxed font-medium">
              "Educația nu este umplerea unui vas, ci aprinderea unui foc. Acest
              portal este conceput pentru a întreține acea flacără."
            </p>
          </div>
        </div>
        <div className="md:w-[55%] p-8 md:p-16 lg:p-24 flex flex-col justify-center bg-white">
          <div className="max-w-md mx-auto w-full">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {isLogin ? "Bun venit înapoi" : "Creare Cont"}
            </h2>
            <p className="text-gray-500 mb-10 text-sm font-medium">
              {isLogin
                ? "Introdu datele de autentificare."
                : "Introdu detaliile instituționale pentru a începe."}
            </p>
            <form className="space-y-5" onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                      Prenume
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Ion"
                      className="w-full bg-gray-100 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-900 outline-none transition-all"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                      Nume
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Popescu"
                      className="w-full bg-gray-100 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-900 outline-none transition-all"
                    />
                  </div>
                </div>
              )}
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
                    className="w-full bg-gray-100 border-none rounded-xl p-4 pl-12 text-sm focus:ring-2 focus:ring-blue-900 outline-none transition-all"
                  />
                </div>
              </div>
              {!isLogin && (
                <div className="flex items-start gap-3 py-2">
                  <input
                    required
                    type="checkbox"
                    id="terms"
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-900"
                  />
                  <label
                    htmlFor="terms"
                    className="text-xs text-gray-500 leading-tight"
                  >
                    Sunt de acord cu{" "}
                    <span className="text-blue-900 font-bold underline cursor-pointer">
                      Termenii de Utilizare
                    </span>{" "}
                    și{" "}
                    <span className="text-blue-900 font-bold underline cursor-pointer">
                      Politica de Confidențialitate
                    </span>
                    .
                  </label>
                </div>
              )}
              <button
                type="submit"
                className="w-full bg-[#001f3f] text-white font-bold py-4 rounded-xl shadow-xl hover:bg-blue-950 transition-all transform hover:-translate-y-0.5 mt-4"
              >
                {isLogin ? "Accesează Portalul" : "Finalizează Înscrierea"}
              </button>
            </form>
            <div className="mt-12 text-center text-sm text-gray-500 font-medium">
              {isLogin ? "Nu ai cont?" : "Ai deja un cont?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-[#001f3f] font-bold hover:underline ml-1"
              >
                {isLogin ? "Înregistrează-te aici" : "Loghează-te aici"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <footer className="w-full max-w-6xl mt-8 px-6 flex flex-col md:flex-row justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">
        <p>© 2026 Portal Universitar. Toate drepturile rezervate.</p>
        <div className="flex gap-6 mt-4 md:mt-0 font-bold">
          <a href="#" className="hover:text-blue-900 transition-colors">
            Confidențialitate
          </a>
          <a href="#" className="hover:text-blue-900 transition-colors">
            Termeni
          </a>
          <a href="#" className="hover:text-blue-900 transition-colors">
            Harta Campus
          </a>
          <a href="#" className="hover:text-blue-900 transition-colors">
            Ajutor
          </a>
        </div>
      </footer>
    </div>
  );
}
export default AuthPage;
