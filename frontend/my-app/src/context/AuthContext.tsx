'use client'

import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  isLoggedIn: boolean;
  role: string | null;
  loading: boolean; // 🔥 ADD
  // user: any; // ✅ ADD THIS
  // token: string | null; // ✅ ADD THIS
  login: (token: string, role: string, userData: any) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // 🔥 NEW
  // const [user, setUser] = useState(null);       // ✅ ADD
  // const [token, setToken] = useState(null);
  // const [token, setToken] = useState<string | null>(null);
  // const [user, setUser] = useState<any | null>(null);

  // const [token, setToken] = useState(null);


  // check token on load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");
    if (token) {
      setIsLoggedIn(true);
      setRole(savedRole);
    }
      setLoading(false); // 🔥 DONE LOADING
  }, []);

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   const savedRole = localStorage.getItem("role");
  //   const savedUser = localStorage.getItem("user"); // ✅ ADD THIS

  //   if (token && savedUser) {
  //     // setIsLoggedIn(true);
  //     // setRole(savedRole);
  //     // setUser(JSON.parse(savedUser)); // ✅ IMPORTANT
  //     // setToken(token);
  //     // setRole(savedRole);
  //     // setUser(JSON.parse(savedUser)); // ✅ IMPORTANT
  //     // setIsLoggedIn(true);
  //     try {
  //       setToken(token);
  //       setRole(savedRole);
  //       setUser(JSON.parse(savedUser)); // ✅ safe now
  //       setIsLoggedIn(true);
  //     } catch (error) {
  //       console.log("Invalid user data");
  //       localStorage.removeItem("user"); // cleanup
  //     }
  //   }
  // }, []);

  // const login = (token: string, role: string) => {
  //   localStorage.setItem("token", token);
  //   localStorage.setItem("role", role);
  //   setIsLoggedIn(true);
  //   setRole(role);
  // };

  const login = (token: string, role: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    // localStorage.setItem("user", JSON.stringify(userData)); // ✅ IMPORTANT

    // setToken(token);
    setRole(role);
    // setUser(userData);
    setIsLoggedIn(true);
  };


  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{isLoggedIn, role, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};

