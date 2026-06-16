import { db } from './db';

// Define the booking state structure
export interface ChatState {
  step: 'WELCOME' | 'COLLECTING_NAME' | 'COLLECTING_PHONE' | 'COLLECTING_EMAIL' | 'COLLECTING_INSURANCE' | 'SELECTING_SERVICE' | 'SELECTING_DOCTOR' | 'SELECTING_DAY' | 'SELECTING_TIME' | 'CONFIRMING_BOOKING' | 'BOOKED' | 'HANDOFF';
  name?: string;
  phone?: string;
  email?: string;
  insurance?: string;
  serviceId?: string;
  serviceName?: string;
  doctorId?: string;
  doctorName?: string;
  day?: string;
  time?: string;
}

// Helper: Parse message logs to reconstruct the active state
export function parseStateFromMessages(messages: { sender: string; content: string }[]): ChatState {
  const state: ChatState = { step: 'WELCOME' };

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    const prevMsg = i > 0 ? messages[i - 1] : null;

    if (msg.sender === 'AI') {
      if (msg.content.includes('tell me your full name')) {
        state.step = 'COLLECTING_NAME';
      } else if (msg.content.includes('phone number to reach you')) {
        state.step = 'COLLECTING_PHONE';
      } else if (msg.content.includes('email address')) {
        state.step = 'COLLECTING_EMAIL';
      } else if (msg.content.includes('dental insurance you would like us to verify')) {
        state.step = 'COLLECTING_INSURANCE';
      } else if (msg.content.includes('Which service are you looking to book')) {
        state.step = 'SELECTING_SERVICE';
      } else if (msg.content.includes('Do you have a doctor preference')) {
        state.step = 'SELECTING_DOCTOR';
      } else if (msg.content.includes('Which day next week works best')) {
        state.step = 'SELECTING_DAY';
      } else if (msg.content.includes('timeslots open on')) {
        state.step = 'SELECTING_TIME';
      } else if (msg.content.includes('Is this correct? (Type \'Yes\' to confirm')) {
        state.step = 'CONFIRMING_BOOKING';
      } else if (msg.content.includes('confirmed!')) {
        state.step = 'BOOKED';
      } else if (msg.content.includes('connect you with our clinic team')) {
        state.step = 'HANDOFF';
      }
    } else if (msg.sender === 'PATIENT' && prevMsg?.sender === 'AI') {
      // User response to AI prompt
      const content = msg.content.trim();
      
      if (prevMsg.content.includes('tell me your full name')) {
        state.name = content;
        state.step = 'COLLECTING_PHONE';
      } else if (prevMsg.content.includes('phone number to reach you')) {
        state.phone = content;
        state.step = 'COLLECTING_EMAIL';
      } else if (prevMsg.content.includes('email address')) {
        state.email = content;
        state.step = 'COLLECTING_INSURANCE';
      } else if (prevMsg.content.includes('dental insurance you would like us to verify')) {
        state.insurance = content;
        state.step = 'SELECTING_SERVICE';
      } else if (prevMsg.content.includes('Which service are you looking to book')) {
        // Find selected service in list
        state.serviceName = content;
        state.step = 'SELECTING_DOCTOR';
      } else if (prevMsg.content.includes('Do you have a doctor preference')) {
        state.doctorName = content;
        state.step = 'SELECTING_DAY';
      } else if (prevMsg.content.includes('Which day next week works best')) {
        state.day = content;
        state.step = 'SELECTING_TIME';
      } else if (prevMsg.content.includes('timeslots open on')) {
        state.time = content;
        state.step = 'CONFIRMING_BOOKING';
      } else if (prevMsg.content.includes('Is this correct? (Type \'Yes\' to confirm')) {
        if (content.toLowerCase().startsWith('y')) {
          state.step = 'BOOKED';
        } else {
          // Restart booking flow
          state.step = 'WELCOME';
        }
      }
    }
  }

  return state;
}

