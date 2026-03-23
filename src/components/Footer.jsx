import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto pt-20 pb-12 px-8 w-full">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-6 tracking-tighter text-[#001f3f]">
            Portal Universitar
          </h2>
          <p className="text-gray-400 max-w-sm leading-relaxed mb-8 font-medium">
            Susținem studenții prin informație și tehnologie. Accesează situația
            academică, resursele campusului și noutățile într-un singur spațiu
            unificat.
          </p>
        </div>
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 mb-8">
            Resurse
          </h4>
          <ul className="space-y-4 text-[13px] font-bold text-gray-500">
            <li>
              <a href="#" className="hover:text-blue-900 transition-colors">
                Harta Campus
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-900 transition-colors">
                Help Desk
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-900 transition-colors">
                Suport IT
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 mb-8">
            Legal
          </h4>
          <ul className="space-y-4 text-[13px] font-bold text-gray-500">
            <li>
              <a href="#" className="hover:text-blue-900 transition-colors">
                Politică de Confidențialitate
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-900 transition-colors">
                Termeni și Condiții
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto border-t border-gray-50 pt-10 text-center md:text-left text-[10px] font-bold text-gray-300 tracking-[0.2em] uppercase">
        © 2026 University Student Portal. Toate drepturile rezervate.
      </div>
    </footer>
  );
};

export default Footer;
