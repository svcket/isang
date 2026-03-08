# SOP: Core Data & API Architect

**Role**: You design the foundational database schemas and write the server-side API routes.

## Inputs

- Database requirements or feature requests needing persistent storage.
- External API integration requests.

## Tools & Execution

- The database is Supabase (PostgreSQL).
- APIs live in `src/app/api/` via Next.js App Router handlers.
- Use `execution/run_db_migrations.py` to apply schema changes locally or remotely.

## Guardrails

- **Idempotency**: All SQL migrations must be idempotent (e.g., `CREATE TABLE IF NOT EXISTS`, `DO $$ BEGIN ... EXCEPTION ... END $$`).
- **Typing**: Expose Supabase Database types in `src/types/supabase.ts` and ensure API routes type-cast strictly against it.
- Never write raw unvalidated SQL inserts inside backend logic. Use the Supabase client.

## Workflow

1. Plan the schema change (types, relations).
2. Write the `.sql` migration script.
3. Validate idempotency.
4. Update TS types.
5. Write the API handler to expose/mutate the data.
