
---

# ✅ FINAL CONFIRMED TECH STACK (No Ambiguity Version)

You are building:

## Frontend

* **Vite** (build tool)
* **React 18**
* **TypeScript**
* **TailwindCSS**
* **React Router DOM**
* **Zustand** (state management)
* **React Hook Form**
* **Recharts** (analytics charts)
* **Day.js** (date handling)

---

## Backend

* **Supabase**

  * PostgreSQL
  * Supabase Auth (Email + Google)
  * Row Level Security enabled

---

## Deployment

* **Vercel**
* GitHub repository

---

# ⚠ Important Clarification

We are **NOT using Next.js**.

This is a pure:

> Vite + React + TypeScript SPA (Single Page Application)

That means:

* No server-side rendering
* No Next.js routing
* No API routes inside frontend
* All backend handled by Supabase

This avoids confusion.

---

# ✅ Folder Structure (Correct for Vite + React)

Antigravity should generate exactly this:

```
src/
  assets/
  components/
    ui/
    tasks/
    energy/
    layout/
  pages/
    Home.tsx
    MyTasks.tsx
    Calendar.tsx
    Dashboard.tsx
  hooks/
  store/
  services/
    supabaseClient.ts
    taskService.ts
  types/
  utils/
  App.tsx
  main.tsx
```

---

# ✅ Routing Setup (For AI Clarity)

Use:

```ts
react-router-dom
```

Routes:

* /
* /tasks
* /calendar
* /dashboard
* /profile

---

# ✅ State Management Clarification

We are using:

Zustand

For:

* Current user state
* Daily energy state
* Assigned tasks state
* Theme state (future)

We are NOT using Redux (to avoid complexity).

---

# ✅ Styling System

TailwindCSS only.

No:

* Material UI
* Chakra
* Bootstrap

This avoids styling conflicts.

---

# ✅ Important AI Agent Instruction

When you start Antigravity, your first instruction should say:

> This is a Vite + React + TypeScript project. Do not use Next.js. Do not use JavaScript. Use strict TypeScript typing.

That prevents it from switching frameworks mid-build.

---

# 🔎 What Was Already Included?

In the previous spec:

✔ TypeScript
✔ Vite
✔ React
✔ Tailwind
✔ Supabase
✔ Recharts
✔ Zustand

So yes — it was aligned.

But now we’ve made it unambiguous.

---

# 🧠 Why This Stack Is Perfect For You

Since you’re a beginner:

* Vite is simpler than Next.js
* No backend server to manage
* Supabase handles auth
* TypeScript forces clarity (fewer bugs)
* React ecosystem is AI-friendly

This reduces cognitive overload.

---

# ⚠ Biggest Beginner Mistake to Avoid

Do NOT:

* Mix JS and TS files
* Let AI introduce Next.js
* Add Firebase midway
* Add multiple UI libraries

Keep it clean.

---

# 🏗 Before You Start Building

You need 3 things prepared:

1. Supabase project created
2. GitHub repo created
3. Clear MVP scope locked

---

