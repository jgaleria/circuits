import { createClient } from "@/lib/supabase/client";
import type { Profile, ProfileUpdate, ProfileError } from "@/lib/types/profile";
import { User } from "@supabase/supabase-js";

/**
 * Fetches a profile by user ID from the profiles table.
 */
export async function getProfile(userId: string): Promise<Profile | ProfileError> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_url, created_at, updated_at")
    .eq("id", userId)
    .single();
  if (error) {
    return { message: error.message };
  }
  return data as Profile;
}

/**
 * Updates a user's profile in the profiles table.
 */
export async function updateProfile(userId: string, updates: ProfileUpdate): Promise<Profile | ProfileError> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select("id, display_name, avatar_url, created_at, updated_at")
    .single();
  if (error) {
    return { message: error.message };
  }
  return data as Profile;
}

/**
 * Gets the current user's profile using Supabase Auth session.
 */
export async function getCurrentUserProfile(): Promise<Profile | ProfileError> {
  const supabase = createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return { message: userError?.message || "User not authenticated" };
  }
  return getProfile(user.id);
} 