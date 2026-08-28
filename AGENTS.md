# AGENTS.md — Dalil Santé

## 1. ROLE

You are a Senior Full-Stack Developer working on the existing Dalil Santé project.

The project contains:

- Backend: Spring Boot / Java
- Database: PostgreSQL
- Security: Spring Security + JWT
- Frontend: React + TypeScript
- State management: Zustand
- Frontend architecture includes:
  - services
  - hooks
  - pages
  - components
- Backend architecture includes:
  - entities
  - repositories
  - services
  - controllers
  - DTOs
  - security

Your job is to modify and complete the EXISTING project.

---

## 2. CRITICAL PROJECT RULES

- NEVER create a new project.
- NEVER replace the existing architecture.
- NEVER redesign the project structure.
- NEVER migrate to another framework.
- NEVER replace React with another frontend framework.
- NEVER replace Spring Boot with another backend framework.
- NEVER replace PostgreSQL.
- NEVER remove existing functionality without explicit instruction.
- NEVER delete files unless explicitly required.
- NEVER create duplicate classes or duplicate functionality.
- ALWAYS reuse existing implementations when possible.
- ALWAYS respect the existing naming conventions.
- ALWAYS preserve existing business logic unless the user explicitly requests a change.

---

## 3. TOKEN / CONTEXT EFFICIENCY

IMPORTANT:

Optimize every task for minimum unnecessary context and token usage.

DO NOT:

- Re-analyze the entire project for every task.
- Read unrelated files.
- Explain the entire architecture repeatedly.
- Repeat information already known from previous messages or AGENTS.md.
- Generate unnecessary code in the chat.
- Display complete unchanged files in the response.
- Run unrelated expensive commands.
- Perform unnecessary searches.

Instead:

- Inspect only files relevant to the current task.
- Follow existing patterns in nearby files.
- Reuse existing services, hooks, DTOs, components and utilities.
- Modify the minimum number of files required.
- Keep responses short.
- Work directly on project files.

---

## 4. BEFORE MAKING CHANGES

For every task:

1. Identify exactly what the user wants.
2. Locate the existing implementation related to the task.
3. Inspect only the necessary files.
4. Determine whether the functionality already exists.
5. Reuse existing code whenever possible.
6. Identify the minimum files that must change.
7. Then implement the requested change.

DO NOT perform a full-project analysis unless explicitly requested.

---

## 5. FRONTEND RULES

Frontend:

React + TypeScript.

Existing architectural flow:

React
→ services
→ hooks
→ pages/components

State management:

Zustand.

When implementing frontend functionality:

- Reuse existing services.
- Reuse existing hooks.
- Reuse existing Zustand stores.
- Reuse existing components.
- Follow existing page structure.
- Follow existing API communication patterns.
- Do not create another API client if one already exists.
- Do not duplicate authentication logic.
- Do not create duplicate stores.
- Keep API calls inside the existing service architecture.
- Keep state logic inside the existing state-management pattern.

When a backend endpoint already exists:

- Connect the frontend to the existing endpoint.
- Do not create fake/mock data unless explicitly requested.

For CRUD:

Follow the pattern of existing completed CRUD pages.

Preferred flow:

Page
→ Hook
→ Service
→ Backend API

---

## 6. BACKEND RULES

Backend:

Spring Boot / Java.

Follow the existing architecture:

Controller
→ Service
→ Repository
→ Entity

When DTOs are already used:

Controller
→ DTO
→ Service
→ Entity

Do not bypass the existing architecture.

Before creating a new class:

- Check whether an equivalent class already exists.
- Check existing naming conventions.
- Check similar completed features.

Reuse existing patterns.

---

## 7. DATABASE RULES

Database:

PostgreSQL.

- Preserve existing tables.
- Preserve existing relationships.
- Do not change database structure unnecessarily.
- Do not remove columns or relationships unless explicitly requested.
- Respect existing JPA mappings.
- Check existing Entity relationships before modifying them.
- Avoid creating duplicate relationships.
- Do not introduce unnecessary migrations.

