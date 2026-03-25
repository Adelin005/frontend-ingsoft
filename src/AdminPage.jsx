import React, { useState, useEffect } from "react";
import { db} from "./firebase";
import { addDoc, getDoc,setDoc} from "firebase/firestore";
import { firebaseConfig } from "./firebase";
import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc,  
  deleteDoc,
  query, 
  where 
} from "firebase/firestore";
import { initializeApp, deleteApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useAlert } from "./components/useAlert.js";
import { 
  User, 
  Trash2, 
  Save, 
  GraduationCap, 
  Search, 
  ChevronRight,
  UserPlus,
  X 
} from "lucide-react";
import Layout from "./Layout";

const AdminPage = () => {
  const { showAlert } = useAlert();
  
  const [students, setStudents] = useState([]); 
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [allGrades, setAllGrades] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudent, setNewStudent] = useState({ Nume: "", Prenume: "", CNP: "", password: "", Specializare: "C" });
  const [addingStudent, setAddingStudent] = useState(false);

  // 🔹 FETCH STUDENȚI
  const fetchStudents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "student"));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStudents(data);
    } catch (error) {
      console.error(error);
      showAlert("Eroare la încărcarea listei de studenți", "error");
    }
  };

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // 🔹 SELECT STUDENT
  const handleSelectStudent = async (student) => {
    try {
      const studentRef = doc(db, "student", student.id);
      const studentSnap = await getDoc(studentRef);
      if (studentSnap.exists()) {
        setSelectedStudent({
          id: studentSnap.id,
          ...studentSnap.data(),
          bursa_s1: studentSnap.data().bursa_s1 || "",
          bursa_s2: studentSnap.data().bursa_s2 || ""
        });
      } else {
        setSelectedStudent({
          ...student,
          bursa_s1: student.bursa_s1 || "",
          bursa_s2: student.bursa_s2 || ""
        });
      }

      const q = query(collection(db, "grades"), where("studentId", "==", student.id));
      const querySnapshot = await getDocs(q);
      const gradesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllGrades(gradesData);
    } catch (error) {
      console.error(error);
      showAlert("Eroare la încărcarea notelor", "error");
    }
  };

  const handleDeleteGrade = async (grade) => {
    if (grade.isNew) {
      setAllGrades(prev => prev.filter(g => g.id !== grade.id));
      return;
    }

    if (!window.confirm("Ștergi materia?")) return;

    try {
      await deleteDoc(doc(db, "grades", grade.id));
      setAllGrades(prev => prev.filter(g => g.id !== grade.id));
      showAlert("Materia a fost ștearsă", "success");
    } catch (error) {
      console.error(error);
      showAlert("Eroare la ștergere", "error");
    }
  };

  // 🔹 SAVE
  const handleSaveAll = async () => {
    if (!selectedStudent) return;

    try {
      const studentRef = doc(db, "student", selectedStudent.id);

      await updateDoc(studentRef, {
        Nume: selectedStudent.Nume || "",
        Prenume: selectedStudent.Prenume || "",
        Specializare: selectedStudent.Specializare || "",
        bursa_s1: selectedStudent.bursa_s1 || "",
        bursa_s2: selectedStudent.bursa_s2 || ""
      });

      const promises = allGrades.map(g => {
        if (g.isNew) {
          return addDoc(collection(db, "grades"), {
            subject: g.subject,
            code: g.code || "",
            credits: g.credits,
            grade: g.grade,
            semester: g.semester,
            studentId: selectedStudent.id,
            specializare: ""

          });
        } else {
          const gradeRef = doc(db, "grades", g.id);
          return updateDoc(gradeRef, {
            subject: g.subject,
            code: g.code || "",
            credits: g.credits,
            grade: g.grade
          });
        }
      });

      await Promise.all(promises);

      showAlert("Totul a fost salvat!", "success");

      // reload
      handleSelectStudent(selectedStudent);
    } catch (error) {
      console.error(error);
      showAlert("Eroare la salvare", "error");
    }
  };
  // 🔹 DELETE STUDENT
  const handleDelete = async (id) => {
    if (!window.confirm("Sigur vrei să ștergi acest student?")) return;

    try {
      await deleteDoc(doc(db, "student", id));
      setSelectedStudent(null);
      setAllGrades([]);
      fetchStudents();
      showAlert("Student șters", "success");
    } catch (error) {
      console.error(error);
      showAlert("Eroare la ștergere", "error");
    }
  };

  // 🔹 SEARCH
  const filteredStudents = students.filter(s =>
    `${s.Nume || ""} ${s.Prenume || ""}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🔹 ADD SUBJECT
  const handleAddSubject = (semester) => {
    const newSubject = {
      id: "temp-" + Date.now(),
      subject: "Materie nouă",
      code: "NEW",
      credits: 0,
      grade: 0,
      semester: semester,
      studentId: "",
      specializare: "",
      isNew: true
    };
    setAllGrades(prev => [...prev, newSubject]);
  };

  // 🔹 ADD STUDENT (Firebase Auth + Firestore)
  const handleAddStudent = async () => {  
    const { Nume, Prenume, CNP, password, Specializare } = newStudent;

    if (!Nume || !Prenume || !CNP || !password) {
      showAlert("Completează toate câmpurile obligatorii!", "error");
      return;
    }
    if (password.length < 6) {
      showAlert("Parola trebuie să aibă minim 6 caractere!", "error");
      return;
    }

    setAddingStudent(true);
    let secondaryApp = null;

    try {
      // Creăm o instanță secundară Firebase pentru a nu afecta sesiunea admin
      secondaryApp = initializeApp(firebaseConfig, "tempAddStudent");
      const secondaryAuth = getAuth(secondaryApp);

      const email = `${CNP}@student.uoradea.ro`;
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
      const uid = userCredential.user.uid;

      // Ștergem instanța secundară
      await deleteApp(secondaryApp);
      secondaryApp = null;

      await setDoc(doc(db, "student", uid), {
        CNP,
        Nume,
        Prenume,
        Specializare,
        bursa_s1: "",
        bursa_s2: "",
        email,
        id: uid
      });

      // ---- AUTO POPULATE GRADES DIRECTLY FROM EXISTING DB REORDS ----
      // Determinăm prefixul materiei (ex: "C-" sau "TI-")
     const qSubjects = query(
  collection(db, "grades"),
  where("specializare", "==", Specializare),
  where("studentId", "==", "")
);

const subjectsSnap = await getDocs(qSubjects);

const gradePromises = subjectsSnap.docs.map(subjectDoc => {
  const subj = subjectDoc.data();
  return addDoc(collection(db, "grades"), {
    code: subj.code,
    subject: subj.subject,
    credits: subj.credits,
    semester: subj.semester,
    grade: 0,
    studentId: uid
  });
});

await Promise.all(gradePromises);

      showAlert(`Studentul ${Prenume} ${Nume} a fost creat cu succes!`, "success");
      setShowAddModal(false);
      setNewStudent({ Nume: "", Prenume: "", CNP: "", password: "", Specializare: "C" });
      fetchStudents();
    } catch (error) {
      console.error(error);
      if (secondaryApp) {
        try { await deleteApp(secondaryApp); } catch {/* ignore */}
      }
      if (error.code === "auth/email-already-in-use") {
        showAlert("Un student cu acest CNP există deja!", "error");
      } else {
        showAlert("Eroare la crearea studentului: " + error.message, "error");
      }
    } finally {
      setAddingStudent(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6 flex flex-col md:flex-row gap-8 h-[calc(100vh-100px)]">
        
        {/* STÂNGA */}
        <div className="md:w-1/3 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-6 flex flex-col overflow-hidden">
          <h2 className="text-xl font-bold mb-5 flex items-center gap-3 px-2 text-[#001f3f]">
            <User size={22} className="text-blue-600" /> Studenți ({filteredStudents.length})
          </h2>

          <div className="relative mb-6 px-2">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Caută după nume..."
              className="w-full bg-gray-50 p-4 pl-12 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-900/10 transition-all border border-transparent focus:border-blue-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
          </div>

          <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
            {filteredStudents.map(s => (
              <div
                key={s.id}
                onClick={() => handleSelectStudent(s)}
                className={`group p-5 rounded-[1.8rem] cursor-pointer transition-all border flex items-center justify-between ${
                  selectedStudent?.id === s.id 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200' 
                  : 'hover:bg-gray-50 border-transparent bg-white shadow-sm'
                }`}
              >
                <div>
                  <p className="font-bold text-sm">{s.Prenume} {s.Nume}</p>
                  <p className={`text-[10px] uppercase tracking-widest mt-0.5 ${selectedStudent?.id === s.id ? 'text-blue-100' : 'text-gray-400'}`}>
                    {s.Specializare || "Student"}
                  </p>
                </div>
                <ChevronRight size={16} className={selectedStudent?.id === s.id ? 'text-white' : 'text-gray-300'} />
              </div>
            ))}
          </div>

          {/* Buton Adaugă Student */}
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full mt-4 bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
          >
            <UserPlus size={18} /> Adaugă Student
          </button>
        </div>

        {/* DREAPTA */}
        <div className="md:w-2/3 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-10 overflow-y-auto custom-scrollbar">
          {selectedStudent ? (
            <div className="space-y-10">
              
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="text-2xl font-black text-[#001f3f] bg-transparent outline-none border-b border-gray-300 focus:border-blue-400 px-2"
                      value={selectedStudent.Prenume}
                      onChange={(e) => setSelectedStudent({ ...selectedStudent, Prenume: e.target.value })}
                    />
                    <input
                      type="text"
                      className="text-2xl font-black text-[#001f3f] bg-transparent outline-none border-b border-gray-300 focus:border-blue-400 px-2"
                      value={selectedStudent.Nume}
                      onChange={(e) => setSelectedStudent({ ...selectedStudent, Nume: e.target.value })}
                    />
                  </div>
                  <input
                    type="text"
                    className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] bg-transparent outline-none border-b border-gray-300 focus:border-blue-400 px-2"
                    value={selectedStudent.Specializare || ""}
                    onChange={(e) => setSelectedStudent({ ...selectedStudent, Specializare: e.target.value })}
                  />
                </div>

                <button onClick={() => handleDelete(selectedStudent.id)} className="p-3 text-red-500 hover:bg-red-50 rounded-2xl">
                  <Trash2 size={22} />
                </button>
              </div>

              {/* Afișare pe Semestre */}
              {[1, 2].map((sem) => (
                <div key={sem} className="space-y-6">
                  <div className="flex items-center justify-between px-2 gap-4">
                    <h3 className="text-xl font-black text-[#001f3f]">Semestrul {sem}</h3>

                    <div className="flex items-center gap-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Bursă</label>
                      <input
                        type="text"
                        className="w-20 p-1 rounded-lg border border-gray-200 text-sm text-center focus:ring-1 focus:ring-blue-600"
                        value={sem === 1 ? selectedStudent.bursa_s1 : selectedStudent.bursa_s2}
                        onChange={(e) =>
                          setSelectedStudent(prev => ({
                            ...prev,
                            [sem === 1 ? "bursa_s1" : "bursa_s2"]: e.target.value
                          }))
                        }
                      />
                    </div>

                    <button
                      onClick={() => handleAddSubject(sem)}
                      className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-xl font-bold hover:bg-blue-100"
                    >
                      + Adaugă materie
                    </button>

                    <div className="h-px flex-grow mx-6 bg-gray-100"></div>
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">UO 2025/2026</span>
                  </div>

                  <div className="space-y-4">
                      {allGrades.filter(g => g.semester === sem).length > 0 ? (
                        allGrades.filter(g => g.semester === sem).map((gradeDoc) => (
                          <div key={gradeDoc.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-8 hover:shadow-md transition-shadow">
                            <div className="flex-grow">
                              <input
                                type="text"
                                className="text-[10px] font-black uppercase text-gray-400 mb-1 tracking-tighter bg-transparent outline-none border-b border-transparent focus:border-blue-400"
                                value={gradeDoc.code || ""}
                                onChange={(e) => {
                                  const updated = allGrades.map(g =>
                                    g.id === gradeDoc.id ? { ...g, code: e.target.value } : g
                                  );
                                  setAllGrades(updated);
                                }}
                              />  
                              <input
                                type="text"
                                className="font-bold text-[#001f3f] text-base bg-transparent outline-none border-b border-transparent focus:border-blue-400"
                                value={gradeDoc.subject || ""}
                                onChange={(e) => {
                                  const updated = allGrades.map(g =>
                                    g.id === gradeDoc.id ? { ...g, subject: e.target.value } : g
                                  );
                                  setAllGrades(updated);
                                }}
                              />
                              <button
                              onClick={() => handleDeleteGrade(gradeDoc)}
                              className="text-red-400 hover:text-red-600 transition"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>

                          <div className="flex items-center gap-10">
                            <div className="text-center">
                              <label className="block text-[9px] font-black text-gray-400 uppercase mb-2">Credite</label>
                              <input 
                                type="number"
                                className="w-14 bg-gray-100 border-none p-2 rounded-xl text-center text-sm font-bold outline-none focus:ring-2 focus:ring-blue-600"
                                value={gradeDoc.credits}
                                onChange={(e) => {
                                  const updated = allGrades.map(g => g.id === gradeDoc.id ? { ...g, credits: parseFloat(e.target.value) } : g);
                                  setAllGrades(updated);
                                }}
                              />
                            </div>
                            <div className="text-center">
                              <label className="block text-[9px] font-black text-gray-400 uppercase mb-2">Notă</label>
                              <input 
                                type="number"
                                className="w-14 bg-blue-50 border-none p-2 rounded-xl text-center text-sm font-black text-blue-700 outline-none focus:ring-2 focus:ring-blue-600"
                                value={gradeDoc.grade}
                                onChange={(e) => {
                                  const updated = allGrades.map(g => g.id === gradeDoc.id ? { ...g, grade: parseInt(e.target.value) } : g);
                                  setAllGrades(updated);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10 bg-gray-50/50 rounded-[2rem] border border-dashed border-gray-200">
                        <p className="text-xs text-gray-400 font-medium italic">Nicio materie alocată în acest semestru.</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Save Button */}
              <div className="sticky bottom-0 bg-white pt-6 border-t mt-12 pb-2">
                <button 
                  onClick={handleSaveAll}
                  className="w-full bg-[#001f3f] text-white py-5 rounded-[1.5rem] font-bold shadow-2xl shadow-blue-900/20 hover:bg-blue-950 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3"
                >
                  <Save size={20} /> Salvează Catalogul Studentului
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-300 py-20">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <GraduationCap size={48} className="opacity-20" />
              </div>
              <p className="font-bold text-sm uppercase tracking-widest opacity-40">Selectează un student din listă</p>
            </div>
          )}
        </div>
      </div>
      {/* MODAL ADAUGĂ STUDENT */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-8 relative animate-in">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 p-3 rounded-xl">
                <UserPlus size={22} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-black text-[#001f3f]">Student Nou</h3>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Prenume *</label>
                  <input
                    type="text"
                    placeholder="Ion"
                    value={newStudent.Prenume}
                    onChange={(e) => setNewStudent({ ...newStudent, Prenume: e.target.value })}
                    className="w-full bg-gray-50 p-3.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-600/20 border border-gray-100 focus:border-blue-300 transition-all"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Nume *</label>
                  <input
                    type="text"
                    placeholder="Popescu"
                    value={newStudent.Nume}
                    onChange={(e) => setNewStudent({ ...newStudent, Nume: e.target.value })}
                    className="w-full bg-gray-50 p-3.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-600/20 border border-gray-100 focus:border-blue-300 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">CNP (ID Național) *</label>
                <input
                  type="text"
                  placeholder="1234567890123"
                  value={newStudent.CNP}
                  onChange={(e) => setNewStudent({ ...newStudent, CNP: e.target.value })}
                  className="w-full bg-gray-50 p-3.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-600/20 border border-gray-100 focus:border-blue-300 transition-all"
                />
                <p className="text-[10px] text-gray-400 mt-1">Email generat: {newStudent.CNP ? `${newStudent.CNP}@student.uoradea.ro` : "—"}</p>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Parolă *</label>
                <input
                  type="text"
                  placeholder="Minim 6 caractere"
                  value={newStudent.password}
                  onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                  className="w-full bg-gray-50 p-3.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-600/20 border border-gray-100 focus:border-blue-300 transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Specializare</label>
                <select
                  value={newStudent.Specializare}
                  onChange={(e) => setNewStudent({ ...newStudent, Specializare: e.target.value })}
                  className="w-full bg-gray-50 p-3.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-600/20 border border-gray-100 focus:border-blue-300 transition-all cursor-pointer"
                >
                  <option value="C">C (Calculatoare)</option>
                  <option value="TI">TI (Tehnologia Informației)</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleAddStudent}
              disabled={addingStudent}
              className="w-full mt-6 bg-[#001f3f] text-white py-4 rounded-xl font-bold shadow-xl hover:bg-blue-950 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {addingStudent ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Se creează...
                </>
              ) : (
                <>
                  <UserPlus size={18} /> Creează Studentul
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AdminPage;