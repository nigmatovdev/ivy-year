import { getServerAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { StudentForm } from "@/components/students/StudentForm";

export default async function NewStudentPage() {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <h2 className="text-h2 font-serif font-bold text-primary-900 mb-10 tracking-tight">
        Create New Student
      </h2>
      <div className="bg-white border border-ivy-200 rounded-3xl p-10 md:p-12 shadow-soft-lg">
        <StudentForm />
      </div>
    </div>
  );
}