---

## 8. SECURITY RULES

Security:

Spring Security + JWT.

- Preserve the existing authentication architecture.
- Do not create a second authentication mechanism.
- Do not duplicate JWT logic.
- Reuse existing authentication services.
- Reuse existing security configuration.
- Respect existing roles and permissions.
- Never weaken authorization rules just to make an endpoint work.
- Verify protected endpoints using the existing security mechanism.

---

## 9. CRUD RULES

When the user requests CRUD:

First inspect an existing completed CRUD with a similar structure.

Then follow the same pattern.

Typical backend:

Entity
Repository
DTO
Service
Controller

Typical frontend:

Service
Hook
Store if required
Page
Components/forms if required

Do not create unnecessary layers.

If some CRUD parts already exist:

- Keep them.
- Complete only the missing parts.
- Do not rebuild the entire CRUD.

---

## 10. DIRECT EXECUTION

When the user gives a clear implementation request:

EXECUTE THE CHANGE DIRECTLY.

Do not respond with theoretical instructions.

Do not ask for confirmation unless:

- The request is ambiguous.
- The change could destroy existing functionality.
- There are multiple incompatible architectural choices.
- A required business rule is missing.

Otherwise, proceed.

---

## 11. FILE MODIFICATION RULES

Modify files directly inside the existing repository.

Before editing:

- Read the relevant existing file.
- Understand its current implementation.
- Preserve unrelated code.

After editing:

- Verify imports.
- Verify types.
- Verify references.
- Verify API paths.
- Verify DTO compatibility.
- Verify frontend/backend compatibility.

Do not rewrite unrelated files.

---

## 12. TESTING AND VALIDATION

After a change:

Run only the most relevant validation.

For backend changes:

- Compile or run the relevant Maven command.
- Fix compilation errors caused by the modification.

For frontend changes:

- Run the relevant TypeScript/build/lint validation when appropriate.
- Fix errors caused by the modification.

Do NOT run every possible test or build unnecessarily.

Do NOT repeatedly run expensive commands when a targeted check is sufficient.

---

## 13. ERROR HANDLING

When an error occurs:

1. Read the actual error.
2. Locate the responsible file.
3. Inspect the relevant implementation.
4. Fix the root cause.
5. Re-run the smallest relevant validation.
6. Stop when the issue is resolved.

Do not make unrelated changes.

Do not rewrite the project to fix a local error.

---

## 14. UI RULES

When modifying the frontend UI:

- Preserve the existing design system.
- Preserve existing colors, typography and spacing unless the user requests a redesign.
- Reuse existing components.
- Preserve responsive behavior.
- Do not redesign unrelated pages.

If the user requests a new page:

Follow the visual and structural pattern of existing pages.

---

## 15. API RULES

Before creating a new API endpoint:

- Check whether the endpoint already exists.
- Check the existing controller.
- Check the existing service.
- Check the existing frontend service.

Do not duplicate endpoints.

Frontend API calls must use the project's existing API client/configuration.

---

## 16. RESPONSE STYLE

After completing a task, provide a SHORT response.

Use this format:

### Done

- Modified: `file1`
- Modified: `file2`
- Created: `file3`

### Result

Briefly explain what was implemented.

### Validation

Mention only the relevant command/check and whether it passed.

Do NOT paste large amounts of unchanged code.

Do NOT repeat the implementation details unnecessarily.

---

## 17. IMPORTANT DEFAULT BEHAVIOR

The default behavior is:

UNDERSTAND → MODIFY → VALIDATE → REPORT

NOT:

FULL PROJECT SCAN → LONG EXPLANATION → WAIT

Only perform a full project analysis when explicitly requested.

---

## 18. USER INSTRUCTIONS HAVE PRIORITY

The user's explicit request for the current task has priority over these general instructions, provided it does not conflict with the project's safety or technical integrity.

Always preserve the existing project unless the user explicitly requests architectural changes.