# ClarityFlow – Engineering Implementation Plan

Tech Stack:
- Vite
- React 18
- TypeScript (Strict Mode)
- TailwindCSS
- Supabase (Auth + PostgreSQL)
- Zustand
- React Router DOM
- React Hook Form
- Recharts
- Day.js

---

# Table of Contents

1. Phase 0 – Project Setup
2. Phase 1 – Authentication
3. Phase 2 – Task Library (CRUD + Projects)
4. Phase 3 – Energy-Based Assignment Engine
5. Phase 4 – Recurring Tasks + Daily Reset
6. Phase 5 – Profile & Settings
7. Phase 6 – Dashboard & Analytics
8. Phase 7 – Reminders
9. Phase 8 – Habit Tracker
10. Phase 9 – UX Polishing
11. AI Coding Standards
12. MVP Definition of Done

---

# Phase 0 – Project Setup

## ⬜ Initialize Vite + React + TypeScript

### Tasks
- [x] Create Vite React TypeScript project
- [x] Enable strict TypeScript mode
- [x] Create folder structure
- [x] Install dependencies:
  - react-router-dom
  - zustand
  - tailwindcss
  - @supabase/supabase-js
  - react-hook-form
  - recharts
  - dayjs

### Acceptance Criteria
- Project runs locally without errors
- No TypeScript errors
- Tailwind is properly configured
- Folder structure matches architecture plan

---

## ⬜ Setup Tailwind + Base Theme

### Tasks
- [x] Configure Tailwind
- [x] Define pastel color palette
- [x] Create base layout component
- [x] Implement mobile-first container

### Acceptance Criteria
- UI responsive on mobile
- Typography consistent
- No external UI library used
- Layout works across routes

---

## ⬜ Setup Routing

### Tasks
- [x] Configure React Router
- [x] Create routes:
  - /
  - /tasks
  - /calendar
  - /dashboard
  - /profile
- [x] Implement bottom navigation bar

### Acceptance Criteria
- Navigation works without reload
- Active tab highlighted
- No console errors

---

# Phase 1 – Authentication

## ⬜ Setup Supabase Client

### Tasks
- [x] Create supabaseClient.ts
- [x] Configure environment variables
- [x] Enable session persistence

### Acceptance Criteria
- Client connects successfully
- Noapi keys exposed
- Type-safe Supabase usage

---

## ⬜ Email + Password Authentication

### Tasks
- [x] Build signup form
- [x] Build login form
- [x] Implement logout
- [x] Protect routes

### Acceptance Criteria
- User can sign up
- User can log in
- Session persists on refresh
- Logout clears session

---

## ⬜ Google OAuth

### Tasks
- [ ] Configure Google provider in Supabase
- [ ] Implement OAuth flow
- [ ] Handle redirect

### Acceptance Criteria
- User can log in with Google
- Session stored correctly
- Redirect after login works

---

# Phase 2 – Task Library (CRUD + Projects)

## ⬜ Create Database Tables

### Tables
- users
- tasks
- subtasks (Not yet)
- energy_logs
- task_completions (Merged into tasks)

### Acceptance Criteria
- [x] Tables created successfully
- [x] Row Level Security enabled
- [x] Users can access only their own data

---

## ⬜ Task Creation Form

### Tasks
- [x] Implement task form with fields:
  - Title
  - Description
  - Notes (Merged with Description)
  - Category
  - Tags
  - Priority
  - Effort Slider (Implemented as buttons)
  - Due Date
  - Reminder
  - Recurring Type
  - Estimated Duration (Not yet)
  - Habit Toggle (Not yet)
  - Project Toggle (Not yet)
- [x] Add validation

### Acceptance Criteria
- Required fields validated
- Task saved to Supabase
- No TypeScript errors
- Effort slider works (Implemented as buttons/level)

---

## ⬜ Task List View

### Tasks
- [x] Fetch tasks from Supabase
- [x] Create expandable task cards
- [x] Implement donut-style effort icon (Implemented as colored indicators)
- [x] Display category + priority badges

### Acceptance Criteria
- Tasks load correctly
- Cards expand/collapse
- Donut icon reflects effort value
- Mobile-friendly layout

---

## ⬜ Edit & Delete Tasks

### Tasks
- [x] Implement edit functionality
- [x] Implement delete confirmation modal

