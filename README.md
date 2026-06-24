Created & Developed by [Mubashir Ali](#developer-creator) (Full-Stack Healthcare Technology Engineer | AI Healthcare Solutions Builder)

# CareDesk AI — AI Front Desk Operating System for Clinics

CareDesk AI is a premium, high-fidelity **AI Front Desk Operating System for Healthcare Clinics** designed to manage the complete patient journey—from first website visit and qualification to automated follow-up. 

Rather than a simple chat widget, CareDesk AI functions as a complete **AI Front Desk Employee** that runs 24/7, helping clinics increase patient bookings, response speeds, capture revenue leakage, and reduce staff burden.

---

## 🚀 Key Platform Features

### 1. AI Receptionist Command Center
* **Control Center UI**: Provides clinic admins with a real-time monitor of their AI receptionist employee (**"Sarah"**).
* **Live Status**: Displays an active status indicator (**🟢 Online**) along with daily performance stats (Conversations, Appointments Booked, Questions Solved %, and saved Revenue Opportunities).

### 2. AI Employee Training Studio
* **Clinic Brain Builder**: Allows staff to configure FAQs, medical treatments, and physician shifts.
* **Knowledge base Sync Checklist**: Displays active synchronized categories (`✓ Dental Services`, `✓ Insurance Rules`, `✓ Appointment Policy`, `✓ Doctor Information`).
* **Bulk File Ingestion**: Contains drag-and-drop slots for uploading clinical leaflets, policy PDFs, and scraping website URLs.
* **Ingestion Version Control**: Logs system edits (e.g. `Pricing details updated: June 2026 | Changed by: Admin`).

### 3. AI Conversation Simulator
* **Pre-Live Tester Workspace**: Allows administrators to text the configured AI assistant offline to review response formatting.
* **Instant Intent Feedback**: Automatically classifies quality confidence parameters:
  * **Response Quality**: *Excellent*
  * **Booking Ability**: *Qualified*
  * **Improvements**: *None*

### 4. AI Voice Receptionist Dashboard
* **Telephony Metrics**: Integrates Twilio-configured call center stats:
  * **Calls Today**: 250
  * **Handled by AI**: 210 (84% Solved)
  * **Transferred to Staff**: 40 (16% Routed)
* **Greeter synthesis**: A speech playground using native browser `SpeechSynthesis` to preview audio greeting rules.

### 5. Patient CRM & AI Lead Scoring
* **CRM Registry Table**: Searchable registry showing verified insurance details, booking statuses, and **AI Lead Scores**.
* **AI Lead Scoring Assessment**: Automatically evaluates patient records as **High**, **Medium**, or **Low** based on insurance status and high-value treatments.
* **Patient Journey Card**: Renders active pipeline logs (*Status: New Lead, Interest: Implant, Last Contact: Yesterday, Next Action: Book Consultation*).

### 6. AI Triage & Emergency Classification
* **Emergency Classification**: Scans conversations for urgent keywords (severe pain, bleeding, swelling) to set triage categories:
  * `Category: Emergency Triage` | `Priority: High` | `Suggested Action: Book Urgent Slot`
* **Urgent Human Handoff**: Pauses the AI receptionist and triggers a visual alert banner on the administrator panel.
* **AI Conversation Summary**: Shows preparatory briefing context (*Need, Budget, Recommended Action*) so staff can quickly resume human control.

### 7. AI Follow-Up Automation Engine Map
* **Follow-up campaigns**: Visual delay-node flow modeling the follow-up pipeline:
  * `1. Inbound Inquiry Captured` ➔ `2. Wait 2 Hours (Delay)` ➔ `3. Auto SMS Check-in` ➔ `4. Wait 3 Days`

### 8. Revenue Pipeline & Business Insights
* **Revenue funnel stages**: Stages numerical pipeline statistics: `New Leads (260) → Consultations (158) → Treatment Accepted (112) → Closed Revenue ($68,400)`.
* **AI Business Explanation**: Outlines actionable insights to improve pricing structures and increase patient bookings.

---

## 🛠️ Technology Stack

* **Frontend Framework**: Next.js App Router (React 19, TypeScript)
* **Styling**: Vanilla CSS, flexbox grid systems, obsidian theme palettes.
* **Database & ORM**: SQLite (`dev.db`) & Prisma ORM.
* **Charting Engine**: Recharts (for analytics funnels, cumulative line charts, and metrics bars).
* **Iconography**: Lucide React.

---

## 📂 Project Directory Structure

```text
CareDesk/
├── prisma/
│   ├── dev.db                 # SQLite local database file
│   ├── schema.prisma          # Prisma database models (Clinic, Patient, CRM, etc.)
│   └── seed.js                # Database seeder file
├── src/
│   ├── app/
│   │   ├── (marketing)/       # Marketing pages (Home, Features, Pricing, Contact, etc.)
│   │   ├── api/               # API Router Handlers (chat, setup, CRM notes, knowledge)
│   │   ├── dashboard/         # Portal pages (overview, CRM table, automations, settings)
│   │   ├── demo/              # Side-by-side interactive playground sandbox
│   │   ├── layout.tsx         # Global app styles and layout wrapper
│   │   └── globals.css        # Root design token variables & layout styles
│   ├── components/
│   │   └── ChatWidget.tsx     # Floating patient chat launcher component
│   └── lib/
│       ├── db.ts              # Database connection library
│       └── assistant.ts       # AI conversation rules state-machine & intent matcher
└── next.config.ts             # Next.js configurations
```

---

## ⚙️ Local Development Setup

### 1. Install Dependencies
Run npm installer to pull packages:
```bash
npm install
```

### 2. Database Migrations
Run Prisma migrations to compile SQLite schemas:
```bash
npx prisma migrate dev --name init
```

### 3. Run Database Seeding
Execute the offline database seeder script to populate mock analytics, CRM records, FAQs, and shift details:
```bash
node prisma/seed.js
```

### 4. Run Development Server
Launch the compiler server locally on port 3000:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the homepage. Open [http://localhost:3000/demo](http://localhost:3000/demo) to launch the sandbox simulator, or [http://localhost:3000/dashboard](http://localhost:3000/dashboard) to log into the admin operating system portal.

---

## 🔬 Production Compilation

Validate type checks and compile optimized static pages:
```bash
npm run build
```
All static pages, API routes, and styling configurations will bundle and compile cleanly.

---

<a id="developer-creator"></a>
## 👤 Developer & Creator

I am a Full-Stack Healthcare Technology Developer specializing in building modern, scalable, and AI-powered healthcare platforms. I create high-performance digital solutions using React.js, Next.js, TypeScript, and Tailwind CSS to deliver fast, secure, and user-friendly experiences.

My expertise covers complete application development, from frontend architecture and responsive interfaces to backend systems powered by Node.js, REST APIs, GraphQL, PostgreSQL, and Prisma ORM. I build reliable platforms designed for scalability, performance, and long-term growth.

I work with modern cloud infrastructure including AWS, Vercel Edge, Google Cloud, Cloudflare CDN, Docker, and CI/CD pipelines to deploy secure and optimized applications.

With a strong focus on healthcare technology, I develop solutions including patient portals, AI automation systems, EHR integrations, and healthcare applications built around industry standards such as FHIR APIs and HIPAA compliance requirements.

My goal is to combine modern software engineering, cloud technologies, and healthcare innovation to help organizations build smarter digital experiences that improve patient engagement, operational efficiency, and healthcare delivery.

### 📫 Connect with Me

- 💼 **LinkedIn**: <a href="https://linkedin.com/in/mubashirali822" target="_blank" rel="noopener noreferrer">mubashirali822</a>
- 📧 **Email**: <a href="mailto:alimubashir822@gmail.com" target="_blank" rel="noopener noreferrer">alimubashir822@gmail.com</a>
- 🌐 **Website**: <a href="https://www.medclinicx.com/" target="_blank" rel="noopener noreferrer">medclinicx.com</a>
- 🏥 **View More Healthcare Solutions**: <a href="https://www.medclinicx.com/demo" target="_blank" rel="noopener noreferrer">medclinicx.com/demo</a>

⭐ *Building the next generation of digital healthcare technology.*
