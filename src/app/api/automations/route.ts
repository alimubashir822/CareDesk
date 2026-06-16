import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const clinic = await db.clinic.findUnique({
      where: { subdomain: 'smile-dental' },
    });

    if (!clinic) {
      return NextResponse.json({ error: 'Clinic not found' }, { status: 404 });
    }

    const automations = await db.automation.findMany({
      where: { clinicId: clinic.id },
      include: {
        logs: {
          orderBy: { sentAt: 'desc' },
          take: 15,
        },
      },
      orderBy: { type: 'asc' },
    });

    return NextResponse.json(automations);
  } catch (error: any) {
    console.error('Fetch automations error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { id, template, enabled } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Missing automation id' }, { status: 400 });
    }

    const updateData: any = {};
    if (template !== undefined) updateData.template = template;
    if (enabled !== undefined) updateData.enabled = enabled;

    const automation = await db.automation.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, automation });
  } catch (error: any) {
    console.error('Update automation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
