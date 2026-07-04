import { LoginForm } from "@/components/auth/login-form";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4">
      <LoginForm searchParams={searchParams} />
    </main>
  );
}
