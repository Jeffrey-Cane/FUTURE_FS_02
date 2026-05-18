1. Project Goal (Final Definition)

Build a lightweight CRM system that:

Captures leads via a public contact form
Stores leads centrally in a database
Allows admin users to manage, update, and track leads
Supports notes, status tracking, and follow-ups
Includes secure admin authentication
2. Recommended Fast Stack (Free Tier Optimized)
Frontend
React (Vite)
Tailwind CSS
Backend
Node.js + Express
Database
MongoDB Atlas (free cluster)
Auth
JWT-based authentication
Hosting (fast deployment combo)
Frontend → Vercel
Backend → Render
Database → MongoDB Atlas
3. System Structure (Simplified Architecture)
Contact Form (Public UI)
        ↓
Express API (Backend)
        ↓
MongoDB (Leads Storage)
        ↓
Admin Dashboard (CRM UI)
4. Core Modules
1. Lead Capture Module (Contact Form)
Public-facing page
Collects:
Name
Email
Message
Sends data to backend API
Automatically tags source as “website_form”
2. Lead Management Module (CRM Core)
View all leads
Filter by status:
New
Contacted
Converted
Update lead status
3. Notes & Follow-ups Module
Add notes per lead
Store interaction history
Track engagement progress
4. Admin Authentication Module
Admin login system
Protected dashboard routes
JWT session handling
5. Database Design (Minimal but scalable)
Leads Collection
Name
Email
Message
Source (default: website_form)
Status (default: new)
Notes (array of entries)
Created timestamp
Admin Collection
Email
Password hash
6. Backend Implementation Plan (Fast Build Order)
Phase 1: Setup
Initialize Express backend
Connect MongoDB Atlas
Set environment variables
Phase 2: Lead System (Core Priority)
Create lead data model
Build API endpoint to receive contact form submissions
Build API to retrieve all leads
Build API to update lead status
Phase 3: Notes System
Add endpoint to attach notes to leads
Ensure notes are timestamped and stored as history
Phase 4: Authentication
Create admin login endpoint
Implement JWT protection for all CRM routes
Restrict dashboard access to authenticated users
7. Frontend Implementation Plan (Fast Build Order)
Phase 1: Basic UI Setup
Initialize React project
Setup routing
Create basic layout structure
Phase 2: Public Contact Form
Build contact form page
Connect to backend API
Add success/failure feedback UI
Phase 3: Admin Authentication UI
Login page
Store JWT securely (local storage/session)
Phase 4: CRM Dashboard
Leads table view
Status update controls
Lead detail view
Notes section per lead
Phase 5: UI Polish
Responsive design
Clean table layout
Status badges
Loading and error states
8. Lead Flow (Final System Behavior)
User submits contact form
        ↓
Backend receives request
        ↓
Lead stored in MongoDB (status = new)
        ↓
Admin logs into dashboard
        ↓
Admin views & manages lead
        ↓
Admin updates status / adds notes
9. Deployment Plan (Fast & Free)
Step 1: Database
Create MongoDB Atlas cluster
Configure network access
Get connection string
Step 2: Backend Deployment (Render)
Push backend to GitHub
Deploy on Render
Add environment variables:
DB connection string
JWT secret
Step 3: Frontend Deployment (Vercel)
Push frontend to GitHub
Connect to Vercel
Set backend API URL
Step 4: Final Integration
Ensure contact form points to deployed backend
Test full flow:
Submit lead → appears in dashboard
10. Minimum Viable Feature Set (MVP Scope)

To deploy quickly, focus only on:

Contact form → lead creation
Admin login
Lead listing
Status update
Notes

Everything else is optional enhancement.

11. Optional Enhancements (Post-deployment upgrades)

If time allows:

Email notification on new lead
Search + filters
Pagination
Dashboard analytics (simple counts)
Export leads (CSV)