import { getServerAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@ivyonaire/db";
import { StudentForm } from "@/components/students/StudentForm";
import { notFound } from "next/navigation";

export default async function EditStudentPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/login");
  }

  const student = await prisma.student.findUnique({
    where: { id: params.id },
    include: {
      ieltsProgress: true,
      satProgress: true,
      portfolioProjects: true,
      internationalAdmits: true,
    },
  });

  if (!student) {
    notFound();
  }

  // Transform data for form
  const ielts = student.ieltsProgress[0];
  const satEnglish = student.satProgress.find((p) => p.type === "ENGLISH");
  const satMath = student.satProgress.find((p) => p.type === "MATH");

  const initialData = {
    fullName: student.fullName,
    slug: student.slug,
    academicYear: student.academicYear,
    ieltsStartScore: (ielts?.startScore ?? "") as number | "",
    ieltsCurrentScore: (ielts?.currentScore ?? "") as number | "",
    ieltsTargetScore: (ielts?.targetScore ?? "") as number | "",
    satEnglishStartScore: (satEnglish?.startScore ?? "") as number | "",
    satEnglishCurrentScore: (satEnglish?.currentScore ?? "") as number | "",
    satEnglishTargetScore: (satEnglish?.targetScore ?? "") as number | "",
    satMathStartScore: (satMath?.startScore ?? "") as number | "",
    satMathCurrentScore: (satMath?.currentScore ?? "") as number | "",
    satMathTargetScore: (satMath?.targetScore ?? "") as number | "",
    portfolioProjects: student.portfolioProjects.map((p) => ({
      title: p.title,
      description: p.description,
      status: p.status as "PLANNED" | "IN_PROGRESS" | "COMPLETED",
    })),
    internationalAdmits: student.internationalAdmits.map((a) => ({
      programName: a.programName,
      country: a.country,
      status: a.status as "PENDING" | "OFFERED" | "ENROLLED" | "REJECTED",
    })),
  };

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <h2 className="text-h2 font-serif font-bold text-primary-900 mb-10 tracking-tight">
        Edit Student
      </h2>
      <div className="bg-white border border-ivy-200 rounded-3xl p-10 md:p-12 shadow-soft-lg">
        <StudentForm studentId={params.id} initialData={initialData} />
      </div>
    </div>
  );
}