// Dynamic FAQ and keyword matcher
async function matchFAQ(query: string, clinicId: string): Promise<string | null> {
  const entries = await db.knowledgeEntry.findMany({
    where: { clinicId },
  });

  const cleanQuery = query.toLowerCase();
  
  // Direct matching
  for (const entry of entries) {
    const q = entry.question.toLowerCase();
    if (cleanQuery.includes(q) || q.includes(cleanQuery)) {
      return entry.answer;
    }
  }

  // Keyword associations
  if (cleanQuery.includes('insurance') || cleanQuery.includes('ppo') || cleanQuery.includes('accept')) {
    const match = entries.find(e => e.question.toLowerCase().includes('insurance'));
    if (match) return match.answer;
  }
  if (cleanQuery.includes('hour') || cleanQuery.includes('time') || cleanQuery.includes('open') || cleanQuery.includes('close')) {
    const match = entries.find(e => e.question.toLowerCase().includes('hour') || e.question.toLowerCase().includes('open'));
    if (match) return match.answer;
  }
  if (cleanQuery.includes('location') || cleanQuery.includes('where') || cleanQuery.includes('address') || cleanQuery.includes('find you')) {
    const match = entries.find(e => e.question.toLowerCase().includes('location') || e.question.toLowerCase().includes('where'));
    if (match) return match.answer;
  }
  if (cleanQuery.includes('cancel') || cleanQuery.includes('reschedule') || cleanQuery.includes('policy')) {
    const match = entries.find(e => e.question.toLowerCase().includes('cancel') || e.question.toLowerCase().includes('policy'));
    if (match) return match.answer;
  }
  if (cleanQuery.includes('implant') || cleanQuery.includes('price') || cleanQuery.includes('cost') || cleanQuery.includes('how much')) {
    const match = entries.find(e => e.question.toLowerCase().includes('implant') || e.question.toLowerCase().includes('cost') || e.question.toLowerCase().includes('price'));
    if (match) return match.answer;
  }

  return null;
}

