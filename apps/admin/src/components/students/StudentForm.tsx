"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { generateSlugFromNameAndYear } from "@/lib/utils";

type PortfolioProject = {
  title: string;
  description: string;
  status: "PLANNED" | "IN_PROGRESS" | "COMPLETED";
};

type InternationalAdmit = {
  programName: string;
  country: string;
  status: "PENDING" | "OFFERED" | "ENROLLED" | "REJECTED";
};

type StudentFormData = {
  fullName: string;
  slug: string;
  academicYear: string;
  ieltsStartScore: number | "";
  ieltsCurrentScore: number | "";
  ieltsTargetScore: number | "";
  satEnglishStartScore: number | "";
  satEnglishCurrentScore: number | "";
  satEnglishTargetScore: number | "";
  satMathStartScore: number | "";
  satMathCurrentScore: number | "";
  satMathTargetScore: number | "";
  portfolioProjects: PortfolioProject[];
  internationalAdmits: InternationalAdmit[];
};

type StudentFormProps = {
  studentId?: string;
  initialData?: Partial<StudentFormData>;
  onSuccess?: () => void;
};

export function StudentForm({ studentId, initialData, onSuccess }: StudentFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [autoGenerateSlug, setAutoGenerateSlug] = React.useState(true);
  const [slugChecking, setSlugChecking] = React.useState(false);
  const [slugAvailable, setSlugAvailable] = React.useState<boolean | null>(null);

  const [formData, setFormData] = React.useState<StudentFormData>({
    fullName: initialData?.fullName || "",
    slug: initialData?.slug || "",
    academicYear: initialData?.academicYear || "",
    ieltsStartScore: initialData?.ieltsStartScore ?? "",
    ieltsCurrentScore: initialData?.ieltsCurrentScore ?? "",
    ieltsTargetScore: initialData?.ieltsTargetScore ?? "",
    satEnglishStartScore: initialData?.satEnglishStartScore ?? "",
    satEnglishCurrentScore: initialData?.satEnglishCurrentScore ?? "",
    satEnglishTargetScore: initialData?.satEnglishTargetScore ?? "",
    satMathStartScore: initialData?.satMathStartScore ?? "",
    satMathCurrentScore: initialData?.satMathCurrentScore ?? "",
    satMathTargetScore: initialData?.satMathTargetScore ?? "",
    portfolioProjects: initialData?.portfolioProjects || [],
    internationalAdmits: initialData?.internationalAdmits || [],
  });

  // Check slug availability
  const checkSlugAvailability = React.useCallback(
    async (fullName: string, academicYear: string, slug: string) => {
      if (!fullName.trim() || !academicYear.trim() || !slug.trim()) {
        setSlugAvailable(null);
        return;
      }

      setSlugChecking(true);
      try {
        const response = await fetch("/api/students/check-slug", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName,
            academicYear,
            excludeId: studentId,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          setSlugAvailable(data.slug === slug);
          // Update slug if server generated a different one
          if (data.slug !== slug && autoGenerateSlug) {
            setFormData((prev) => ({ ...prev, slug: data.slug }));
          }
        } else {
          setSlugAvailable(null);
        }
      } catch (error) {
        setSlugAvailable(null);
      } finally {
        setSlugChecking(false);
      }
    },
    [studentId, autoGenerateSlug]
  );

  // Auto-generate slug when fullName or academicYear changes
  React.useEffect(() => {
    if (autoGenerateSlug && formData.fullName && formData.academicYear) {
      const generated = generateSlugFromNameAndYear(
        formData.fullName,
        formData.academicYear
      );
      setFormData((prev) => ({ ...prev, slug: generated }));
    }
  }, [formData.fullName, formData.academicYear, autoGenerateSlug]);

  // Check slug availability when slug changes (debounced)
  React.useEffect(() => {
    if (!formData.slug.trim() || !formData.fullName.trim() || !formData.academicYear.trim()) {
      return;
    }

    const timeoutId = setTimeout(() => {
      checkSlugAvailability(formData.fullName, formData.academicYear, formData.slug);
    }, 500); // Debounce for 500ms

    return () => clearTimeout(timeoutId);
  }, [formData.slug, formData.fullName, formData.academicYear, checkSlugAvailability]);

  const handleChange = (field: keyof StudentFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleAddPortfolioProject = () => {
    setFormData((prev) => ({
      ...prev,
      portfolioProjects: [
        ...prev.portfolioProjects,
        { title: "", description: "", status: "PLANNED" },
      ],
    }));
  };

  const handleRemovePortfolioProject = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      portfolioProjects: prev.portfolioProjects.filter((_, i) => i !== index),
    }));
  };

  const handleUpdatePortfolioProject = (index: number, field: keyof PortfolioProject, value: string) => {
    setFormData((prev) => ({
      ...prev,
      portfolioProjects: prev.portfolioProjects.map((project, i) =>
        i === index ? { ...project, [field]: value } : project
      ),
    }));
  };

  const handleAddInternationalAdmit = () => {
    setFormData((prev) => ({
      ...prev,
      internationalAdmits: [
        ...prev.internationalAdmits,
        { programName: "", country: "", status: "PENDING" },
      ],
    }));
  };

  const handleRemoveInternationalAdmit = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      internationalAdmits: prev.internationalAdmits.filter((_, i) => i !== index),
    }));
  };

  const handleUpdateInternationalAdmit = (index: number, field: keyof InternationalAdmit, value: string) => {
    setFormData((prev) => ({
      ...prev,
      internationalAdmits: prev.internationalAdmits.map((admit, i) =>
        i === index ? { ...admit, [field]: value } : admit
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Validation
      if (!formData.fullName.trim()) {
        throw new Error("Full name is required");
      }
      if (!formData.slug.trim()) {
        throw new Error("Slug is required");
      }
      if (!formData.academicYear.trim()) {
        throw new Error("Academic year is required");
      }

      const payload = {
        fullName: formData.fullName.trim(),
        slug: formData.slug.trim(),
        academicYear: formData.academicYear.trim(),
        ieltsStartScore: formData.ieltsStartScore === "" ? undefined : Number(formData.ieltsStartScore),
        ieltsCurrentScore: formData.ieltsCurrentScore === "" ? undefined : Number(formData.ieltsCurrentScore),
        ieltsTargetScore: formData.ieltsTargetScore === "" ? undefined : Number(formData.ieltsTargetScore),
        satEnglishStartScore: formData.satEnglishStartScore === "" ? undefined : Number(formData.satEnglishStartScore),
        satEnglishCurrentScore: formData.satEnglishCurrentScore === "" ? undefined : Number(formData.satEnglishCurrentScore),
        satEnglishTargetScore: formData.satEnglishTargetScore === "" ? undefined : Number(formData.satEnglishTargetScore),
        satMathStartScore: formData.satMathStartScore === "" ? undefined : Number(formData.satMathStartScore),
        satMathCurrentScore: formData.satMathCurrentScore === "" ? undefined : Number(formData.satMathCurrentScore),
        satMathTargetScore: formData.satMathTargetScore === "" ? undefined : Number(formData.satMathTargetScore),
        portfolioProjects: formData.portfolioProjects.filter((p) => p.title.trim()),
        internationalAdmits: formData.internationalAdmits.filter((a) => a.programName.trim()),
      };

      const url = studentId ? `/api/students/${studentId}` : "/api/students";
      const method = studentId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save student");
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/students");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 shadow-soft">
          <p className="text-body-sm text-rose-800 font-medium">{error}</p>
        </div>
      )}

      {/* Basic Information */}
      <div className="space-y-6">
        <h3 className="text-h4 font-semibold text-primary-900 tracking-tight">Basic Information</h3>
        
        <div>
          <label htmlFor="fullName" className="block text-body-sm font-semibold text-primary-900 mb-2">
            Full Name *
          </label>
          <input
            id="fullName"
            type="text"
            required
            value={formData.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            className="w-full rounded-xl border border-ivy-200 bg-white px-4 py-3 text-body text-primary-900 shadow-soft focus:border-ivy-500 focus:ring-2 focus:ring-ivy-500/20 transition-all"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="slug" className="block text-body-sm font-semibold text-primary-900">
              Slug *
            </label>
            <label className="flex items-center gap-2 text-body-sm text-primary-600">
              <input
                type="checkbox"
                checked={autoGenerateSlug}
                onChange={(e) => {
                  setAutoGenerateSlug(e.target.checked);
                  if (e.target.checked && formData.fullName && formData.academicYear) {
                    const generated = generateSlugFromNameAndYear(
                      formData.fullName,
                      formData.academicYear
                    );
                    handleChange("slug", generated);
                  }
                }}
                className="rounded border-ivy-300 text-ivy-600 focus:ring-ivy-500"
              />
              Auto-generate
            </label>
          </div>
          <div className="relative">
            <input
              id="slug"
              type="text"
              required
              value={formData.slug}
              onChange={(e) => {
                setAutoGenerateSlug(false);
                handleChange("slug", e.target.value);
              }}
              className={`w-full rounded-xl border ${
                slugAvailable === false
                  ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/20"
                  : slugAvailable === true
                  ? "border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500/20"
                  : "border-ivy-200 focus:border-ivy-500 focus:ring-ivy-500/20"
              } bg-white px-4 py-3 text-body text-primary-900 shadow-soft focus:ring-2 font-mono pr-12 transition-all`}
            />
            {slugChecking && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-ivy-300 border-t-ivy-700 rounded-full animate-spin" />
              </div>
            )}
            {!slugChecking && slugAvailable !== null && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                {slugAvailable ? (
                  <svg
                    className="w-5 h-5 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5 text-rose-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </div>
            )}
          </div>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-body-sm text-primary-600">
              Preview: /{formData.slug || "slug-will-appear-here"}
            </p>
            {slugAvailable === false && (
              <p className="text-body-sm text-rose-700 font-medium">
                This slug is already taken. A unique version will be generated.
              </p>
            )}
            {slugAvailable === true && (
              <p className="text-body-sm text-emerald-700 font-medium">Slug is available</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="academicYear" className="block text-sm font-medium text-gray-700 mb-1">
            Academic Year *
          </label>
          <input
            id="academicYear"
            type="text"
            required
            placeholder="e.g., 2024-2025"
            value={formData.academicYear}
            onChange={(e) => handleChange("academicYear", e.target.value)}
            className="w-full rounded-xl border border-ivy-200 bg-white px-4 py-3 text-body text-primary-900 shadow-soft focus:border-ivy-500 focus:ring-2 focus:ring-ivy-500/20 transition-all"
          />
        </div>
      </div>

      {/* IELTS Progress */}
      <div className="space-y-6">
        <h3 className="text-h4 font-semibold text-primary-900 tracking-tight">IELTS Progress</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="ieltsStart" className="block text-sm font-medium text-gray-700 mb-1">
              Start Score
            </label>
            <input
              id="ieltsStart"
              type="number"
              min="0"
              max="9"
              step="0.5"
              value={formData.ieltsStartScore}
              onChange={(e) => handleChange("ieltsStartScore", e.target.value ? parseFloat(e.target.value) : "")}
              className="w-full rounded-xl border border-ivy-200 bg-white px-4 py-3 text-body text-primary-900 shadow-soft focus:border-ivy-500 focus:ring-2 focus:ring-ivy-500/20 transition-all"
            />
          </div>
          <div>
            <label htmlFor="ieltsCurrent" className="block text-sm font-medium text-gray-700 mb-1">
              Current Score
            </label>
            <input
              id="ieltsCurrent"
              type="number"
              min="0"
              max="9"
              step="0.5"
              value={formData.ieltsCurrentScore}
              onChange={(e) => handleChange("ieltsCurrentScore", e.target.value ? parseFloat(e.target.value) : "")}
              className="w-full rounded-xl border border-ivy-200 bg-white px-4 py-3 text-body text-primary-900 shadow-soft focus:border-ivy-500 focus:ring-2 focus:ring-ivy-500/20 transition-all"
            />
          </div>
          <div>
            <label htmlFor="ieltsTarget" className="block text-sm font-medium text-gray-700 mb-1">
              Target Score
            </label>
            <input
              id="ieltsTarget"
              type="number"
              min="0"
              max="9"
              step="0.5"
              value={formData.ieltsTargetScore}
              onChange={(e) => handleChange("ieltsTargetScore", e.target.value ? parseFloat(e.target.value) : "")}
              className="w-full rounded-xl border border-ivy-200 bg-white px-4 py-3 text-body text-primary-900 shadow-soft focus:border-ivy-500 focus:ring-2 focus:ring-ivy-500/20 transition-all"
            />
          </div>
        </div>
      </div>

      {/* SAT Progress */}
      <div className="space-y-6">
        <h3 className="text-h4 font-semibold text-primary-900 tracking-tight">SAT Progress</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-body-sm font-semibold text-primary-900 mb-4">English</h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="satEnglishStart" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Score
                </label>
                <input
                  id="satEnglishStart"
                  type="number"
                  min="200"
                  max="800"
                  value={formData.satEnglishStartScore}
                  onChange={(e) => handleChange("satEnglishStartScore", e.target.value ? parseInt(e.target.value) : "")}
                  className="w-full rounded-xl border border-ivy-200 bg-white px-4 py-3 text-body text-primary-900 shadow-soft focus:border-ivy-500 focus:ring-2 focus:ring-ivy-500/20 transition-all"
                />
              </div>
              <div>
                <label htmlFor="satEnglishCurrent" className="block text-sm font-medium text-gray-700 mb-1">
                  Current Score
                </label>
                <input
                  id="satEnglishCurrent"
                  type="number"
                  min="200"
                  max="800"
                  value={formData.satEnglishCurrentScore}
                  onChange={(e) => handleChange("satEnglishCurrentScore", e.target.value ? parseInt(e.target.value) : "")}
                  className="w-full rounded-xl border border-ivy-200 bg-white px-4 py-3 text-body text-primary-900 shadow-soft focus:border-ivy-500 focus:ring-2 focus:ring-ivy-500/20 transition-all"
                />
              </div>
              <div>
                <label htmlFor="satEnglishTarget" className="block text-sm font-medium text-gray-700 mb-1">
                  Target Score
                </label>
                <input
                  id="satEnglishTarget"
                  type="number"
                  min="200"
                  max="800"
                  value={formData.satEnglishTargetScore}
                  onChange={(e) => handleChange("satEnglishTargetScore", e.target.value ? parseInt(e.target.value) : "")}
                  className="w-full rounded-xl border border-ivy-200 bg-white px-4 py-3 text-body text-primary-900 shadow-soft focus:border-ivy-500 focus:ring-2 focus:ring-ivy-500/20 transition-all"
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-body-sm font-semibold text-primary-900 mb-4">Math</h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="satMathStart" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Score
                </label>
                <input
                  id="satMathStart"
                  type="number"
                  min="200"
                  max="800"
                  value={formData.satMathStartScore}
                  onChange={(e) => handleChange("satMathStartScore", e.target.value ? parseInt(e.target.value) : "")}
                  className="w-full rounded-xl border border-ivy-200 bg-white px-4 py-3 text-body text-primary-900 shadow-soft focus:border-ivy-500 focus:ring-2 focus:ring-ivy-500/20 transition-all"
                />
              </div>
              <div>
                <label htmlFor="satMathCurrent" className="block text-sm font-medium text-gray-700 mb-1">
                  Current Score
                </label>
                <input
                  id="satMathCurrent"
                  type="number"
                  min="200"
                  max="800"
                  value={formData.satMathCurrentScore}
                  onChange={(e) => handleChange("satMathCurrentScore", e.target.value ? parseInt(e.target.value) : "")}
                  className="w-full rounded-xl border border-ivy-200 bg-white px-4 py-3 text-body text-primary-900 shadow-soft focus:border-ivy-500 focus:ring-2 focus:ring-ivy-500/20 transition-all"
                />
              </div>
              <div>
                <label htmlFor="satMathTarget" className="block text-sm font-medium text-gray-700 mb-1">
                  Target Score
                </label>
                <input
                  id="satMathTarget"
                  type="number"
                  min="200"
                  max="800"
                  value={formData.satMathTargetScore}
                  onChange={(e) => handleChange("satMathTargetScore", e.target.value ? parseInt(e.target.value) : "")}
                  className="w-full rounded-xl border border-ivy-200 bg-white px-4 py-3 text-body text-primary-900 shadow-soft focus:border-ivy-500 focus:ring-2 focus:ring-ivy-500/20 transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Projects */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-h4 font-semibold text-primary-900 tracking-tight">Portfolio Projects</h3>
          <button
            type="button"
            onClick={handleAddPortfolioProject}
            className="text-body-sm font-semibold text-ivy-700 hover:text-ivy-900 transition-colors"
          >
            + Add Project
          </button>
        </div>
        {formData.portfolioProjects.map((project, index) => (
          <div key={index} className="border border-ivy-200 rounded-2xl p-6 space-y-4 bg-gradient-to-br from-white to-ivy-50/30 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-body-sm font-semibold text-primary-900">Project {index + 1}</span>
              <button
                type="button"
                onClick={() => handleRemovePortfolioProject(index)}
                className="text-body-sm font-semibold text-rose-600 hover:text-rose-800 transition-colors"
              >
                Remove
              </button>
            </div>
            <div>
              <label className="block text-body-sm font-semibold text-primary-900 mb-2">Title</label>
              <input
                type="text"
                value={project.title}
                onChange={(e) => handleUpdatePortfolioProject(index, "title", e.target.value)}
                className="w-full rounded-xl border border-ivy-200 bg-white px-4 py-3 text-body text-primary-900 shadow-soft focus:border-ivy-500 focus:ring-2 focus:ring-ivy-500/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-body-sm font-semibold text-primary-900 mb-2">Description</label>
              <textarea
                value={project.description}
                onChange={(e) => handleUpdatePortfolioProject(index, "description", e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-ivy-200 bg-white px-4 py-3 text-body text-primary-900 shadow-soft focus:border-ivy-500 focus:ring-2 focus:ring-ivy-500/20 transition-all resize-none"
              />
            </div>
            <div>
              <label className="block text-body-sm font-semibold text-primary-900 mb-2">Status</label>
              <select
                value={project.status}
                onChange={(e) => handleUpdatePortfolioProject(index, "status", e.target.value)}
                className="w-full rounded-xl border border-ivy-200 bg-white px-4 py-3 text-body text-primary-900 shadow-soft focus:border-ivy-500 focus:ring-2 focus:ring-ivy-500/20 transition-all"
              >
                <option value="PLANNED">Planned</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* International Admits */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-h4 font-semibold text-primary-900 tracking-tight">International Admits</h3>
          <button
            type="button"
            onClick={handleAddInternationalAdmit}
            className="text-body-sm font-semibold text-ivy-700 hover:text-ivy-900 transition-colors"
          >
            + Add Admit
          </button>
        </div>
        {formData.internationalAdmits.map((admit, index) => (
          <div key={index} className="border border-ivy-200 rounded-2xl p-6 space-y-4 bg-gradient-to-br from-white to-ivy-50/30 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-body-sm font-semibold text-primary-900">Admit {index + 1}</span>
              <button
                type="button"
                onClick={() => handleRemoveInternationalAdmit(index)}
                className="text-body-sm font-semibold text-rose-600 hover:text-rose-800 transition-colors"
              >
                Remove
              </button>
            </div>
            <div>
              <label className="block text-body-sm font-semibold text-primary-900 mb-2">Program Name</label>
              <input
                type="text"
                value={admit.programName}
                onChange={(e) => handleUpdateInternationalAdmit(index, "programName", e.target.value)}
                className="w-full rounded-xl border border-ivy-200 bg-white px-4 py-3 text-body text-primary-900 shadow-soft focus:border-ivy-500 focus:ring-2 focus:ring-ivy-500/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-body-sm font-semibold text-primary-900 mb-2">Country</label>
              <input
                type="text"
                value={admit.country}
                onChange={(e) => handleUpdateInternationalAdmit(index, "country", e.target.value)}
                className="w-full rounded-xl border border-ivy-200 bg-white px-4 py-3 text-body text-primary-900 shadow-soft focus:border-ivy-500 focus:ring-2 focus:ring-ivy-500/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-body-sm font-semibold text-primary-900 mb-2">Status</label>
              <select
                value={admit.status}
                onChange={(e) => handleUpdateInternationalAdmit(index, "status", e.target.value)}
                className="w-full rounded-xl border border-ivy-200 bg-white px-4 py-3 text-body text-primary-900 shadow-soft focus:border-ivy-500 focus:ring-2 focus:ring-ivy-500/20 transition-all"
              >
                <option value="PENDING">Pending</option>
                <option value="OFFERED">Offered</option>
                <option value="ENROLLED">Enrolled</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="flex items-center gap-4 pt-8 border-t border-ivy-200">
        <button
          type="submit"
          disabled={isLoading}
          className="px-8 py-3.5 bg-ivy-900 text-white rounded-xl hover:bg-ivy-800 transition-all duration-300 shadow-soft-md hover:shadow-soft-lg disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          {isLoading ? "Saving..." : studentId ? "Update Student" : "Create Student"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-8 py-3.5 border border-ivy-200 text-primary-700 rounded-xl hover:bg-ivy-50 transition-all duration-300 shadow-soft hover:shadow-soft-md font-semibold"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

