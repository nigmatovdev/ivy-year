import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-ivy-50 via-white to-ivy-50">
      <div className="container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-display-sm md:text-display font-serif font-bold text-ivy-900 mb-6 tracking-tight text-balance">
            Ivyonaire
          </h1>
          <p className="text-body-lg md:text-xl text-primary-700 mb-12 leading-relaxed">
            Premium Student Progress Tracking
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <p className="text-body text-primary-600">
              Track academic achievements throughout the year
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
