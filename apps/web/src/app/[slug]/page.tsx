import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@ivyonaire/db";
import { StudentProfile } from "@/components/StudentProfile";

type Props = {
  params: Promise<{ slug: string }>;
};

const siteUrl = process.env.NEXT_PUBLIC_WEB_URL || "https://ivyonaire.com";

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
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${student.fullName} - Student Progress | Ivyonaire`;
  const description = `View ${student.fullName}'s academic progress for ${student.academicYear}. Track IELTS scores, SAT progress, portfolio projects, and international admissions.`;
  const url = `${siteUrl}/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${student.fullName} - Student Progress`,
      description,
      url,
      type: "profile",
      siteName: "Ivyonaire",
      images: [
        {
          url: `${siteUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: `${student.fullName} - Student Progress`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${student.fullName} - Student Progress`,
      description,
      images: [`${siteUrl}/og-image.png`],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function StudentProfilePage({ params }: Props) {
  const { slug } = await params;

  const student = await prisma.student.findUnique({
    where: { slug },
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

  return <StudentProfile student={student} />;
}
