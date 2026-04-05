import { createContext, useContext, useState, ReactNode } from "react";

export interface User {
  email: string;
  name: string;
}

interface AuthContextValue {
  user: User | null;
  login: (email: string, name: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const item = window.localStorage.getItem("nn_current_user");
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  });

  const login = (email: string, name: string) => {
    const newUser = { email, name };
    setUser(newUser);
    try {
      window.localStorage.setItem("nn_current_user", JSON.stringify(newUser));
    } catch {}
  };

  const logout = () => {
    setUser(null);
    try {
      window.localStorage.removeItem("nn_current_user");
    } catch {}
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
