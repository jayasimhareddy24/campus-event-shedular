# CampusFlow — Campus Event Scheduler

A responsive React + Vite campus event scheduling app with student and administrator views.

## Features

### Student / attendee
- Register and sign in with a demo account
- Browse upcoming campus events
- Search by event title, organizer, or venue
- Filter by category and availability
- View event details, date, venue, capacity, and remaining seats
- Register for an event and cancel a registration
- "My events" view
- Announcement feed
- Responsive layout for desktop and mobile

### Admin
- Admin dashboard with event, attendee, and registration metrics
- Create, edit, and delete events
- Set capacity, category, venue, date/time, description, and organizer
- See attendee counts and registrations
- Manage announcements
- Export registrations as CSV
- Reset demo data

## Run locally

Install Node.js (LTS), then open this folder in VS Code terminal:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## Demo logins

- Admin: `admin@campus.edu` / `Admin@123`
- Student: `student@campus.edu` / `Student@123`

You can also create a demo account from the sign-up screen.

## Important security note

This is a portfolio-ready **frontend demo**. Accounts, events, and registrations are stored in that browser's `localStorage`. This means:
- Data is not shared between different devices or browsers.
- The demo admin login is not secure and must not be used for real institutional data.
- For production, add a backend API (for example Node.js/Express), a database (PostgreSQL/MySQL), server-side password hashing, role-based authorization, input validation, and secure sessions/JWT. Never trust a role stored only in browser storage.

## Suggested GitHub upload

1. Create a new GitHub repository named `campus-event-scheduler`.
2. Extract this ZIP.
3. Open the extracted folder in VS Code.
4. Run the commands above and test the app.
5. In the terminal, run:

```bash
git init
git add .
git commit -m "Build CampusFlow campus event scheduler"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/campus-event-scheduler.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username.
