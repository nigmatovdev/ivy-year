import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/lib/auth";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-ivy-50 via-white to-ivy-50">
      <nav className="border-b border-ivy-200 bg-white/90 backdrop-blur-sm sticky top-0 z-50 shadow-soft">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <Link href="/" className="group">
              <h1 className="text-2xl font-serif font-bold text-ivy-900 tracking-tight group-hover:text-ivy-800 transition-colors">
                Admin Dashboard
              </h1>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-body-sm text-primary-600">
                {session.user?.email}
              </span>
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}
