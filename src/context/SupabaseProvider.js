"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { supabase } from "@/lib/supabaseClient";

const SupabaseContext = createContext(null);

export function SupabaseProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // Initial session fetch
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (!error && isMounted) {
        setSession(data.session);
      }

      setLoading(false);
    };

    getSession();

    // Auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (isMounted) {
          setSession(session);
        }
      }
    );

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      supabase,
      session,
      loading,
      isAuthenticated: !!session,
      user: session?.user ?? null,
    }),
    [session, loading]
  );

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const context = useContext(SupabaseContext);

  if (!context) {
    throw new Error(
      "useSupabase must be used within a SupabaseProvider"
    );
  }

  return context;
}
