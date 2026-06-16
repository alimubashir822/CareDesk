import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { name, price, durationMin, clinicSubdomain = 'smile-dental' } = await req.json();

    if (!name || !price || !durationMin) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const clinic = await db.clinic.findUnique({
      where: { subdomain: clinicSubdomain },
    });

    if (!clinic) {
      return NextResponse.json({ error: 'Clinic not found' }, { status: 404 });
    }

    const service = await db.service.create({
      data: {
        clinicId: clinic.id,
        name,
        price: parseFloat(price),
        durationMin: parseInt(durationMin),
      },
    });

    return NextResponse.json({ success: true, service });
  } catch (error: any) {
    console.error('Service creation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
