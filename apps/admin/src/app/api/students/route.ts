import { NextRequest, NextResponse } from 'next/server';
import { getServerAuthSession } from '@/lib/auth';
import { prisma } from '@ivyonaire/db';
import {
  generateSlugFromNameAndYear,
  generateUniqueSlug,
} from '@/lib/utils';

// GET - List all students
export async function GET() {
  try {
    const session = await getServerAuthSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const students = await prisma.student.findMany({
      include: {
        ieltsProgress: true,
        satProgress: true,
        portfolioProjects: true,
        internationalAdmits: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(students);
  } catch (error) {
    console.error('[API] Error fetching students:', error);
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    );
  }
}

// POST - Create new student
export async function POST(request: NextRequest) {
  try {
    const session = await getServerAuthSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      fullName,
      slug,
      academicYear,
      ieltsStartScore,
      ieltsCurrentScore,
      ieltsTargetScore,
      satEnglishStartScore,
      satEnglishCurrentScore,
      satEnglishTargetScore,
      satMathStartScore,
      satMathCurrentScore,
      satMathTargetScore,
      portfolioProjects,
      internationalAdmits,
    } = body;

    // Validation
    if (!fullName || !fullName.trim()) {
      return NextResponse.json(
        { error: 'Full name is required' },
        { status: 400 }
      );
    }

    if (!academicYear || !academicYear.trim()) {
      return NextResponse.json(
        { error: 'Academic year is required' },
        { status: 400 }
      );
    }

    // Generate slug if not provided
    let finalSlug: string;
    
    if (slug?.trim()) {
      // Use provided slug, but still check for uniqueness
      finalSlug = slug.trim();
      
      const existingStudent = await prisma.student.findUnique({
        where: { slug: finalSlug },
      });

      if (existingStudent) {
        return NextResponse.json(
          { error: 'A student with this slug already exists' },
          { status: 400 }
        );
      }
    } else {
      // Auto-generate slug from name and academic year
      const baseSlug = generateSlugFromNameAndYear(
        fullName.trim(),
        academicYear.trim()
      );

      // Get all existing slugs to check for collisions
      const existingStudents = await prisma.student.findMany({
        select: { slug: true },
      });

      const existingSlugs = existingStudents.map((s) => s.slug);
      finalSlug = generateUniqueSlug(baseSlug, existingSlugs);
    }

    // Create student with all related data
    const student = await prisma.student.create({
      data: {
        fullName: fullName.trim(),
        slug: finalSlug,
        academicYear: academicYear.trim(),
        ieltsProgress: ieltsStartScore !== undefined || ieltsCurrentScore !== undefined || ieltsTargetScore !== undefined
          ? {
              create: {
                startScore: ieltsStartScore ?? 0,
                currentScore: ieltsCurrentScore ?? 0,
                targetScore: ieltsTargetScore ?? 0,
              },
            }
          : undefined,
        satProgress: {
          create: [
            satEnglishStartScore !== undefined || satEnglishCurrentScore !== undefined || satEnglishTargetScore !== undefined
              ? {
                  type: 'ENGLISH',
                  startScore: satEnglishStartScore ?? 0,
                  currentScore: satEnglishCurrentScore ?? 0,
                  targetScore: satEnglishTargetScore ?? 0,
                }
              : null,
            satMathStartScore !== undefined || satMathCurrentScore !== undefined || satMathTargetScore !== undefined
              ? {
                  type: 'MATH',
                  startScore: satMathStartScore ?? 0,
                  currentScore: satMathCurrentScore ?? 0,
                  targetScore: satMathTargetScore ?? 0,
                }
              : null,
          ].filter(Boolean) as any,
        },
        portfolioProjects: portfolioProjects?.length
          ? {
              create: portfolioProjects.map((project: any) => ({
                title: project.title || '',
                description: project.description || '',
                status: project.status || 'PLANNED',
              })),
            }
          : undefined,
        internationalAdmits: internationalAdmits?.length
          ? {
              create: internationalAdmits.map((admit: any) => ({
                programName: admit.programName || '',
                country: admit.country || '',
                status: admit.status || 'PENDING',
              })),
            }
          : undefined,
      },
      include: {
        ieltsProgress: true,
        satProgress: true,
        portfolioProjects: true,
        internationalAdmits: true,
      },
    });

    return NextResponse.json(student, { status: 201 });
  } catch (error: any) {
    console.error('[API] Error creating student:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A student with this slug already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create student', details: error.message },
      { status: 500 }
    );
  }
}

