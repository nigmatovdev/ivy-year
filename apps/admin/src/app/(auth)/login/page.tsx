import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/lib/auth";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  const session = await getServerAuthSession();

  if (session) {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-ivy-50 via-white to-ivy-50">
      <div className="w-full max-w-md px-4">
        <div className="mb-10 text-center">
          <h1 className="mb-3 text-h1 font-serif font-bold text-ivy-900 tracking-tight">
            Admin Login
          </h1>
          <p className="text-body text-primary-700">
            Sign in to access the Ivyonaire admin dashboard
          </p>
        </div>
        <div className="rounded-3xl border border-ivy-200 bg-white/90 p-10 shadow-soft-lg backdrop-blur-sm">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
