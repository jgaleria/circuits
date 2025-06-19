"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Profile, ProfileError, ProfileUpdate } from "@/lib/types/profile";
import { getCurrentUserProfile, updateProfile } from "@/lib/supabase/profiles";
import { createClient } from "@/lib/supabase/client";

interface ProfileContextValue {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  updateProfileInContext: (updates: ProfileUpdate) => Promise<void>;
  setProfile: (profile: Profile | null) => void;
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getCurrentUserProfile().then((result) => {
      if (!isMounted) return;
      if ("display_name" in result) {
        setProfile(result);
        setError(null);
      } else {
        setProfile(null);
        setError(result.message);
      }
      setLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Listen for Supabase auth state changes and update profile context
  useEffect(() => {
    const supabase = createClient();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        getCurrentUserProfile().then((result) => {
          if ("display_name" in result) {
            setProfile(result);
            setError(null);
          } else {
            setProfile(null);
            setError(result.message);
          }
        });
      } else {
        setProfile(null);
      }
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  // Optimistic update function
  const updateProfileInContext = async (updates: ProfileUpdate) => {
    if (!profile) return;
    const prevProfile = { ...profile };
    setProfile({ ...profile, ...updates });
    setLoading(true);
    const result = await updateProfile(profile.id, updates);
    if ("display_name" in result) {
      setProfile(result);
      setError(null);
    } else {
      setProfile(prevProfile); // revert
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <ProfileContext.Provider value={{ profile, loading, error, updateProfileInContext, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
} 