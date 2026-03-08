# Agent Skills Index

This document defines the reusable capabilities (skills) available to this agent for the Isang project.

When a user request comes in, check this index to determine the appropriate skill to route the task to. Each skill is mapped to an SOP (Standard Operating Procedure) in the `directives/` folder and deterministic scripts in the `execution/` folder.

> **Note:** If you need to create a new skill, STOP and read `skill_creator.md` first.

---

## Available Skills

### 1. UI & Design System Architect

- **Trigger**: User asks to build, modify, or style UI components (buttons, layouts, cards).
- **Directive SOP**: `directives/isang_ui_architect.md`
- **Execution Script**: `execution/verify_tailwind_classes.py`
- **Responsibilities**: Mobile-responsiveness, pixel-perfect Tailwind, shadcn/ui components, adherence to Isang's design system (SF Pro, FF4405, generic components).

### 2. AI Response Engine Specialist

- **Trigger**: User wants to modify how AI generative blocks are structured, mapped, or displayed (e.g., specific response patterns).
- **Directive SOP**: `directives/isang_response_engine.md`
- **Execution Script**: `execution/validate_response_schema.py`
- **Responsibilities**: AI parsing, structured JSON mappings, fallbacks for missing data.

### 3. State & Architecture Orchestrator

- **Trigger**: Complex state requirements, global state flows across components, or routing interactions.
- **Directive SOP**: `directives/isang_state_orchestrator.md`
- **Execution Script**: `execution/test_zustand_store.py`
- **Responsibilities**: Zustand stores, side-effects, Next.js App Router flows, avoiding prop-drilling or stale closures.

### 4. Verification & QA Specialist

- **Trigger**: Needs to fix type errors, fix lint errors, or maintain testing pipelines.
- **Directive SOP**: `directives/isang_qa_specialist.md`
- **Execution Script**: `execution/run_verification_suite.py`
- **Responsibilities**: TypeScript strictness, ESLint, Vitest unit tests, Playwright E2E.

### 5. Core Data & API Architect

- **Trigger**: Building backend API routes, designing database schemas, or writing migrations.
- **Directive SOP**: `directives/isang_data_architect.md`
- **Execution Script**: `execution/run_db_migrations.py`
- **Responsibilities**: Database schemas (Supabase), internal data contracts, server-side APIs in `src/app/api/`.

### 6. DevOps & Security Guardian

- **Trigger**: Dealing with Auth (RLS policies), deployment configurations, or secure environments.
- **Directive SOP**: `directives/isang_devops_security.md`
- **Execution Script**: `execution/audit_security_rules.py`
- **Responsibilities**: Row Level Security, caching strategies (Image Proxy), env var management, overall security posture.
