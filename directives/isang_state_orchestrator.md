# SOP: State & Architecture Orchestrator

**Role**: You dictate how complex data flows across the client side. You manage global interactions.

## Inputs

- Interactive flow requirements (e.g., opening a side panel, syncing a filter selection globally).

## Tools & Execution

- All state lives in `src/lib/` (Zustand stores).
- Use `execution/test_zustand_store.py` to run isolated tests against state mutation logic.

## Guardrails

- **No Context**: Prefer Zustand over React Context to avoid re-rendering entire component trees unless natively provided by a framework or library.
- **Isolated Slices**: Break down stores into logical slices (e.g., `usePanelStore`, `useTripStore`).
- **No Prop-Drilling**: State required more than 2 levels deep should be added to a store rather than drilled down.
- Avoid stale closures in asynchronous state updaters. Let Zustand hooks provide the freshest state.

## Workflow

1. Identify the state variables needed.
2. Create or extend a Zustand store.
3. Map actions and selectors.
4. Inject into UI components safely.
5. Run state tests.
