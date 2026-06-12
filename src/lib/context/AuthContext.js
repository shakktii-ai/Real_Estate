"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const data = await res.json();
      setUser(data.user || null);
      return data.user || null;
    } catch (err) {
      console.error("auth/me fetch error", err);
      setUser(null);
      return null;
    }
  }, []);

  const refreshUser = useCallback(async () => {
    return fetchCurrentUser();
  }, [fetchCurrentUser]);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      await fetchCurrentUser();
      if (mounted) setLoading(false);
    };

    init();
    return () => {
      mounted = false;
    };
  }, [fetchCurrentUser]);

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);