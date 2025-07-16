"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { LogoutButton } from "./logout-button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useProfile } from "@/lib/contexts/profile-context";

export function AuthButton() {
  const { profile, loading } = useProfile();

  // Simulate user object for fallback (replace with actual user context if available)
  const userEmail = typeof window !== "undefined" ? window.localStorage.getItem("user_email") || "user@email.com" : "user@email.com";

  if (loading) {
    return <div className="text-circuits-dark-grey">Loading...</div>;
  }

  if (!profile) {
    return (
      <div className="flex gap-2">
        <Button asChild size="sm" variant={"outline"}>
          <Link href="/auth/login">Sign in</Link>
        </Button>
        <Button asChild size="sm" variant={"default"}>
          <Link href="/auth/sign-up">Sign up</Link>
        </Button>
      </div>
    );
  }

  const displayName = profile.display_name || userEmail;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-md bg-circuits-light-grey hover:bg-circuits-light-blue transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-circuits-dark-blue"
          aria-label="User menu"
        >
          {/* Avatar placeholder */}
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-circuits-medium-blue text-white font-bold">
            {displayName.charAt(0).toUpperCase()}
          </span>
          <span className="font-medium text-circuits-dark-blue">Hey, {displayName}!</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[180px]">
        <DropdownMenuItem asChild>
          <Link href="/profile">View Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <LogoutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