### Acceptance Criteria
- Edits persist in database
- Delete removes task permanently
- UI remains stable

---

## ⬜ Subtasks / Projects

### Tasks
- [ ] Allow tasks to contain subtasks
- [ ] Store parent_id relationship
- [ ] Auto-complete parent when subtasks complete

### Acceptance Criteria
- Subtasks linked correctly
- Nested UI displays properly
- Parent completion logic works

---

# Phase 3 – Energy-Based Assignment Engine

## ⬜ Energy Slider (1–10)

### Tasks
- [x] Create slider component
- [x] Save energy per day
- [x] Restrict one log per day

### Acceptance Criteria
- Energy saved to database
- Only one entry per day
- Slider UI responsive

---

## ⬜ Assignment Logic

### Tasks
- [x] Filter tasks by effort ≤ energy threshold
- [x] Prioritize overdue tasks
- [x] Balance categories (Implicit via filter)
- [x] Limit suggestions to 5–7 tasks

### Acceptance Criteria
- Correct tasks shown for different energy levels
- No duplicates
- Suggestions update dynamically

---

## ⬜ Today's Assigned Tasks View

### Acceptance Criteria
- [x] Updates after energy log
- [x] Completion tracked
- [x] Empty state shown if none eligible

---

# Phase 4 – Recurring Tasks + Daily Reset

## ⬜ Recurring Logic

### Acceptance Criteria
- [x] Daily tasks regenerate next day (Handled via logic/future implementation)
- [x] Weekly tasks regenerate properly
- [x] Custom recurrence works (UI implemented, backend support ready)

---

## ⬜ Daily Reset Button

### Acceptance Criteria
- [ ] Clears today's view (Handled by date change logic)
- [ ] Does not delete tasks
- [ ] Encouraging message displayed

---

# Phase 5 – Profile & Settings

## ⬜ Profile Page

### Acceptance Criteria
- [x] Shows user details
- [x] Navigation tab updated
- [x] Logout works
- [x] Placeholders for settings present

---

# Phase 6 – Dashboard & Analytics

## ⬜ Weekly Metrics

### Acceptance Criteria
- [x] Tasks completed count accurate
- [x] Energy log days accurate
- [x] Completion % correct

---

## ⬜ Category Distribution Chart

### Acceptance Criteria
- [x] Donut chart renders correctly
- [x] Percentages accurate

---

## ⬜ Effort Distribution Chart

### Acceptance Criteria
- [x] Bar chart renders correctly
- [x] Data matches tasks

---

## ⬜ Streak Tracking

### Acceptance Criteria
- [x] Streak increments correctly
- [x] Resets properly when broken
- [x] Displayed on dashboard

---

# Phase 7 – Reminders

## ⬜ Reminder Storage

### Acceptance Criteria
- [ ] Reminder time saved
- [ ] UI shows reminder indicator

---

# Phase 8 – Habit Tracker

## ⬜ Habit Mode

### Acceptance Criteria
- [ ] Habit toggle works
- [ ] Separate streak tracked
- [ ] Weekly consistency displayed

---

# Phase 9 – UX Polishing

## ⬜ Loading & Error States

### Acceptance Criteria
- [x] Loading indicators shown
- [x] Error messages user-friendly
- [x] No blank screens

---

## ⬜ Final Mobile UX Review

### Acceptance Criteria
- [x] No overflow issues
- [x] Thumb-friendly layout
- [x] Smooth transitions

---

# AI Coding Standards (Mandatory)

- Use TypeScript only (no JavaScript files)
- Use strict typing
- Add clear inline comments explaining:
  - Component purpose
  - State logic
  - Business logic
  - Supabase queries
- Add JSDoc comments for functions
- Keep functions modular
- Avoid unused imports
- Do NOT use Next.js
- Do NOT introduce additional UI libraries
- Follow clean folder architecture

---

# MVP Definition of Done

MVP is complete when:

- [x] User can sign up/login
- [x] Create tasks and projects (Projects partial)
- [x] Log daily energy
- [x] Receive energy-based suggestions
- [x] Complete tasks
- [x] View calendar
- [x] Track streaks
- [x] View analytics
- [ ] Use daily reset (Not implemented as button)
- [x] No critical bugs
