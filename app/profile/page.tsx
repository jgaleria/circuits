"use client";

import { useProfile } from "@/lib/contexts/profile-context";
import ProfileForm from "@/components/profile-form";
import MainLayout from "@/components/main-layout";

export default function ProfilePage() {
  const { profile, loading } = useProfile();
  const displayName = profile?.display_name;

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <div className="w-full max-w-md bg-white rounded shadow p-6 flex flex-col gap-6">
          <h1 className="text-2xl font-bold text-circuits-dark-blue mb-2">Profile</h1>
          <div className="mb-4">
            <span className="font-medium">Current display name:</span>{" "}
            <span>
              {loading
                ? <span className="italic text-circuits-dark-grey">Loading...</span>
                : displayName
                  ? displayName
                  : <span className="italic text-circuits-dark-grey">Not set</span>
              }
            </span>
          </div>
          <ProfileForm initialDisplayName={displayName || ""} />
        </div>
      </div>
    </MainLayout>
  );
} 