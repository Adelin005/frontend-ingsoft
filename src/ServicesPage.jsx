import React, { useState, useEffect}from "react";
import { db, auth } from "./firebase";
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";
import {
  Mail,
  Phone,
  MapPin,
  Bell,
  Settings,
  Clock,
  Send,
  ChevronRight, 
  LogOut
} from "lucide-react";
import Layout from "./Layout";
import { useAlert } from "./components/useAlert";
const ServicesPage = () => {
  const { showAlert } = useAlert();
  const [studentInfo, setStudentInfo] = useState({ nume: "", prenume: "", cnp: "", email: "" });
  const [formData, setFormData] = useState({
    categorie: "Secretariat General",
    subiect: "",
    mesaj: "",
  });
  useEffect(() => {
    const fetchStudentData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "student", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setStudentInfo({
            nume: docSnap.data().Nume,
            prenume: docSnap.data().Prenume,
            email: user.email
          });
        }
      }
    };
    fetchStudentData();
  }, []);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    // 1. Verificăm dacă există un utilizator logat (opțional, dacă vrei să legi mesajul de un cont)
    const user = auth.currentUser;

    // 2. Referință către colecția unde vrei să salvezi
    const messagesRef = collection(db, "messages");

    // 3. Adăugăm documentul
    await addDoc(messagesRef, {
      studentId: user.uid, // UID-ul studentului dacă e logat
      nume: studentInfo.nume,
      prenume: studentInfo.prenume,
      email: studentInfo.email,
      subiect: formData.subiect,
      mesaj: formData.mesaj,
      dataTrimitere: serverTimestamp(), // Salvează ora exactă a serverului
      status: "nou" // Utilitate pentru un viitor panou de admin (citit/necitit)
    });

    showAlert("Mesajul a fost trimis și salvat cu succes!");
    setFormData({
        categorie: "Secretariat General",
        subiect: "",
        mesaj: "",
      });
  } catch (error) {
    console.error("Eroare la salvarea mesajului:", error);
    showAlert("A apărut o eroare. Încearcă din nou.", "error");
  }
  
};
  
  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#001f3f] font-sans pb-20">
      {/* NAVBAR */}
      
      <main className="max-w-7xl mx-auto px-8 py-12">
        {/* HEADER PAGINĂ */}
        <header className="mb-12">
          <h1 className="text-5xl font-bold tracking-tight mb-4 text-[#001f3f]">
            Contactează Servicii Studenți
          </h1>
          <p className="text-gray-500 text-lg max-w-3xl leading-relaxed font-medium">
            Echipa noastră de suport de la Universitatea din Oradea este aici să
            te ajute cu înscrierea, bursele, consilierea în carieră și întrebări
            despre campus.
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* COLOANA STÂNGA - CARDURI CONTACT */}
          <div className="lg:w-1/3 space-y-6">
            <div className="bg-white p-8 rounded-[2rem] border border-gray-50 shadow-sm hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Mail className="text-blue-600" size={20} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#001f3f]">
                Solicitări Digitale
              </h3>
              <p className="text-gray-400 text-xs font-medium leading-relaxed mb-4">
                Pentru întrebări generale către rectorat sau secretariat.
              </p>
              <p className="text-blue-900 font-bold text-sm hover:underline cursor-pointer tracking-tight">
                rectorat@uoradea.ro
              </p>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-gray-50 shadow-sm hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-cyan-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Phone className="text-cyan-600" size={20} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#001f3f]">
                Centrală Telefonică
              </h3>
              <p className="text-gray-400 text-xs font-medium leading-relaxed mb-4">
                Luni – Vineri, 08:00 – 16:00.
              </p>
              <p className="text-blue-900 font-bold text-sm hover:underline cursor-pointer">
                +40 259 408 106
              </p>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-gray-50 shadow-sm hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MapPin className="text-orange-600" size={20} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#001f3f]">
                Campus Principal
              </h3>
              <div className="text-[#001f3f] font-medium text-xs space-y-1">
                <p>Strada Universității Nr. 1</p>
                <p>Oradea, Cod 410087</p>
                <p>Județul Bihor, România</p>
              </div>
            </div>
          </div>

          {/* COLOANA DREAPTĂ - FORMULAR */}
          <div className="lg:w-2/3">
            <div className="bg-white p-10 md:p-12 rounded-[3rem] shadow-sm border border-gray-100">
              <h2 className="text-3xl font-bold mb-8 text-[#001f3f]">
                Trimite un Mesaj
              </h2>

              <form className="space-y-6" onSubmit={handleSubmit}>
              
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">                 
                  <div className="space-y-2 relative">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                      Categorie
                    </label>
                    <select className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-900 transition-all appearance-none outline-none font-medium text-[#001f3f]"
                    name="categorie"
                    value={formData.categorie}
                    onChange={handleChange}
                    required
                    >

                      <option>Secretariat General</option>
                      <option>Burse și Cazare</option>
                      <option>Mobilități Erasmus</option>
                      <option>Suport IT / Portal</option>
                    </select>
                    <ChevronRight
                      className="absolute right-4 top-[65%] -translate-y-1/2 text-gray-400 rotate-90"
                      size={16}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                    Subiect
                  </label>
                  <input
                    type="text"
                    placeholder="Subiectul solicitării tale"
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-900 transition-all outline-none"
                    name="subiect"
                    value={formData.subiect}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                    Mesaj
                  </label>
                  <textarea
                    rows="5"
                    placeholder="Descrie problema ta în detaliu..."
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-900 transition-all resize-none outline-none"
                    name="mesaj"
                    value={formData.mesaj}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-gray-50">
                  <div className="flex items-center gap-3 text-gray-400 italic">
                    <Clock size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">
                      Răspuns în aprox. 24-48h lucrătoare
                    </span>
                  </div>
                  <button
                    type="submit"
                    className="bg-[#001f3f] text-white px-12 py-5 rounded-2xl font-bold text-sm shadow-xl hover:bg-blue-950 transition-all flex items-center gap-3 hover:-translate-y-1 active:translate-y-0"
                  >
                    Trimite Mesajul <Send size={18} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* HARTA LOCAȚIE - GOOGLE MAPS INTERACTIV */}
        <div className="mt-20 rounded-[3rem] overflow-hidden h-[450px] relative shadow-2xl border-8 border-white group">
          <iframe
            title="Harta Universitatea din Oradea"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2718.7735040244634!2d21.9201021!3d47.0446751!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4746479564d81847%3A0xda97ccf1bcea0869!2sUniversitatea%20din%20Oradea!5e0!3m2!1sen!2sro!4v1773934060099!5m2!1sen!2sro"
            className="w-full h-full border-0 grayscale-[20%] contrast-[1.1]"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
          {/* Overlay pentru Badge - Mutat în dreapta sus pentru a nu bloca butoanele Google */}
          <div className="absolute top-6 right-6 pointer-events-none">
            <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-lg flex items-center gap-3 border border-blue-50">
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>
              <span className="font-bold text-[#001f3f] text-[10px] uppercase tracking-widest">
                Campus Central UO
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ServicesPage;
