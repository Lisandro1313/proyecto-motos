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
  adminCredentials,
  defaultWorkerProfiles,
} from "@/lib/auth-defaults";
import type { ActiveWorker, WorkerProfile, WorkerRole } from "@/lib/types";

const ADMIN_SESSION_KEY = "motocenter-admin-session-v1";
const ACTIVE_PROFILE_KEY = "motocenter-active-profile-v1";
const WORKER_PROFILES_KEY = "motocenter-worker-profiles-v1";

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
};

type AuthContextValue = {
  ready: boolean;
  adminSession: AdminSession | null;
  activeProfile: ActiveWorker | null;
  profiles: WorkerProfile[];
  login: (email: string, password: string) => boolean;
  logout: () => void;
  selectProfile: (profileId: string, pin: string) => boolean;
  clearActiveProfile: () => void;
  addProfile: (profile: WorkerProfileInput) => void;
  toggleProfile: (profileId: string) => void;
  resetProfiles: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function makeId() {
  return `worker-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 7)}`;
}

function readJson<T>(key: string, fallback: T) {
  if (typeof window === "undefined") return fallback;

  const stored = window.localStorage.getItem(key);
  if (!stored) return fallback;

  try {
    return JSON.parse(stored) as T;
  } catch {
    return fallback;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);
  const [activeProfile, setActiveProfile] = useState<ActiveWorker | null>(null);
  const [profiles, setProfiles] =
    useState<WorkerProfile[]>(defaultWorkerProfiles);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setAdminSession(readJson<AdminSession | null>(ADMIN_SESSION_KEY, null));
      setActiveProfile(readJson<ActiveWorker | null>(ACTIVE_PROFILE_KEY, null));
      setProfiles(
        readJson<WorkerProfile[]>(WORKER_PROFILES_KEY, defaultWorkerProfiles),
      );
      setReady(true);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(WORKER_PROFILES_KEY, JSON.stringify(profiles));
  }, [profiles, ready]);

  const login = useCallback((email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const valid =
      normalizedEmail === adminCredentials.email &&
      password === adminCredentials.password;

    if (!valid) return false;

    const session = {
      email: normalizedEmail,
      loggedAt: new Date().toISOString(),
    };

    setAdminSession(session);
    window.localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
    return true;
  }, []);

  const logout = useCallback(() => {
    setAdminSession(null);
    setActiveProfile(null);
    window.localStorage.removeItem(ADMIN_SESSION_KEY);
    window.localStorage.removeItem(ACTIVE_PROFILE_KEY);
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
    setProfiles((currentProfiles) => [
      {
        id: makeId(),
        active: true,
        ...profile,
        pin: profile.pin.trim(),
      },
      ...currentProfiles,
    ]);
  }, []);

  const toggleProfile = useCallback((profileId: string) => {
    setProfiles((currentProfiles) =>
      currentProfiles.map((profile) =>
        profile.id === profileId
          ? { ...profile, active: !profile.active }
          : profile,
      ),
    );
  }, []);

  const resetProfiles = useCallback(() => {
    setProfiles(defaultWorkerProfiles);
    setActiveProfile(null);
    window.localStorage.setItem(
      WORKER_PROFILES_KEY,
      JSON.stringify(defaultWorkerProfiles),
    );
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
