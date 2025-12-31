"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export function LoginForm() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Check for error in URL on mount
  React.useEffect(() => {
    const urlError = searchParams.get("error");
    if (urlError === "CredentialsSignin") {
      setError("Invalid email or password. Please try again.");
    }
  }, [searchParams]);

  // Clear error when user starts typing
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError(null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) setError(null);
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: email.trim(),
        password: password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password. Please check your credentials and try again.");
        setIsLoading(false);
      } else if (result?.ok) {
        // Success - redirect to dashboard
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit} aria-label="Admin login form">
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-body-sm font-semibold text-primary-900"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={handleEmailChange}
          className="block w-full rounded-xl border border-ivy-200 bg-white px-4 py-3 text-body text-primary-900 shadow-soft outline-none ring-0 transition-all placeholder:text-primary-400 focus:border-ivy-500 focus:ring-2 focus:ring-ivy-500/20"
          placeholder="admin@ivyonaire.com"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-body-sm font-semibold text-primary-900"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={handlePasswordChange}
          className="block w-full rounded-xl border border-ivy-200 bg-white px-4 py-3 text-body text-primary-900 shadow-soft outline-none ring-0 transition-all placeholder:text-primary-400 focus:border-ivy-500 focus:ring-2 focus:ring-ivy-500/20"
          placeholder="Enter your password"
        />
      </div>

      {error && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 animate-in fade-in duration-200">
          <p className="text-body-sm text-rose-800 font-medium" role="alert">
            {error}
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="flex w-full items-center justify-center rounded-xl bg-ivy-900 px-6 py-3.5 text-body-sm font-semibold text-white shadow-soft-md transition-all hover:bg-ivy-800 hover:shadow-soft-lg focus:outline-none focus:ring-2 focus:ring-ivy-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isLoading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
