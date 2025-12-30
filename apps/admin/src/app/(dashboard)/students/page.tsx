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
      <StudentList students={students} />
    </div>
  );
}
