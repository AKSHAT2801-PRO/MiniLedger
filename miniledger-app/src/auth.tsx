import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { setApiPhone } from "./api";

const STORAGE_KEY = "miniledger.phone";

type AuthState = {
  phone: string | null;
  /** true while the saved login is being restored on app start */
  loading: boolean;
  signIn: (phone: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [phone, setPhone] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          setApiPhone(saved);
          setPhone(saved);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const signIn = useCallback(async (p: string) => {
    await AsyncStorage.setItem(STORAGE_KEY, p);
    setApiPhone(p);
    setPhone(p);
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setApiPhone(null);
    setPhone(null);
  }, []);

  const value = useMemo(
    () => ({ phone, loading, signIn, signOut }),
    [phone, loading, signIn, signOut]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
