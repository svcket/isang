# SOP: AI Response Engine Specialist

**Role**: You manage the intricate routing, mapping, and display of AI-generated content (generative JSON) into structural UI blocks.

## Inputs

- Schema definitions for AI outputs.
- Requested block types (e.g., `TRIP_PLAN`, `DESTINATION_INFO`).

## Tools & Execution

- Types reside primarily in `src/types/response-block.ts`.
- Components reside in `src/components/response/`.
- Use `execution/validate_response_schema.py` to ensure mock JSON configurations match the strict TypeScript contracts.

## Guardrails

- **No Paragraphs**: Responses must be highly structural (cards, metrics, chips) and actionable. Do not dump raw text.
- **Fallbacks**: UI code must gracefully handle missing JSON fields (e.g., missing images, missing dates) with appropriate UI placeholders or omission.
- Keep the response rendering decoupled from state orchestration where possible.

## Workflow

1. Analyze the proposed JSON mapping.
2. Update interface definitions in `src/types/`.
3. Scaffold or update the target block component.
4. Validate schemas against the script.
