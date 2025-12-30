import { NextRequest, NextResponse } from 'next/server';
import { getServerAuthSession } from '@/lib/auth';
import { prisma } from '@ivyonaire/db';
import {
  generateSlugFromNameAndYear,
  generateUniqueSlug,
} from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerAuthSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { fullName, academicYear, excludeId } = body;

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

    // Generate base slug
    const baseSlug = generateSlugFromNameAndYear(
      fullName.trim(),
      academicYear.trim()
    );

    // Get all existing slugs
    const whereClause: any = {};
    if (excludeId) {
      whereClause.id = { not: excludeId };
    }

    const existingStudents = await prisma.student.findMany({
      where: whereClause,
      select: { slug: true },
    });

    const existingSlugs = existingStudents.map((s) => s.slug);

    // Generate unique slug
    const uniqueSlug = generateUniqueSlug(
      baseSlug,
      existingSlugs,
      excludeId ? undefined : baseSlug
    );

    const isAvailable = uniqueSlug === baseSlug;

    return NextResponse.json({
      slug: uniqueSlug,
      isAvailable,
      isUnique: isAvailable,
    });
  } catch (error) {
    console.error('[API] Error checking slug:', error);
    return NextResponse.json(
      { error: 'Failed to check slug availability' },
      { status: 500 }
    );
  }
}

