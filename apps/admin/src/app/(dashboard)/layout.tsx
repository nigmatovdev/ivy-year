import { redirect } from "next/navigation";

// This layout will protect dashboard routes
// Authentication check will be implemented here
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Add authentication check
  // const session = await getServerSession();
  // if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-serif font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <div className="text-sm text-gray-600">
              {/* User menu will go here */}
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}

