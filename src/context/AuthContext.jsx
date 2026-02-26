import { createContext, useState, useEffect } from "react";
import { loginUser } from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    if (token) {
      setUser({ email: "apiuser@reqres.in" });
    }
  }, [token]);

  const login = async (email, password) => {
    const result = await loginUser(email, password);

    if (result.success) {
      localStorage.setItem("token", result.token);
      setToken(result.token);
      setUser({ email });

      return { success: true };
    } else {
      return { success: false, message: result.message };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};