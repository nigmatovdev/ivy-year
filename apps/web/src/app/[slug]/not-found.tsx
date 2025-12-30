import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
          404
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Student profile not found
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </main>
  );
}

