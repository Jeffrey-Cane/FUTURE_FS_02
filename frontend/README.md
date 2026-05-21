# Pulse CRM Frontend

A lightweight CRM frontend for lead capture and admin management.

## Setup

1. Install dependencies:
   - `npm install`
2. Create a local env file:
   - Copy `.env.example` to `.env.local`
   - Set `VITE_API_URL` to your backend URL
3. Start the app:
   - `npm run dev`

## Admin Setup

The first admin account must be created once using the Setup section on the Login page.

After the first admin is created:
- Remove or hide the Setup section in the Login UI so new admins cannot be created.
- The login form should remain available for existing admins.

If you want to automate removal, do it by feature flag or by deleting the setup form in the login page component.
