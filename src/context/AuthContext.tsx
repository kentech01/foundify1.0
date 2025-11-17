/* eslint-disable no-useless-catch */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { useContext, createContext, useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  type User,
} from "firebase/auth";
import { auth } from "../../firebase";

import type { ReactNode } from "react";

interface AuthContextType {
  googleSignIn: () => Promise<void>;
  facebookSignIn: () => Promise<void>;
  emailSignUp: (email: string, password: string, name: string) => Promise<void>;
  emailSignIn: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
  user: User | null;
  loading: boolean;
  accessToken: string | null;
}

const AuthContext = createContext<AuthContextType>({
  googleSignIn: async () => {},
  facebookSignIn: async () => {},
  emailSignUp: async () => {},
  emailSignIn: async () => {},
  logOut: async () => {},
  user: null,
  loading: false,
  accessToken: null,
});

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  console.log(user, "kkkkkkk");

  const googleSignIn = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: "select_account",
    });
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      if (error.code === "auth/popup-closed-by-user") {
        console.warn("Popup closed by user.");
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const facebookSignIn = async () => {
    setLoading(true);
    const provider = new FacebookAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      if (error.code === "auth/popup-closed-by-user") {
        console.warn("Popup closed by user.");
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const emailSignUp = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Update the user's display name
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName: name });
      }
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        throw new Error("This email is already registered.");
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const emailSignIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      if (
        error.code === "auth/wrong-password" ||
        error.code === "auth/user-not-found"
      ) {
        throw new Error("Invalid email or password.");
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    setLoading(true);
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const token = await currentUser.getIdToken();
        setAccessToken(token);
      } else {
        setAccessToken(null);
      }
      setLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        googleSignIn,
        facebookSignIn,
        emailSignUp,
        emailSignIn,
        logOut,
        user,
        loading,
        accessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
