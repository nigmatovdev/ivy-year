"use client";

import * as React from "react";
import { signOut } from "next-auth/react";

export function LogoutButton() {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut({ callbackUrl: "/login" });
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="px-4 py-2 text-body-sm font-semibold text-primary-700 hover:text-ivy-900 border border-ivy-200 rounded-xl hover:border-ivy-300 hover:bg-ivy-50 transition-all duration-300 shadow-soft hover:shadow-soft-md disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? "Logging out..." : "Logout"}
    </button>
  );
}

