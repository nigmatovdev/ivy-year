import { NextRequest, NextResponse } from 'next/server';
import { getServerAuthSession } from '@/lib/auth';
import { prisma } from '@ivyonaire/db';
import {
  generateSlugFromNameAndYear,
  generateUniqueSlug,
} from '@/lib/utils';

// GET - Get single student
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerAuthSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json(student);
  } catch (error) {
    console.error('[API] Error fetching student:', error);
    return NextResponse.json(
      { error: 'Failed to fetch student' },
      { status: 500 }
    );
  }
}

// PUT - Update student
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if student exists
    const existingStudent = await prisma.student.findUnique({
      where: { id: params.id },
    });

    if (!existingStudent) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

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
      // Use provided slug, but check if it's taken by another student
      finalSlug = slug.trim();
      
      if (finalSlug !== existingStudent.slug) {
        const slugTaken = await prisma.student.findUnique({
          where: { slug: finalSlug },
        });

        if (slugTaken) {
          return NextResponse.json(
            { error: 'A student with this slug already exists' },
            { status: 400 }
          );
        }
      }
    } else {
      // Auto-generate slug from name and academic year
      const baseSlug = generateSlugFromNameAndYear(
        fullName.trim(),
        academicYear.trim()
      );

      // Get all existing slugs (excluding current student)
      const existingStudents = await prisma.student.findMany({
        where: { id: { not: params.id } },
        select: { slug: true },
      });

      const existingSlugs = existingStudents.map((s) => s.slug);
      finalSlug = generateUniqueSlug(baseSlug, existingSlugs, existingStudent.slug);
    }

    // Update student and related data in a transaction
    const student = await prisma.$transaction(async (tx) => {
      // Update basic info
      const updated = await tx.student.update({
        where: { id: params.id },
        data: {
          fullName: fullName.trim(),
          slug: finalSlug,
          academicYear: academicYear.trim(),
        },
      });

      // Update IELTS progress
      const existingIELTS = await tx.iELTSProgress.findFirst({
        where: { studentId: params.id },
      });

      if (existingIELTS) {
        await tx.iELTSProgress.update({
          where: { id: existingIELTS.id },
          data: {
            startScore: ieltsStartScore ?? existingIELTS.startScore,
            currentScore: ieltsCurrentScore ?? existingIELTS.currentScore,
            targetScore: ieltsTargetScore ?? existingIELTS.targetScore,
          },
        });
      } else if (ieltsStartScore !== undefined || ieltsCurrentScore !== undefined || ieltsTargetScore !== undefined) {
        await tx.iELTSProgress.create({
          data: {
            studentId: params.id,
            startScore: ieltsStartScore ?? 0,
            currentScore: ieltsCurrentScore ?? 0,
            targetScore: ieltsTargetScore ?? 0,
          },
        });
      }

      // Update SAT progress
      const existingSATEnglish = await tx.sATProgress.findFirst({
        where: { studentId: params.id, type: 'ENGLISH' },
      });

      const existingSATMath = await tx.sATProgress.findFirst({
        where: { studentId: params.id, type: 'MATH' },
      });

      if (existingSATEnglish) {
        await tx.sATProgress.update({
          where: { id: existingSATEnglish.id },
          data: {
            startScore: satEnglishStartScore ?? existingSATEnglish.startScore,
            currentScore: satEnglishCurrentScore ?? existingSATEnglish.currentScore,
            targetScore: satEnglishTargetScore ?? existingSATEnglish.targetScore,
          },
        });
      } else if (satEnglishStartScore !== undefined || satEnglishCurrentScore !== undefined || satEnglishTargetScore !== undefined) {
        await tx.sATProgress.create({
          data: {
            studentId: params.id,
            type: 'ENGLISH',
            startScore: satEnglishStartScore ?? 0,
            currentScore: satEnglishCurrentScore ?? 0,
            targetScore: satEnglishTargetScore ?? 0,
          },
        });
      }

      if (existingSATMath) {
        await tx.sATProgress.update({
          where: { id: existingSATMath.id },
          data: {
            startScore: satMathStartScore ?? existingSATMath.startScore,
            currentScore: satMathCurrentScore ?? existingSATMath.currentScore,
            targetScore: satMathTargetScore ?? existingSATMath.targetScore,
          },
        });
      } else if (satMathStartScore !== undefined || satMathCurrentScore !== undefined || satMathTargetScore !== undefined) {
        await tx.sATProgress.create({
          data: {
            studentId: params.id,
            type: 'MATH',
            startScore: satMathStartScore ?? 0,
            currentScore: satMathCurrentScore ?? 0,
            targetScore: satMathTargetScore ?? 0,
          },
        });
      }

      // Delete and recreate portfolio projects
      await tx.portfolioProject.deleteMany({
        where: { studentId: params.id },
      });

      if (portfolioProjects?.length) {
        await tx.portfolioProject.createMany({
          data: portfolioProjects.map((project: any) => ({
            studentId: params.id,
            title: project.title || '',
            description: project.description || '',
            status: project.status || 'PLANNED',
          })),
        });
      }

      // Delete and recreate international admits
      await tx.internationalAdmit.deleteMany({
        where: { studentId: params.id },
      });

      if (internationalAdmits?.length) {
        await tx.internationalAdmit.createMany({
          data: internationalAdmits.map((admit: any) => ({
            studentId: params.id,
            programName: admit.programName || '',
            country: admit.country || '',
            status: admit.status || 'PENDING',
          })),
        });
      }

      return updated;
    });

    // Fetch updated student with relations
    const updatedStudent = await prisma.student.findUnique({
      where: { id: params.id },
      include: {
        ieltsProgress: true,
        satProgress: true,
        portfolioProjects: true,
        internationalAdmits: true,
      },
    });

    return NextResponse.json(updatedStudent);
  } catch (error: any) {
    console.error('[API] Error updating student:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A student with this slug already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update student', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete student
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerAuthSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const student = await prisma.student.findUnique({
      where: { id: params.id },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Cascade delete will handle related records
    await prisma.student.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] Error deleting student:', error);
    return NextResponse.json(
      { error: 'Failed to delete student' },
      { status: 500 }
    );
  }
}

