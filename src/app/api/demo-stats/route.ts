import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // 1. Fetch Smile Dental Clinic
    const clinic = await db.clinic.findUnique({
      where: { subdomain: 'smile-dental' },
    });

    if (!clinic) {
      return NextResponse.json({ error: 'Smile clinic not seeded' }, { status: 404 });
    }

    // 2. Fetch today's analytics metrics
    const startOfDay = new Date();
    startOfDay.setHours(0,0,0,0);
    const endOfDay = new Date();
    endOfDay.setHours(23,59,59,999);

    const stats = await db.analytics.findFirst({
      where: {
        clinicId: clinic.id,
        date: { gte: startOfDay, lte: endOfDay },
      },
    });

    // Default mock stats if analytics not initialized
    const todayConversations = stats?.conversations || 24;
    const todayBookings = stats?.bookings || 8;
    const todayLeads = stats?.leads || 12;
    const resolutionRate = 85.5; // resolved vs handoff

    // 3. Fetch recent Conversations with messages
    const recentConvs = await db.conversation.findMany({
      where: { clinicId: clinic.id },
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
        patient: true,
      },
      orderBy: { updatedAt: 'desc' },
      take: 4,
    });

    // 4. Fetch CRM Patients
    const patients = await db.patient.findMany({
      where: { clinicId: clinic.id },
      orderBy: { createdAt: 'desc' },
      take: 8,
    });

    // 5. Fetch recent Appointments
    const appointments = await db.appointment.findMany({
      where: { clinicId: clinic.id },
      include: {
        patient: true,
        service: true,
        doctor: true,
      },
      orderBy: { dateTime: 'asc' },
      take: 8,
    });

    return NextResponse.json({
      metrics: {
        conversations: todayConversations,
        bookings: todayBookings,
        leads: todayLeads,
        resolutionRate,
      },
      conversations: recentConvs,
      patients,
      appointments,
    });
  } catch (error: any) {
    console.error('Demo stats error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
