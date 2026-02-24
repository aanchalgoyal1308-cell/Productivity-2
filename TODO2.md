# ✅ Energy-Based Task Assignment – Implementation Checklist

## 1️⃣ Update Task Model

- [x] Replace easy/medium/hard with:
      energyLevel: 1–10
- [x] Ensure type:
      export type EnergyLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
- [x] Task model includes:
      - title
      - description
      - category
      - priority: 'high' | 'medium' | 'low'
      - energyLevel
      - dueDate? (optional)
      - recurrence? (daily/weekly/monthly/custom)

---

## 2️⃣ Update Task Creation UI

- [x] Replace effort dropdown with slider (1–10)
- [x] Reuse same slider from Dashboard
- [x] Store numeric value in DB/state

---

## 3️⃣ Energy → Assignment Distribution

Implement STRICT limits:

Energy 4  → 2 Easy + 1 Medium  
Energy 5  → 1 Easy + 2 Medium  
Energy 6  → 1 Medium + 1 Hard  
Energy 7  → 2 Medium + 1 Hard  
Energy 8  → 2 Medium + 2 Hard  
Energy 9  → 2 Medium + 2 Hard  
Energy 10 → 1 Medium + 3 Hard  

- [x] Create function:
      getTaskDistribution(energy: EnergyLevel)

---

## 4️⃣ Internal Difficulty Mapping (Algorithm Only)

Map slider to buckets:

- Easy   → 1–3
- Medium → 4–7
- Hard   → 8–10

- [x] Create helper:
      mapEnergyToDifficulty(level)

NOTE:
This is NOT visible in UI.
Only used inside assignment logic.

---

## 5️⃣ Fix Assignment Algorithm

Core Rules:

- [x] Use distribution table ONLY
- [x] PRIORITIZE:
      1. High
      2. Medium
      3. Low
- [x] Ignore daily tasks in quota counting
- [x] Daily tasks auto-appear but do NOT reduce assignment count
- [x] Do not exceed allowed number
- [x] No duplicate assignment
- [x] Stop when bucket quota filled

---

## 6️⃣ Recurrence Rules

- [x] Maximum 3 daily tasks globally
- [x] Daily tasks always visible
- [x] Daily tasks excluded from energy-based assignment count

---

## 7️⃣ Dashboard Logic

When energy is logged:

- [x] Call getTaskDistribution()
- [x] Filter non-daily tasks
- [x] Sort by priority (high → medium → low)
- [x] Assign based on mapped difficulty
- [x] Ensure exact quota match
- [x] Log assigned tasks for debugging

---

## 8️⃣ Testing Checklist

- [x] Energy 4 → exactly 3 tasks
- [x] Energy 5 → exactly 3 tasks
- [x] Energy 6 → exactly 2 tasks
- [x] Energy 7 → exactly 3 tasks
- [x] Energy 8 → exactly 4 tasks
- [x] Energy 9 → exactly 4 tasks
- [x] Energy 10 → exactly 4 tasks
- [x] High priority always selected first
- [x] Daily tasks do NOT affect quota
- [x] No over-assignment