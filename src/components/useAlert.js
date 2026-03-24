import { createContext, useContext } from "react";

// 1. Definim contextul
export const AlertContext = createContext();

// 2. Exportăm doar hook-ul
export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert trebuie folosit în interiorul unui AlertProvider");
  }
  return context;
};