import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const patients = await db.patient.findMany({
      include: {
        appointments: {
          include: {
            service: true,
            doctor: true,
          },
          orderBy: { dateTime: 'desc' },
        },
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(patients);
  } catch (error: any) {
    console.error('Fetch patients error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
