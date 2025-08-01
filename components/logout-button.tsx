"use client";

import { Button } from "@/components/ui/button";
import { authService } from "@/lib/api/auth-service";
import { useProfile } from "@/lib/contexts/profile-context";

export function LogoutButton() {
  const { setProfile } = useProfile();

  const handleLogout = async () => {
    try {
      await authService.logout();
      setProfile(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return <Button onClick={handleLogout}>Logout</Button>;
}
