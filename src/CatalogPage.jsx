import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  Bell,
  Settings,
  Download,
  GraduationCap,
  TrendingUp,
  LogOut,
} from "lucide-react";
import { db, auth } from "./firebase";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import stampilaImg from "./assets/stampila.jpeg";

const CatalogPage = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentStatusS1, setStudentStatusS1] = useState();
  const [studentStatusS2, setStudentStatusS2] = useState();


  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const uid = user.uid;

          // 1. Obținem datele despre Bursă din colecția 'users'
          const userDocRef = doc(db, "student", uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            setStudentStatusS1(userDocSnap.data().bursa_s1);
            setStudentStatusS2(userDocSnap.data().bursa_s2);
          }
         const q = query(
            collection(db, "grades"),
            where("studentId", "==", uid)
          );
          const querySnapshot = await getDocs(q);
          
          // Mapăm datele din Firebase (subject, grade, etc.) 
          // să se potrivească cu literele tale din tabel (n, g, etc.)
          const data = querySnapshot.docs.map(doc => {
            const item = doc.data();
            return {
              c: item.code || "N/A",      // Cod materie
              n: item.subject || "N/A",   // Nume materie
              cr: item.credits || 0,      // Credite
              g: item.grade || 0,         // Notă
              semester: item.semester,     // Semestru
            };
          });
          
          setGrades(data);
          
        }
      } catch (error) {
        console.error("Eroare la încărcare:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGrades();
  }, []);

const handleDownloadPDF = async () => {
  const user = auth.currentUser;
  if (!user) return;

  const s1Courses = grades.filter(g => g.semester === 1);
  const s2Courses = grades.filter(g => g.semester === 2);

  const doc = new jsPDF("p", "mm", "a4");
  let y = 20;

  // Header
  doc.setFontSize(22);
  doc.text("FISA MATRICOLA", 105, y, { align: "center" });
  y += 10;

  doc.setFontSize(12);
  doc.text(`CNP Student: ${user.uid}`, 20, y);
  doc.text(`Email: ${user.email}`, 20, y + 6);
  doc.text(`Bursa Sem 1: ${studentStatusS1 || "N/A"}`, 20, y + 12);
  doc.text(`Bursa Sem 2: ${studentStatusS2 || "N/A"}`, 20, y + 18);
  y += 30;

  const drawSemesterTable = (semester, courses) => {
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 128);
    doc.text(`Semestrul ${semester}`, 20, y);

    y += 6;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    // Header tabel
    doc.setFillColor(220, 220, 220);
    doc.rect(20, y, 170, 7, "F");
    doc.text("Cod", 22, y + 5);
    doc.text("Materie", 50, y + 5);
    doc.text("Credite", 130, y + 5);
    doc.text("Nota", 150, y + 5);
    y += 10;

    courses.forEach((c) => {
      doc.text(c.c, 22, y);
      doc.text(c.n, 50, y);
      doc.text(`${c.cr}`, 132, y);
      doc.text(`${c.g}`, 152, y);
      y += 8;

      if (y > 280) {
        doc.addPage();
        y = 20;
      }
    });
    y += 10;
  };

  drawSemesterTable(1, s1Courses);
  drawSemesterTable(2, s2Courses);

  try {
    const imgElement = new Image();
    imgElement.src = stampilaImg;
    await new Promise((resolve, reject) => {
      imgElement.onload = resolve;
      imgElement.onerror = reject;
    });
    // plasam ștampila în dreapta jos (x=160, y=250), dimensiune 40x40
    doc.addImage(imgElement, "JPEG", 160, 250, 40, 40);
  } catch (error) {
    console.error("Eroare la adăugarea ștampilei în PDF:", error);
  }

  doc.save(`FisaMatricola_${user.uid}.pdf`);
};
    const calculateStats = (subjects) => {
    if (subjects.length === 0) return { avg: "0.00", credits: 0 };
    const totalWeighted = subjects.reduce((acc, curr) => acc + (curr.g * curr.cr), 0);
    const totalCredits = subjects.reduce((acc, curr) => acc + curr.cr, 0);
    return {
      avg: totalCredits > 0 ? (totalWeighted / totalCredits).toFixed(2) : "0.00",
      credits: totalCredits
    };
  };
  const s1 = grades.filter(g => g.semester === 1);
  const s2 = grades.filter(g => g.semester === 2);
  const annualStats = calculateStats(grades);  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#001f3f]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#001f3f] font-sans pb-20">
      

      <main className="max-w-7xl mx-auto px-8 py-12">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Situație Academică</h1>
        <p className="text-gray-400 font-medium text-lg mb-10">Catalog detaliat al notelor pentru studentul logat.</p>

