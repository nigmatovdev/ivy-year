"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

export function LoginForm() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: email.trim(),
        password: password,
        redirect: false,
      });

      if (result?.error) {
        // Redirect to login page with error
        window.location.href = "/login?error=CredentialsSignin";
      } else if (result?.ok) {
        // Success - redirect to dashboard
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Login error:", error);
      window.location.href = "/login?error=CredentialsSignin";
    } finally {
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
          onChange={(e) => setEmail(e.target.value)}
          className="block w-full rounded-xl border border-ivy-200 bg-white px-4 py-3 text-body text-primary-900 shadow-soft outline-none ring-0 transition-all placeholder:text-primary-400 focus:border-ivy-500 focus:ring-2 focus:ring-ivy-500/20"
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
          onChange={(e) => setPassword(e.target.value)}
          className="block w-full rounded-xl border border-ivy-200 bg-white px-4 py-3 text-body text-primary-900 shadow-soft outline-none ring-0 transition-all placeholder:text-primary-400 focus:border-ivy-500 focus:ring-2 focus:ring-ivy-500/20"
        />
      </div>

      {error && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-4">
          <p className="text-body-sm text-rose-800 font-medium" role="alert">
            Invalid credentials. Please try again.
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
