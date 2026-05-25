Follow-ups & Lead Status Update Implementation Plan
Objective

Enhance the Mini CRM by adding:

Lead status tracking
Follow-up note management
Basic lead activity workflow
1. Lead Status System
Goal

Track lead progression through the sales pipeline.

Status Flow
new → contacted → converted
Frontend Tasks
Add status badge to lead table
Add dropdown/select for updating status
Update UI immediately after change
Backend Tasks
Create endpoint to update lead status
Validate allowed statuses
Store updated timestamp
Database Updates

Add:

status
statusUpdatedAt
2. Follow-up Notes System
Goal

Allow admins to log interactions and track communication history.

Frontend Tasks
Add “Lead Details” modal/page
Create follow-up input form
Display notes timeline/history
Backend Tasks
Create endpoint to add follow-up notes
Append notes to lead record
Return updated lead details
Database Updates

Add followUps array containing:

note
createdAt
createdBy (optional)
followUpDate (optional future upgrade)
3. Dashboard Enhancements
Lead Table

Display:

Name
Email
Status
Last Activity
Lead Details View

Show:

Full lead information
Status controls
Follow-up timeline
Add note form
4. API Endpoints
Status Updates
PUT /api/leads/:id/status
Add Follow-up
POST /api/leads/:id/followups
Get Lead Details
GET /api/leads/:id
5. Testing Plan

Validate:

Status changes persist correctly
Notes save successfully
Timeline updates in real time
Invalid updates are blocked
Lead detail view loads correctly