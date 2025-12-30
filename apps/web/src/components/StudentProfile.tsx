"use client";

import * as React from "react";
import type { Student, IELTSProgress, SATProgress, PortfolioProject, InternationalAdmit } from "@ivyonaire/db";
import { EnhancedProgressCard, Badge } from "@ivyonaire/ui";
import {
  calculateProgressPercentage,
  calculateRemainingPercentage,
} from "@ivyonaire/utils";
import Link from "next/link";

type StudentWithRelations = Student & {
  ieltsProgress: IELTSProgress[];
  satProgress: SATProgress[];
  portfolioProjects: PortfolioProject[];
  internationalAdmits: InternationalAdmit[];
};

type StudentProfileProps = {
  student: StudentWithRelations;
};

export function StudentProfile({ student }: StudentProfileProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const ielts = student.ieltsProgress[0];
  const satEnglish = student.satProgress.find((p) => p.type === "ENGLISH");
  const satMath = student.satProgress.find((p) => p.type === "MATH");

  const ieltsProgress = ielts
    ? calculateProgressPercentage({
        startScore: ielts.startScore,
        currentScore: ielts.currentScore,
        targetScore: ielts.targetScore,
      })
    : 0;

  const ieltsRemaining = ielts
    ? calculateRemainingPercentage({
        startScore: ielts.startScore,
        currentScore: ielts.currentScore,
        targetScore: ielts.targetScore,
      })
    : 0;

  const satEnglishProgress = satEnglish
    ? calculateProgressPercentage({
        startScore: satEnglish.startScore,
        currentScore: satEnglish.currentScore,
        targetScore: satEnglish.targetScore,
      })
    : 0;

  const satEnglishRemaining = satEnglish
    ? calculateRemainingPercentage({
        startScore: satEnglish.startScore,
        currentScore: satEnglish.currentScore,
        targetScore: satEnglish.targetScore,
      })
    : 0;

  const satMathProgress = satMath
    ? calculateProgressPercentage({
        startScore: satMath.startScore,
        currentScore: satMath.currentScore,
        targetScore: satMath.targetScore,
      })
    : 0;

  const satMathRemaining = satMath
    ? calculateRemainingPercentage({
        startScore: satMath.startScore,
        currentScore: satMath.currentScore,
        targetScore: satMath.targetScore,
      })
    : 0;

  return (
    <main className="min-h-screen bg-gradient-to-b from-ivy-50 via-white to-ivy-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-ivy-900 via-ivy-800 to-ivy-950 text-white shadow-ivy-lg">
        <div className="container mx-auto px-4 py-20 md:py-28">
          <div
            className={`transition-all duration-1000 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="mb-6">
              <Link
                href="/"
                className="inline-flex items-center text-sm text-ivy-200 hover:text-white transition-colors mb-8 group"
              >
                <svg
                  className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Ivyonaire
              </Link>
            </div>
            <h1 className="text-display-sm md:text-display font-serif font-bold mb-4 text-balance tracking-tight text-white">
              {student.fullName}
            </h1>
            <p className="text-body-lg md:text-xl text-ivy-200 mb-8">
              Academic Year {student.academicYear}
            </p>
            <div className="flex items-center gap-3 text-sm text-ivy-300">
              <span className="font-medium">Ivyonaire</span>
              <span className="w-1 h-1 bg-ivy-400 rounded-full"></span>
              <span>Student Progress Tracking</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-20 max-w-6xl">
        {/* IELTS Progress */}
        {ielts && (
          <section
            className={`mb-20 transition-all duration-700 delay-100 ${
              mounted
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <div className="bg-white rounded-3xl shadow-soft-lg border border-ivy-100 p-10 md:p-12 hover:shadow-soft-xl transition-all duration-300">
              <EnhancedProgressCard
                title="IELTS Progress"
                description="International English Language Testing System. Scores range from 0 to 9.0, with most universities requiring 6.5-7.5 for admission."
                progress={ieltsProgress}
                remaining={ieltsRemaining}
                startScore={ielts.startScore}
                currentScore={ielts.currentScore}
                targetScore={ielts.targetScore}
                maxScore={9.0}
                scoreUnit="/9.0"
                variant="ielts"
                ariaLabel="IELTS overall progress"
              />
            </div>
          </section>
        )}

        {/* SAT Progress */}
        {(satEnglish || satMath) && (
          <section
            className={`mb-20 transition-all duration-700 delay-200 ${
              mounted
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <div className="bg-white rounded-3xl shadow-soft-lg border border-ivy-100 p-10 md:p-12 hover:shadow-soft-xl transition-all duration-300">
              <div className="mb-10">
                <h2 className="text-h2 font-serif font-bold text-primary-900 mb-3 tracking-tight">
                  SAT Progress
                </h2>
                <p className="text-body text-primary-700 leading-relaxed max-w-3xl">
                  Scholastic Assessment Test. Each section (English and Math) is
                  scored from 200 to 800. Top universities typically require
                  scores of 1400+ (combined).
                </p>
              </div>

              <div className="space-y-16">
                {/* SAT English */}
                {satEnglish && (
                  <div>
                    <h3 className="text-h4 font-semibold text-primary-900 mb-8 flex items-center gap-3 tracking-tight">
                      <span className="w-2.5 h-2.5 bg-purple-500 rounded-full shadow-soft"></span>
                      English Section
                    </h3>
                    <EnhancedProgressCard
                      title=""
                      progress={satEnglishProgress}
                      remaining={satEnglishRemaining}
                      startScore={satEnglish.startScore}
                      currentScore={satEnglish.currentScore}
                      targetScore={satEnglish.targetScore}
                      maxScore={800}
                      scoreUnit="/800"
                      variant="sat-english"
                      ariaLabel="SAT English section progress"
                      className="mb-8"
                    />
                  </div>
                )}

                {/* SAT Math */}
                {satMath && (
                  <div>
                    <h3 className="text-h4 font-semibold text-primary-900 mb-8 flex items-center gap-3 tracking-tight">
                      <span className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-soft"></span>
                      Math Section
                    </h3>
                    <EnhancedProgressCard
                      title=""
                      progress={satMathProgress}
                      remaining={satMathRemaining}
                      startScore={satMath.startScore}
                      currentScore={satMath.currentScore}
                      targetScore={satMath.targetScore}
                      maxScore={800}
                      scoreUnit="/800"
                      variant="sat-math"
                      ariaLabel="SAT Math section progress"
                      className="mb-8"
                    />
                  </div>
                )}

                {/* Combined SAT Score */}
                {satEnglish && satMath && (
                  <div className="bg-gradient-to-br from-ivy-50 to-ivy-100 rounded-2xl p-8 border border-ivy-200 shadow-soft">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-body-sm font-semibold text-primary-700 uppercase tracking-wider mb-2">
                          Combined SAT Score
                        </p>
                        <p className="text-body-sm text-primary-600">
                          English + Math total
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-h1 font-bold text-ivy-900">
                          {satEnglish.currentScore + satMath.currentScore}
                        </span>
                        <p className="text-body-sm text-primary-600 mt-1">
                          / {satEnglish.targetScore + satMath.targetScore} target
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Portfolio Projects */}
        {student.portfolioProjects.length > 0 && (
          <section
            className={`mb-20 transition-all duration-700 delay-300 ${
              mounted
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <div className="bg-white rounded-3xl shadow-soft-lg border border-ivy-100 p-10 md:p-12 hover:shadow-soft-xl transition-all duration-300">
              <div className="mb-10">
                <h2 className="text-h2 font-serif font-bold text-primary-900 mb-3 tracking-tight">
                  Portfolio Projects
                </h2>
                <p className="text-body text-primary-700 leading-relaxed max-w-3xl">
                  Extracurricular projects and achievements that strengthen
                  university applications. These demonstrate initiative, creativity,
                  and commitment beyond academics.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {student.portfolioProjects.map((project, index) => (
                  <div
                    key={project.id}
                    className={`border border-ivy-200 rounded-2xl p-8 hover:border-ivy-300 hover:shadow-soft-md transition-all duration-300 bg-gradient-to-br from-white to-ivy-50/30 ${
                      mounted
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4"
                    }`}
                    style={{
                      transitionDelay: `${300 + index * 100}ms`,
                    }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-h4 font-semibold text-primary-900 tracking-tight">
                        {project.title}
                      </h3>
                      <Badge
                        variant={
                          project.status === "COMPLETED"
                            ? "success"
                            : project.status === "IN_PROGRESS"
                            ? "warning"
                            : "neutral"
                        }
                      >
                        {project.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <p className="text-body text-primary-700 leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* International Admits */}
        {student.internationalAdmits.length > 0 && (
          <section
            className={`mb-20 transition-all duration-700 delay-400 ${
              mounted
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <div className="bg-white rounded-3xl shadow-soft-lg border border-ivy-100 p-10 md:p-12 hover:shadow-soft-xl transition-all duration-300">
              <div className="mb-10">
                <h2 className="text-h2 font-serif font-bold text-primary-900 mb-3 tracking-tight">
                  International University Applications
                </h2>
                <p className="text-body text-primary-700 leading-relaxed max-w-3xl">
                  Applications to universities abroad. Status updates show the
                  progress of each application through the admission process.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {student.internationalAdmits.map((admit, index) => (
                  <div
                    key={admit.id}
                    className={`border border-ivy-200 rounded-2xl p-8 hover:border-ivy-300 hover:shadow-soft-md transition-all duration-300 bg-gradient-to-br from-white to-ivy-50/30 ${
                      mounted
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4"
                    }`}
                    style={{
                      transitionDelay: `${400 + index * 100}ms`,
                    }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-h4 font-semibold text-primary-900 mb-2 tracking-tight">
                          {admit.programName}
                        </h3>
                        <p className="text-body-sm text-primary-600 flex items-center gap-2">
                          <svg
                            className="w-4 h-4 text-ivy-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {admit.country}
                        </p>
                      </div>
                      <Badge
                        variant={
                          admit.status === "ENROLLED"
                            ? "success"
                            : admit.status === "OFFERED"
                            ? "success"
                            : admit.status === "REJECTED"
                            ? "danger"
                            : "neutral"
                        }
                      >
                        {admit.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Empty State Message */}
        {!ielts && !satEnglish && !satMath && student.portfolioProjects.length === 0 && student.internationalAdmits.length === 0 && (
          <div className="text-center py-20">
            <p className="text-body text-primary-600">No progress data available yet.</p>
          </div>
        )}
      </div>
    </main>
  );
}
