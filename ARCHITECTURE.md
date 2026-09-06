# Architecture Specification: SkillLoop AI

## High-Level Design
SkillLoop AI is designed as a Next.js (App Router) full-stack application. For the hackathon MVP, the primary constraint is **demo reliability**. Therefore, state management is largely handled client-side via Zustand with pre-seeded demo data. This guarantees that the 2-minute pitch flow cannot be interrupted by network latency or API rate limits.

## Tech Stack
- **Framework:** Next.js 15 (React 19)
- **Styling:** Tailwind CSS + custom shadcn/ui components
- **State Management:** Zustand
- **Icons:** Lucide React
- **Data Visualizations:** Recharts (optional for further extensions)

## Directory Structure
- `app/(student)/`: Routes for the Student Experience (Dashboard, Tutor, Assessment, Skills, Projects).
- `app/(teacher)/`: Routes for the Teacher Experience (Analytics, Interventions).
- `components/ui/`: Reusable, atomic UI components (Buttons, Cards, Progress, Badges).
- `components/layout/`: Shared sidebar and topbar navigation (`AppLayout.tsx`).
- `lib/store/`: Zustand global store containing the mocked demo state.
- `lib/ai/`: Centralized abstraction for AI logic.

## AI Design Pattern
The platform abstracts AI into separate specific "Agents":
1. **Tutor Agent:** Programmed with a Socratic persona to refuse direct answers and provide progressive hints.
2. **Assessment Agent:** Analyzes mastery levels to dynamically render difficult vs. easy questions.
3. **Insight Agent:** Analyzes classroom-wide data to recommend targeted teacher interventions.

*(Note: During the hackathon demo, AI responses are deterministic mock wrappers to ensure a flawless live presentation).*
