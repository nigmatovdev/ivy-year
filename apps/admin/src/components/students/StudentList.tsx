"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Student = {
  id: string;
  fullName: string;
  slug: string;
  academicYear: string;
  createdAt: string;
  ieltsProgress: Array<{
    startScore: number;
    currentScore: number;
    targetScore: number;
  }>;
  satProgress: Array<{
    type: string;
    startScore: number;
    currentScore: number;
    targetScore: number;
  }>;
  portfolioProjects: Array<{
    title: string;
    status: string;
  }>;
  internationalAdmits: Array<{
    programName: string;
    country: string;
    status: string;
  }>;
};

type StudentListProps = {
  students: Student[];
};

export function StudentList({ students }: StudentListProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(id);

    try {
      const response = await fetch(`/api/students/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete student");
      }

      router.refresh();
    } catch (error) {
      alert("Failed to delete student. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  if (students.length === 0) {
    return (
      <div className="bg-white border border-ivy-200 rounded-2xl p-16 text-center shadow-soft">
        <p className="text-body text-primary-600 mb-6">No students yet.</p>
        <Link
          href="/students/new"
          className="inline-block text-body-sm font-semibold text-ivy-700 hover:text-ivy-900 underline transition-colors"
        >
          Create your first student
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white border border-ivy-200 rounded-2xl overflow-hidden shadow-soft-lg">
      <table className="w-full">
        <thead className="bg-ivy-50 border-b border-ivy-200">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-primary-700 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-primary-700 uppercase tracking-wider">
              Slug
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-primary-700 uppercase tracking-wider">
              Academic Year
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-primary-700 uppercase tracking-wider">
              Progress
            </th>
            <th className="px-6 py-4 text-right text-xs font-semibold text-primary-700 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-ivy-100">
          {students.map((student) => (
            <tr key={student.id} className="hover:bg-ivy-50/50 transition-colors">
              <td className="px-6 py-5 whitespace-nowrap">
                <div className="text-body font-semibold text-primary-900">
                  {student.fullName}
                </div>
              </td>
              <td className="px-6 py-5 whitespace-nowrap">
                <div className="text-body-sm text-primary-600 font-mono">
                  {student.slug}
                </div>
              </td>
              <td className="px-6 py-5 whitespace-nowrap">
                <div className="text-body text-primary-700">{student.academicYear}</div>
              </td>
              <td className="px-6 py-5 whitespace-nowrap">
                <div className="text-body-sm text-primary-600">
                  {student.ieltsProgress.length > 0 && "IELTS "}
                  {student.satProgress.length > 0 && "SAT "}
                  {student.portfolioProjects.length > 0 && `${student.portfolioProjects.length} Projects `}
                  {student.internationalAdmits.length > 0 && `${student.internationalAdmits.length} Admits`}
                </div>
              </td>
              <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end gap-4">
                  <Link
                    href={`/students/${student.id}/edit`}
                    className="text-ivy-700 hover:text-ivy-900 font-semibold transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(student.id, student.fullName)}
                    disabled={deletingId === student.id}
                    className="text-rose-600 hover:text-rose-800 disabled:opacity-50 font-semibold transition-colors"
                  >
                    {deletingId === student.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
