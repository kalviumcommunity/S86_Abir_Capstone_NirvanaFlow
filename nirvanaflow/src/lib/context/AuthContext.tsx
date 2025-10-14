"use client";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import axios from "axios";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  handleSignIn: () => Promise<void>;
  handleLogOut: () => Promise<void>;
};

const defaultValue: AuthContextType = {
  user: null,
  loading: true,
  error: null,
  handleSignIn: async () => {},
  handleLogOut: async () => {},
};

const AuthContext = createContext<AuthContextType>(defaultValue);

export default function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set persistence when auth is initialized
    setPersistence(auth, browserLocalPersistence);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);

      if (user) {
        const token = await user.getIdToken(true);
        document.cookie = `firebaseToken=${token}; path=/; max-age=31536000`; // Set cookie for 1 year
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      const signedInUser = result.user;
      

      await axios.post("/api/auth", {
        uid: signedInUser.uid,
        name: signedInUser.displayName,
        email: signedInUser.email,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
    setLoading(false);
  };

  const handleLogOut = async () => {
    setLoading(true);
    try {
      await signOut(auth);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
    setLoading(false);
  };

  
  return (
    
    <AuthContext.Provider
      value={{ user, loading, error, handleSignIn, handleLogOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  console.log(context);
  return context;
}
