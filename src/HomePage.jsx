import React from "react";
import {
  Search,
  Bell,
  Settings,
  ArrowRight,
  Calendar,
  FileText,
  GraduationCap,
  Star,
  Clock,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#001f3f] font-sans">
      <nav className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <span className="text-xl font-bold tracking-tighter text-[#001f3f]">
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
        <div className="flex items-center gap-5">
          <div className="relative hidden sm:block">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={14}
            />
            <input
              type="text"
              placeholder="Caută resurse..."
              className="bg-gray-100 border-none rounded-lg py-2 pl-9 pr-4 text-xs w-64 focus:ring-1 focus:ring-blue-900 outline-none"
            />
          </div>
          <Bell size={18} className="text-gray-400 cursor-pointer" />
          <Settings size={18} className="text-gray-400 cursor-pointer" />
          <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
            <img src="https://i.pravatar.cc/150?u=student" alt="profile" />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-12">
        {/* HERO SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-gray-100 pb-10">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-4 block italic">
              Presa Universitară
            </span>
            <h1 className="text-5xl md:text-6xl font-bold leading-[1.1] max-w-2xl text-[#001f3f] tracking-tight text-balance">
              Modelăm Viitorul Excelenței Academice
            </h1>
            <p className="text-gray-400 mt-6 text-lg max-w-lg leading-relaxed font-medium">
              Rămâneți informați cu cele mai recente descoperiri, evenimente și
              anunțuri pentru studentul modern.
            </p>
          </div>
          <div className="flex gap-12 mt-8 md:mt-0 pb-2">
            <div className="text-right border-r border-gray-100 pr-12">
              <p className="text-4xl font-bold text-[#001f3f]">9.45</p>
              <p className="text-[9px] font-black uppercase text-gray-400 tracking-[0.15em]">
                Media Generală
              </p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-[#001f3f]">180</p>
              <p className="text-[9px] font-black uppercase text-gray-400 tracking-[0.15em]">
                Credite ECTS
              </p>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mb-24">
          <div className="lg:col-span-2 group cursor-pointer">
            <div className="rounded-3xl overflow-hidden mb-8 shadow-xl">
              <img
                src="https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                className="w-full h-[450px] object-cover group-hover:scale-105 transition-transform duration-700"
                alt="Lansare"
              />
            </div>
            <div className="flex items-center gap-4 mb-5">
              <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-md uppercase tracking-widest">
                Viața în Campus
              </span>
              <span className="text-gray-300 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                <Clock size={12} /> Lectură de 4 min
              </span>
            </div>
            <h2 className="text-4xl font-bold mb-5 leading-tight hover:text-blue-800 transition-colors italic">
              Dezvăluirea Viziunii: Noul Centru pentru Cercetare Cuantică și
              Inovare
            </h2>
            <p className="text-gray-500 leading-relaxed text-lg mb-8 opacity-90 font-medium">
              Universitatea a pus oficial piatra de temelie pentru facilitatea
              de 450M$ destinată să devină un hub global pentru fizica
              particulelor.
            </p>
            <button className="bg-[#001f3f] text-white px-8 py-3 rounded-xl flex items-center gap-3 font-bold text-sm hover:bg-blue-900 transition-all shadow-lg">
              Citește Articolul <ArrowRight size={18} />
            </button>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm h-fit">
            <h3 className="flex items-center gap-2 font-black mb-10 uppercase text-[11px] tracking-[0.2em] text-[#001f3f]">
              <span className="text-blue-500 italic">✦</span> Tendințe Acum
            </h3>
            <div className="space-y-10">
              {[
                {
                  t: "Bursele de Merit 2024: Aplicațiile sunt acum deschise",
                  tag: "Admiteri",
                },
                {
                  t: "Programarea Examenelor Finale pentru Semestrul 2",
                  tag: "Academic",
                },
                {
                  t: "Extinderea Opțiunilor Sustenabile în Cafenele",
                  tag: "Campus",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="group cursor-pointer flex gap-5 items-center"
                >
                  <div className="w-20 h-20 bg-gray-100 rounded-2xl flex-shrink-0 overflow-hidden shadow-sm">
                    <img
                      src={`https://picsum.photos/seed/${idx + 1}/200`}
                      className="w-full h-full object-cover"
                      alt="t"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-[13px] leading-snug text-[#001f3f] group-hover:text-blue-600 transition-colors line-clamp-2">
                      {item.t}
                    </h4>
                    <p className="text-[9px] font-black uppercase text-gray-300 mt-2 tracking-widest">
                      {item.tag}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-12 py-4 border-2 border-gray-50 rounded-2xl text-[10px] font-black text-gray-400 hover:bg-gray-50 hover:text-blue-900 transition-all uppercase tracking-[0.2em]">
              Vezi Mai Multe Știri
            </button>
          </div>
        </div>

        {/* SECONDARY NEWS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-24">
          {[
            {
              c: "Cercetare",
              t: "O Nouă Enzimă Ar Putea Revoluționa Reciclarea Plasticului",
              d: "Echipa profesorului Vance a identificat calea microbiană pentru PET.",
              col: "text-red-500",
              img: "https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=600",
            },
            {
              c: "Tehnologie",
              t: "IA Etică: Conturarea Curriculei de Computing în Noul Deceniu",
              d: "Revizuirea disciplinelor CS pentru a include module de impact social.",
              col: "text-cyan-500",
              img: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600",
            },
            {
              c: "Infrastructură",
              t: "Harta Campusului: 15 Noi Stații de Încărcare EV Instalate",
              d: "Inițiative de transport sustenabil extinse pentru vehicule electrice.",
              col: "text-green-500",
              img: "https://images.pexels.com/photos/108942/pexels-photo-108942.jpeg",
            },
          ].map((news, idx) => (
            <div key={idx} className="group cursor-pointer">
              <div className="h-56 rounded-[2rem] bg-gray-200 mb-7 overflow-hidden shadow-md border-4 border-white">
                <img
                  src={news.img}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  alt="news"
                />
              </div>
              <p
                className={`text-[10px] font-black uppercase tracking-widest mb-3 ${news.col}`}
              >
                {news.c}
              </p>
              <h3 className="text-xl font-bold mb-3 leading-tight text-[#001f3f]">
                {news.t}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed font-medium">
                {news.d}
              </p>
            </div>
          ))}
        </div>

        {/* MILESTONES */}
        <div className="border-t border-gray-100 pt-16 mb-16">
          <h3 className="text-3xl font-bold tracking-tight mb-12 flex items-center gap-3">
            <span className="w-1.5 h-10 bg-blue-900 rounded-full"></span>Termene
            Limită
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                i: Calendar,
                t: "Modificare Contracte",
                d: "Sept 12, 2024",
                sub: "Ultima zi pentru modificarea disciplinelor.",
                col: "text-red-500",
                bg: "bg-red-50",
              },
              {
                i: FileText,
                t: "Examene Parțiale",
                d: "Oct 14 - 21",
                sub: "Sesiunea de examinare intermediară.",
                col: "text-blue-600",
                bg: "bg-blue-50",
              },
              {
                i: GraduationCap,
                t: "Cereri Absolvire",
                d: "Până la Oct 30",
                sub: "Depunerea actelor pentru diploma de licență.",
                col: "text-gray-700",
                bg: "bg-gray-100",
              },
              {
                i: Star,
                t: "Grant Cercetare",
                d: "Nov 05, 2024",
                sub: "Trimiterea aplicațiilor pentru bursa de cercetare.",
                col: "text-orange-500",
                bg: "bg-orange-50",
              },
            ].map((m, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm hover:shadow-xl transition-all group"
              >
                <div
                  className={`${m.bg} ${m.col} w-14 h-14 rounded-2xl flex items-center justify-center mb-6`}
                >
                  <m.i size={24} />
                </div>
                <h4 className="font-bold text-base mb-2">{m.t}</h4>
                <p className="text-xs text-gray-400 mb-6 font-medium leading-relaxed">
                  {m.sub}
                </p>
                <p
                  className={`text-[11px] font-black uppercase tracking-widest ${m.col}`}
                >
                  {m.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
export default HomePage;
