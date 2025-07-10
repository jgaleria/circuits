"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import type { Profile, ProfileError, ProfileUpdate } from "@/lib/types/profile";
import { profileService } from "@/lib/api/profile-service";

interface ProfileContextValue {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  updateProfileInContext: (updates: ProfileUpdate) => Promise<void>;
  setProfile: (profile: Profile | null) => void;
  reloadProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const result = await profileService.getCurrentProfile();
      setProfile(result);
      setError(null);
    } catch (err: unknown) {
      setProfile(null);
      if (err instanceof Error) setError(err.message || "Failed to fetch profile");
      else setError("Failed to fetch profile");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Optimistic update function
  const updateProfileInContext = async (updates: ProfileUpdate) => {
    if (!profile) return;
    const prevProfile = { ...profile };
    setProfile({ ...profile, ...updates });
    setLoading(true);
    try {
      const result = await profileService.updateCurrentProfile(updates);
      setProfile(result);
      setError(null);
    } catch (err: unknown) {
      setProfile(prevProfile); // revert
      if (err instanceof Error) setError(err.message || "Failed to update profile");
      else setError("Failed to update profile");
    }
    setLoading(false);
  };

  // Expose a reloadProfile method for UI to refresh after login/logout
  const reloadProfile = fetchProfile;

  return (
    <ProfileContext.Provider value={{ profile, loading, error, updateProfileInContext, setProfile, reloadProfile }}>
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