import type { Metadata } from "next";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Student Progress - ${params.slug}`,
    description: "View student progress throughout the academic year",
  };
}

export default function StudentProfilePage({ params }: { params: { slug: string } }) {
  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
          Student Progress
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Profile: {params.slug}
        </p>
        <div className="space-y-4">
          <p className="text-gray-500">Progress tracking will be displayed here.</p>
        </div>
      </div>
    </main>
  );
}

