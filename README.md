# NirvanaFlow: AI-Powered Zen Productivity Suite 🧘♂️  
*Next.js + TypeScript + Gemini AI + Firebase. Deployable on Vercel.*  

## 🌟 **Project Overview**  
**Problem**: Juggling tasks across apps leads to chaos and wasted time.  
**Solution**: NirvanaFlow is a **minimalist AI co-pilot** that automates task management, syncs with Google tools, and keeps you in "flow state".  

**Key Features**:  
- 🧠 **1-Click AI Subtasks**: Break tasks into steps with Gemini.  
- 🗓️ **Smart Calendar Sync**: Auto-convert events into actionable tasks.  
- 📧 **Urgent Email Spotlight**: Gemini finds your most critical email.  
- 🎨 **Luxury Minimalist UI**: Calm design with smooth animations.  

---

## 🛠️ **Tech Stack**  
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS  
- **Backend**: Next.js API Routes, Firebase (Auth + Firestore)  
- **AI**: Gemini free, Google Calendar/Gmail APIs  
- **Database**: MongoDB Atlas (NoSQL)  
- **Deployment**: Vercel (Frontend + Serverless), Firebase Hosting  
- **Animations**: Framer Motion  

---

## 🚀 **45-Day Development Plan**  
**Day-by-Day Roadmap** *(Mentor-Friendly + Testable Deliverables)*  

### **Phase 1: Core Setup (Days 1-7)**  
| Day | Task | Deliverable | Testing |  
|-----|------|-------------|---------|  
| 1 | Initialize Next.js + TS. Configure Tailwind. | `npx create-next-app@latest` | `npm run dev` |  
| 2 | Firebase Setup (Google Auth). | Login button redirects to Google. | Manual sign-in test. |  
| 3 | Task Schema: `{ title, subtasks[], priority }`. | Tasks save to Firestore. | Postman API test. |  
| 4 | Gemini API Integration (Serverless route). | `/api/generate-subtasks` returns steps. | Curl/Postman test. |  
| 5 | Task Creation Form + Subtask Button. | Form submits to Firestore. | UI validation checks. |  
| 6 | Deploy to Vercel. | Live at `nirvanaflow.vercel.app`. | Check Vercel logs. |  
| 7 | Priority Tags (Urgent/Serene/Low). | Color-coded task labels. | Manual UI check. |  

### **Phase 2: AI & Integrations (Days 8-21)**  
| Day | Task | Deliverable | Testing |  
|-----|------|-------------|---------|  
| 8 | Google Calendar Sync Setup. | Today’s events in sidebar. | Test with dummy event. |  
| 9 | Auto-Convert Events → Tasks (Gemini). | "Meeting" → Subtasks. | Check Firestore entries. |  
| 10 | Gmail API: Fetch urgent emails. | Top 1 email shown. | Send test "URGENT" email. |  
| 11 | Kanban Board (Todo/Doing/Done). | Drag-and-drop tasks. | Manual drag test. |  
| 12 | Deadline Aura (SVG clock). | Clock color changes. | Test with fake deadlines. |  
| 13 | Pomodoro Flow Mode (25-min timer). | Browser notification on break. | Allow notifications. |  

### **Phase 3: UI/UX Polish (Days 22-35)**  
| Day | Task | Deliverable | Testing |  
|-----|------|-------------|---------|  
| 22 | Framer Motion: Task entry animations. | Fade-in effect. | Visual check. |  
| 23 | Dark Mode Toggle. | Theme persists in localStorage. | Toggle test. |  
| 24 | Loading States (Skeleton UI). | Spinner during API calls. | Throttle network in DevTools. |  
| 25 | Error Handling Toasts. | "Failed to save task" message. | Disable backend & test. |  
| 26 | Mobile Responsive Kanban. | Columns stack on mobile. | Chrome DevTools test. |  

### **Phase 4: Testing & Launch (Days 36-45)**  
| Day | Task | Deliverable | Testing |  
|-----|------|-------------|---------|  
| 36 | Jest Unit Tests (API routes). | 80% coverage. | `npm test` |  
| 37 | Cypress E2E Tests. | Login → Task creation flow. | `npx cypress run` |  
| 38 | Performance Audit (Lighthouse). | Score >85. | Chrome Lighthouse. |  
| 39 | Security Audit (Firebase Rules). | Read/write rules enforced. | Firestore Simulator. |  
| 40 | Deploy Final Version. | Production-ready on Vercel. | End-to-end smoke test. |  
| 41 | Record Demo Video. | 2-min Loom video. | Mentor review. |  
| 42 | Update README + Docs. | Screenshots, GIFs added. | Peer review. |  
| 43 | Buffer Day: Bug Fixes. | Zero critical issues. | Final check. |  

---

## 🎨 **Design Philosophy**  
**Luxury Minimalism**:  
- **Colors**: `#F8FAFC` (Light), `#1F2937` (Dark), `#4F46E5` (Accent)  
- **Fonts**: Inter (Body), Space Grotesk (Headings)  
- **Spacing**: 24px grid, 8px baseline  
- **Animations**:  
  - Task Entry: Fade-in + slide-up (300ms)  
  - Drag Preview: Scale 105% + shadow  

[Design Mockup](https://www.figma.com/design/lzFlsAv6Lxr9uhKFXumr7E/NIrvana-flow?node-id=0-1&t=EsaONIfsP0VBUCEZ-1)  

---

## 🛠️ **Installation**  
1. **Clone Repo**:  
```bash  
git clone https://github.com/YOUR_USERNAME/NirvanaFlow.git  
cd NirvanaFlow  
