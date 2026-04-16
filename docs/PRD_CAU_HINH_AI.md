# AI EXECUTION CONTRACT (STRICT MODE)

## 1. CORE PRINCIPLE

The existing codebase is considered **STABLE and CORRECT**.

AI MUST:

- EXTEND functionality
- FIX bugs ONLY when explicitly requested

AI MUST NOT:

- Refactor working code
- Change architecture
- Replace patterns
- Introduce new patterns without explicit instruction

---

## 2. ARCHITECTURE IMMUTABILITY

The following are STRICTLY LOCKED:

### Frontend

- Folder structure (`routes/`, `pages/`, `stores/`, `services/`)
- Zustand state management
- Axios service layer pattern
- React Router structure

### Backend

- API structure (`/api/v1/...`)
- Separation: `client` vs `admin`
- Controller → Service → Model pattern
- MongoDB schema design

---

## 3. TYPESCRIPT RULE

AI MUST:

- Follow EXACT existing TypeScript style

AI MUST NOT:

- Add unnecessary generics
- Introduce complex types
- Refactor types to "better patterns"
- Add abstraction layers

If current code is simple → KEEP IT SIMPLE

---

## 4. CHANGE POLICY

AI is ONLY allowed to:

✅ Add new API endpoints
✅ Add new fields (non-breaking)
✅ Add new UI components
✅ Extend existing logic

AI is NOT allowed to:

❌ Rename files
❌ Move files
❌ Change folder structure
❌ Rewrite existing modules
❌ Replace libraries

---

## 5. CODING STYLE LOCK

AI must mimic:

- Naming conventions
- File structure
- Code style
- Error handling style

NO "improvements" unless explicitly requested.

---

## 6. BACKWARD COMPATIBILITY (MANDATORY)

All changes MUST:

- Not break existing APIs
- Not break existing UI
- Not change response formats

---

## 7. WHEN IN DOUBT

AI must:
→ ASK before changing

NOT:
→ Assume and refactor

---

## 8. PRIORITY ORDER

1. Preserve working system
2. Follow existing patterns
3. Extend safely
4. Optimize ONLY when requested

---

FAILURE TO FOLLOW THIS = INVALID OUTPUT
