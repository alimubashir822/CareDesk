import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { question, answer, category, clinicSubdomain = 'smile-dental' } = await req.json();

    if (!question || !answer || !category) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const clinic = await db.clinic.findUnique({
      where: { subdomain: clinicSubdomain },
    });

    if (!clinic) {
      return NextResponse.json({ error: 'Clinic not found' }, { status: 404 });
    }

    const entry = await db.knowledgeEntry.create({
      data: {
        clinicId: clinic.id,
        category,
        question,
        answer,
      },
    });

    return NextResponse.json({ success: true, entry });
  } catch (error: any) {
    console.error('FAQ creation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
