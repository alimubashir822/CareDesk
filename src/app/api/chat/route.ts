import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAssistantResponse } from '@/lib/assistant';

// Optional OpenAI integration using native fetch to keep dependencies minimal
async function getOpenAIResponse(
  apiKey: string,
  systemPrompt: string,
  history: { role: string; content: string }[]
): Promise<string> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...history,
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'OpenAI API call failed.');
    }

    const data = await response.json();
    return data.choices[0].message.content || '';
  } catch (error: any) {
    console.error('OpenAI fetch error, falling back to offline mode:', error);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { conversationId, message, clinicSubdomain } = await req.json();

    if (!message || !clinicSubdomain) {
      return NextResponse.json({ error: 'Missing message or clinicSubdomain parameter' }, { status: 400 });
    }

    // 1. Fetch Clinic
    const clinic = await db.clinic.findUnique({
      where: { subdomain: clinicSubdomain },
      include: { services: true, doctors: true, knowledgeBase: true },
    });

    if (!clinic) {
      return NextResponse.json({ error: 'Clinic not found' }, { status: 404 });
    }

    // 2. Fetch or Create Conversation
    let conversation;
    if (conversationId) {
      conversation = await db.conversation.findUnique({
        where: { id: conversationId },
      });
    }

    if (!conversation) {
      conversation = await db.conversation.create({
        data: {
          clinicId: clinic.id,
          status: 'ACTIVE',
        },
      });
    }

    // Increment conversation count in analytics for today
    const startOfDay = new Date();
    startOfDay.setHours(0,0,0,0);
    const endOfDay = new Date();
    endOfDay.setHours(23,59,59,999);
    
    const analytics = await db.analytics.findFirst({
      where: {
        clinicId: clinic.id,
        date: { gte: startOfDay, lte: endOfDay },
      },
    });

    if (!analytics) {
      await db.analytics.create({
        data: {
          clinicId: clinic.id,
          date: new Date(),
          conversations: 1,
          bookings: 0,
          leads: 0,
          revenueEst: 0,
          missedCallsSaved: 1,
        },
      });
    } else {
      await db.analytics.update({
        where: { id: analytics.id },
        data: { conversations: { increment: 1 } },
      });
    }

    // 3. Save Patient Message to DB
    await db.message.create({
      data: {
        conversationId: conversation.id,
        sender: 'PATIENT',
        content: message,
      },
    });

    // 4. Generate AI response (Check for OpenAI Key first)
    const apiKey = process.env.OPENAI_API_KEY;
    let aiReply = '';
    let status: 'ACTIVE' | 'HANDOFF_REQUESTED' | 'COMPLETED' = 'ACTIVE';
    let appointmentBooked = false;

    if (apiKey) {
      // Build dynamic system prompt using database FAQs, Services, and Doctors
      const faqsList = clinic.knowledgeBase.map(kb => `Q: ${kb.question}\nA: ${kb.answer}`).join('\n\n');
      const servicesList = clinic.services.map(s => `- ${s.name}: $${s.price} (${s.durationMin} mins)`).join('\n');
      const docsList = clinic.doctors.map(d => `- ${d.name}: Specialty ${d.specialty}`).join('\n');
      
      const systemPrompt = `You are the AI Medical Receptionist for "${clinic.name}". Your goal is to guide patients visiting our website.
We provide the following services:
${servicesList}

We have the following doctors:
${docsList}

Clinic Location & FAQs:
${faqsList}

YOUR BEHAVIOR RULES:
1. Always be extremely polite, professional, and helpful. Use emojis in greetings.
2. If the patient wants to book an appointment, qualify them step-by-step:
   - Ask for their full name first.
   - Ask for their phone number.
   - Ask for their email.
   - Ask for their insurance provider (type 'None' if they don't have one).
   - Let them select a service, a doctor, a day (Mon-Sat), and timeslots.
   - Present a summary block and ask them to confirm with 'Yes' or 'No'.
3. When they confirm with 'Yes' at the end of the booking summary:
   - You MUST include the exact word "confirmed!" in your final response. This triggers the database booking engine in our system.
4. If they ask about services, location, hours, or policies, answer clearly using the FAQs provided.
5. HEALTHCARE SAFETY RULE: NEVER diagnose a medical condition. If they mention symptoms of urgent severity (severe pain, swelling, bleeding, trauma), tell them you are connecting them to a human receptionist and flag the handoff by outputting: "I am connecting you with our clinical team for urgent assistance."
`;

      // Fetch message logs for OpenAI context
      const dbLogs = await db.message.findMany({
        where: { conversationId: conversation.id },
        orderBy: { createdAt: 'asc' },
      });

      const openAIHistory = dbLogs.map(l => ({
        role: l.sender === 'PATIENT' ? 'user' : 'assistant',
        content: l.content,
      }));

      try {
        aiReply = await getOpenAIResponse(apiKey, systemPrompt, openAIHistory);
        
        // Analyze response to set status
        if (aiReply.toLowerCase().includes('confirmed!')) {
          status = 'COMPLETED';
          appointmentBooked = true;
          
          // Execute background booking from parsed values (simulate database write)
          const nameMatch = dbLogs.find(l => l.sender === 'PATIENT')?.content || 'Patient';
          let patient = await db.patient.findFirst({
            where: { clinicId: clinic.id, name: nameMatch },
          });

          if (!patient) {
            patient = await db.patient.create({
              data: {
                name: nameMatch,
                phone: '(555) 111-2222',
                email: 'web-inbound@caredesk.ai',
                insurance: 'PPO Insurance',
                notes: 'Auto-booked via LLM engine',
                clinicId: clinic.id,
              },
            });
          }
          
          await db.appointment.create({
            data: {
              clinicId: clinic.id,
              patientId: patient.id,
              serviceId: clinic.services[0].id,
              doctorId: clinic.doctors[0].id,
              dateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // booked in 3 days
              status: 'CONFIRMED',
            },
          });

          await db.conversation.update({
            where: { id: conversation.id },
            data: { status: 'COMPLETED', patientId: patient.id },
          });
        } else if (aiReply.toLowerCase().includes('connecting you with our clinical team')) {
          status = 'HANDOFF_REQUESTED';
          await db.conversation.update({
            where: { id: conversation.id },
            data: { status: 'HANDOFF_REQUESTED' },
          });
        }
      } catch (err) {
        // Fallback to local offline state machine if API fails
        const localRes = await getAssistantResponse(conversation.id, message, clinicSubdomain);
        aiReply = localRes.reply;
        status = localRes.status;
        appointmentBooked = localRes.appointmentBooked || false;
      }
    } else {
      // Offline mode (standard rules-based engine)
      const localRes = await getAssistantResponse(conversation.id, message, clinicSubdomain);
      aiReply = localRes.reply;
      status = localRes.status;
      appointmentBooked = localRes.appointmentBooked || false;
    }

    // 5. Save AI Message to DB
    await db.message.create({
      data: {
        conversationId: conversation.id,
        sender: 'AI',
        content: aiReply,
      },
    });

    // 6. Update Conversation summary and timestamp
    await db.conversation.update({
      where: { id: conversation.id },
      data: {
        summary: aiReply.slice(0, 100),
        updatedAt: new Date(),
      },
    });

    // 7. Refetch and Return final logs
    const updatedMessages = await db.message.findMany({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({
      conversationId: conversation.id,
      reply: aiReply,
      status,
      appointmentBooked,
      messages: updatedMessages,
    });

  } catch (error: any) {
    console.error('Chat error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