<div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
          <div className="bg-[#001f3f] p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] opacity-60 mb-8">
              Media Generală Anuală
            </p>
            <h2 className="text-8xl font-bold mb-10 tracking-tighter">{annualStats.avg}</h2>
            <div className="w-full bg-white/10 h-2 rounded-full">
              <div
                className="h-full bg-blue-400 rounded-full transition-all duration-1000" 
                style={{ width: `${Math.min(parseFloat(annualStats.avg) * 10, 100)}%` }}
              ></div>
            </div>
          </div>
          <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <GraduationCap size={28} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-300 mb-2">
                Total Credite
              </p>
              <h3 className="text-5xl font-bold text-[#001f3f]">{annualStats.credits} / 60</h3>
              <div className="flex gap-4 mt-4 text-[11px] font-bold uppercase tracking-wider">
      <div className="flex gap-4 mt-6">
    <div className="flex items-center gap-2 bg-blue-50/50 px-3 py-1.5 rounded-xl">
      <div className="w-2 h-2 rounded-full bg-blue-400"></div>
      <span className="text-[15px] font-black uppercase text-gray-400">Sem 1:</span>
      <span className="text-lg font-black text-[#001f3f]">{calculateStats(s1).credits}</span>
    </div>
    
    <div className="flex items-center gap-2 bg-indigo-50/50 px-3 py-1.5 rounded-xl">
      <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
      <span className="text-[15px] font-black uppercase text-gray-400">Sem 2:</span>
      <span className="text-lg font-black text-[#001f3f]">{calculateStats(s2).credits}</span>
    </div>
  </div>
            </div>
            </div>
          </div>
          <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6">
              <TrendingUp size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Status Bursa
              </p>
              <h3 className="text-5xl font-bold text-[#001f3f] italic">
      <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between bg-orange-50/40 px-4 py-3 rounded-2xl border border-orange-100/50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-orange-400"></div>
          <span className="text-[12px] font-black uppercase text-gray-400">Semestrul 1:</span>
        </div>
        <span className="text-lg font-black text-[#001f3f]">{studentStatusS1 }</span>
      </div>

      <div className="flex items-center justify-between bg-orange-50/40 px-4 py-3 rounded-2xl border border-orange-100/50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-orange-500"></div>
          <span className="text-[12px] font-black uppercase text-gray-400">Semestrul 2:</span>
        </div>
        <span className="text-lg font-black text-[#001f3f]">{studentStatusS2}</span>
      </div>
      
    </div>
        </h3>
            </div>
          </div>
        </div>




        {/* TABELE SEMESTRE */}
        <div className="space-y-24">
          <SemesterTable title="Semestrul 1" badge="TOAMNĂ 2025" stats={calculateStats(s1)} courses={s1} />
          <SemesterTable title="Semestrul 2" badge="PRIMĂVARĂ 2026" stats={calculateStats(s2)} courses={s2} />
        </div>
       <div className="mt-24 flex justify-center">
  <div className="bg-[#f1f3f5] p-12 rounded-[3rem] border border-gray-200 flex flex-col lg:flex-row items-center justify-center gap-10">
    <div className="max-w-xl text-center">
      <h3 className="text-2xl font-bold mb-3 text-[#001f3f]">
        Solicitare Foaie Matricolă?
      </h3>
      <p className="text-gray-500 text-base font-medium leading-relaxed">
        Documentele semnate digital sunt disponibile imediat în format PDF.
      </p>
    </div>
    <button
  onClick={handleDownloadPDF}
  className="bg-[#001f3f] text-white px-10 py-5 rounded-2xl font-bold text-sm flex items-center gap-3 shadow-xl hover:bg-blue-900 transition-all"
>
  <Download size={20} /> Descarcă PDF
</button>
  </div>
</div>
      </main>
    </div>
  );
};

// Tabelul rămâne la fel ca cel original pe care l-ai trimis
const SemesterTable = ({ title, badge, stats ,courses }) => (
  <section>
    <div className="flex justify-between items-end mb-10 px-4">
      <div>
        <span className="px-4 py-1.5 bg-blue-100 text-blue-700 text-[10px] font-black rounded-lg uppercase mb-4 block w-fit">{badge}</span>
        <h2 className="text-4xl font-bold text-[#001f3f] tracking-tight">{title}</h2>
      </div>
      <div className="text-right">
        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1"> Medie Semestru</p>
        <p className="text-3xl font-black text-blue-600">{stats.avg}</p>
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
          {courses.length > 0 ? (
            courses.map((c, i) => (
              <tr key={i} className="group hover:bg-blue-50/30 transition-all">
                <td className="px-10 py-7 text-[13px] font-bold text-gray-400 uppercase tracking-widest">{c.c}</td>
                <td className="px-10 py-7 text-[15px] font-bold text-[#001f3f]">{c.n}</td>
                <td className="px-10 py-7 text-sm font-bold text-gray-500 text-center">{c.cr}.0</td>
                <td className="px-10 py-7 text-right font-black text-blue-600">{c.g}</td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="4" className="px-10 py-7 text-center text-gray-400">Nu există note pentru acest semestru.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  </section>
);

export default CatalogPage;