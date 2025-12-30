import Link from "next/link";
import { getServerAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@ivyonaire/db";
import { StudentList } from "@/components/students/StudentList";

export default async function StudentsPage() {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/login");
  }

  const students = await prisma.student.findMany({
    include: {
      ieltsProgress: true,
      satProgress: true,
      portfolioProjects: true,
      internationalAdmits: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Serialize Date objects to strings for client component
  const serializedStudents = students.map((student) => ({
    ...student,
    createdAt: student.createdAt.toISOString(),
    // Only include the fields that StudentList actually uses
    ieltsProgress: student.ieltsProgress.map((progress) => ({
      startScore: progress.startScore,
      currentScore: progress.currentScore,
      targetScore: progress.targetScore,
    })),
    satProgress: student.satProgress.map((progress) => ({
      type: progress.type,
      startScore: progress.startScore,
      currentScore: progress.currentScore,
      targetScore: progress.targetScore,
    })),
    portfolioProjects: student.portfolioProjects.map((project) => ({
      title: project.title,
      status: project.status,
    })),
    internationalAdmits: student.internationalAdmits.map((admit) => ({
      programName: admit.programName,
      country: admit.country,
      status: admit.status,
    })),
  }));

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-h2 font-serif font-bold text-primary-900 tracking-tight">
          Students
        </h2>
        <Link
          href="/students/new"
          className="px-6 py-3 bg-ivy-900 text-white rounded-xl hover:bg-ivy-800 transition-all duration-300 shadow-soft hover:shadow-soft-md font-semibold"
        >
          Add Student
        </Link>
      </div>
      <StudentList students={serializedStudents} />
    </div>
  );
}
