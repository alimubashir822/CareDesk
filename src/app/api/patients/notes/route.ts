import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { patientId, notes } = await req.json();

    if (!patientId) {
      return NextResponse.json({ error: 'Missing patientId parameter' }, { status: 400 });
    }

    const patient = await db.patient.update({
      where: { id: patientId },
      data: { notes },
    });

    return NextResponse.json({ success: true, patient });
  } catch (error: any) {
    console.error('Patient notes update error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
