import React from "react";
import {
  Bell,
  Settings,
  Download,
  GraduationCap,
  TrendingUp,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const CatalogPage = () => {
  const navigate = useNavigate();

  const s1 = [
    { c: "CS-101", n: "Introducere în Programare", cr: 6, g: 10 },
    { c: "MATH-201", n: "Analiză Matematică", cr: 5, g: 8 },
    { c: "PHYS-102", n: "Fizică Generală", cr: 5, g: 9 },
    { c: "ENG-110", n: "Limbi Străine I", cr: 4, g: 10 },
    { c: "LOG-100", n: "Logică Computațională", cr: 5, g: 10 },
    { c: "SPO-101", n: "Educație Fizică", cr: 5, g: 10 },
  ];
  const s2 = [
    { c: "CS-102", n: "Structuri de Date", cr: 6, g: 9 },
    { c: "MATH-202", n: "Algebră Liniară", cr: 5, g: 10 },
    { c: "PHIL-150", n: "Etică în Tehnologie", cr: 4, g: 10 },
    { c: "ECON-101", n: "Microeconomie", cr: 5, g: 7 },
    { c: "CS-103", n: "Arhitectura Calculatoarelor", cr: 5, g: 8 },
    { c: "PRJ-101", n: "Proiect Software", cr: 5, g: 10 },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#001f3f] font-sans pb-20">
      {/* NAVBAR CORECTAT */}
      <nav className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <span className="text-xl font-bold tracking-tighter">
            Portal Universitar
          </span>
          {/* ÎNLOCUIEȘTE TOT ACEST DIV ÎN INTERIORUL <nav> */}
          <div className="hidden md:flex gap-6 text-[10px] font-black uppercase tracking-widest items-center">
            <NavLink
              to="/home"
              className={({ isActive }) =>
                isActive
                  ? "text-[#001f3f] border-b-2 border-[#001f3f] pb-1 transition-all"
                  : "text-gray-400 hover:text-[#001f3f] transition-colors"
              }
            >
              Acasă
            </NavLink>

            <NavLink
              to="/catalog"
              className={({ isActive }) =>
                isActive
                  ? "text-[#001f3f] border-b-2 border-[#001f3f] pb-1 transition-all"
                  : "text-gray-400 hover:text-[#001f3f] transition-colors"
              }
            >
              Catalog
            </NavLink>

            <NavLink
              to="/services"
              className={({ isActive }) =>
                isActive
                  ? "text-[#001f3f] border-b-2 border-[#001f3f] pb-1 transition-all"
                  : "text-gray-400 hover:text-[#001f3f] transition-colors"
              }
            >
              Servicii
            </NavLink>

            <NavLink
              to="/settings"
              className={({ isActive }) =>
                isActive
                  ? "text-[#001f3f] border-b-2 border-[#001f3f] pb-1 transition-all"
                  : "text-gray-400 hover:text-[#001f3f] transition-colors"
              }
            >
              Setări
            </NavLink>
          </div>
        </div>

        {/* ZONA DIN DREAPTA CU ICONIȚE */}
        <div className="flex items-center gap-5">
          <Bell
            size={18}
            className="text-gray-400 cursor-pointer hover:text-blue-900 transition-colors"
          />
          <Settings
            size={18}
            className="text-gray-400 cursor-pointer hover:text-blue-900 transition-colors"
            onClick={() => navigate("/settings")}
          />
          <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
            <img src="https://i.pravatar.cc/150?u=student" alt="profil" />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-12">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Situație Academică
        </h1>
        <p className="text-gray-400 font-medium text-lg mb-10">
          Catalog detaliat al notelor și creditelor pentru anul 2023-2024.
        </p>

        {/* STATISTICI */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
          <div className="bg-[#001f3f] p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] opacity-60 mb-8">
              Media Generală Anuală
            </p>
            <h2 className="text-8xl font-bold mb-10 tracking-tighter">9.12</h2>
            <div className="w-full bg-white/10 h-2 rounded-full">
              <div
                className="h-full bg-blue-400 rounded-full"
                style={{ width: "91%" }}
              ></div>
            </div>
          </div>
          <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <GraduationCap size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 mb-2">
                Total Credite ECTS
              </p>
              <h3 className="text-5xl font-bold text-[#001f3f]">60 / 60</h3>
            </div>
          </div>
          <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6">
              <TrendingUp size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">
                Status Bursă
              </p>
              <h3 className="text-5xl font-bold text-[#001f3f] italic">
                Merit I
              </h3>
            </div>
          </div>
        </div>

        {/* TABELE SEMESTRE */}
        <div className="space-y-24">
          <SemesterTable
            title="Semestrul 1"
            badge="TOAMNĂ 2023"
            avg="9.25"
            courses={s1}
          />
          <SemesterTable
            title="Semestrul 2"
            badge="PRIMĂVARĂ 2024"
            avg="9.00"
            courses={s2}
          />
        </div>

        {/* SECȚIUNE DOWNLOAD */}
        <div className="mt-24 bg-[#f1f3f5] p-12 rounded-[3rem] border border-gray-200 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="max-w-xl">
            <h3 className="text-2xl font-bold mb-3 text-[#001f3f]">
              Solicitare Foaie Matricolă?
            </h3>
            <p className="text-gray-500 text-base font-medium leading-relaxed">
              Documentele semnate digital sunt disponibile imediat în format
              PDF.
            </p>
          </div>
          <button className="bg-[#001f3f] text-white px-10 py-5 rounded-2xl font-bold text-sm flex items-center gap-3 shadow-xl">
            <Download size={20} /> Descarcă PDF
          </button>
        </div>
      </main>
    </div>
  );
};

const SemesterTable = ({ title, badge, avg, courses }) => (
  <section>
    <div className="flex justify-between items-end mb-10 px-4">
      <div>
        <span className="px-4 py-1.5 bg-blue-100 text-blue-700 text-[10px] font-black rounded-lg uppercase mb-4 block w-fit">
          {badge}
        </span>
        <h2 className="text-4xl font-bold text-[#001f3f] tracking-tight">
          {title}
        </h2>
      </div>
      <div className="text-right">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 mb-2 italic">
          Medie Semestrială
        </p>
        <p className="text-5xl font-black text-[#001f3f]">{avg}</p>
      </div>
    </div>
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-50 text-[11px] font-black uppercase tracking-[0.25em] text-gray-400">
            <th className="px-10 py-7">Cod</th>
            <th className="px-10 py-7">Materie</th>
            <th className="px-10 py-7 text-center">Credite</th>
            <th className="px-10 py-7 text-right">Notă</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 font-medium">
          {courses.map((c, i) => (
            <tr key={i} className="group hover:bg-blue-50/30 transition-all">
              <td className="px-10 py-7 text-[13px] font-bold text-gray-400 uppercase tracking-widest">
                {c.c}
              </td>
              <td className="px-10 py-7 text-[15px] font-bold text-[#001f3f]">
                {c.n}
              </td>
              <td className="px-10 py-7 text-sm font-bold text-gray-500 text-center">
                {c.cr}.0
              </td>
              <td className="px-10 py-7 text-right font-black text-blue-600">
                {c.g}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

export default CatalogPage;
