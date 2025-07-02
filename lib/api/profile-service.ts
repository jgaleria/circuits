import { apiClient } from './client';
import type { Profile, ProfileUpdate } from '@/lib/types/profile';

export const profileService = {
  async getCurrentProfile(): Promise<Profile> {
    return apiClient.get<Profile>('/api/profiles/me');
  },

  async updateCurrentProfile(updates: ProfileUpdate): Promise<Profile> {
    return apiClient.put<Profile>('/api/profiles/me', updates);
  },
}; 