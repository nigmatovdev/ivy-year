import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@ivyonaire/db";
import { StudentProfile } from "@/components/StudentProfile";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  const student = await prisma.student.findUnique({
    where: { slug },
    select: {
      fullName: true,
      academicYear: true,
    },
  });

  if (!student) {
    return {
      title: "Student Not Found",
      description: "The requested student profile could not be found.",
    };
  }

  return {
    title: `${student.fullName} - Student Progress | Ivyonaire`,
    description: `View ${student.fullName}'s academic progress for ${student.academicYear}. Track IELTS scores, SAT progress, portfolio projects, and international admissions.`,
    openGraph: {
      title: `${student.fullName} - Student Progress`,
      description: `View ${student.fullName}'s academic progress for ${student.academicYear}.`,
      type: "profile",
    },
    twitter: {
      card: "summary",
      title: `${student.fullName} - Student Progress`,
      description: `View ${student.fullName}'s academic progress for ${student.academicYear}.`,
    },
  };
}

export default async function StudentProfilePage({ params }: Props) {
  const { slug } = await params;

  const student = await prisma.student.findUnique({
    where: { slug },
    include: {
      ieltsProgress: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      satProgress: {
        orderBy: { createdAt: "desc" },
      },
      portfolioProjects: {
        orderBy: { createdAt: "desc" },
      },
      internationalAdmits: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!student) {
    notFound();
  }

  return <StudentProfile student={student} />;
}

