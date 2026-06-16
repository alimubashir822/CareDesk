import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const clinic = await db.clinic.findUnique({
      where: { subdomain: 'smile-dental' },
    });

    if (!clinic) {
      return NextResponse.json({ error: 'Smile clinic not seeded' }, { status: 404 });
    }

    const faqs = await db.knowledgeEntry.findMany({
      where: { clinicId: clinic.id },
      orderBy: { createdAt: 'desc' },
    });

    const services = await db.service.findMany({
      where: { clinicId: clinic.id },
      orderBy: { createdAt: 'desc' },
    });

    const doctors = await db.doctor.findMany({
      where: { clinicId: clinic.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      faqs,
      services,
      doctors,
    });
  } catch (error: any) {
    console.error('Fetch knowledge base error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
