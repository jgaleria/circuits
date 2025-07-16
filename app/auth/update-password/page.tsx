import MainLayout from "@/components/main-layout";
import { UpdatePasswordForm } from "@/components/update-password-form";

export default function Page() {
  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const token = searchParams?.get("access_token") || undefined;
  const type = searchParams?.get("type") || undefined;

  // Only show the form if this is a recovery link with a token
  const showForm = type === "recovery" && !!token;

  return (
    <MainLayout>
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          {showForm ? (
            <UpdatePasswordForm token={token} />
          ) : (
            <div className="text-center text-lg text-circuits-dark-grey">Invalid or expired password reset link.</div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
