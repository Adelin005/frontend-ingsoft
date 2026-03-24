import React, { useState } from "react";
import { AlertContext } from "./components/useAlert.js";
import { AlertCircle, CheckCircle, Info, X } from "lucide-react"; // Importă iconițele

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({ show: false, msg: "", type: "info" });

  const showAlert = (msg, type = "info") => {
    setAlert({ show: true, msg, type });
    setTimeout(() => setAlert({ show: false, msg: "", type: "info" }), 4000);
  };

  const closeAlert = () => setAlert((prev) => ({ ...prev, show: false }));

  return (
    <AlertContext.Provider value={{ alert, showAlert, closeAlert }}>
      {children}
      
      {}
      {alert.show && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[9999] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className={`
            flex items-center gap-4 px-6 py-4 rounded-[1.5rem] shadow-2xl border backdrop-blur-md
            ${alert.type === "error" ? "bg-red-50 border-red-100 text-red-600" : 
              alert.type === "success" ? "bg-green-50 border-green-100 text-green-600" : 
              "bg-blue-50 border-blue-100 text-blue-700"}
          `}>
            {alert.type === "error" ? <AlertCircle size={20} /> : 
             alert.type === "success" ? <CheckCircle size={20} /> : <Info size={20} />}
            
            <p className="text-sm font-black tracking-tight uppercase text-[11px]">
              {alert.msg}
            </p>
            
            <button onClick={closeAlert} className="ml-2 hover:opacity-50">
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
};