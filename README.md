# Red Launch Platform

A full-stack **Next.js** platform that acts as a **command center** for supply chain risk analysis, predictive logistics, and real-time monitoring.  

---

## Dashboards

- **Interactive Mission Timeline:**  
  Visualizes critical events such as Aircraft Arrival, Diagnostics, Maintenance Planning, Parts Ordering, and Final QA.

- **Priority Alerts:**  
  Real-time alerts for supplier delays, weather risks, and new contract events.

- **Resource Allocation Panel:**  
  Live view of personnel, equipment, logistics, and reserve capacity.

- **Secure Team Chat:**  
  Built-in collaboration channel for operators (secure comms, MFA enabled).

- **Global Risk Tools:**  
  - Logistic Risk Analysis  
  - Supplier Risk Assessment  
  - Predictive Inventory  
  - Mesh Network Status  
  - Predictive Logistics Simulation

---

## System Architecture

```
Frontend (Next.js UI)
├── Mission Timeline (React Flow)
├── Alerts & Notifications (server-pushed events)
├── Resource Allocation (live metrics)
└── Secure Team Chat (websocket channel)
API Layer (Next.js Route Handlers)
├── analyze / insight (OpenAI LLMs)
├── predict-disruption (risk forecasts)
├── threatfox (external threat intel)
└── risk-intel / tracking (domain-specific logic)
External Services
├── Supabase (auth, future DB)
├── OpenAI API (GPT models)
└── ThreatFox API
```

## File Structure

```
├── public/ # Static assets (icons, logos)
├── src/
│ ├── app/
│ │ ├── api/ # All backend route handlers
│ │ ├── new_dashboard/ # Main dashboard + timeline view
│ │ ├── map/ # Map visualization
│ │ ├── supplier-risk/ # Supplier risk analysis pages
│ │ ├── predictive-inventory/ # Inventory simulation
│ │ └── login/ # Authentication flow
│ ├── components/ # Reusable React components
│ ├── lib/ # Supabase client, DB mocks, risk engine stubs
│ └── generated/prisma/ # Prisma client artifacts (schema TBD)
├── tailwind.config.js # Tailwind theme & custom colors
├── package.json # Scripts & dependencies
└── 7_30 Dataset - Sheet1.csv # Sample dataset for prototyping

```

## Running the Project

1. **Install dependencies**
```
npm install
```

2. **Setup environment variables (.env.local):**
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

OPENAI_API_KEY=sk-...
THREATFOX_API_KEY=...

NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...
```
```
🚩 Note: Nitesh, you have exposted all other keys except OpenAI API Key. I've flagged this.
```
3. **Run development server (backend)**
```
node src/server.js
```
4. **Run development server (frontend)**
```
npm run dev
```
Then open http://localhost:3000

## Tech Stacks
| Layer             | Details                                                          |
| ----------------- | ---------------------------------------------------------------- |
| **Frontend**      | Next.js (App Router), TypeScript, Tailwind                       |
| **Backend**       | Serverless API Routes in Next.js                                 |
| **Auth**          | Supabase Auth (client + server-ready)                            |
| **AI/Analytics**  | OpenAI GPT models for insights & disruption prediction           |
| **Data**          | Mock DB layer (planned migration to Postgres + Prisma)           |
| **Threat Intel**  | ThreatFox API integration                                        |
| **Collaboration** | Team Chat (UI component + placeholder backend)                   |

## Development Notes
Secrets: Move hardcoded API keys to ```.env.local```
