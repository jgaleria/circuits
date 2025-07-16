"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/api/auth-service";
import { FetchDataSteps } from "@/components/tutorial/fetch-data-steps";
import { InfoIcon } from "lucide-react";

// Define a User type based on expected user object shape
interface User {
  id: string;
  email: string;
  // Add other fields as needed
}

export default function ProtectedPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    authService.getCurrentUser()
      .then((res => {
        const typedRes = res as { user: User };
        setUser(typedRes.user);
        setLoading(false);
      }))
      .catch(() => {
        router.push("/auth/login");
      });
  }, [router]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          This is a protected page that you can only see as an authenticated user
        </div>
      </div>
      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">Your user details</h2>
        <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
      <div>
        <h2 className="font-bold text-2xl mb-4">Next steps</h2>
        <FetchDataSteps />
      </div>
    </div>
  );
}
