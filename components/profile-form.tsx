"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormInputGroup } from "@/components/form-input-group";
import type { ProfileUpdate } from "@/lib/types/profile";
import { useProfile } from "@/lib/contexts/profile-context";

interface ProfileFormProps {
  initialDisplayName: string;
}

export default function ProfileForm({ initialDisplayName }: ProfileFormProps): JSX.Element {
  const { profile, updateProfileInContext, loading } = useProfile();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue } = useForm<ProfileUpdate>({
    defaultValues: { display_name: initialDisplayName },
  });
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: ProfileUpdate, e?: React.BaseSyntheticEvent) => {
    setSuccess(null);
    setError(null);
    if (!profile) {
      setError("User not authenticated");
      return;
    }
    const prevName = profile.display_name;
    setValue("display_name", data.display_name || ""); // Optimistic update
    try {
      await updateProfileInContext({ display_name: data.display_name });
      setSuccess("Profile updated successfully!");
      reset({ display_name: data.display_name });
    } catch (err) {
      setError((err as Error).message);
      setValue("display_name", prevName || ""); // Revert on failure
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <FormInputGroup
        id="display_name"
        label="Display Name"
        type="text"
        {...register("display_name", {
          required: "Display name is required",
          minLength: { value: 2, message: "Must be at least 2 characters" },
          maxLength: { value: 50, message: "Must be at most 50 characters" },
        })}
        error={errors.display_name?.message}
      />
      <Button type="submit" className="w-full" disabled={isSubmitting || loading}>
        {(isSubmitting || loading) ? "Saving..." : "Save"}
      </Button>
      {success && <p className="text-green-600 text-sm text-center">{success}</p>}
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
    </form>
  );
} 