// Primary assistant reply generator
export async function getAssistantResponse(
  conversationId: string,
  patientMessage: string,
  clinicSubdomain: string
): Promise<{
  reply: string;
  status: 'ACTIVE' | 'HANDOFF_REQUESTED' | 'COMPLETED';
  patientUpdated?: boolean;
  appointmentBooked?: boolean;
}> {
  // 1. Fetch Clinic
  const clinic = await db.clinic.findUnique({
    where: { subdomain: clinicSubdomain },
    include: { services: true, doctors: true },
  });

  if (!clinic) {
    return { reply: "Error: Clinic configuration not found.", status: 'ACTIVE' };
  }

  // 2. Fetch Conversation History
  const history = await db.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'asc' },
  });

  // Reconstruct the state by examining history
  const historyForParse = history.map(h => ({ sender: h.sender, content: h.content }));
  const state = parseStateFromMessages(historyForParse);
  const cleanInput = patientMessage.trim();
  const lowerInput = cleanInput.toLowerCase();

  // 3. Check for clinical emergency trigger (HIPAA safety rules)
  const emergencyKeywords = ['pain', 'swelling', 'bleed', 'broke', 'knocked', 'accident', 'emergency', 'urgent', 'swollen', 'throbbing'];
  const isEmergency = emergencyKeywords.some(keyword => lowerInput.includes(keyword));
  
  if (isEmergency && state.step !== 'HANDOFF') {
    // Return urgent handoff immediately
    const reply = "I understand you are experiencing an urgent issue. Since this sounds like an emergency, I am flagging this chat for our clinical team to contact you immediately. A staff member will call you shortly. In the meantime, if you have a life-threatening emergency, please call 911 or visit the nearest ER.";
    
    // Update conversation status in database
    await db.conversation.update({
      where: { id: conversationId },
      data: { status: 'HANDOFF_REQUESTED' },
    });

    return {
      reply,
      status: 'HANDOFF_REQUESTED',
    };
  }

  // 4. Check for General Knowledge Base FAQ match
  const faqAnswer = await matchFAQ(cleanInput, clinic.id);
  if (faqAnswer) {
    let followUpPrompt = "";
    
    // Append standard prompt back based on current state to guide patient
    if (state.step === 'WELCOME') {
      followUpPrompt = "\n\nWould you like to book an appointment with us? (Type 'Book Appointment' or click below)";
    } else if (state.step === 'COLLECTING_NAME') {
      followUpPrompt = "\n\nReturning to your scheduling, what is your full name?";
    } else if (state.step === 'COLLECTING_PHONE') {
      followUpPrompt = `\n\nThanks! Now, what is the best phone number to reach you at, ${state.name || 'there'}?`;
    } else if (state.step === 'COLLECTING_EMAIL') {
      followUpPrompt = "\n\nWhat is your email address for appointment updates?";
    } else if (state.step === 'COLLECTING_INSURANCE') {
      followUpPrompt = "\n\nDo you have dental insurance you would like us to verify?";
    } else if (state.step === 'SELECTING_SERVICE') {
      followUpPrompt = "\n\nWhich service are you looking to book?";
    } else if (state.step === 'SELECTING_DOCTOR') {
      followUpPrompt = "\n\nDo you have a doctor preference?";
    } else if (state.step === 'SELECTING_DAY') {
      followUpPrompt = "\n\nWhich day next week works best?";
    } else if (state.step === 'SELECTING_TIME') {
      followUpPrompt = "\n\nWhich of those timeslots works best?";
    } else if (state.step === 'CONFIRMING_BOOKING') {
      followUpPrompt = "\n\nIs the booking details summary correct? (Type 'Yes' to confirm or 'No' to edit)";
    }

    return {
      reply: `${faqAnswer}${followUpPrompt}`,
      status: 'ACTIVE',
    };
  }

  // 5. Run local State Machine logic
  let reply = '';
  let status: 'ACTIVE' | 'HANDOFF_REQUESTED' | 'COMPLETED' = 'ACTIVE';
  let patientUpdated = false;
  let appointmentBooked = false;

  // Let's check which state step we are currently waiting for patient response on
  switch (state.step) {
    case 'WELCOME':
      // Check if patient wants to book
      const wantsToBook = ['book', 'appoint', 'sched', 'clean', 'exam', 'root', 'implant', 'whitening', 'consult', 'visit'].some(w => lowerInput.includes(w));
      if (wantsToBook) {
        reply = "I would be happy to help you schedule an appointment. To start, could you please tell me your full name?";
      } else {
        reply = "Hi 👋 Welcome to Smile Dental Clinic. I am your AI receptionist. How can I help you today?\n\nOptions:\n🦷 Book Appointment\n💰 Pricing Question\n📍 Location\n📄 Insurance\n❓ Ask Question";
      }
      break;

    case 'COLLECTING_NAME':
      // Input is the patient's name
      state.name = cleanInput;
      reply = `Thank you, ${cleanInput}. What is the best phone number to reach you?`;
      break;

    case 'COLLECTING_PHONE':
      // Input is the phone
      state.phone = cleanInput;
      reply = "Got it. And what is your email address? We will send your appointment confirmations there.";
      break;

    case 'COLLECTING_EMAIL':
      // Input is the email
      state.email = cleanInput;
      reply = "Do you have dental insurance you would like us to verify? (If yes, please tell me the provider name. If not, type 'None')";
      break;

    case 'COLLECTING_INSURANCE':
      // Input is the insurance provider
      state.insurance = cleanInput;
      
      // List services
      const serviceOptions = clinic.services.map((s, i) => `${i + 1}. ${s.name} ($${s.price})`).join('\n');
      reply = `Thank you. Which service are you looking to book today? Here are our popular treatments:\n\n${serviceOptions}\n\nPlease type the service name or number.`;
      break;

    case 'SELECTING_SERVICE':
      // Input is the service selection (can be index or name)
      let selectedService = clinic.services[0]; // fallback
      const matchIdx = parseInt(cleanInput) - 1;
      if (!isNaN(matchIdx) && matchIdx >= 0 && matchIdx < clinic.services.length) {
        selectedService = clinic.services[matchIdx];
      } else {
        // Try keyword matching
        const matched = clinic.services.find(s => lowerInput.includes(s.name.toLowerCase()) || s.name.toLowerCase().includes(lowerInput));
        if (matched) selectedService = matched;
      }
      
      // Save selected service
      state.serviceId = selectedService.id;
      state.serviceName = selectedService.name;

      // List doctors
      const doctorOptions = clinic.doctors.map((d, i) => `${i + 1}. ${d.name} (${d.specialty})`).join('\n');
      reply = `Understood: booking ${selectedService.name}.\n\nWhich doctor would you like to see?\n\n${doctorOptions}\n\nPlease type the doctor's name, number, or type 'First Available'.`;
      break;

    case 'SELECTING_DOCTOR':
      // Input is doctor selection
      let selectedDoc = clinic.doctors[0]; // fallback
      const docIdx = parseInt(cleanInput) - 1;
      if (!isNaN(docIdx) && docIdx >= 0 && docIdx < clinic.doctors.length) {
        selectedDoc = clinic.doctors[docIdx];
      } else {
        const matched = clinic.doctors.find(d => lowerInput.includes(d.name.toLowerCase()) || d.name.toLowerCase().includes(lowerInput));
        if (matched) selectedDoc = matched;
      }

      state.doctorId = selectedDoc.id;
      state.doctorName = selectedDoc.name;

      reply = `Excellent choice: ${selectedDoc.name}.\n\nWhich day next week works best for your appointment? (e.g. Monday, Tuesday, Wednesday, Thursday, Friday, Saturday)`;
      break;

    case 'SELECTING_DAY':
      // Input is the day
      state.day = cleanInput;
      
      reply = `We have the following timeslots open on next ${cleanInput}:\n1. 9:30 AM\n2. 11:00 AM\n3. 2:00 PM\n4. 3:30 PM\n\nWhich of these works best for you?`;
      break;

    case 'SELECTING_TIME':
      // Input is the time
      let timeVal = cleanInput;
      if (cleanInput === '1') timeVal = '9:30 AM';
      else if (cleanInput === '2') timeVal = '11:00 AM';
      else if (cleanInput === '3') timeVal = '2:00 PM';
      else if (cleanInput === '4') timeVal = '3:30 PM';
      
      state.time = timeVal;

      // Reconstruct historical variables from parsed states
      // We will parse all inputs to build summary
      const name = historyForParse.find((_, idx) => historyForParse[idx - 1]?.content.includes('tell me your full name'))?.content || 'Patient';
      const phone = historyForParse.find((_, idx) => historyForParse[idx - 1]?.content.includes('phone number to reach you'))?.content || 'N/A';
      const email = historyForParse.find((_, idx) => historyForParse[idx - 1]?.content.includes('email address'))?.content || 'N/A';
      const insurance = historyForParse.find((_, idx) => historyForParse[idx - 1]?.content.includes('dental insurance you would like us to verify'))?.content || 'N/A';
      
      // Find the service name and doctor name
      const serviceSelected = historyForParse.find((_, idx) => historyForParse[idx - 1]?.content.includes('Which service are you looking to book'))?.content || 'Teeth Cleaning & Exam';
      let cleanServ = serviceSelected;
      const parsedSIdx = parseInt(serviceSelected) - 1;
      if (!isNaN(parsedSIdx) && parsedSIdx >= 0 && parsedSIdx < clinic.services.length) {
        cleanServ = clinic.services[parsedSIdx].name;
      }

      const doctorSelected = historyForParse.find((_, idx) => historyForParse[idx - 1]?.content.includes('Do you have a doctor preference'))?.content || 'First Available';
      let cleanDoc = doctorSelected;
      const parsedDIdx = parseInt(doctorSelected) - 1;
      if (!isNaN(parsedDIdx) && parsedDIdx >= 0 && parsedDIdx < clinic.doctors.length) {
        cleanDoc = clinic.doctors[parsedDIdx].name;
      }
      
      const dayVal = historyForParse.find((_, idx) => historyForParse[idx - 1]?.content.includes('Which day next week works best'))?.content || 'Monday';

      reply = `Thank you. Here is a summary of your appointment booking details:\n\n` + 
              `👤 **Patient**: ${name}\n` +
              `📞 **Phone**: ${phone}\n` +
              `✉️ **Email**: ${email}\n` +
              `📄 **Insurance**: ${insurance}\n` +
              `🦷 **Service**: ${cleanServ}\n` +
              `👨‍⚕️ **Physician**: ${cleanDoc}\n` +
              `📅 **Scheduled**: Next ${dayVal} at ${timeVal}\n\n` +
              `Is this correct? (Type 'Yes' to confirm or 'No' to restart)`;
      break;

    case 'CONFIRMING_BOOKING':
      if (lowerInput.startsWith('y')) {
        // 1. Reconstruct all inputs from message log
        const nameVal = historyForParse.find((_, idx) => historyForParse[idx - 1]?.content.includes('tell me your full name'))?.content || 'Patient';
        const phoneVal = historyForParse.find((_, idx) => historyForParse[idx - 1]?.content.includes('phone number to reach you'))?.content || 'N/A';
        const emailVal = historyForParse.find((_, idx) => historyForParse[idx - 1]?.content.includes('email address'))?.content || 'N/A';
        const insVal = historyForParse.find((_, idx) => historyForParse[idx - 1]?.content.includes('dental insurance you would like us to verify'))?.content || 'N/A';
        
        const serviceInput = historyForParse.find((_, idx) => historyForParse[idx - 1]?.content.includes('Which service are you looking to book'))?.content || '';
        let serv = clinic.services[0];
        const sIdx = parseInt(serviceInput) - 1;
        if (!isNaN(sIdx) && sIdx >= 0 && sIdx < clinic.services.length) {
          serv = clinic.services[sIdx];
        } else {
          const matched = clinic.services.find(s => serviceInput.toLowerCase().includes(s.name.toLowerCase()) || s.name.toLowerCase().includes(serviceInput.toLowerCase()));
          if (matched) serv = matched;
        }

        const doctorInput = historyForParse.find((_, idx) => historyForParse[idx - 1]?.content.includes('Do you have a doctor preference'))?.content || '';
        let doc = clinic.doctors[0];
        const dIdx = parseInt(doctorInput) - 1;
        if (!isNaN(dIdx) && dIdx >= 0 && dIdx < clinic.doctors.length) {
          doc = clinic.doctors[dIdx];
        } else {
          const matched = clinic.doctors.find(d => doctorInput.toLowerCase().includes(d.name.toLowerCase()) || d.name.toLowerCase().includes(doctorInput.toLowerCase()));
          if (matched) doc = matched;
        }

        const dayValue = historyForParse.find((_, idx) => historyForParse[idx - 1]?.content.includes('Which day next week works best'))?.content || 'Monday';
        const timeValue = historyForParse.find((_, idx) => historyForParse[idx - 1]?.content.includes('timeslots open on'))?.content || '9:30 AM';
        let parsedTime = timeValue;
        if (timeValue === '1') parsedTime = '9:30 AM';
        else if (timeValue === '2') parsedTime = '11:00 AM';
        else if (timeValue === '3') parsedTime = '2:00 PM';
        else if (timeValue === '4') parsedTime = '3:30 PM';

        // 2. Upsert Patient CRM Record
        let patient = await db.patient.findFirst({
          where: { clinicId: clinic.id, phone: phoneVal },
        });

        if (!patient) {
          patient = await db.patient.create({
            data: {
              name: nameVal,
              phone: phoneVal,
              email: emailVal,
              insurance: insVal === 'None' || insVal === 'none' ? 'Self-pay' : insVal,
              notes: `Auto-qualified by CareDesk AI. Primary reason: ${serv.name}`,
              clinicId: clinic.id,
            },
          });
        }
        
        // Link conversation to patient
        await db.conversation.update({
          where: { id: conversationId },
          data: { patientId: patient.id },
        });

        // 3. Create Appointment (Calculate next week's date)
        const daysMap: { [key: string]: number } = { monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6, sunday: 0 };
        const targetDay = daysMap[dayValue.toLowerCase()] || 1;
        const apptDate = new Date();
        // Calculate offset to next week's target day
        const currentDay = apptDate.getDay();
        let distance = targetDay - currentDay;
        if (distance <= 0) distance += 7; // force next week
        apptDate.setDate(apptDate.getDate() + distance);
        
        // Extract hour and min from "9:30 AM" or similar
        const timeParts = parsedTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
        if (timeParts) {
          let hrs = parseInt(timeParts[1]);
          const mins = parseInt(timeParts[2]);
          const meridian = timeParts[3].toUpperCase();
          if (meridian === 'PM' && hrs < 12) hrs += 12;
          if (meridian === 'AM' && hrs === 12) hrs = 0;
          apptDate.setHours(hrs, mins, 0, 0);
        } else {
          apptDate.setHours(9, 30, 0, 0);
        }

        await db.appointment.create({
          data: {
            clinicId: clinic.id,
            patientId: patient.id,
            serviceId: serv.id,
            doctorId: doc.id,
            dateTime: apptDate,
            status: 'CONFIRMED',
          },
        });

        // 4. Update Analytics for today
        const startOfDay = new Date();
        startOfDay.setHours(0,0,0,0);
        const endOfDay = new Date();
        endOfDay.setHours(23,59,59,999);

        let analytics = await db.analytics.findFirst({
          where: {
            clinicId: clinic.id,
            date: { gte: startOfDay, lte: endOfDay },
          },
        });

        if (!analytics) {
          analytics = await db.analytics.create({
            data: {
              clinicId: clinic.id,
              date: new Date(),
              conversations: 1,
              bookings: 1,
              leads: 1,
              revenueEst: serv.price,
              missedCallsSaved: 1,
            },
          });
        } else {
          await db.analytics.update({
            where: { id: analytics.id },
            data: {
              bookings: { increment: 1 },
              leads: { increment: 1 },
              revenueEst: { increment: serv.price },
            },
          });
        }

        // 5. Send confirmation notifications (Automation Simulation)
        const confirmationAuto = await db.automation.findFirst({
          where: { clinicId: clinic.id, type: 'CONFIRMATION' },
        });

        if (confirmationAuto && confirmationAuto.enabled) {
          const formattedContent = confirmationAuto.template
            .replace('{patient_name}', patient.name)
            .replace('{service_name}', serv.name)
            .replace('{doctor_name}', doc.name)
            .replace('{appointment_time}', apptDate.toLocaleString());
            
          await db.automationLog.create({
            data: {
              automationId: confirmationAuto.id,
              recipient: patient.phone || patient.email || 'N/A',
              content: formattedContent,
              status: 'SENT',
            },
          });
        }

        // Log audit trail
        await db.auditLog.create({
          data: {
            clinicId: clinic.id,
            action: 'APPOINTMENT_AUTOBOOK',
            details: `Appointment booked automatically via CareDesk chat for ${patient.name} (${serv.name} with ${doc.name}).`,
          },
        });

        reply = `🎉 **Confirmed!** Your appointment for **${serv.name}** with **${doc.name}** is scheduled for **${apptDate.toLocaleString()}**.\n\nWe have sent a text message and email confirmation. Thank you for choosing Smile Dental Clinic! Let me know if there's anything else I can answer for you.`;
        status = 'COMPLETED';
        appointmentBooked = true;
        
        await db.conversation.update({
          where: { id: conversationId },
          data: { status: 'COMPLETED' },
        });

      } else {
        reply = "No problem. Let's restart our scheduling process. What is your full name?";
      }
      break;

    default:
      reply = "Hi! How can I help you today? If you want to book an appointment, please type 'Book Appointment'.";
  }

  return {
    reply,
    status,
    patientUpdated,
    appointmentBooked,
  };
}
