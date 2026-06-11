"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db, hasFirebaseConfig } from "@/lib/firebase";
import { defaultWorkerProfiles } from "@/lib/auth-defaults";
import type { ActiveWorker, WorkerProfile, WorkerRole } from "@/lib/types";

const ACTIVE_PROFILE_KEY = "re-motos-active-profile-v1";

type AdminSession = {
  email: string;
  loggedAt: string;
};

type WorkerProfileInput = {
  name: string;
  role: WorkerRole;
  branch: string;
  pin: string;
  color: string;
  photo?: string;
};

type WorkerProfileUpdate = Partial<
  Pick<WorkerProfile, "name" | "role" | "branch" | "pin" | "color" | "photo">
> & {
  active?: boolean;
};

type AuthContextValue = {
  ready: boolean;
  adminSession: AdminSession | null;
  activeProfile: ActiveWorker | null;
  profiles: WorkerProfile[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  selectProfile: (profileId: string, pin: string) => boolean;
  clearActiveProfile: () => void;
  addProfile: (profile: WorkerProfileInput) => void;
  updateProfile: (profileId: string, profile: WorkerProfileUpdate) => void;
  toggleProfile: (profileId: string) => void;
  resetProfiles: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function readActiveProfile(): ActiveWorker | null {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(ACTIVE_PROFILE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as ActiveWorker;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(!hasFirebaseConfig);
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);
  const [activeProfile, setActiveProfile] = useState<ActiveWorker | null>(null);
  const [profiles, setProfiles] = useState<WorkerProfile[]>([]);

  // Sesión del admin (Firebase Auth).
  useEffect(() => {
    if (!hasFirebaseConfig) return;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAdminSession({
          email: user.email || "",
          loggedAt:
            user.metadata.lastSignInTime || new Date().toISOString(),
        });
        setActiveProfile(readActiveProfile());
      } else {
        setAdminSession(null);
        setActiveProfile(null);
        setProfiles([]);
      }
      setReady(true);
    });

    return () => unsubscribe();
  }, []);

  // Perfiles de trabajo (Firestore) — solo cuando hay sesión admin.
  useEffect(() => {
    if (!hasFirebaseConfig || !adminSession) return;

    const unsubscribe = onSnapshot(
      collection(db, "worker_profiles"),
      (snap) => {
        setProfiles(
          snap.docs.map((d) => ({ ...d.data(), id: d.id }) as WorkerProfile),
        );
      },
    );

    return () => unsubscribe();
  }, [adminSession]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(
        auth,
        email.trim().toLowerCase(),
        password,
      );
      return true;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setActiveProfile(null);
    window.localStorage.removeItem(ACTIVE_PROFILE_KEY);
    void signOut(auth);
  }, []);

  const selectProfile = useCallback(
    (profileId: string, pin: string) => {
      const profile = profiles.find(
        (candidate) => candidate.id === profileId && candidate.active,
      );
      if (!profile || profile.pin !== pin.trim()) return false;

      const activeWorker: ActiveWorker = {
        id: profile.id,
        name: profile.name,
        role: profile.role,
        branch: profile.branch,
        color: profile.color,
        photo: profile.photo,
        active: profile.active,
        startedAt: new Date().toISOString(),
      };

      setActiveProfile(activeWorker);
      window.localStorage.setItem(
        ACTIVE_PROFILE_KEY,
        JSON.stringify(activeWorker),
      );
      return true;
    },
    [profiles],
  );

  const clearActiveProfile = useCallback(() => {
    setActiveProfile(null);
    window.localStorage.removeItem(ACTIVE_PROFILE_KEY);
  }, []);

  const addProfile = useCallback((profile: WorkerProfileInput) => {
    void addDoc(collection(db, "worker_profiles"), {
      ...profile,
      pin: profile.pin.trim(),
      active: true,
    });
  }, []);

  const updateProfile = useCallback(
    (profileId: string, profile: WorkerProfileUpdate) => {
      const current = profiles.find((candidate) => candidate.id === profileId);
      const updates: Record<string, unknown> = { ...profile };
      if (profile.pin !== undefined) {
        updates.pin = profile.pin.trim() || current?.pin || "";
      }
      void updateDoc(doc(db, "worker_profiles", profileId), updates);

      setActiveProfile((prev) => {
        if (!prev || prev.id !== profileId) return prev;
        const next = {
          ...prev,
          name: profile.name ?? prev.name,
          role: profile.role ?? prev.role,
          branch: profile.branch ?? prev.branch,
          color: profile.color ?? prev.color,
          photo: profile.photo ?? prev.photo,
        };
        window.localStorage.setItem(ACTIVE_PROFILE_KEY, JSON.stringify(next));
        return next;
      });
    },
    [profiles],
  );

  const toggleProfile = useCallback(
    (profileId: string) => {
      const current = profiles.find((candidate) => candidate.id === profileId);
      if (!current) return;
      void updateDoc(doc(db, "worker_profiles", profileId), {
        active: !current.active,
      });
    },
    [profiles],
  );

  const resetProfiles = useCallback(() => {
    for (const profile of defaultWorkerProfiles) {
      void setDoc(doc(db, "worker_profiles", profile.id), profile);
    }
    setActiveProfile(null);
    window.localStorage.removeItem(ACTIVE_PROFILE_KEY);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ready,
      adminSession,
      activeProfile,
      profiles,
      login,
      logout,
      selectProfile,
      clearActiveProfile,
      addProfile,
      updateProfile,
      toggleProfile,
      resetProfiles,
    }),
    [
      ready,
      adminSession,
      activeProfile,
      profiles,
      login,
      logout,
      selectProfile,
      clearActiveProfile,
      addProfile,
      updateProfile,
      toggleProfile,
      resetProfiles,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider.");
  }

  return context;
}
