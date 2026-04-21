import React, { useState, useEffect, useMemo } from "react";
import { db, auth, firebaseConfig } from "./firebase";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, getDocs, doc, updateDoc, deleteDoc, setDoc, query, where, getDoc } from "firebase/firestore";
import Layout from "./Layout";
import { 
  Users, Search, Plus, Trash2, Edit, Save, X, Phone, Mail, 
  MapPin, Info, GraduationCap, ClipboardCheck, CreditCard, 
  LayoutDashboard, UserPlus, Download, CheckCircle2, AlertCircle, Bell
} from "lucide-react";

const AdminPage = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [allGrades, setAllGrades] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });

  const [newStudent, setNewStudent] = useState({ 
    Nume: "", 
    Prenume: "", 
    CNP: "", 
    password: "", 
    Specializare: "C",
    varsta: "",
    sex: "M",
    telefon: "",
    bio: "",
    adresa: "",
    finantare: "Buget",
    statusTaxa: "Asteptare",
    bursa_s1: "Fara bursa",
    bursa_s2: "Fara bursa"
  });
  const [addingStudent, setAddingStudent] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  // 🔔 NOTIFICATION HELPER
  const notify = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "success" }), 4000);
  };

  const fetchStudents = async () => {
    const querySnapshot = await getDocs(collection(db, "student"));
    setStudents(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSelectStudent = async (student) => {
    try {
      const studentSnap = await getDoc(doc(db, "student", student.id));
      if (studentSnap.exists()) {
        const data = studentSnap.data();
        setSelectedStudent({
          id: student.id,
          ...data,
          bursa_s1: data.bursa_s1 || "Fara bursa",
          bursa_s2: data.bursa_s2 || "Fara bursa",
          varsta: data.varsta || "",
          sex: data.sex || "M",
          telefon: data.telefon || "",
          bio: data.bio || "",
          adresa: data.adresa || "",
          finantare: data.finantare || "Buget",
          statusTaxa: data.statusTaxa || "Asteptare"
        });
      }

      if (activeTab === "grades_tab") {
        const gradesRef = collection(db, `student/${student.id}/grades`);
        const qGrades = await getDocs(gradesRef);
        setAllGrades(qGrades.docs.map(d => ({ id: d.id, ...d.data() })));
        setShowDetailsModal(true);
      }
    } catch (err) {
      console.error("Error fetching detail:", err);
    }
  };

  const handleSaveAll = async () => {
    if (!selectedStudent) return;
    try {
      const studentRef = doc(db, "student", selectedStudent.id);
      await updateDoc(studentRef, {
        Nume: selectedStudent.Nume,
        Prenume: selectedStudent.Prenume,
        CNP: selectedStudent.CNP,
        Specializare: selectedStudent.Specializare,
        bursa_s1: selectedStudent.bursa_s1,
        bursa_s2: selectedStudent.bursa_s2,
        varsta: selectedStudent.varsta || "",
        sex: selectedStudent.sex || "M",
        telefon: selectedStudent.telefon || "",
        bio: selectedStudent.bio || "",
        adresa: selectedStudent.adresa || "",
        finantare: selectedStudent.finantare || "Buget",
        statusTaxa: selectedStudent.statusTaxa || "Asteptare"
      });

      const promises = allGrades.map(g => {
        const gRef = doc(db, `student/${selectedStudent.id}/grades`, g.id);
        return setDoc(gRef, { ...g });
      });
      await Promise.all(promises);

      notify("Modificările au fost salvate în Cloud cu succes!");
      fetchStudents();
      if (activeTab === "grades_tab") setShowDetailsModal(false);
    } catch (err) {
      console.error(err);
      notify("Eroare la salvare: " + err.message, "error");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Sigur ștergi studentul permanent?")) {
      try {
        await deleteDoc(doc(db, "student", id));
        notify("Studentul a fost eliminat din bazele de date.");
        setSelectedStudent(null);
        fetchStudents();
      } catch (err) {
        notify("Eroare la ștergere.", "error");
      }
    }
  };

  const handleAddSubject = (semester) => {
    const newId = `new_${Date.now()}`;
    const newGrade = { id: newId, subject: "Materie Nouă", code: "COD", grade: 0, credits: 5, semester: semester };
    setAllGrades([...allGrades, newGrade]);
  };

  const handleDeleteGrade = async (gradeDoc) => {
    if (gradeDoc.id.startsWith("new_")) {
      setAllGrades(allGrades.filter(g => g.id !== gradeDoc.id));
      return;
    }
    if (window.confirm("Ștergi materia din catalog?")) {
      await deleteDoc(doc(db, `student/${selectedStudent.id}/grades`, gradeDoc.id));
      setAllGrades(allGrades.filter(g => g.id !== gradeDoc.id));
      notify("Materie eliminată.");
    }
  };

  const handleAddStudent = async () => {
    if (!newStudent.CNP || !newStudent.password) {
      notify("CNP și Parola sunt obligatorii pentru acreditare!", "error");
      return;
    }
    setAddingStudent(true);
    
    // 🛡️ Securizăm sesiunea Administratorului
    const secondaryApp = initializeApp(firebaseConfig, "SecondaryApp_" + Date.now());
    const secondaryAuth = getAuth(secondaryApp);

    try {
      const email = `${newStudent.CNP}@student.uoradea.ro`;
      
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, newStudent.password);
      const uid = userCredential.user.uid;

      await setDoc(doc(db, "student", uid), {
        Nume: newStudent.Nume,
        Prenume: newStudent.Prenume,
        CNP: newStudent.CNP,
        Specializare: newStudent.Specializare,
        email: email,
        bursa_s1: newStudent.bursa_s1,
        bursa_s2: newStudent.bursa_s2,
        varsta: newStudent.varsta || "",
        sex: newStudent.sex || "M",
        telefon: newStudent.telefon || "",
        bio: newStudent.bio || "",
        adresa: newStudent.adresa || "",
        finantare: newStudent.finantare || "Buget",
        statusTaxa: newStudent.statusTaxa || "Asteptare"
      });

      // 📚 STICT SPECIALIZATION SUBJECTS
      const gradesTemplatesSnap = await getDocs(collection(db, "grades"));
      const templates = gradesTemplatesSnap.docs.map(doc => doc.data());
      const filteredTemplates = templates.filter(t => t.specializare === newStudent.Specializare);

      if (filteredTemplates.length === 0) {
        notify(`Atenție: Nu există materii predefinite pentru specializarea ${newStudent.Specializare}. Catalogul va fi gol.`, "error");
      }

      const creationPromises = filteredTemplates.map(t => {
        const gRef = doc(collection(db, `student/${uid}/grades`));
        return setDoc(gRef, { subject: t.subject, grade: 0, credits: t.credits || 5, semester: t.semester || 1, code: t.code || "TPL" });
      });
      await Promise.all(creationPromises);

      await signOut(secondaryAuth);

      notify(`Studentul ${newStudent.Nume} a fost înmatriculat cu succes!`);
      setShowAddModal(false);
      setNewStudent({ Nume: "", Prenume: "", CNP: "", password: "", Specializare: "C", varsta: "", sex: "M", telefon: "", bio: "", adresa: "", finantare: "Buget", statusTaxa: "Asteptare", bursa_s1: "Fara bursa", bursa_s2: "Fara bursa" });
      fetchStudents();
    } catch (error) {
      console.error(error);
      notify("Eroare înmatriculare: " + error.message, "error");
    } finally {
      setAddingStudent(false);
    }
  };

  const filteredStudents = useMemo(() => {
    return students.filter(s => 
      `${s.Nume} ${s.Prenume} ${s.CNP} ${s.Specializare} ${s.email} ${s.finantare}`.toLowerCase()
      .includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  return (
    <Layout>
      <div className="flex bg-[#f8f9fa] min-h-[calc(100vh-73px)] w-full overflow-hidden relative">
        
        {/* 🔔 TOAST NOTIFICATION COMPONENT */}
        {notification.show && (
          <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[1000] animate-in slide-in-from-top-10 duration-500">
             <div className={`${notification.type === 'error' ? 'bg-red-600' : 'bg-green-600'} text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[300px]`}>
                {notification.type === 'error' ? <AlertCircle size={24} /> : <CheckCircle2 size={24} />}
                <p className="font-bold text-sm tracking-tight">{notification.message}</p>
                <button onClick={() => setNotification({...notification, show: false})} className="ml-auto hover:scale-110 transition-transform"><X size={18} /></button>
             </div>
          </div>
        )}

        {/* SIDEBAR */}
        <aside className="w-64 bg-[#001f3f] text-white flex flex-col hidden lg:flex shrink-0 z-20">
          <div className="p-8">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap size={20} className="text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight uppercase">Admin Panel</span>
            </div>

            <nav className="space-y-1.5">
              {[
                { id: "dashboard", label: "Consolă", icon: LayoutDashboard },
                { id: "students", label: "Studenți", icon: Users },
                { id: "grades_tab", label: "Catalog", icon: ClipboardCheck },
                { id: "billing", label: "Financiar", icon: CreditCard },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setSelectedStudent(null); }}
                  className={`w-full flex items-center gap-3.5 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    activeTab === item.id 
                    ? "bg-blue-600 text-white shadow-xl shadow-blue-900/30" 
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <item.icon size={16} />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* CONTENT */}
        <main className="flex-1 bg-white overflow-y-auto custom-scrollbar relative flex flex-col">
          
          <div className="px-10 py-8 border-b border-gray-100 bg-white sticky top-0 z-10 flex justify-between items-center">
             <div>
               {activeTab === "dashboard" && <><h1 className="text-2xl font-bold text-[#001f3f]">Monitorizare Centrală</h1><p className="text-xs text-gray-400 font-bold uppercase mt-1">Sumar Activitate</p></>}
               {activeTab === "students" && <><h1 className="text-2xl font-bold text-[#001f3f]">Baza de Date Studenți</h1><p className="text-xs text-gray-400 font-bold uppercase mt-1">Evidență Matricolă</p></>}
               {activeTab === "grades_tab" && <><h1 className="text-2xl font-bold text-[#001f3f]">Catalog Academic</h1><p className="text-xs text-gray-400 font-bold uppercase mt-1">Gestiune Note</p></>}
               {activeTab === "billing" && <><h1 className="text-2xl font-bold text-[#001f3f]">Sistem Financiar</h1><p className="text-xs text-gray-400 font-bold uppercase mt-1">Status Taxe & Burse</p></>}
             </div>
             {activeTab === "students" && <button onClick={() => setShowAddModal(true)} className="px-6 py-3 bg-blue-600 text-white text-xs font-bold uppercase rounded-xl shadow-lg hover:bg-blue-700 transition-all">+ Adaugă Student</button>}
          </div>

          <div className="px-10 py-10 flex-grow">
            
            {activeTab === "dashboard" && (
              <div className="w-full animate-in fade-in duration-500">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                   {[
                     { label: "Studenți Înrolați", value: students.length, icon: Users, color: "blue" },
                     { label: "Specializări Activ", value: [...new Set(students.map(s => s.Specializare))].length, icon: GraduationCap, color: "indigo" },
                     { label: "Capacitate Burse", value: "150", icon: CreditCard, color: "green" }
                   ].map((stat, i) => (
                     <div key={i} className="p-8 rounded-3xl bg-gray-50 border border-gray-100 flex flex-col gap-6">
                        <div className={`w-12 h-12 bg-${stat.color}-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-${stat.color}-200`}><stat.icon size={22} /></div>
                        <div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p><p className="text-3xl font-bold text-[#001f3f]">{stat.value}</p></div>
                     </div>
                   ))}
                 </div>
                 <div className="h-80 rounded-[3rem] bg-gray-900 border-8 border-gray-800 flex items-center justify-center italic text-gray-600 text-xs font-bold uppercase tracking-[0.4em]">Operational Data Sync...</div>
              </div>
            )}

            {(activeTab === "students" || activeTab === "grades_tab" || activeTab === "billing") && (
              <div className="w-full animate-in fade-in duration-500">
                <div className="flex items-center bg-gray-50 rounded-2xl border border-gray-100 mb-8 px-6 shadow-sm">
                   <Search className="text-gray-300" size={20} />
                   <input
                     type="text"
                     placeholder="Căutare rapidă student..."
                     className="w-full p-5 bg-transparent font-bold text-sm text-[#001f3f] outline-none"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                   />
                </div>

                <div className="overflow-x-auto rounded-3xl border border-gray-100 shadow-xl bg-white mb-8">
                  <table className="w-full text-left border-collapse min-w-[1100px]">
                    <thead>
                      <tr className="bg-gray-50/70 border-b border-gray-50">
                        <th className="px-8 py-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Identitate</th>
                        {activeTab === "students" && <>
                          <th className="px-8 py-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Document CNP</th>
                          <th className="px-8 py-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Email</th>
                          <th className="px-8 py-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Spec.</th>
                          <th className="px-8 py-6 text-right text-[11px] font-bold text-gray-400 uppercase tracking-widest">Sursa</th>
                        </>}
                        {activeTab === "grades_tab" && <>
                          <th className="px-8 py-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Cod Unic</th>
                          <th className="px-8 py-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Facultate</th>
                          <th className="px-8 py-6 text-right text-[11px] font-bold text-gray-400 uppercase tracking-widest">Acțiuni</th>
                        </>}
                        {activeTab === "billing" && <>
                          <th className="px-8 py-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Regim</th>
                          <th className="px-8 py-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Echilibru Taxă</th>
                          <th className="px-8 py-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Bursă S1</th>
                          <th className="px-8 py-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Bursă S2</th>
                        </>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                       {filteredStudents.map(s => (
                         <tr key={s.id} onClick={() => handleSelectStudent(s)} className={`group cursor-pointer transition-all ${selectedStudent?.id === s.id ? "bg-blue-50/70" : "hover:bg-gray-50/50"}`}>
                            <td className="px-8 py-4">
                               <div className="flex items-center gap-4">
                                  <div className="w-11 h-11 rounded-xl bg-white border-2 border-gray-100 overflow-hidden shadow-sm">
                                     <img src={`https://i.pravatar.cc/150?u=${s.id}`} alt="p" className="w-full h-full object-cover" />
                                  </div>
                                  <div>
                                     <p className="font-bold text-[#001f3f] text-sm">{s.Prenume} {s.Nume}</p>
                                     <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 opacity-60">ID: {s.id?.slice(0, 10)}</p>
                                  </div>
                               </div>
                            </td>
                            {activeTab === "students" && <>
                              <td className="px-8 py-4 text-xs font-bold text-gray-400 font-mono tracking-tighter">{s.CNP}</td>
                              <td className="px-8 py-4 text-xs font-bold text-gray-500">{s.email}</td>
                              <td className="px-8 py-4"><span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase rounded-lg border border-indigo-100">{s.Specializare}</span></td>
                              <td className="px-8 py-4 text-right"><span className={`text-[10px] font-bold uppercase ${s.finantare === 'Taxa' ? 'text-red-500' : 'text-green-500'}`}>{s.finantare}</span></td>
                            </>}
                            {activeTab === "grades_tab" && <>
                              <td className="px-8 py-4 text-xs font-bold text-gray-400 font-mono">{s.CNP}</td>
                              <td className="px-8 py-4 text-[10px] font-bold text-gray-300 uppercase">{s.Specializare}</td>
                              <td className="px-8 py-4 text-right"><button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-bold uppercase opacity-0 group-hover:opacity-100 transition-all border border-blue-100 shadow-sm">Editează Catalog</button></td>
                            </>}
                            {activeTab === "billing" && <>
                              <td className="px-8 py-4"><span className={`${s.finantare === 'Taxa' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'} px-3 py-1 rounded-lg border text-[10px] font-bold uppercase`}>{s.finantare}</span></td>
                              <td className="px-8 py-4">
                                 {s.finantare === 'Buget' ? (
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-green-600">
                                       <CheckCircle2 size={16} /> Scutit
                                    </div>
                                 ) : (
                                    <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase ${s.statusTaxa === 'Platit' ? 'text-green-600' : 'text-red-500'}`}>
                                       <div className={`w-1.5 h-1.5 rounded-full ${s.statusTaxa === 'Platit' ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}></div>
                                       {s.statusTaxa === 'Platit' ? 'Confirmat' : 'Restanță Plată'}
                                    </div>
                                 )}
                              </td>
                              <td className="px-8 py-4 font-bold text-[#001f3f] text-xs">
                                 {s.bursa_s1 === 'Merit' ? <span className="text-green-600 font-black">MERIT</span> : "—"}
                              </td>
                              <td className="px-8 py-4 font-bold text-[#001f3f] text-xs">
                                 {s.bursa_s2 === 'Merit' ? <span className="text-green-600 font-black">MERIT</span> : "—"}
                              </td>
                            </>}
                         </tr>
                       ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* SIDE PANEL */}
        {(activeTab === "students" || activeTab === "billing") && (
          <aside className={`fixed top-[73px] right-0 bottom-0 w-[460px] bg-white border-l border-gray-100 flex flex-col transition-all duration-500 overflow-y-auto custom-scrollbar z-30 ${selectedStudent ? "translate-x-0 shadow-[-50px_0_100px_-50px_rgba(0,0,0,0.1)]" : "translate-x-full"}`}>
            {selectedStudent && (
               <div className="p-10">
                  <div className="flex justify-between items-center mb-12">
                     <button onClick={() => setSelectedStudent(null)} className="p-3 bg-gray-50 text-gray-400 hover:text-black rounded-xl transition-all"><X size={20} /></button>
                     <div className="flex gap-3">
                        <button onClick={handleSaveAll} className="p-4 bg-[#001f3f] text-white rounded-2xl shadow-xl hover:bg-black transition-all"><Save size={20} /></button>
                        <button onClick={() => handleDelete(selectedStudent.id)} className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={20} /></button>
                     </div>
                  </div>

                  <div className="flex flex-col items-center mb-12 text-center">
                     <div className="relative mb-6">
                        <img src={`https://i.pravatar.cc/300?u=${selectedStudent.id}`} alt="p" className="w-32 h-32 rounded-3xl border-4 border-white shadow-2xl" />
                     </div>
                     <h2 className="text-2xl font-bold text-[#001f3f]">{selectedStudent.Prenume} {selectedStudent.Nume}</h2>
                     <p className="text-[10px] font-bold text-gray-300 uppercase mt-2 tracking-widest">{selectedStudent.Specializare}</p>
                  </div>

                  <div className="space-y-12">
                     <section>
                        <h3 className="text-[11px] font-bold uppercase text-gray-400 border-b pb-3 mb-8 tracking-widest">Informații Account</h3>
                        <div className="grid grid-cols-2 gap-6 mb-8">
                           <div className="p-6 bg-gray-50 rounded-2xl">
                              <p className="text-[9px] font-bold text-gray-400 uppercase mb-2">Vârstă</p>
                              <input type="number" className="bg-transparent font-bold text-2xl text-[#001f3f] outline-none w-full" value={selectedStudent.varsta} onChange={e => setSelectedStudent({...selectedStudent, varsta: e.target.value})} />
                           </div>
                           <div className="p-6 bg-gray-50 rounded-2xl">
                              <p className="text-[9px] font-bold text-gray-400 uppercase mb-2">Gen</p>
                              <select className="bg-transparent font-bold text-lg text-[#001f3f] outline-none w-full uppercase" value={selectedStudent.sex} onChange={e => setSelectedStudent({...selectedStudent, sex: e.target.value})}>
                                 <option value="M">Masculin</option>
                                 <option value="F">Feminin</option>
                              </select>
                           </div>
                        </div>
                        <div className="space-y-4">
                           <div className="p-5 bg-gray-50 rounded-2xl flex items-center gap-6">
                              <Phone size={18} className="text-gray-300" />
                              <input className="bg-transparent text-[#001f3f] font-bold text-sm w-full outline-none" value={selectedStudent.telefon} placeholder="CONTACT GSM" onChange={e => setSelectedStudent({...selectedStudent, telefon: e.target.value})} />
                           </div>
                           <div className="p-5 bg-gray-50 rounded-2xl flex items-center gap-6">
                              <MapPin size={18} className="text-gray-300" />
                              <input className="bg-transparent text-[#001f3f] font-bold text-xs w-full outline-none uppercase" value={selectedStudent.adresa} placeholder="ADRESĂ FIZICĂ" onChange={e => setSelectedStudent({...selectedStudent, adresa: e.target.value})} />
                           </div>
                        </div>
                     </section>

                     <section>
                        <h3 className="text-[11px] font-bold uppercase text-gray-400 border-b pb-3 mb-8 tracking-widest">Parametri Fiscali</h3>
                        <div className="grid grid-cols-2 gap-3 mb-4">
                           {['Buget', 'Taxa'].map(f => (
                              <button key={f} onClick={() => setSelectedStudent({...selectedStudent, finantare: f})} className={`py-4 rounded-xl text-[11px] font-bold uppercase transition-all ${selectedStudent.finantare === f ? 'bg-[#001f3f] text-white shadow-xl' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>{f}</button>
                           ))}
                        </div>
                        {selectedStudent.finantare === 'Taxa' ? (
                           <div className="grid grid-cols-1 gap-2">
                              {['Asteptare', 'Platit'].map(s => (
                                 <button key={s} onClick={() => setSelectedStudent({...selectedStudent, statusTaxa: s})} className={`py-4 rounded-xl text-[11px] font-bold uppercase transition-all ${selectedStudent.statusTaxa === s ? (s === 'Platit' ? 'bg-green-600' : 'bg-red-500') + ' text-white shadow-lg' : 'bg-gray-100 text-gray-400'}`}>{s === 'Platit' ? 'Confirmat (Fără Debite)' : 'Plată Restantă'}</button>
                              ))}
                           </div>
                        ) : (
                            <div className="p-4 bg-green-50 text-green-700 text-[10px] font-bold uppercase rounded-xl border border-green-100 flex items-center gap-3">
                                <CheckCircle2 size={16} /> Regim Scutit de Taxe Semestriale
                            </div>
                        )}
                        <div className="grid grid-cols-1 gap-4 mt-8">
                           {[1, 2].map(sem => (
                              <div key={sem} className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                                 <p className="text-[9px] font-bold text-gray-400 uppercase mb-3 tracking-widest">Bursă Semestrul {sem}</p>
                                 <div className="flex gap-2">
                                    {['Fara bursa', 'Merit'].map(type => {
                                       const field = `bursa_s${sem}`;
                                       return (
                                          <button 
                                             key={type}
                                             onClick={() => setSelectedStudent({...selectedStudent, [field]: type})}
                                             className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase transition-all ${selectedStudent[field] === type ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-100 hover:border-gray-200'}`}
                                          >
                                             {type}
                                          </button>
                                       );
                                    })}
                                 </div>
                              </div>
                           ))}
                        </div>
                     </section>

                     <section>
                        <h3 className="text-[11px] font-bold uppercase text-gray-400 mb-4 tracking-widest">Dosar & Bio</h3>
                        <textarea className="w-full bg-gray-50 border border-gray-100 p-6 rounded-3xl font-medium text-xs text-gray-600 outline-none h-40 resize-none" value={selectedStudent.bio} placeholder="Note administrative..." onChange={e => setSelectedStudent({...selectedStudent, bio: e.target.value})} />
                     </section>
                  </div>
               </div>
            )}
          </aside>
        )}
      </div>

      {/* CATALOG MODAL - SIMPLIFIED */}
      {showDetailsModal && selectedStudent && (
        <div className="fixed inset-0 bg-[#001f3f]/70 backdrop-blur-sm flex items-center justify-center z-[200] p-6 animate-in zoom-in-95 duration-300">
           <div className="bg-white rounded-[2rem] w-full max-w-4xl h-[85vh] overflow-hidden flex flex-col shadow-2xl">
              <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-white">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">{selectedStudent.Prenume?.[0]}{selectedStudent.Nume?.[0]}</div>
                    <div>
                       <h2 className="text-xl font-bold text-[#001f3f]">{selectedStudent.Prenume} {selectedStudent.Nume}</h2>
                       <p className="text-xs text-gray-400">Management Note & Credite</p>
                    </div>
                 </div>
                 <button onClick={() => setShowDetailsModal(false)} className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><X size={24} /></button>
              </div>

              <div className="flex-grow overflow-y-auto p-10 custom-scrollbar">
                 {[1, 2].map(sem => (
                    <div key={sem} className="mb-12 last:mb-0">
                       <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-100">
                          <h3 className="text-sm font-bold text-[#001f3f] uppercase tracking-wider">Semestrul {sem}</h3>
                          <button onClick={() => handleAddSubject(sem)} className="px-4 py-2 bg-[#001f3f] text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all">+ Materie</button>
                       </div>
                       
                       <div className="grid grid-cols-1 gap-4">
                          {allGrades.filter(g => g.semester === sem).map(grade => (
                             <div key={grade.id} className="p-6 bg-gray-50 rounded-2xl flex items-center gap-8 border border-transparent hover:bg-white hover:border-gray-100 hover:shadow-xl transition-all duration-300 group">
                                <div className="flex-grow">
                                   <input className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-transparent outline-none mb-1 w-full" value={grade.code} placeholder="COD" onChange={e => setAllGrades(allGrades.map(g => g.id === grade.id ? {...g, code: e.target.value} : g))} />
                                   <input className="text-base font-bold text-[#001f3f] bg-transparent outline-none w-full" value={grade.subject} placeholder="MATERIE" onChange={e => setAllGrades(allGrades.map(g => g.id === grade.id ? {...g, subject: e.target.value} : g))} />
                                </div>
                                <div className="flex items-center gap-6">
                                   <div className="text-center">
                                      <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Credite</p>
                                      <input type="number" className="w-10 h-10 bg-white rounded-lg border border-gray-100 text-center font-bold text-sm outline-none" value={grade.credits} onChange={e => setAllGrades(allGrades.map(g => g.id === grade.id ? {...g, credits: e.target.value} : g))} />
                                   </div>
                                   <div className="text-center">
                                      <p className="text-[9px] font-bold text-blue-400 uppercase mb-1">Notă</p>
                                      <input type="number" className="w-12 h-12 bg-blue-600 rounded-xl text-white text-center font-bold text-xl outline-none shadow-lg group-hover:scale-105 transition-transform" value={grade.grade} onChange={e => setAllGrades(allGrades.map(g => g.id === grade.id ? {...g, grade: e.target.value} : g))} />
                                   </div>
                                   <button onClick={() => handleDeleteGrade(grade)} className="p-2 text-gray-200 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"><Trash2 size={20} /></button>
                                </div>
                             </div>
                          ))}
                       </div>
                    </div>
                 ))}
              </div>

              <div className="p-8 bg-gray-50 border-t border-gray-100">
                 <button onClick={handleSaveAll} className="w-full bg-[#001f3f] text-white py-5 rounded-2xl font-bold text-sm shadow-xl hover:bg-black transition-all uppercase tracking-widest flex items-center justify-center gap-3"><Save size={20} /> Confirmă Toate Modificările</button>
              </div>
           </div>
        </div>
      )}

      {/* REGISTER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-[#001f3f]/80 backdrop-blur-md flex items-center justify-center z-[300] p-6 animate-in fade-in duration-500">
           <div className="bg-white rounded-[3rem] w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              <div className="p-10 border-b border-gray-100 flex justify-between items-center bg-gray-50/20">
                 <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-blue-600 rounded-[1.2rem] flex items-center justify-center text-white shadow-xl"><UserPlus size={28} /></div>
                    <h2 className="text-2xl font-bold text-[#001f3f] tracking-tight uppercase">Edu Enroll System</h2>
                 </div>
                 <button onClick={() => setShowAddModal(false)} className="p-4 text-gray-300 hover:text-gray-600 rounded-2xl transition-all"><X size={32} /></button>
              </div>

              <div className="flex-grow overflow-y-auto p-12 custom-scrollbar">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-8">
                       <h4 className="text-[10px] font-bold text-blue-600 uppercase tracking-widest border-b pb-2">Identificare Cont</h4>
                       <div className="grid grid-cols-2 gap-6">
                          <div><label className="text-[9px] font-bold text-gray-400 uppercase mb-2 block">Nume</label><input type="text" className="w-full bg-gray-50 p-5 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-blue-50 transition-all" value={newStudent.Nume} onChange={e => setNewStudent({...newStudent, Nume: e.target.value})} /></div>
                          <div><label className="text-[9px] font-bold text-gray-400 uppercase mb-2 block">Prenume</label><input type="text" className="w-full bg-gray-50 p-5 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-blue-50 transition-all" value={newStudent.Prenume} onChange={e => setNewStudent({...newStudent, Prenume: e.target.value})} /></div>
                       </div>
                       <div><label className="text-[9px] font-bold text-gray-400 uppercase mb-2 block">C.N.P.</label><input type="text" className="w-full bg-gray-50 p-5 rounded-2xl font-bold text-base font-mono tracking-widest text-center text-[#001f3f] outline-none" value={newStudent.CNP} onChange={e => setNewStudent({...newStudent, CNP: e.target.value})} /></div>
                       <div><label className="text-[9px] font-bold text-gray-400 uppercase mb-2 block">Parolă Înrolare</label><input type="password" placeholder="MIN. 6 CARACTERI" className="w-full bg-gray-50 p-5 rounded-2xl font-bold text-sm outline-none" value={newStudent.password} onChange={e => setNewStudent({...newStudent, password: e.target.value})} /></div>
                       <div className="grid grid-cols-2 gap-6">
                          <div><label className="text-[9px] font-bold text-gray-400 uppercase mb-2 block">Finanțare</label><select className="w-full bg-gray-50 p-5 rounded-2xl font-bold uppercase text-[10px] outline-none" value={newStudent.finantare} onChange={e => setNewStudent({...newStudent, finantare: e.target.value})}><option value="Buget">BUGET</option><option value="Taxa">TAXA</option></select></div>
                          <div><label className="text-[9px] font-bold text-gray-400 uppercase mb-2 block">Spec.</label><select className="w-full bg-gray-50 p-5 rounded-2xl font-bold uppercase text-[10px] outline-none" value={newStudent.Specializare} onChange={e => setNewStudent({...newStudent, Specializare: e.target.value})}><option value="C">C</option><option value="TI">TI</option></select></div>
                       </div>
                    </div>

                    <div className="space-y-8">
                       <h4 className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest border-b pb-2">Atribute Sociale</h4>
                       <div className="grid grid-cols-2 gap-6">
                          <div className="p-6 bg-gray-50 rounded-2xl text-center"><label className="text-[8px] font-bold text-gray-300 uppercase mb-1 block">Vârstă</label><input type="number" className="bg-transparent font-bold text-3xl text-[#001f3f] text-center outline-none w-full" value={newStudent.varsta} onChange={e => setNewStudent({...newStudent, varsta: e.target.value})} /></div>
                          <div className="p-6 bg-gray-50 rounded-2xl text-center"><label className="text-[8px] font-bold text-gray-300 uppercase mb-1 block">Gen</label><select className="bg-transparent font-bold text-lg text-[#001f3f] outline-none w-full text-center uppercase" value={newStudent.sex} onChange={e => setNewStudent({...newStudent, sex: e.target.value})}><option value="M">MAS</option><option value="F">FEM</option></select></div>
                       </div>
                       <div>
                          <label className="text-[9px] font-bold text-gray-400 uppercase mb-2 block">Burse Semestriale</label>
                          <div className="grid grid-cols-2 gap-4">
                             {[1, 2].map(sem => (
                                <select 
                                   key={sem}
                                   className="w-full bg-gray-50 p-4 rounded-xl font-bold uppercase text-[9px] outline-none border border-gray-100"
                                   value={newStudent[`bursa_s${sem}`]}
                                   onChange={e => setNewStudent({...newStudent, [`bursa_s${sem}`]: e.target.value})}
                                >
                                   <option value="Fara bursa">S{sem}: Fără Bursă</option>
                                   <option value="Merit">S{sem}: Merit</option>
                                </select>
                             ))}
                          </div>
                       </div>
                       <div><label className="text-[9px] font-bold text-gray-400 uppercase mb-2 block">Contact GSM</label><input type="text" className="w-full bg-gray-50 p-5 rounded-2xl font-bold text-sm outline-none" value={newStudent.telefon} onChange={e => setNewStudent({...newStudent, telefon: e.target.value})} /></div>
                       <div><label className="text-[9px] font-bold text-gray-400 uppercase mb-2 block">Adresă REZID.</label><input type="text" className="w-full bg-gray-50 p-5 rounded-2xl font-bold text-xs uppercase" value={newStudent.adresa} onChange={e => setNewStudent({...newStudent, adresa: e.target.value})} /></div>
                    </div>
                 </div>
              </div>

              <div className="p-10 bg-gray-50 border-t border-gray-100">
                 <button onClick={handleAddStudent} disabled={addingStudent} className="w-full bg-[#001f3f] text-white py-6 rounded-3xl font-bold text-lg shadow-2xl hover:bg-black transition-all uppercase tracking-widest">{addingStudent ? <div className="flex items-center justify-center gap-4"><div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin"></div> ÎNROLĂM...</div> : "ÎNREGISTREAZĂ STUDENT"}</button>
              </div>
           </div>
        </div>
      )}
    </Layout>
  );
};

export default AdminPage;
