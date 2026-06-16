import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // 1. Clean up database
    await db.auditLog.deleteMany({});
    await db.analytics.deleteMany({});
    await db.automationLog.deleteMany({});
    await db.automation.deleteMany({});
    await db.knowledgeEntry.deleteMany({});
    await db.appointment.deleteMany({});
    await db.service.deleteMany({});
    await db.doctor.deleteMany({});
    await db.message.deleteMany({});
    await db.conversation.deleteMany({});
    await db.patient.deleteMany({});
    await db.user.deleteMany({});
    await db.clinic.deleteMany({});

    // 2. Create Clinic
    const clinic = await db.clinic.create({
      data: {
        name: 'Smile Dental Clinic',
        subdomain: 'smile-dental',
        address: '120 Medical Plaza, Suite 400, Downtown',
        phone: '(555) 234-5678',
        email: 'hello@smileclinic.com',
        logo: '🦷',
        hours: JSON.stringify({
          weekday: '8:00 AM - 5:00 PM',
          saturday: '9:00 AM - 2:00 PM',
          sunday: 'Closed',
        }),
      },
    });

    // 3. Create Admin User
    await db.user.create({
      data: {
        name: 'Dr. Sarah Mitchell',
        email: 'admin@smileclinic.com',
        role: 'ADMIN',
        clinicId: clinic.id,
      },
    });

    // 4. Create Services
    const servicesData = [
      { name: 'Teeth Cleaning & Exam', price: 99.00, durationMin: 30 },
      { name: 'Root Canal Therapy', price: 850.00, durationMin: 60 },
      { name: 'Dental Implant Consultation', price: 150.00, durationMin: 45 },
      { name: 'Emergency Dental Consultation', price: 199.00, durationMin: 45 },
      { name: 'Teeth Whitening', price: 299.00, durationMin: 60 },
    ];
    
    const services = [];
    for (const service of servicesData) {
      const created = await db.service.create({
        data: {
          ...service,
          clinicId: clinic.id,
        },
      });
      services.push(created);
    }

    // 5. Create Doctors
    const doctorsData = [
      { name: 'Dr. Sarah Mitchell', specialty: 'General Dentistry', availability: JSON.stringify({ Mon: ['08:00', '12:00'], Tue: ['08:00', '17:00'], Wed: ['08:00', '17:00'], Thu: ['08:00', '17:00'], Fri: ['08:00', '12:00'] }) },
      { name: 'Dr. James Zhao', specialty: 'Endodontics (Root Canals)', availability: JSON.stringify({ Mon: ['09:00', '17:00'], Wed: ['09:00', '17:00'], Fri: ['09:00', '17:00'] }) },
      { name: 'Dr. Elena Rostova', specialty: 'Implantology & Oral Surgery', availability: JSON.stringify({ Tue: ['08:00', '17:00'], Thu: ['08:00', '17:00'], Sat: ['09:00', '14:00'] }) },
    ];

    const doctors = [];
    for (const doctor of doctorsData) {
      const created = await db.doctor.create({
        data: {
          ...doctor,
          clinicId: clinic.id,
        },
      });
      doctors.push(created);
    }

    // 6. Create Knowledge Entries (FAQs)
    const faqs = [
      { category: 'FAQ', question: 'Do you accept insurance?', answer: 'Yes, we accept major PPO insurance plans including Delta Dental, Aetna, Cigna, MetLife, and Blue Cross Blue Shield. We do not accept Medicaid or HMO plans.' },
      { category: 'FAQ', question: 'What are your hours?', answer: 'We are open Monday-Friday from 8:00 AM to 5:00 PM, and Saturday from 9:00 AM to 2:00 PM. We are closed on Sundays.' },
      { category: 'GENERAL', question: 'Where is the clinic located?', answer: 'Our clinic is located at 120 Medical Plaza, Suite 400, Downtown. Free valet parking is available for patients.' },
      { category: 'POLICY', question: 'What is your cancellation policy?', answer: 'We require 24 hours notice for cancellations. Late cancellations or no-shows are subject to a $50 fee.' },
      { category: 'PRICING', question: 'How much does dental implant cost?', answer: 'Dental implant cost depends on individual cases. A consultation is $150. A single implant typically starts at $2,500, which can be partially covered by PPO insurance.' },
    ];

    for (const faq of faqs) {
      await db.knowledgeEntry.create({
        data: {
          ...faq,
          clinicId: clinic.id,
        },
      });
    }

    // 7. Create Automations
    const automations = [
      { type: 'CONFIRMATION', channel: 'SMS', template: 'Hi {patient_name}, your appointment for {service_name} at Smile Dental with {doctor_name} is confirmed for {appointment_time}. See you soon!' },
      { type: 'REMINDER_24H', channel: 'SMS', template: 'Friendly reminder: {patient_name}, you have a dental visit tomorrow at {appointment_time} for {service_name}. Reply 1 to Confirm or 2 to Reschedule.' },
      { type: 'FOLLOW_UP', channel: 'EMAIL', template: 'Hi {patient_name},\n\nThank you for choosing Smile Dental Clinic! Dr. {doctor_name} and our team hope you had a pleasant experience during your {service_name} visit.\n\nCould you please take 1 minute to leave us feedback on how we did? We appreciate your support!\n\nWarm regards,\nSmile Dental Team' },
    ];

    for (const auto of automations) {
      await db.automation.create({
        data: {
          ...auto,
          clinicId: clinic.id,
        },
      });
    }

    // 8. Create Patients (CRM data)
    const patientsData = [
      { name: 'Sarah Connor', email: 'sarah.c@sky.net', phone: '(555) 987-6543', insurance: 'Delta Dental PPO', notes: 'Prefers morning appointments. High sensitivity to cold.' },
      { name: 'John Doe', email: 'johndoe@gmail.com', phone: '(555) 123-4567', insurance: 'Aetna PPO', notes: 'New patient. Needs full mouth X-rays.' },
      { name: 'Marcus Wright', email: 'marcus.w@cyberdyne.com', phone: '(555) 555-8291', insurance: 'None (Self-pay)', notes: 'Interested in dental implants for lower molars.' },
      { name: 'Ellen Ripley', email: 'ripley@nostromo.org', phone: '(555) 888-2947', insurance: 'Cigna PPO', notes: 'Emergency root canal completed. Needs follow-up crown.' },
      { name: 'Thomas Anderson', email: 'neo@matrix.io', phone: '(555) 101-0101', insurance: 'MetLife Dental', notes: 'Excellent oral health. Routine scaling.' },
      { name: 'Bruce Wayne', email: 'bruce@waynecorp.com', phone: '(555) 900-1939', insurance: 'Blue Cross PPO', notes: 'Prefers high privacy. Requested Saturday slots.' },
      { name: 'Clark Kent', email: 'clark.kent@dailyplanet.com', phone: '(555) 800-1938', insurance: 'Aetna PPO', notes: 'Extremely strong enamel. Regular cleaning.' },
      { name: 'Diana Prince', email: 'diana@themyscira.gov', phone: '(555) 700-1941', insurance: 'Delta Dental PPO', notes: 'Likes afternoon appointments.' },
    ];

    const patients = [];
    for (const patient of patientsData) {
      const created = await db.patient.create({
        data: {
          ...patient,
          clinicId: clinic.id,
        },
      });
      patients.push(created);
    }

    // 9. Create Historical Conversations and Messages
    const conversationsData = [
      {
        patient: patients[0],
        status: 'COMPLETED',
        messages: [
          { sender: 'PATIENT', content: 'Hi, I need to schedule a cleaning please.' },
          { sender: 'AI', content: 'Hi Sarah! I would be happy to help you book a Teeth Cleaning & Exam. Which day of the week works best for you?' },
          { sender: 'PATIENT', content: 'Tuesday mornings work best.' },
          { sender: 'AI', content: 'Great, Dr. Sarah Mitchell has availability on Tuesday at 9:00 AM. Does that work?' },
          { sender: 'PATIENT', content: 'Yes, that works.' },
          { sender: 'AI', content: 'Perfect! I have booked you for a Teeth Cleaning & Exam on Tuesday at 9:00 AM with Dr. Sarah Mitchell.' },
        ],
      },
      {
        patient: patients[2],
        status: 'ACTIVE',
        messages: [
          { sender: 'PATIENT', content: 'How much do you charge for dental implants?' },
          { sender: 'AI', content: 'Dental implant consultations are $150. A single implant starts at $2,500. This depends on whether X-rays or bone grafting are needed. Would you like to schedule a consultation with our implantologist, Dr. Elena Rostova?' },
          { sender: 'PATIENT', content: 'Yes, but does insurance cover this?' },
          { sender: 'AI', content: 'Most PPO insurance plans offer partial coverage for dental implants. We can verify your specific benefits when you come in for your consultation. Do you have a preferred day for a consultation?' },
        ],
      },
      {
        patient: patients[3],
        status: 'HANDOFF_REQUESTED',
        messages: [
          { sender: 'PATIENT', content: 'I have severe throbbing pain in my upper tooth. It started last night and now my face is swollen. I need help immediately.' },
          { sender: 'AI', content: 'I understand you are experiencing severe pain and swelling. Since this sounds like an urgent dental emergency, I will immediately connect you with our clinic team to get you scheduled for an priority emergency visit. One of our staff members will contact you at your phone number shortly.' },
        ],
      },
      {
        patient: patients[1],
        status: 'COMPLETED',
        messages: [
          { sender: 'PATIENT', content: 'Do you accept Aetna?' },
          { sender: 'AI', content: 'Yes! We accept Aetna PPO plans. Would you like to book an appointment with us?' },
          { sender: 'PATIENT', content: 'Yes, need an exam.' },
          { sender: 'AI', content: 'Great! Let\'s get you scheduled. To start, could you please provide your full name, phone number, and email address?' },
          { sender: 'PATIENT', content: 'John Doe, 555-123-4567, johndoe@gmail.com' },
          { sender: 'AI', content: 'Thank you, John. Which service do you need: 1. Teeth Cleaning & Exam, 2. Root Canal, 3. Emergency Consultation?' },
          { sender: 'PATIENT', content: 'Teeth cleaning and exam.' },
          { sender: 'AI', content: 'Perfect. Which doctor would you like to see? We have Dr. Sarah Mitchell (General Dentistry) or Dr. Elena Rostova.' },
          { sender: 'PATIENT', content: 'Dr. Mitchell.' },
          { sender: 'AI', content: 'Excellent. What day is best for you next week?' },
          { sender: 'PATIENT', content: 'Monday afternoon.' },
          { sender: 'AI', content: 'Dr. Mitchell is available on Monday at 2:00 PM or 3:30 PM. Which works best?' },
          { sender: 'PATIENT', content: '3:30 works.' },
          { sender: 'AI', content: 'Perfect! Your Teeth Cleaning & Exam is scheduled for Monday at 3:30 PM with Dr. Sarah Mitchell.' },
        ],
      },
    ];

    for (const conv of conversationsData) {
      const dbConv = await db.conversation.create({
        data: {
          clinicId: clinic.id,
          patientId: conv.patient?.id || null,
          status: conv.status,
          summary: conv.messages[conv.messages.length - 1].content.slice(0, 100),
        },
      });

      for (const msg of conv.messages) {
        await db.message.create({
          data: {
            conversationId: dbConv.id,
            sender: msg.sender,
            content: msg.content,
          },
        });
      }
    }

    // 10. Create Historical Appointments
    const appointmentsData = [
      { patient: patients[0], service: services[0], doctor: doctors[0], dateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), status: 'CONFIRMED' }, // In 2 days
      { patient: patients[1], service: services[0], doctor: doctors[0], dateTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), status: 'PENDING' }, // In 5 days
      { patient: patients[3], service: services[1], doctor: doctors[1], dateTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), status: 'COMPLETED' }, // Yesterday
      { patient: patients[4], service: services[0], doctor: doctors[0], dateTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), status: 'COMPLETED' }, // 3 days ago
      { patient: patients[5], service: services[2], doctor: doctors[2], dateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), status: 'CONFIRMED' }, // In 3 days
      { patient: patients[6], service: services[0], doctor: doctors[0], dateTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), status: 'CONFIRMED' }, // Tomorrow
      { patient: patients[7], service: services[4], doctor: doctors[0], dateTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), status: 'PENDING' }, // In 4 days
    ];

    for (const appt of appointmentsData) {
      await db.appointment.create({
        data: {
          clinicId: clinic.id,
          patientId: appt.patient.id,
          serviceId: appt.service.id,
          doctorId: appt.doctor.id,
          dateTime: appt.dateTime,
          status: appt.status,
        },
      });
    }

    // 11. Create Analytics History (last 14 days)
    const analyticsHistory = [];
    const baseDate = new Date();
    
    for (let i = 14; i >= 0; i--) {
      const date = new Date(baseDate);
      date.setDate(baseDate.getDate() - i);
      
      // Generate somewhat realistic, variable numbers
      const conversations = Math.floor(25 + Math.random() * 25);
      const bookings = Math.floor(5 + Math.random() * 12);
      const leads = Math.floor(12 + Math.random() * 15);
      const revenueEst = bookings * 280; // Mock average booking value
      const missedCallsSaved = Math.floor(4 + Math.random() * 8);

      analyticsHistory.push({
        clinicId: clinic.id,
        date,
        conversations,
        bookings,
        leads,
        revenueEst,
        missedCallsSaved,
      });
    }

    for (const record of analyticsHistory) {
      await db.analytics.create({
        data: record,
      });
    }

    // 12. Create default Audit Logs
    await db.auditLog.create({
      data: {
        clinicId: clinic.id,
        action: 'SYSTEM_SEED',
        details: 'Initial database seed of Smile Dental Clinic sandbox successfully executed.',
      },
    });

    return NextResponse.json({ success: true, message: 'Database reset and successfully seeded with sandbox data.' });
  } catch (error: any) {
    console.error('Seeding error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
